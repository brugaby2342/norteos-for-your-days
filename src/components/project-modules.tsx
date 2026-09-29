import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { usePos } from "@/lib/store";

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

export function ProjectModules({ id }: { id: string }) {
  const project = usePos((s) => s.projects.find((p) => p.id === id));
  const updateProject = usePos((s) => s.updateProject);

  if (!project) return null;

  const syllabus = project.syllabus ?? [];
  const total = syllabus.length || project.modules || 0;
  const done = Math.max(0, Math.min(project.done ?? 0, total));
  const pctMods = total ? Math.round((done / total) * 100) : 0;

  function bump(delta: number) {
    const nextDone = Math.max(0, Math.min(total, done + delta));
    updateProject(id, {
      done: nextDone,
      modules: total,
      current:
        syllabus[nextDone] ??
        syllabus[syllabus.length - 1] ??
        (nextDone >= total && total > 0 ? "Concluído" : project.current ?? "A começar"),
    });
  }

  return (
    <Card className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-2xl tracking-tight">Módulos</h2>
        <p className="pt-1 text-sm tabular-nums text-muted">{pctMods}%</p>
      </div>
      <p className="text-sm text-muted">
        {syllabus.length ? `Atual: ${project.current || syllabus[done] || "A começar"}` : "Nenhum módulo cadastrado ainda."}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-warm">
        <div className="h-full bg-forest" style={{ width: `${pctMods}%` }} />
      </div>
      {syllabus.length > 0 ? (
        <ol className="grid gap-1">
          {syllabus.map((item, i) => (
            <li
              key={`${id}-m-${i}`}
              className="flex items-center justify-between gap-2 rounded-md border border-line bg-bg px-3 py-2"
            >
              <span
                className={`text-sm ${
                  i < done
                    ? "text-subtle line-through"
                    : i === done
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
                  const next = syllabus.filter((_, j) => j !== i);
                  const nextDone = Math.min(done, next.length);
                  updateProject(id, {
                    syllabus: next,
                    modules: next.length,
                    done: nextDone,
                    current: next[nextDone] ?? "A começar",
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
          const next = [...syllabus, title];
          updateProject(id, {
            syllabus: next,
            modules: next.length,
            current: syllabus.length === 0 ? title : project.current,
          });
        }}
      />
      <div className="flex gap-2">
        <Button type="button" tone="ghost" onClick={() => bump(1)}>
          Módulo feito
        </Button>
        <Button type="button" tone="ghost" onClick={() => bump(-1)}>
          Desfazer
        </Button>
      </div>
    </Card>
  );
}
