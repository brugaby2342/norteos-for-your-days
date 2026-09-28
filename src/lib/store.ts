import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AgendaEvent,
  AiLog,
  Area,
  CheckIn,
  Course,
  Habit,
  InboxNote,
  Lead,
  LeadStatus,
  NoteTag,
  Profile,
  Project,
  ProjectStatus,
  Quadrant,
  StudyNote,
  Task,
} from "./types";
import {
  seedCheckins,
  seedCourses,
  seedEvents,
  seedHabits,
  seedInbox,
  seedLeads,
  seedNotes,
  seedProfile,
  seedProjects,
  seedTasks,
} from "./seed";
import { asParaBucket } from "./para";
import { areaFromTags, asEventKind, asLayers, asNoteTags, asPackets, NOTE_TAGS, slugTag } from "./types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function todayIso() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

const QUAD_SET = new Set<Quadrant>([
  "urgente-importante",
  "importante",
  "urgente",
  "nenhum",
]);
const AREA_SET = new Set<Area>([
  "estudos",
  "curiosidades",
  "portfolio",
  "linkedin",
  "pessoal",
]);

export type IncomingTask = {
  title: string;
  notes?: string;
  quadrant?: string;
  area?: string;
};

interface PosState {
  profile: Profile;
  tasks: Task[];
  events: AgendaEvent[];
  habits: Habit[];
  checkins: CheckIn[];
  inbox: InboxNote[];
  aiLogs: AiLog[];
  courses: Course[];
  projects: Project[];
  leads: Lead[];
  notes: StudyNote[];
  customTags: NoteTag[];
  pomodorosToday: number;
  lastPomodoroDate: string;
  demoOn: boolean;
  setProfile: (p: Partial<Profile>) => void;
  addTask: (t: Omit<Task, "id" | "createdAt" | "completedAt" | "pomodoros">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  addEvent: (e: Omit<AgendaEvent, "id">) => void;
  removeEvent: (id: string) => void;
  toggleHabit: (id: string, date?: string) => void;
  addHabit: (name: string, targetPerWeek: number) => void;
  updateHabit: (id: string, patch: Partial<Pick<Habit, "name" | "targetPerWeek">>) => void;
  removeHabit: (id: string) => void;
  saveCheckIn: (c: CheckIn) => void;
  addInbox: (text: string) => void;
  removeInbox: (id: string) => void;
  addAiLog: (kind: string, prompt: string, result: string) => void;
  removeAiLog: (id: string) => void;
  bumpPomodoro: () => void;
  applyAiTasks: (titles: IncomingTask[]) => void;
  bumpCourse: (id: string, delta: number) => void;
  addCourse: (c: Omit<Course, "id">) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addLead: (l: Omit<Lead, "id">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  addNote: (n: Omit<StudyNote, "id" | "createdAt">) => void;
  updateNote: (id: string, patch: Partial<StudyNote>) => void;
  removeNote: (id: string) => void;
  noteToTask: (id: string) => void;
  addCustomTag: (label: string) => string | null;
  clearData: () => void;
  loadDemo: () => void;
}

function titleFrom(text: string) {
  const line = text.trim().split("\n")[0] ?? "";
  return line.slice(0, 80) || "Sem título";
}

function migratePos(persisted: unknown, version: number): PosState {
  const s = (persisted && typeof persisted === "object" ? persisted : {}) as PosState;
  const notes = Array.isArray(s.notes) ? s.notes : [];
  const mapped: StudyNote[] = notes.map((n) => {
    const rawArea = (n as StudyNote & { course?: string }).area;
    const course = (n as { course?: string }).course;
    let area: Area | null = null;
    if (AREA_SET.has(rawArea as Area)) area = rawArea as Area;
    else if (course === "unifecaf" || course === "rocketseat") area = "estudos";
    let tags = asNoteTags(n.tags);
    if (area && !tags.includes(area)) tags = [...tags, area];
    return {
      id: n.id,
      title: n.title,
      body: n.body,
      createdAt: n.createdAt,
      area: areaFromTags(tags) ?? area,
      para: asParaBucket(n.para || (course && course !== "outro" ? "recursos" : "entrada")),
      tags,
      projectId: n.projectId ?? null,
      courseId: n.courseId ?? null,
    };
  });
  const ids = new Set(mapped.map((n) => n.id));
  const inbox = Array.isArray(s.inbox) ? s.inbox : [];
  for (const item of inbox) {
    if (!item?.id || ids.has(item.id)) continue;
    mapped.push({
      id: item.id,
      area: null,
      title: titleFrom(item.text || ""),
      body: item.text || "",
      para: "entrada",
      createdAt: item.createdAt || "",
      tags: [],
      projectId: null,
      courseId: null,
    });
    ids.add(item.id);
  }
  const leads = Array.isArray(s.leads)
    ? s.leads.map((l) =>
        (l.status as string) === "fechado" ? { ...l, status: "recusado" as LeadStatus } : l,
      )
    : [];
  const events = Array.isArray(s.events)
    ? s.events.map((e) => ({ ...e, kind: asEventKind(e.kind) }))
    : [];
  const courses = Array.isArray(s.courses)
    ? s.courses.map((c) => {
        const seed = seedCourses.find((x) => x.id === c.id);
        const syllabus =
          Array.isArray(c.syllabus) && c.syllabus.length > 0
            ? c.syllabus
            : (seed?.syllabus ?? []);
        const done = Math.max(0, Math.min(c.done ?? 0, syllabus.length || c.modules || 0));
        return {
          ...c,
          syllabus,
          modules: syllabus.length || c.modules || 0,
          done,
          current: syllabus[done] ?? c.current ?? seed?.current ?? "A começar",
          outcome: c.outcome || seed?.outcome || "",
          deadline: c.deadline ?? seed?.deadline ?? null,
          distill: c.distill || seed?.distill || "",
          layers: asLayers(c.layers, c.distill || seed?.distill || ""),
          packets: asPackets(c.packets).length ? asPackets(c.packets) : asPackets(seed?.packets),
        };
      })
    : [];
  const projects = Array.isArray(s.projects)
    ? s.projects.map((p) => ({
        ...p,
        outcome: p.outcome ?? "",
        deadline: p.deadline ?? null,
        distill: p.distill ?? "",
        layers: asLayers(p.layers, p.distill ?? ""),
        packets: asPackets(p.packets),
      }))
    : [];
  const customTags: NoteTag[] = Array.isArray(s.customTags)
    ? s.customTags.filter(
        (t) => t && typeof t.id === "string" && typeof t.label === "string" && t.id && t.label,
      )
    : [];
  const next = {
    ...s,
    notes: mapped,
    inbox: [],
    leads,
    events,
    courses,
    projects,
    customTags,
    habits: version < 13 ? seedHabits : Array.isArray(s.habits) ? s.habits : seedHabits,
    demoOn: Boolean(s.demoOn),
  };
  if (version < 14) return { ...next, ...emptySlice() };
  if (version < 15 && next.demoOn) return { ...next, ...demoSlice() };
  if (version < 15) {
    return {
      ...next,
      tasks: Array.isArray(s.tasks)
        ? s.tasks.map((t) => ({ ...t, area: remapFront(t.area) }))
        : [],
      notes: next.notes.map((n) => ({
        ...n,
        area: n.area ? remapFront(n.area) : null,
        tags: asNoteTags(n.tags),
      })),
    };
  }
  return next;
}

function remapFront(raw: string): Area {
  if (raw === "unifecaf" || raw === "rocketseat") return "estudos";
  if (raw === "candidaturas") return "linkedin";
  if (
    raw === "estudos" ||
    raw === "curiosidades" ||
    raw === "portfolio" ||
    raw === "linkedin" ||
    raw === "pessoal"
  ) {
    return raw;
  }
  return "estudos";
}

const emptySlice = () => ({
  profile: seedProfile,
  tasks: [],
  events: [],
  habits: [],
  checkins: [],
  inbox: [],
  aiLogs: [] as AiLog[],
  courses: [],
  projects: [],
  leads: [],
  notes: [],
  customTags: [] as NoteTag[],
  pomodorosToday: 0,
  lastPomodoroDate: todayIso(),
  demoOn: false,
});

const demoSlice = () => ({
  profile: seedProfile,
  tasks: seedTasks,
  events: seedEvents,
  habits: seedHabits,
  checkins: seedCheckins,
  inbox: seedInbox,
  aiLogs: [] as AiLog[],
  courses: seedCourses,
  projects: seedProjects,
  leads: seedLeads,
  notes: seedNotes,
  customTags: [] as NoteTag[],
  pomodorosToday: 0,
  lastPomodoroDate: todayIso(),
  demoOn: true,
});

export const usePos = create<PosState>()(
  persist(
    (set, get) => ({
      ...emptySlice(),
      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      addTask: (t) =>
        set({
          tasks: [
            {
              ...t,
              id: uid("t"),
              createdAt: todayIso(),
              completedAt: null,
              pomodoros: 0,
            },
            ...get().tasks,
          ],
        }),
      updateTask: (id, patch) =>
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }),
      removeTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      completeTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status: "feito", completedAt: todayIso() } : t,
          ),
        }),
      addEvent: (e) => set({ events: [...get().events, { ...e, id: uid("e") }] }),
      removeEvent: (id) =>
        set({ events: get().events.filter((e) => e.id !== id) }),
      toggleHabit: (id, date) => {
        const day = date ?? todayIso();
        set({
          habits: get().habits.map((h) => {
            if (h.id !== id) return h;
            const has = h.logs.includes(day);
            return {
              ...h,
              logs: has ? h.logs.filter((d) => d !== day) : [...h.logs, day],
            };
          }),
        });
      },
      addHabit: (name, targetPerWeek) => {
        const title = name.trim();
        if (!title) return;
        const target = Math.max(1, Math.min(7, targetPerWeek || 1));
        set({
          habits: [
            ...get().habits,
            { id: uid("h"), name: title, detail: "", targetPerWeek: target, logs: [] },
          ],
        });
      },
      updateHabit: (id, patch) =>
        set({
          habits: get().habits.map((h) => {
            if (h.id !== id) return h;
            const name = patch.name?.trim();
            const target =
              patch.targetPerWeek == null
                ? h.targetPerWeek
                : Math.max(1, Math.min(7, patch.targetPerWeek));
            return { ...h, name: name || h.name, targetPerWeek: target };
          }),
        }),
      removeHabit: (id) => set({ habits: get().habits.filter((h) => h.id !== id) }),
      saveCheckIn: (c) =>
        set({
          checkins: [c, ...get().checkins.filter((x) => x.date !== c.date)].sort(
            (a, b) => b.date.localeCompare(a.date),
          ),
        }),
      addInbox: (text) => {
        get().addNote({
          area: null,
          title: titleFrom(text),
          body: text.trim(),
          para: "entrada",
          tags: [],
          projectId: null,
          courseId: null,
        });
      },
      removeInbox: (id) => get().removeNote(id),
      addAiLog: (kind, prompt, result) =>
        set({
          aiLogs: [
            {
              id: uid("ai"),
              kind,
              prompt,
              result,
              createdAt: new Date().toISOString(),
            },
            ...get().aiLogs,
          ].slice(0, 20),
        }),
      removeAiLog: (id) => set({ aiLogs: get().aiLogs.filter((l) => l.id !== id) }),
      bumpPomodoro: () => {
        const day = todayIso();
        const same = get().lastPomodoroDate === day;
        set({
          pomodorosToday: same ? get().pomodorosToday + 1 : 1,
          lastPomodoroDate: day,
        });
      },
      applyAiTasks: (titles) => {
        const extras: Task[] = titles.map((item) => ({
          id: uid("t"),
          title: item.title,
          notes: item.notes ?? "Gerada pela IA a partir da captura.",
          status: "inbox",
          quadrant: QUAD_SET.has(item.quadrant as Quadrant)
            ? (item.quadrant as Quadrant)
            : "importante",
          area: AREA_SET.has(item.area as Area)
            ? (item.area as Area)
            : "estudos",
          energy: "media",
          estimateMin: 30,
          due: null,
          createdAt: todayIso(),
          completedAt: null,
          pomodoros: 0,
        }));
        set({ tasks: [...extras, ...get().tasks] });
      },
      bumpCourse: (id, delta) =>
        set({
          courses: get().courses.map((c) => {
            if (c.id !== id) return c;
            const done = Math.max(0, Math.min(c.modules, c.done + delta));
            const current =
              c.syllabus[done] ??
              c.syllabus[c.syllabus.length - 1] ??
              (done >= c.modules && c.modules > 0 ? "Concluído" : c.current);
            return { ...c, done, current };
          }),
        }),
      addCourse: (c) =>
        set({
          courses: [
            {
              ...c,
              outcome: c.outcome ?? "",
              deadline: c.deadline ?? null,
              distill: c.distill ?? "",
              packets: asPackets(c.packets),
              id: uid("c"),
            },
            ...get().courses,
          ],
        }),
      updateCourse: (id, patch) =>
        set({
          courses: get().courses.map((c) =>
            c.id === id
              ? { ...c, ...patch, packets: patch.packets ? asPackets(patch.packets) : c.packets }
              : c,
          ),
        }),
      removeCourse: (id) =>
        set({ courses: get().courses.filter((c) => c.id !== id) }),
      addProject: (p) =>
        set({
          projects: [
            {
              ...p,
              outcome: p.outcome ?? "",
              deadline: p.deadline ?? null,
              distill: p.distill ?? "",
              packets: asPackets(p.packets),
              id: uid("p"),
            },
            ...get().projects,
          ],
        }),
      updateProject: (id, patch) =>
        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? { ...p, ...patch, packets: patch.packets ? asPackets(patch.packets) : p.packets }
              : p,
          ),
        }),
      removeProject: (id) =>
        set({ projects: get().projects.filter((p) => p.id !== id) }),
      addLead: (l) => set({ leads: [{ ...l, id: uid("l") }, ...get().leads] }),
      updateLead: (id, patch) =>
        set({
          leads: get().leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }),
      removeLead: (id) => set({ leads: get().leads.filter((l) => l.id !== id) }),
      addNote: (n) =>
        set({
          notes: [
            {
              ...n,
              para: asParaBucket(n.para) || "entrada",
              tags: asNoteTags(n.tags),
              area: areaFromTags(asNoteTags(n.tags)) ?? n.area ?? null,
              projectId: n.projectId ?? null,
              courseId: n.courseId ?? null,
              id: uid("sn"),
              createdAt: todayIso(),
            },
            ...get().notes,
          ],
        }),
      updateNote: (id, patch) =>
        set({
          notes: get().notes.map((n) => {
            if (n.id !== id) return n;
            const next = {
              ...n,
              ...patch,
              para: patch.para ? asParaBucket(patch.para) : n.para,
              tags: patch.tags ? asNoteTags(patch.tags) : n.tags,
            };
            return { ...next, area: areaFromTags(next.tags) };
          }),
        }),
      removeNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
      noteToTask: (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (!note) return;
        get().addTask({
          title: note.title.slice(0, 90),
          notes: note.body,
          status: "inbox",
          quadrant: null,
          area: areaFromTags(note.tags ?? []) ?? "pessoal",
          energy: "media",
          estimateMin: 30,
          due: null,
        });
      },
      addCustomTag: (label) => {
        const name = label.trim();
        const id = slugTag(name);
        if (!id) return null;
        if (NOTE_TAGS.some((t) => t.id === id)) return id;
        if (get().customTags.some((t) => t.id === id)) return id;
        set({ customTags: [...get().customTags, { id, label: name }] });
        return id;
      },
      clearData: () => set(emptySlice()),
      loadDemo: () => set(demoSlice()),
    }),
    { name: "norte-os-v2", version: 15, migrate: migratePos },
  ),
);

export function weekDates(from = new Date()) {
  const start = new Date(from);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(12, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function todayIsoClient() {
  return todayIso();
}

export type { LeadStatus, ProjectStatus };
