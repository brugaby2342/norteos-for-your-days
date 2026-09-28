import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Field, Input, Pill } from "@/components/ui";
import {
  AREAS,
  QUADRANTS,
  STATUSES,
  type Area,
  type Energy,
  type Quadrant,
  type Task,
} from "@/lib/types";
import { usePos } from "@/lib/store";

export const Route = createFileRoute("/_app/tarefas")({ component: Tarefas });

function Tarefas() {
  const tasks = usePos((s) => s.tasks);
  const addTask = usePos((s) => s.addTask);
  const updateTask = usePos((s) => s.updateTask);
  const completeTask = usePos((s) => s.completeTask);
  const removeTask = usePos((s) => s.removeTask);
  const [view, setView] = useState<"matriz" | "quadro">("matriz");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [quadrant, setQuadrant] = useState<Quadrant>("importante");
  const [area, setArea] = useState<Area>("estudos");
  const [energy, setEnergy] = useState<Energy>("media");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      notes,
      status: "inbox",
      quadrant,
      area,
      energy,
      estimateMin: 30,
      due: null,
    });
    setTitle("");
    setNotes("");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Tarefas e prioridades</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Cadastre suas tarefas e classifique-as conforme suas prioridades
          </p>
        </div>
        <div className="flex gap-2">
          <Button tone={view === "matriz" ? "primary" : "ghost"} onClick={() => setView("matriz")}>
            Matriz de Eisenhower
          </Button>
          <Button tone={view === "quadro" ? "primary" : "ghost"} onClick={() => setView("quadro")}>
            Quadro Kanban
          </Button>
        </div>
      </header>

      <Card>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <Field label="Nova Tarefa">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O que precisa ser feito?" />
          </Field>
          <Field label="Descrição">
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contexto curto" />
          </Field>
          <Field label="Quadrante da Matriz">
            <select
              className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
              value={quadrant}
              onChange={(e) => setQuadrant(e.target.value as Quadrant)}
            >
              {QUADRANTS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Frente">
              <select
                className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm"
                value={area}
                onChange={(e) => setArea(e.target.value as Area)}
              >
                {AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Energia">
              <select
                className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm"
                value={energy}
                onChange={(e) => setEnergy(e.target.value as Energy)}
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </Field>
            <Button type="submit">Capturar</Button>
          </div>
        </form>
      </Card>

      {tasks.some((t) => !t.quadrant && t.status !== "feito") ? (
        <Card className="grid gap-3">
          <h2 className="font-display text-2xl tracking-tight">Para classificar</h2>
          <p className="text-sm text-muted">
            Vieram da Entrada. Preencha frente, energia e contexto e escolha o quadrante.
          </p>
          <ul className="grid gap-3">
            {tasks
              .filter((t) => !t.quadrant && t.status !== "feito")
              .map((t) => (
                <ClassifyCard
                  key={t.id}
                  task={t}
                  onApply={(patch) => updateTask(t.id, patch)}
                />
              ))}
          </ul>
        </Card>
      ) : null}

      {view === "matriz" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {QUADRANTS.map((q) => (
            <Card key={q.id} className="min-h-56">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h2 className="font-display text-xl tracking-tight">{q.label}</h2>
                <span className="text-xs text-subtle">{q.hint}</span>
              </div>
              <ul className="grid gap-2">
                {tasks
                  .filter((t) => t.quadrant === q.id && t.status !== "feito")
                  .map((t) => (
                    <TaskRow
                      key={t.id}
                      id={t.id}
                      title={t.title}
                      meta={`${AREAS.find((a) => a.id === t.area)?.label ?? t.area} · ${t.energy}`}
                      focos={t.pomodoros}
                      onDone={() => completeTask(t.id)}
                      onDrop={() => removeTask(t.id)}
                      onFocus={() => updateTask(t.id, { status: "fazendo" })}
                    />
                  ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((col) => (
            <Card key={col.id} className="min-h-64">
              <h2 className="mb-3 font-display text-xl tracking-tight">{col.label}</h2>
              <ul className="grid gap-2">
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((t) => (
                    <li key={t.id} className="rounded-md border border-line bg-bg p-3">
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="mt-1 text-xs text-subtle">{t.notes}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Pill tone="forest">
                          {AREAS.find((a) => a.id === t.area)?.label ?? t.area}
                        </Pill>
                        <Pill>
                          {t.pomodoros} {t.pomodoros === 1 ? "foco" : "focos"}
                        </Pill>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {STATUSES.filter((s) => s.id !== t.status).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className="rounded-full border border-line px-2 py-1 text-[11px] text-muted hover:text-ink"
                            onClick={() =>
                              s.id === "feito"
                                ? completeTask(t.id)
                                : updateTask(t.id, { status: s.id })
                            }
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ClassifyCard({
  task,
  onApply,
}: {
  task: Task;
  onApply: (patch: Partial<Task>) => void;
}) {
  const [area, setArea] = useState<Area | "">("");
  const [energy, setEnergy] = useState<Energy>(task.energy);
  const [contexto, setContexto] = useState(task.notes);

  return (
    <li className="grid gap-3 rounded-md border border-line bg-bg p-3">
      <p className="text-sm font-medium">{task.title}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Frente">
          <select
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
            value={area}
            onChange={(e) => setArea(e.target.value as Area | "")}
          >
            <option value="">Escolher…</option>
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Energia">
          <select
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
            value={energy}
            onChange={(e) => setEnergy(e.target.value as Energy)}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </Field>
        <Field label="Contexto">
          <Input
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Contexto curto"
          />
        </Field>
      </div>
      <div>
        <p className="mb-2 text-xs text-muted">Quadrante da Matriz</p>
        <div className="flex flex-wrap gap-1">
          {QUADRANTS.map((q) => (
            <button
              key={q.id}
              type="button"
              className="rounded-full border border-line px-2 py-1 text-[11px] text-muted hover:text-ink"
              onClick={() =>
                onApply({
                  quadrant: q.id,
                  area: area || "pessoal",
                  energy,
                  notes: contexto,
                })
              }
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}

function TaskRow({
  id,
  title,
  meta,
  focos,
  onDone,
  onDrop,
  onFocus,
}: {
  id: string;
  title: string;
  meta: string;
  focos: number;
  onDone: () => void;
  onDrop: () => void;
  onFocus: () => void;
}) {
  return (
    <li className="rounded-md border border-line bg-bg p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-subtle">
        {meta} · {focos} {focos === 1 ? "foco" : "focos"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          to="/foco"
          search={{ tarefa: id }}
          className="text-xs text-forest"
          onClick={onFocus}
        >
          Focar
        </Link>
        <button type="button" className="text-xs text-forest" onClick={onDone}>
          Concluir
        </button>
        <button type="button" className="text-xs text-clay" onClick={onDrop}>
          Remover
        </button>
      </div>
    </li>
  );
}
