import { useEffect, useRef, useState } from "react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { NoteCard } from "@/components/note-card";
import { packetProgress, asLayers, slugTag, type DistillLayers, type Packet, type ProjectStatus } from "@/lib/types";
import { usePos } from "@/lib/store";

function pid() {
  return `pk-${Math.random().toString(36).slice(2, 9)}`;
}

function PacketsEditor({
  packets,
  onChange,
}: {
  packets: Packet[];
  onChange: (next: Packet[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const title = draft.trim();
    if (!title) return;
    onChange([...packets, { id: pid(), title, done: false }]);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <ul className="grid gap-1">
        {packets.map((p) => (
          <li key={p.id} className="flex items-center gap-2 rounded-md border border-line bg-bg px-3 py-2">
            <input
              type="checkbox"
              checked={p.done}
              onChange={() =>
                onChange(packets.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))
              }
              className="size-4 accent-[var(--forest,#1f5c4a)]"
            />
            <span className={`flex-1 text-sm ${p.done ? "text-subtle line-through" : ""}`}>
              {p.title}
            </span>
            <button
              type="button"
              className="text-xs text-clay"
              onClick={() => onChange(packets.filter((x) => x.id !== p.id))}
            >
              Tirar
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Novo pacote intermediário"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" tone="ghost" onClick={add}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}

function markupToHtml(src: string) {
  const html = src
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/==([^=\n]+)==/g, "<mark>$1</mark>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
  return html;
}

function htmlToMarkup(html: string) {
  let out = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>\s*<div>/gi, "\n")
    .replace(/<\/?div>/gi, "")
    .replace(/<\/?span[^>]*>/gi, "")
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "");
  for (let i = 0; i < 4; i += 1) {
    out = out
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<mark>([\s\S]*?)<\/mark>/gi, "==$1==");
  }
  return out
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/^\n/, "");
}

function RawLayer({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    const html = markupToHtml(value);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [value]);

  function publish() {
    const el = ref.current;
    if (!el) return;
    onChange(htmlToMarkup(el.innerHTML));
  }

  function apply(kind: "bold" | "mark") {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) return;
    const wrap = document.createElement(kind === "bold" ? "strong" : "mark");
    try {
      range.surroundContents(wrap);
    } catch {
      wrap.appendChild(range.extractContents());
      range.insertNode(wrap);
    }
    sel.removeAllRanges();
    publish();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          tone="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply("bold")}
        >
          Negrito
        </Button>
        <Button
          type="button"
          tone="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply("mark")}
        >
          Marca-texto
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Camada 0, material bruto"
        data-placeholder="Cole a aula, o artigo ou as anotações."
        className="min-h-28 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-forest empty:before:text-subtle empty:before:content-[attr(data-placeholder)] [&_mark]:rounded-sm [&_mark]:bg-[#f3e2a0] [&_mark]:px-0.5 [&_strong]:font-semibold"
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          publish();
        }}
        onInput={publish}
      />
      <p className="text-xs text-subtle">
        Selecione um trecho e use Negrito ou Marca-texto.
      </p>
    </div>
  );
}

function DistillPanel({
  layers,
  onChange,
}: {
  layers: DistillLayers;
  onChange: (next: DistillLayers) => void;
}) {
  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight">Destilar</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Sumarização progressiva para refinar e destilar informações em camadas cada vez menores,
          facilitando a consulta futura
        </p>
      </div>

      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 0 · Material bruto</span>
        <span className="text-xs text-subtle">O texto original.</span>
        <RawLayer value={layers.raw} onChange={(raw) => onChange({ ...layers, raw })} />
      </div>

      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 1 · Destaque em negrito</span>
        <p className="text-sm leading-relaxed text-muted">
          Selecione no material bruto só o que importa e toque em Negrito.
        </p>
      </div>

      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 2 · Destaque marca-texto</span>
        <p className="text-sm leading-relaxed text-muted">
          Do que já está em negrito, selecione apenas o que você vai consultar de novo e toque em
          Marca-texto.
        </p>
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Camada 3 · Resumo executivo</span>
        <span className="text-xs text-subtle">Poucas frases. É o que sobra para consultar depois.</span>
        <Textarea
          value={layers.summary}
          onChange={(e) => onChange({ ...layers, summary: e.target.value })}
          placeholder="O resumo que você leria daqui a um mês."
        />
      </label>
    </Card>
  );
}

function ExpressPanel({
  packets,
  onChange,
}: {
  packets: Packet[];
  onChange: (next: Packet[]) => void;
}) {
  return (
    <Card className="grid gap-3">
      <h2 className="font-display text-2xl tracking-tight">
        Expressar · Pacotes intermediários (PIs)
      </h2>
      <p className="text-sm leading-relaxed text-muted">
        Os PIs são os blocos de construção concretos e individuais que compõem seu trabalho. Você
        cria apenas um pequeno bloco de construção de cada vez e obtém as considerações externas
        antes de seguir em frente.
      </p>
      <PacketsEditor packets={packets} onChange={onChange} />
    </Card>
  );
}

