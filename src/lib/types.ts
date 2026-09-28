export type Quadrant =
  | "urgente-importante"
  | "importante"
  | "urgente"
  | "nenhum";

export type TaskStatus = "inbox" | "fazendo" | "espera" | "feito";

export type Area = "estudos" | "curiosidades" | "portfolio" | "linkedin" | "pessoal";

export type Energy = "alta" | "media" | "baixa";

export type EventKind =
  | "estudo"
  | "exercicios"
  | "codigo"
  | "aula"
  | "lote"
  | "compromisso";

export type ProjectStatus = "ideia" | "progresso" | "publicado";

export type LeadKind = "vaga" | "freela";

export type LeadStatus =
  | "prospectar"
  | "enviado"
  | "followup"
  | "entrevista"
  | "recusado";

export interface Task {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  quadrant: Quadrant | null;
  area: Area;
  energy: Energy;
  estimateMin: number;
  due: string | null;
  createdAt: string;
  completedAt: string | null;
  pomodoros: number;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  kind: EventKind;
  notes: string;
}

export interface Habit {
  id: string;
  name: string;
  detail: string;
  targetPerWeek: number;
  logs: string[];
}

export interface CheckIn {
  date: string;
  mood: number;
  energy: number;
  note: string;
}

export interface InboxNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface AiLog {
  id: string;
  kind: string;
  prompt: string;
  result: string;
  createdAt: string;
}

export interface Profile {
  name: string;
  role: string;
  weeklyFocus: string;
}

export interface Packet {
  id: string;
  title: string;
  done: boolean;
}

export interface DistillLayers {
  raw: string;
  bold: string;
  highlight: string;
  summary: string;
}

export function asLayers(raw: unknown, fallback = ""): DistillLayers {
  if (!raw || typeof raw !== "object") {
    return { raw: "", bold: "", highlight: "", summary: fallback };
  }
  const layer = raw as Partial<DistillLayers>;
  return {
    raw: typeof layer.raw === "string" ? layer.raw : "",
    bold: typeof layer.bold === "string" ? layer.bold : "",
    highlight: typeof layer.highlight === "string" ? layer.highlight : "",
    summary: typeof layer.summary === "string" ? layer.summary : fallback,
  };
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  modules: number;
  done: number;
  current: string;
  syllabus: string[];
  outcome: string;
  deadline: string | null;
  packets: Packet[];
  distill: string;
  layers?: DistillLayers;
}

export interface Project {
  id: string;
  name: string;
  stack: string;
  status: ProjectStatus;
  next: string;
  outcome: string;
  deadline: string | null;
  packets: Packet[];
  distill: string;
  layers?: DistillLayers;
}

export interface Lead {
  id: string;
  title: string;
  company: string;
  kind: LeadKind;
  status: LeadStatus;
  nextAction: string;
  followUp: string | null;
}

export type ParaBucket = "entrada" | "projetos" | "areas" | "recursos" | "arquivo";

export interface StudyNote {
  id: string;
  area: Area | null;
  title: string;
  body: string;
  para: ParaBucket;
  createdAt: string;
  tags: string[];
  projectId: string | null;
  courseId: string | null;
}

export const QUADRANTS: { id: Quadrant; label: string; hint: string }[] = [
  {
    id: "urgente-importante",
    label: "Fazer agora",
    hint: "Urgente e importante",
  },
  { id: "importante", label: "Agendar", hint: "Importante, sem urgência" },
  { id: "urgente", label: "Delegar", hint: "Urgente, pouco importante" },
  { id: "nenhum", label: "Eliminar", hint: "Nem urgente nem importante" },
];

export const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: "inbox", label: "Caixa de entrada" },
  { id: "espera", label: "Aguardando" },
  { id: "fazendo", label: "Em foco" },
  { id: "feito", label: "Concluído" },
];

export const AREAS: { id: Area; label: string }[] = [
  { id: "estudos", label: "Estudos" },
  { id: "curiosidades", label: "Curiosidades" },
  { id: "portfolio", label: "Portfólio" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "pessoal", label: "Pessoal" },
];

export const NOTE_TAGS: { id: string; label: string }[] = [
  { id: "estudos", label: "Estudos" },
  { id: "curiosidades", label: "Curiosidades" },
  { id: "portfolio", label: "Portfólio" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "pessoal", label: "Pessoal" },
  { id: "ia", label: "IA" },
  { id: "programacao", label: "Programação" },
  { id: "automacao", label: "Automação" },
  { id: "comunicacao", label: "Comunicação" },
  { id: "bem-estar", label: "Bem-estar" },
];

