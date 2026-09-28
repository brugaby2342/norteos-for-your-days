import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Pill } from "@/components/ui";
import { CaptureMini } from "@/components/capture";
import { projectProgress } from "@/lib/types";
import { formatDay, todayIsoClient, usePos, weekDates } from "@/lib/store";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

function painelCourseKind(provider: string) {
  const k = (provider ?? "").toLowerCase();
  if (k.includes("faculdade") || k === "unifecaf") return "UniFECAF (faculdade)";
  if (k.includes("rocket")) return "Rocketseat (cursos)";
  return "Outra plataforma";
}

function Dashboard() {
  const tasks = usePos((s) => s.tasks);
  const events = usePos((s) => s.events);
  const habits = usePos((s) => s.habits);
  const checkins = usePos((s) => s.checkins);
  const courses = usePos((s) => s.courses);
  const projects = usePos((s) => s.projects);
  const pomodorosToday = usePos((s) => s.pomodorosToday);
  const lastPomodoroDate = usePos((s) => s.lastPomodoroDate);
  const today = todayIsoClient();
  const week = weekDates();

  const doneWeek = tasks.filter(
    (t) => t.completedAt && week.includes(t.completedAt),
  );
  const todayEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => a.start.localeCompare(b.start));
  const poms = lastPomodoroDate === today ? pomodorosToday : 0;

  const chart = week.map((d) => ({
    dia: formatDay(d).split(" ")[0],
    concluidas: tasks.filter((t) => t.completedAt === d).length,
    habitos: habits.filter((h) => h.logs.includes(d)).length,
  }));

  const inFlight = projects.filter((p) => p.status === "progresso").length;

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">
          POS - Sistema operacional pessoal
        </p>
        <h1 className="font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Bons estudos!
        </h1>
      </header>

      <CaptureMini />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Pomodoros hoje" value={String(poms)} hint="prática de código" />
        <Stat
          label="Tarefas concluídas"
          value={String(doneWeek.length)}
          hint="nas frentes"
        />
        <Stat
          label="Portfólio"
          value={String(inFlight)}
          hint="projetos em curso"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {courses.map((c) => {
          const pct = c.modules ? Math.round((c.done / c.modules) * 100) : 0;
          return (
            <Card key={c.id} className="grid gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-subtle">
                    {painelCourseKind(c.provider)}
                  </p>
                  <h2 className="font-display text-2xl tracking-tight">{c.name}</h2>
                </div>
                <Pill tone="forest">{pct}%</Pill>
              </div>
              <p className="text-sm text-muted">Agora: {c.current}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-warm">
                <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs tabular-nums text-subtle">
                {c.done} de {c.modules} módulos
              </p>
              <Link
                to="/frentes"
                search={{ aba: "cursos", curso: c.id }}
                className="inline-flex items-center gap-1 text-sm text-forest no-underline"
              >
                Entrar no curso <ArrowRight className="size-4" />
              </Link>
            </Card>
          );
        })}
      </div>

      <Card className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl tracking-tight">Portfólio</h2>
            <p className="text-sm text-muted">Projetos em andamento</p>
          </div>
          <Link
            to="/frentes"
            search={{ aba: "portfolio" }}
            className="inline-flex items-center gap-1 text-sm text-forest no-underline"
          >
            Gestão de projetos <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const pct = projectProgress(p);
            return (
              <li key={p.id} className="rounded-md border border-line bg-bg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-subtle">{p.stack}</p>
                  </div>
                  <Pill tone="forest">{pct}%</Pill>
                </div>
                {p.outcome ? <p className="mt-2 text-xs text-muted">{p.outcome}</p> : null}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-warm">
                  <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">Próxima ação: {p.next}</p>
                <Link
                  to="/frentes"
                  search={{ aba: "portfolio", projeto: p.id }}
                  className="mt-2 inline-flex text-sm text-forest no-underline"
                >
                  Entrar no projeto
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-4">
            <h2 className="font-display text-2xl tracking-tight">Pulso da semana</h2>
            <p className="text-sm text-muted">Consistência — tarefas e hábitos concluídos</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} barGap={4}>
                <CartesianGrid stroke="#d8d0c2" vertical={false} />
                <XAxis dataKey="dia" tick={{ fill: "#6b645b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#6b645b", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "#faf7f1",
                    border: "1px solid #d8d0c2",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="concluidas" name="Concluídas" fill="#1f5c4a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="habitos" name="Hábitos" fill="#c9a27a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="grid gap-4">
          <h2 className="font-display text-2xl tracking-tight">Hoje na agenda</h2>
          {todayEvents.length === 0 ? (
            <p className="text-sm text-muted">Nenhum bloco. Proteja ao menos um Pomodoro de código.</p>
          ) : (
            <ul className="grid gap-3">
              {todayEvents.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-xs text-subtle">{e.notes}</p>
                  </div>
                  <Pill>
                    {e.start}–{e.end}
                  </Pill>
                </li>
              ))}
            </ul>
          )}
          <Link to="/agenda" className="inline-flex items-center gap-1 text-sm text-forest no-underline">
            Abrir agenda <ArrowRight className="size-4" />
          </Link>
        </Card>
      </div>

      {checkins[0] ? (
        <Card>
          <p className="text-xs uppercase tracking-[0.16em] text-subtle">Último check-in</p>
          <p className="mt-2 text-sm text-muted">
            Ânimo {checkins[0].mood}/5 · Energia {checkins[0].energy}/5 — {checkins[0].note}
          </p>
        </Card>
      ) : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="grid gap-1 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="font-display text-3xl tabular-nums tracking-tight">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </Card>
  );
}