function ModuleAdder({ onAdd }: { onAdd: (title: string) => void }) {
  const [draft, setDraft] = useState("");
  function add() {
    const title = draft.trim();
    if (!title) return;
    onAdd(title);
    setDraft("");
  }
  return (
    <div className="flex gap-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Novo módulo"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
      />
      <Button type="button" tone="ghost" onClick={add}>
        Adicionar módulo
      </Button>
    </div>
  );
}

function ProjectNoteComposer({
  onAdd,
}: {
  onAdd: (title: string, body: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const empty = !title.trim() && !body.trim();
  return (
    <div className="grid gap-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da nota" />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Capturar ideia, trecho, decisão…"
        className="min-h-24"
      />
      <Button
        type="button"
        disabled={empty}
        onClick={() => {
          onAdd(title.trim() || body.trim().split("\n")[0] || "Sem título", body.trim());
          setTitle("");
          setBody("");
        }}
      >
        Guardar nota
      </Button>
    </div>
  );
}

export function CourseWorkspace({ id, onBack }: { id: string; onBack: () => void }) {
  const course = usePos((s) => s.courses.find((c) => c.id === id));
  const notesAll = usePos((s) => s.notes);
  const notes = notesAll.filter((n) => n.courseId === id);
  const updateCourse = usePos((s) => s.updateCourse);
  const addNote = usePos((s) => s.addNote);
  const updateNote = usePos((s) => s.updateNote);
  const removeNote = usePos((s) => s.removeNote);
  const bumpCourse = usePos((s) => s.bumpCourse);

  if (!course) {
    return (
      <Card>
        <p className="text-sm text-muted">Curso não encontrado.</p>
        <Button className="mt-3" tone="ghost" onClick={onBack}>
          Voltar
        </Button>
      </Card>
    );
  }

  const pctMods = course.modules ? Math.round((course.done / course.modules) * 100) : 0;
  const pctPack = packetProgress(course.packets, pctMods);
  const inst = slugTag(course.provider);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" tone="ghost" onClick={onBack}>
          Voltar aos cursos
        </Button>
        <p className="text-xs tabular-nums text-subtle">
          Módulos {pctMods}% · Pacotes {pctPack}%
        </p>
      </div>
      <p className="text-sm text-muted">
        Gestão no método CODE: capturar notas, organizar o resultado, destilar o essencial e
        expressar em pacotes intermediários.
      </p>

      <Card className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Organizar</h2>
        <Field label="Curso">
          <Input value={course.name} onChange={(e) => updateCourse(id, { name: e.target.value })} />
        </Field>
        <Field label="Instituição">
          <Input
            value={course.provider}
            onChange={(e) => updateCourse(id, { provider: e.target.value })}
          />
        </Field>
        <Field label="Resultado (Como sei que concluí o curso?)">
          <Input
            value={course.outcome}
            onChange={(e) => updateCourse(id, { outcome: e.target.value })}
            placeholder="Ex.: POS entregue e pitch gravado"
          />
        </Field>
        <Field label="Prazo">
          <Input
            type="date"
            value={course.deadline ?? ""}
            onChange={(e) => updateCourse(id, { deadline: e.target.value || null })}
          />
        </Field>
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl tracking-tight">Módulos</h2>
          <p className="pt-1 text-sm tabular-nums text-muted">{pctMods}%</p>
        </div>
        <p className="text-sm text-muted">
          {course.syllabus.length
            ? `Atual: ${course.current}`
            : "Nenhum módulo cadastrado ainda."}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-bg-warm">
          <div className="h-full bg-forest" style={{ width: `${pctMods}%` }} />
        </div>
        {course.syllabus.length > 0 ? (
          <ol className="grid gap-1">
            {course.syllabus.map((item, i) => (
              <li
                key={`${id}-m-${i}`}
                className="flex items-center justify-between gap-2 rounded-md border border-line bg-bg px-3 py-2"
              >
                <span
                  className={`text-sm ${
                    i < course.done
                      ? "text-subtle line-through"
                      : i === course.done
                        ? "font-medium text-ink"
                        : "text-muted"
                  }`}
                >
                  {i + 1}. {item}
                </span>
                <button
                  type="button"
                  className="text-xs text-clay"
                  onClick={() => {
                    const syllabus = course.syllabus.filter((_, j) => j !== i);
                    const done = Math.min(course.done, syllabus.length);
                    updateCourse(id, {
                      syllabus,
                      modules: syllabus.length,
                      done,
                      current: syllabus[done] ?? "A começar",
                    });
                  }}
                >
                  Tirar
                </button>
              </li>
            ))}
          </ol>
        ) : null}
        <ModuleAdder
          onAdd={(title) => {
            const syllabus = [...course.syllabus, title];
            updateCourse(id, {
              syllabus,
              modules: syllabus.length,
              current: course.syllabus.length === 0 ? title : course.current,
            });
          }}
        />
        <div className="flex gap-2">
          <Button type="button" tone="ghost" onClick={() => bumpCourse(id, 1)}>
            Módulo feito
          </Button>
          <Button type="button" tone="ghost" onClick={() => bumpCourse(id, -1)}>
            Desfazer
          </Button>
        </div>
      </Card>

      <DistillPanel
        layers={asLayers(course.layers, course.distill)}
        onChange={(layers) => updateCourse(id, { layers, distill: layers.summary })}
      />

      <ExpressPanel
        packets={course.packets}
        onChange={(packets) => updateCourse(id, { packets })}
      />

      <Card className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Capturar · notas</h2>
        <ProjectNoteComposer
          onAdd={(title, body) =>
            addNote({
              title,
              body,
              para: "recursos",
              area: "estudos",
              tags: inst ? ["estudos", inst] : ["estudos"],
              projectId: null,
              courseId: id,
            })
          }
        />
        {notes.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma nota neste curso ainda.</p>
        ) : (
          <ul className="grid gap-2">
            {notes.map((n) => (
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
    </div>
  );
}

export function ProjectWorkspace({ id, onBack }: { id: string; onBack: () => void }) {
  const project = usePos((s) => s.projects.find((p) => p.id === id));
  const notesAll = usePos((s) => s.notes);
  const notes = notesAll.filter((n) => n.projectId === id);
  const updateProject = usePos((s) => s.updateProject);
  const addNote = usePos((s) => s.addNote);
  const updateNote = usePos((s) => s.updateNote);
  const removeNote = usePos((s) => s.removeNote);

  if (!project) {
    return (
      <Card>
        <p className="text-sm text-muted">Projeto não encontrado.</p>
        <Button className="mt-3" tone="ghost" onClick={onBack}>
          Voltar
        </Button>
      </Card>
    );
  }

  const fallback = project.status === "publicado" ? 100 : project.status === "progresso" ? 45 : 12;
  const pct = packetProgress(project.packets, fallback);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" tone="ghost" onClick={onBack}>
          Voltar ao portfólio
        </Button>
        <p className="text-xs tabular-nums text-subtle">{pct}%</p>
      </div>
      <p className="text-sm text-muted">
        Um projeto tem resultado e prazo. Capture, organize, destile e expresse em pacotes.
      </p>

      <div className="h-1.5 overflow-hidden rounded-full bg-bg-warm">
        <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
      </div>

      <Card className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Organizar</h2>
        <Field label="Projeto">
          <Input value={project.name} onChange={(e) => updateProject(id, { name: e.target.value })} />
        </Field>
        <Field label="Stack">
          <Input value={project.stack} onChange={(e) => updateProject(id, { stack: e.target.value })} />
        </Field>
        <Field label="Fase">
          <select
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
            value={project.status}
            onChange={(e) => updateProject(id, { status: e.target.value as ProjectStatus })}
          >
            <option value="ideia">Ideia</option>
            <option value="progresso">Em progresso</option>
            <option value="publicado">No GitHub</option>
          </select>
        </Field>
        <Field label="Resultado (Como sei que concluí o projeto?)">
          <Input
            value={project.outcome}
            onChange={(e) => updateProject(id, { outcome: e.target.value })}
            placeholder="Ex.: página no GitHub com README"
          />
        </Field>
        <Field label="Prazo">
          <Input
            type="date"
            value={project.deadline ?? ""}
            onChange={(e) => updateProject(id, { deadline: e.target.value || null })}
          />
        </Field>
        <Field label="Próxima ação">
          <Input
            value={project.next}
            onChange={(e) => updateProject(id, { next: e.target.value })}
          />
        </Field>
      </Card>

      <DistillPanel
        layers={asLayers(project.layers, project.distill)}
        onChange={(layers) => updateProject(id, { layers, distill: layers.summary })}
      />

      <ExpressPanel
        packets={project.packets}
        onChange={(packets) => updateProject(id, { packets })}
      />

      <Card className="grid gap-3">
        <h2 className="font-display text-2xl tracking-tight">Capturar · notas</h2>
        <ProjectNoteComposer
          onAdd={(title, body) =>
            addNote({
              title,
              body,
              para: "projetos",
              area: "portfolio",
              tags: ["portfolio"],
              projectId: id,
              courseId: null,
            })
          }
        />
        {notes.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma nota neste projeto ainda.</p>
        ) : (
          <ul className="grid gap-2">
            {notes.map((n) => (
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
    </div>
  );
}
