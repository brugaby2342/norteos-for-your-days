import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { SecondBrain } from "@/components/capture";
import { CourseWorkspace, ProjectWorkspace } from "@/components/forte-workspace";
import { NoteCard } from "@/components/note-card";
import { PARA_BUCKETS, type ParaBucket } from "@/lib/para";
import { Button, Card, Field, Input } from "@/components/ui";
import {
  LEAD_STATUSES,
  PROJECT_STATUSES,
  otherStatuses,
  packetProgress,
  type LeadKind,
  type LeadStatus,
  type ProjectStatus,
  courseProviderLabel,
  slugTag,
  tagLabel,
} from "@/lib/types";
import { usePos } from "@/lib/store";

type Tab = ParaBucket | "cursos" | "portfolio" | "pipeline";

function parseTab(value: unknown): Tab {
  if (
    value === "entrada" ||
    value === "projetos" ||
    value === "areas" ||
    value === "recursos" ||
    value === "arquivo" ||
    value === "cursos" ||
    value === "portfolio" ||
    value === "pipeline"
  ) {
    return value;
  }
  if (value === "para" || value === "captura") return "entrada";
  return "entrada";
}

function asId(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function isBucket(tab: Tab): tab is ParaBucket {
  return PARA_BUCKETS.some((b) => b.id === tab);
}

export const Route = createFileRoute("/_app/frentes")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { aba?: Tab; projeto?: string; curso?: string } => {
    const aba = search.aba == null || search.aba === "" ? undefined : parseTab(search.aba);
    return { aba, projeto: asId(search.projeto), curso: asId(search.curso) };
  },
  component: Frentes,
});

function Frentes() {
  const { aba, projeto, curso } = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab = aba ?? "entrada";
  const courseName = usePos((s) => s.courses.find((c) => c.id === curso)?.name);
  const projectName = usePos((s) => s.projects.find((p) => p.id === projeto)?.name);
  function setTab(id: Tab) {
    void navigate({ search: { aba: id } });
  }
  function openCourse(id: string) {
    void navigate({ search: { aba: "cursos", curso: id } });
  }
  function openProject(id: string) {
    void navigate({ search: { aba: "portfolio", projeto: id } });
  }

  if (tab === "cursos" && curso) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Segundo cérebro</p>
          <h1 className="font-display text-4xl tracking-tight">
            {courseName || "Curso"}
          </h1>
        </header>
        <CourseWorkspace id={curso} onBack={() => setTab("cursos")} />
      </div>
    );
  }

  if (tab === "portfolio" && projeto) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">Segundo cérebro</p>
          <h1 className="font-display text-4xl tracking-tight">
            {projectName || "Projeto"}
          </h1>
        </header>
        <ProjectWorkspace id={projeto} onBack={() => setTab("portfolio")} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      {isBucket(tab) ? (
        <SecondBrain
          bucket={tab}
          onBucket={(id) => setTab(id)}
          onMore={() => setTab("cursos")}
        />
      ) : (
        <>
          <header>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Segundo cérebro</p>
            <h1 className="font-display text-4xl tracking-tight">
              {tab === "cursos" ? "Cursos" : tab === "portfolio" ? "Portfólio" : "Candidaturas"}
            </h1>
          </header>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["cursos", "Cursos"],
                ["portfolio", "Portfólio"],
                ["pipeline", "Candidaturas"],
              ] as const
            ).map(([id, label]) => (
              <Button key={id} tone={tab === id ? "primary" : "ghost"} onClick={() => setTab(id)}>
                {label}
              </Button>
            ))}
            <Button tone="ghost" onClick={() => setTab("entrada")}>
              Voltar às notas
            </Button>
          </div>
        </>
      )}
      {tab === "cursos" ? <CursosPanel onOpen={openCourse} /> : null}
      {tab === "portfolio" ? <PortfolioPanel onOpen={openProject} /> : null}
      {tab === "pipeline" ? <PipelinePanel /> : null}
    </div>
  );
}

function institutionsFrom(courses: { provider: string }[]) {
  const map = new Map<string, string>();
  for (const course of courses) {
    const label = courseProviderLabel(course.provider);
    const key = slugTag(label);
    if (!key || map.has(key)) continue;
    map.set(key, label);
  }
  return [...map.entries()].map(([key, label]) => ({ key, label }));
}

function noteMatchesInstitution(
  note: { tags?: string[]; area?: string | null },
  key: string,
  label: string,
) {
  const wanted = new Set([key, slugTag(label), label.toLowerCase()]);
  const tags = note.tags ?? [];
  if (
    tags.some((tag) => {
      const named = tagLabel(tag);
      return wanted.has(tag) || wanted.has(tag.toLowerCase()) || wanted.has(slugTag(named));
    })
  ) {
    return true;
  }
  return Boolean(note.area && (wanted.has(note.area) || wanted.has(slugTag(note.area))));
}

function CursosPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const courses = usePos((s) => s.courses);
  const notes = usePos((s) => s.notes);
  const bumpCourse = usePos((s) => s.bumpCourse);
  const addCourse = usePos((s) => s.addCourse);
  const removeCourse = usePos((s) => s.removeCourse);
  const updateNote = usePos((s) => s.updateNote);
  const removeNote = usePos((s) => s.removeNote);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [moduleDraft, setModuleDraft] = useState("");
  const [syllabus, setSyllabus] = useState<string[]>([]);

  function addModule() {
    const item = moduleDraft.trim();
    if (!item) return;
    setSyllabus((list) => [...list, item]);
    setModuleDraft("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const modules = syllabus.length;
    addCourse({
      name: name.trim(),
      provider: provider.trim() || "A definir",
      modules,
      done: 0,
      current: syllabus[0] ?? "A começar",
      syllabus,
      outcome: "",
      deadline: null,
      distill: "",
      packets: [],
    });
    setName("");
    setProvider("");
    setModuleDraft("");
    setSyllabus([]);
  }

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted">
        Cada curso é um projeto. Entre para gerir no método CODE.
      </p>
      <Card>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <Field label="Curso">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do curso"
            />
          </Field>
          <Field label="Instituição">
            <Input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="UniFECAF (faculdade), Rocketseat (cursos), outra plataforma…"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Módulos">
              <div className="flex gap-2">
                <Input
                  value={moduleDraft}
                  onChange={(e) => setModuleDraft(e.target.value)}
                  placeholder="Nome do módulo"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addModule();
                    }
                  }}
                />
                <Button type="button" tone="ghost" onClick={addModule}>
                  Adicionar módulo
                </Button>
              </div>
            </Field>
            {syllabus.length > 0 ? (
              <ol className="mt-2 grid gap-1">
                {syllabus.map((item, i) => (
                  <li
                    key={`${item}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-md border border-line bg-bg px-3 py-2 text-sm"
                  >
                    <span>
                      {i + 1}. {item}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-clay"
                      onClick={() => setSyllabus((list) => list.filter((_, j) => j !== i))}
                    >
                      Tirar
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-xs text-subtle">
                Inclua os módulos na ordem do cronograma.
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Adicionar curso</Button>
          </div>
        </form>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        {courses.map((c) => {
          const pct = c.modules ? Math.round((c.done / c.modules) * 100) : 0;
          const pack = packetProgress(c.packets, pct);
          return (
            <Card key={c.id} className="grid gap-3">
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">
                {courseProviderLabel(c.provider)}
              </p>
              <h2 className="font-display text-2xl tracking-tight">{c.name}</h2>
              {c.outcome ? <p className="text-sm text-muted">{c.outcome}</p> : null}
              <p className="text-sm text-muted">Módulo atual: {c.current}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-warm">
                <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs tabular-nums text-subtle">
                Módulos {c.done}/{c.modules} · Pacotes {pack}%
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => onOpen(c.id)}>
                  Entrar no curso
                </Button>
                <Button type="button" tone="ghost" onClick={() => bumpCourse(c.id, 1)}>
                  Módulo feito
                </Button>
                <Button type="button" tone="ghost" onClick={() => bumpCourse(c.id, -1)}>
                  Desfazer
                </Button>
                <button
                  type="button"
                  className="text-xs text-clay"
                  onClick={() => removeCourse(c.id)}
                >
                  Remover
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {institutionsFrom(courses).map(({ key, label }) => {
          const tagged = notes.filter((n) => noteMatchesInstitution(n, key, label));
          return (
            <Card key={key} className="grid gap-3">
              <h2 className="font-display text-2xl tracking-tight">Notas de aula · {label}</h2>
              {tagged.length === 0 ? (
                <p className="text-sm text-muted">
                  Nenhuma nota desta instituição. Use a tag com o nome da plataforma ao enviar a nota.
                </p>
              ) : (
                <ul className="grid gap-2">
                  {tagged.map((n) => (
                    <li key={n.id}>
                      <NoteCard
                        note={n}
                        onSave={(patch) => updateNote(n.id, patch)}
                        onRemove={() => removeNote(n.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PortfolioPanel({ onOpen }: { onOpen: (id: string) => void }) {
  const projects = usePos((s) => s.projects);
  const addProject = usePos((s) => s.addProject);
  const updateProject = usePos((s) => s.updateProject);
  const removeProject = usePos((s) => s.removeProject);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("JavaScript");
  const [next, setNext] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({
      name: name.trim(),
      stack,
      status: "ideia",
      next: next || "Definir o primeiro commit.",
      outcome: "",
      deadline: null,
      distill: "",
      packets: [],
    });
    setName("");
    setNext("");
  }

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted">
        Cadastre seu novo projeto que irá para o Portfólio
      </p>
      <Card>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
          <Field label="Projeto">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do projeto" />
          </Field>
          <Field label="Stack">
            <Input value={stack} onChange={(e) => setStack(e.target.value)} />
          </Field>
          <Field label="Próximo passo">
            <Input value={next} onChange={(e) => setNext(e.target.value)} placeholder="O que publicar primeiro" />
          </Field>
          <div className="sm:col-span-3">
            <Button type="submit">Capturar ideia</Button>
          </div>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {PROJECT_STATUSES.map((col) => (
          <Card key={col.id} className="min-h-56">
            <h2 className="mb-3 font-display text-xl tracking-tight">{col.label}</h2>
            <ul className="grid gap-2">
              {projects
                .filter((p) => p.status === col.id)
                .map((p) => (
                  <li key={p.id} className="rounded-md border border-line bg-bg p-3">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-subtle">{p.stack}</p>
                    <p className="mt-1 text-xs text-muted">{p.next}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <button
                        type="button"
                        className="rounded-full border border-forest px-2 py-1 text-[11px] text-forest"
                        onClick={() => onOpen(p.id)}
                      >
                        Entrar
                      </button>
                      {otherStatuses(PROJECT_STATUSES, p.status).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="rounded-full border border-line px-2 py-1 text-[11px] text-muted"
                          onClick={() => updateProject(p.id, { status: s.id as ProjectStatus })}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="rounded-full px-2 py-1 text-[11px] text-clay"
                        onClick={() => removeProject(p.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeadContext({
  value,
  onSave,
}: {
  value: string;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    onSave(draft.trim());
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        title="Editar descrição"
        aria-label="Editar descrição"
        className="mt-1 flex w-full items-start gap-1.5 text-left text-xs text-muted"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
      >
        <Pencil className="mt-0.5 h-3 w-3 shrink-0 text-subtle" strokeWidth={1.75} />
        <span className="min-w-0 flex-1">
          {value.trim() ? value : <span className="text-subtle">Descrição / contexto</span>}
        </span>
      </button>
    );
  }

  return (
    <Input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="Descrição / contexto"
      className="mt-1 text-xs"
      aria-label="Descrição ou contexto da candidatura"
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") setEditing(false);
      }}
    />
  );
}

function PipelinePanel() {
  const leads = usePos((s) => s.leads);
  const addLead = usePos((s) => s.addLead);
  const updateLead = usePos((s) => s.updateLead);
  const removeLead = usePos((s) => s.removeLead);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [kind, setKind] = useState<LeadKind>("freela");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addLead({
      title: title.trim(),
      company: company.trim() || "A definir",
      kind,
      status: "prospectar",
      nextAction: "",
      followUp: null,
    });
    setTitle("");
    setCompany("");
  }

  return (
    <div className="grid gap-5">
      <Card>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
          <Field label="Vaga ou projeto">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
          </Field>
          <Field label="Empresa / cliente">
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Tipo">
            <select
              className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as LeadKind)}
            >
              <option value="freela">Freela</option>
              <option value="vaga">Vaga</option>
            </select>
          </Field>
          <div className="sm:col-span-3">
            <Button type="submit">Adicionar ao pipeline</Button>
            <p className="mt-2 text-xs text-subtle">
              Clique no lápis do card gerado para anotar o contexto. Atualize-o sempre que mudar
            </p>
          </div>
        </form>
      </Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {LEAD_STATUSES.map((col) => (
          <Card key={col.id} className="min-h-40 p-4">
            <h2 className="mb-3 font-display text-lg tracking-tight">{col.label}</h2>
            <ul className="grid gap-2">
              {leads
                .filter((l) => l.status === col.id)
                .map((l) => (
                  <li key={l.id} className="rounded-md border border-line bg-bg p-3">
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="text-xs text-subtle">
                      {l.company} · {l.kind === "freela" ? "Freela" : "Vaga"}
                    </p>
                    <LeadContext
                      value={l.nextAction}
                      onSave={(nextAction) => updateLead(l.id, { nextAction })}
                    />
                    <div className="mt-2 flex flex-wrap gap-1">
                      {otherStatuses(LEAD_STATUSES, l.status).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="rounded-full border border-line px-2 py-1 text-[11px] text-muted"
                          onClick={() => updateLead(l.id, { status: s.id as LeadStatus })}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="rounded-full px-2 py-1 text-[11px] text-clay"
                        onClick={() => removeLead(l.id)}
                      >
                        Tirar
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
