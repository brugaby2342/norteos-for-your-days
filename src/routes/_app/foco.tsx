import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Input, Pill } from "@/components/ui";
import { todayIsoClient, usePos, weekDates } from "@/lib/store";
import type { Habit } from "@/lib/types";

export const Route = createFileRoute("/_app/foco")({
  validateSearch: (search: Record<string, unknown>): { tarefa?: string } => {
    if (typeof search.tarefa === "string" && search.tarefa) return { tarefa: search.tarefa };
    return {};
  },
  component: Foco,
});

const WORK = 25 * 60;
const BREAK = 5 * 60;

function Foco() {
  const { tarefa } = Route.useSearch();
  const tasks = usePos((s) => s.tasks);
  const habits = usePos((s) => s.habits);
  const checkins = usePos((s) => s.checkins);
  const updateTask = usePos((s) => s.updateTask);
  const bumpPomodoro = usePos((s) => s.bumpPomodoro);
  const toggleHabit = usePos((s) => s.toggleHabit);
  const addHabit = usePos((s) => s.addHabit);
  const updateHabit = usePos((s) => s.updateHabit);
  const removeHabit = usePos((s) => s.removeHabit);
  const saveCheckIn = usePos((s) => s.saveCheckIn);
  const pomodorosToday = usePos((s) => s.pomodorosToday);
  const lastPomodoroDate = usePos((s) => s.lastPomodoroDate);

  const [mode, setMode] = useState<"work" | "break">("work");
  const [left, setLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState("");
  const [counted, setCounted] = useState(false);
  const countedRef = useRef(false);

  const today = todayIsoClient();
  const poms = lastPomodoroDate === today ? pomodorosToday : 0;
  const focusTasks = tasks.filter((t) => t.status !== "feito");

  useEffect(() => {
    if (!tarefa) return;
    const t = tasks.find((x) => x.id === tarefa);
    if (!t || t.status === "feito") return;
    setActiveId(tarefa);
    if (t.status !== "fazendo") updateTask(tarefa, { status: "fazendo" });
  }, [tarefa, tasks, updateTask]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (mode === "work") {
            setMode("break");
            return BREAK;
          }
          setMode("work");
          return WORK;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, activeId, bumpPomodoro, updateTask]);

  const mm = useMemo(() => {
    const m = Math.floor(left / 60).toString().padStart(2, "0");
    const s = (left % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [left]);

  const todayCheck = checkins.find((c) => c.date === today);

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Técnica Pomodoro</p>
        <h1 className="font-display text-4xl tracking-tight">Foco e bem-estar</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          25 minutos de foco para que descanse 5
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Card className="grid place-items-center gap-5 py-10">
          <Pill tone={mode === "work" ? "forest" : "sand"}>
            {mode === "work" ? "Sessão de foco" : "Pausa protegida"}
          </Pill>
          <p className="font-display text-7xl tabular-nums tracking-tight sm:text-8xl">{mm}</p>
          <p className="text-sm text-muted">{poms} pomodoros concluídos hoje</p>
          {counted ? (
            <p className="max-w-md text-center text-sm text-muted">
              Esta sessão já foi registrada. Para registrar outra rodada, atualize a página.
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => {
                if (!running && mode === "work" && !countedRef.current) {
                  countedRef.current = true;
                  bumpPomodoro();
                  if (activeId) {
                    const t = usePos.getState().tasks.find((x) => x.id === activeId);
                    if (t) updateTask(activeId, { pomodoros: t.pomodoros + 1 });
                  }
                  setCounted(true);
                }
                setRunning((v) => !v);
              }}
            >
              {running ? "Pausar" : "Iniciar"}
            </Button>
            <Button
              tone="ghost"
              onClick={() => {
                setRunning(false);
                setLeft(mode === "work" ? WORK : BREAK);
              }}
            >
              Reiniciar
            </Button>
          </div>
          <label className="grid w-full max-w-md gap-1 text-sm">
            <span className="text-muted">Tarefa desta sessão</span>
            <select
              className="min-h-11 rounded-md border border-line bg-bg px-3"
              value={activeId ?? ""}
              onChange={(e) => setActiveId(e.target.value || null)}
            >
              <option value="">Escolher tarefa</option>
              {focusTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
        </Card>

        <div className="grid gap-5">
          <HabitsWeek
            habits={habits}
            today={today}
            onToggle={toggleHabit}
            onAdd={addHabit}
            onUpdate={updateHabit}
            onRemove={removeHabit}
          />

          <Card className="grid gap-3">
            <h2 className="font-display text-2xl tracking-tight">Check-in de ânimo</h2>
            <p className="text-sm text-muted">
              Cuidar da saúde mental reduz procrastinação disfarçada de cansaço. Anote seu estado atual.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-muted">Ânimo {mood}</span>
                <input type="range" min={1} max={5} value={mood} onChange={(e) => setMood(Number(e.target.value))} />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-muted">Energia {energy}</span>
                <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
              </label>
            </div>
            <input
              className="min-h-11 rounded-md border border-line bg-bg px-3 text-sm"
              placeholder="O que está pesando agora?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              onClick={() => {
                saveCheckIn({ date: today, mood, energy, note });
                setNote("");
              }}
            >
              Registrar
            </Button>
            {todayCheck ? (
              <p className="text-xs text-subtle">
                Hoje já registrado: ânimo {todayCheck.mood}, energia {todayCheck.energy}.
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}

const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"];

function HabitsWeek({
  habits,
  today,
  onToggle,
  onAdd,
  onUpdate,
  onRemove,
}: {
  habits: Habit[];
  today: string;
  onToggle: (id: string, date: string) => void;
  onAdd: (name: string, targetPerWeek: number) => void;
  onUpdate: (id: string, patch: Partial<Pick<Habit, "name" | "targetPerWeek">>) => void;
  onRemove: (id: string) => void;
}) {
  const week = weekDates();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(3);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState(3);

  function submitNew(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, target);
    setName("");
    setTarget(3);
    setAdding(false);
  }

  function openEdit(habit: Habit) {
    if (editing === habit.id) {
      setEditing(null);
      return;
    }
    setEditing(habit.id);
    setEditName(habit.name);
    setEditTarget(habit.targetPerWeek);
  }

  return (
    <Card className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl tracking-tight">Hábitos da semana</h2>
        <Button type="button" tone="ghost" onClick={() => setAdding((v) => !v)}>
          + Hábito
        </Button>
      </div>
      <figure className="grid gap-2">
        <blockquote className="text-sm leading-relaxed text-muted">
          “Os hábitos reduzem a carga cognitiva e libertam a capacidade mental, para podermos
          deslocar a atenção para as outras tarefas. Só quando tornamos os fatos básicos da vida
          mais fáceis é que conseguimos criar o espaço mental necessário para o pensamento livre e
          a criatividade.”
        </blockquote>
        <figcaption className="text-xs text-subtle">
          James Clear, autor de Hábitos atômicos. Citado em Segundo cérebro, p. 181.
        </figcaption>
      </figure>
      {adding ? (
        <form onSubmit={submitNew} className="flex flex-wrap items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do hábito"
            aria-label="Nome do hábito"
            className="min-w-0 flex-1"
          />
          <select
            aria-label="Vezes na semana"
            className="min-h-11 rounded-md border border-line bg-surface px-2 text-sm"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          >
            {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}×
              </option>
            ))}
          </select>
          <Button type="submit">Salvar</Button>
        </form>
      ) : null}
      {habits.length === 0 ? (
        <p className="text-sm text-muted">Nenhum hábito ainda.</p>
      ) : (
        <ul className="grid max-h-72 gap-2 overflow-y-auto pr-1">
          {habits.map((habit) => {
            const hits = week.filter((day) => habit.logs.includes(day)).length;
            return (
              <li key={habit.id} className="grid gap-2 rounded-md border border-line bg-bg px-3 py-2">
                <button
                  type="button"
                  className="flex items-baseline justify-between gap-2 text-left"
                  onClick={() => openEdit(habit)}
                >
                  <span className="text-sm font-medium">{habit.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-subtle">
                    {hits}/{habit.targetPerWeek}
                  </span>
                </button>
                <div className="flex justify-between gap-1">
                  {week.map((day, index) => {
                    const on = habit.logs.includes(day);
                    const isToday = day === today;
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-label={`${WEEKDAYS[index]} ${on ? "feito" : "não feito"}`}
                        aria-pressed={on}
                        onClick={() => onToggle(habit.id, day)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                          on
                            ? "bg-forest text-surface"
                            : isToday
                              ? "border border-forest text-ink"
                              : "border border-line text-muted"
                        }`}
                      >
                        {WEEKDAYS[index]}
                      </button>
                    );
                  })}
                </div>
                {editing === habit.id ? (
                  <form
                    className="flex flex-wrap items-center gap-2 border-t border-line pt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      onUpdate(habit.id, { name: editName, targetPerWeek: editTarget });
                      setEditing(null);
                    }}
                  >
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Editar nome"
                      className="min-w-0 flex-1"
                    />
                    <select
                      aria-label="Editar meta"
                      className="min-h-11 rounded-md border border-line bg-surface px-2 text-sm"
                      value={editTarget}
                      onChange={(e) => setEditTarget(Number(e.target.value))}
                    >
                      {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}×
                        </option>
                      ))}
                    </select>
                    <Button type="submit" tone="ghost">
                      Salvar
                    </Button>
                    <button
                      type="button"
                      className="text-xs text-clay"
                      onClick={() => onRemove(habit.id)}
                    >
                      Excluir
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