const DROPPED_TAGS = new Set([
  "javascript",
  "html-css",
  "git",
  "produtividade",
  "gtd",
  "para",
  "eisenhower",
  "cartorio",
]);

export type NoteTag = { id: string; label: string };

export function slugTag(label: string) {
  return label
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function tagLabel(id: string, extra: NoteTag[] = []) {
  return NOTE_TAGS.find((t) => t.id === id)?.label
    ?? extra.find((t) => t.id === id)?.label
    ?? id;
}

const TAG_ALIAS: Record<string, string> = {
  unifecaf: "estudos",
  rocketseat: "estudos",
  candidaturas: "linkedin",
};

export function asNoteTags(raw?: string[]) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const id = TAG_ALIAS[String(item ?? "").trim()] ?? String(item ?? "").trim();
    if (!id || DROPPED_TAGS.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function areaFromTags(tags: string[]): Area | null {
  for (const id of ["estudos", "curiosidades", "portfolio", "linkedin", "pessoal"] as Area[]) {
    if (tags.includes(id)) return id;
  }
  return null;
}

export const KINDS: { id: EventKind; label: string }[] = [
  { id: "estudo", label: "Estudo" },
  { id: "exercicios", label: "Exercícios" },
  { id: "codigo", label: "Código" },
  { id: "aula", label: "Aula" },
  { id: "lote", label: "Lote (vagas, mensagens e e-mails)" },
  { id: "compromisso", label: "Compromisso" },
];

export const BLOCK_KINDS = KINDS.filter((k) => k.id !== "compromisso");

export const PROJECT_STATUSES: { id: ProjectStatus; label: string }[] = [
  { id: "ideia", label: "Ideia" },
  { id: "progresso", label: "Em progresso" },
  { id: "publicado", label: "No GitHub" },
];

export const LEAD_STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "prospectar", label: "Prospectar" },
  { id: "enviado", label: "Enviado" },
  { id: "followup", label: "Follow-up" },
  { id: "entrevista", label: "Entrevista" },
  { id: "recusado", label: "Encerrado" },
];

export function otherStatuses<T extends { id: string }>(list: readonly T[], current: string): T[] {
  return list.filter((s) => s.id !== current);
}

export function areaLabel(id: Area | null | undefined): string {
  if (!id) return "";
  return AREAS.find((a) => a.id === id)?.label ?? id;
}

export function asEventKind(raw?: string): EventKind {
  if (raw === "foco") return "codigo";
  if (raw === "pausa" || raw === "pessoal") return "compromisso";
  if (KINDS.some((k) => k.id === raw)) return raw as EventKind;
  return "compromisso";
}

export function eventKindLabel(id: EventKind): string {
  return KINDS.find((k) => k.id === id)?.label ?? id;
}

export function courseProviderLabel(raw: string) {
  const s = (raw ?? "").trim();
  if (!s) return "Instituição";
  const k = s.toLowerCase();
  if (k === "unifecaf" || k.includes("faculdade")) return k === "unifecaf" ? "UniFECAF (faculdade)" : s;
  if (k === "rocketseat") return "Rocketseat (cursos)";
  return s;
}

export function asPackets(raw: unknown): Packet[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i) => {
      if (typeof item === "string") {
        const title = item.trim();
        return title ? { id: `pk-${i}`, title, done: false } : null;
      }
      if (!item || typeof item !== "object") return null;
      const row = item as { id?: string; title?: string; done?: boolean };
      const title = String(row.title ?? "").trim();
      if (!title) return null;
      return {
        id: String(row.id ?? `pk-${i}`),
        title,
        done: Boolean(row.done),
      };
    })
    .filter((p): p is Packet => Boolean(p));
}

export function packetProgress(packets: Packet[], fallback = 0) {
  if (!packets.length) return fallback;
  return Math.round((100 * packets.filter((p) => p.done).length) / packets.length);
}

export function projectProgress(p: { status: ProjectStatus; packets: Packet[] }) {
  if (p.status === "publicado") return 100;
  const fallback = p.status === "progresso" ? 45 : 12;
  return packetProgress(p.packets ?? [], fallback);
}
