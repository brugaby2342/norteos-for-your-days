import { Button, Card, Field, Input } from "@/components/ui";
import { NoteCard } from "@/components/note-card";
import { ProjectModules } from "@/components/project-modules";
import { DistillPanel, ExpressPanel, ModuleAdder, ProjectNoteComposer } from "@/components/forte-panels";
import { packetProgress, asLayers, slugTag, type ProjectStatus } from "@/lib/types";
import { usePos } from "@/lib/store";

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

      <ProjectModules id={id} />

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
