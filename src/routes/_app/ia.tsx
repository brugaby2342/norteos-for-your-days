import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Trash2 } from "lucide-react";
import { askNorte } from "@/lib/ai";
import { copyFormatted, markdownToHtml, markdownToPlain, ReadyText } from "@/components/md-text";
import { Button, Card, Textarea } from "@/components/ui";
import { usePos } from "@/lib/store";
import type { Packet } from "@/lib/types";

export const Route = createFileRoute("/_app/ia")({ component: Copiloto });

type Kind = "briefing" | "priorizar" | "plano" | "aula" | "backlog" | "modulos";

const ACTIONS: { id: Kind; title: string; hint: string }[] = [
  { id: "briefing", title: "Briefing do dia", hint: "Uma prioridade por frente de estudo e prática." },
  { id: "priorizar", title: "Matriz de Eisenhower", hint: "Eisenhower para as próximas duas horas." },
  { id: "plano", title: "Plano da semana", hint: "Organização da agenda" },
  { id: "aula", title: "Resumir aula", hint: "Notas e sugestão de exercício para prática" },
  { id: "backlog", title: "Priorizar portfólio", hint: "Um projeto da semana, um da quinzena." },
  {
    id: "modulos",
    title: "Planejar módulos e PIs",
    hint: "A IA monta o caminho e os pacotes do curso ou do projeto.",
  },
];

const KIND_LABEL: Record<string, string> = {
  briefing: "Briefing do dia",
  priorizar: "Matriz de Eisenhower",
  plano: "Plano da semana",
  aula: "Resumir aula",
  backlog: "Priorizar portfólio",
  modulos: "Planejar módulos e PIs",
  mensagem: "Mensagem",
};

function Copiloto() {
  const ask = useServerFn(askNorte);
  const tasks = usePos((s) => s.tasks);
  const events = usePos((s) => s.events);
  const notesAll = usePos((s) => s.notes);
  const profile = usePos((s) => s.profile);
  const courses = usePos((s) => s.courses);
  const projects = usePos((s) => s.projects);
  const addAiLog = usePos((s) => s.addAiLog);
  const removeAiLog = usePos((s) => s.removeAiLog);
  const aiLogs = usePos((s) => s.aiLogs);
  const updateCourse = usePos((s) => s.updateCourse);
  const updateProject = usePos((s) => s.updateProject);
  const [kind, setKind] = useState<Kind>("briefing");
  const [extra, setExtra] = useState("");
  const [target, setTarget] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState("");

  function snapshot() {
    const open = tasks
      .filter((t) => t.status !== "feito")
      .map((t) => `- [${t.quadrant}/${t.status}/${t.area}] ${t.title}`)
      .join("\n");
    const agenda = events.map((e) => `- ${e.date} ${e.start} ${e.title}`).join("\n");
    const notes = notesAll
      .filter((n) => n.para === "entrada")
      .map((n) => `- ${n.title}: ${n.body}`)
      .join("\n");
    const curso = courses
      .map((c) => {
        const mods = (c.syllabus ?? []).map((m, i) => `${i + 1}. ${m}`).join(" | ");
        const pis = (c.packets ?? []).map((p) => p.title).join(" | ");
        return `${c.id} · ${c.name} (${c.provider}) atual=${c.current} módulos=[${mods || "nenhum"}] PIs=[${pis || "nenhum"}]`;
      })
      .join("\n");
    const port = projects
      .map((p) => {
        const pis = (p.packets ?? []).map((x) => x.title).join(" | ");
        return `${p.id} · ${p.status} ${p.name} resultado=${p.outcome || "—"} PIs=[${pis || "nenhum"}]`;
      })
      .join("\n");
    const chosen = target || "não escolhido — use o pedido extra";
    return `Pessoa: ${profile.name}, ${profile.role}.
Foco da semana: ${profile.weeklyFocus}
Alvo para módulos/PIs: ${chosen}
Cursos:
${curso || "(nenhum)"}
Portfólio:
${port || "(nenhum)"}
Tarefas abertas:\n${open || "(nenhuma)"}
Agenda:\n${agenda || "(vazia)"}
Entrada:\n${notes || "(vazia)"}
Pedido extra:\n${extra || extraFromKind(kind)}`;
  }

  async function run() {
    setBusy(true);
    setError("");
    setOut("");
    setCopied(false);
    setApplied("");
    try {
      const res = await ask({ data: { kind, context: snapshot() } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOut(res.text);
      addAiLog(kind, extra || kind, res.text);
      setExtra("");
    } catch {
      setError("Não foi possível falar com a IA agora.");
    } finally {
      setBusy(false);
    }
  }

  async function copyOut() {
    if (!out) return;
    const visible = stripPlanJson(out);
    await copyFormatted(markdownToHtml(visible), markdownToPlain(visible));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function applyPlan() {
    const plan = parsePlan(out);
    if (!plan || !target) {
      setError("Escolha o curso ou o projeto e peça de novo se o plano não vier completo.");
      return;
    }
    const packets: Packet[] = plan.packets.map((title, i) => ({
      id: `pk-${Date.now().toString(36)}-${i}`,
      title,
      done: false,
    }));
    if (target.startsWith("c:")) {
      const id = target.slice(2);
      const course = courses.find((c) => c.id === id);
      const done = Math.min(course?.done ?? 0, plan.modules.length);
      updateCourse(id, {
        outcome: plan.outcome || course?.outcome || "",
        syllabus: plan.modules,
        modules: plan.modules.length,
        done,
        current: plan.modules[done] ?? plan.modules[0] ?? "A começar",
        packets,
      });
      setApplied("Módulos e PIs aplicados no curso.");
    } else if (target.startsWith("p:")) {
      const id = target.slice(2);
      const project = projects.find((p) => p.id === id);
      const seen = new Set<string>();
      const titles: string[] = [];
      for (const title of [...plan.modules, ...plan.packets]) {
        const key = title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        titles.push(title);
      }
      updateProject(id, {
        outcome: plan.outcome || project?.outcome || "",
        packets: titles.map((title, i) => ({
          id: `pk-${Date.now().toString(36)}-${i}`,
          title,
          done: false,
        })),
      });
      setApplied("Módulos e PIs aplicados no projeto.");
    }
    window.setTimeout(() => setApplied(""), 2200);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Inteligência artificial</p>
        <h1 className="font-display text-4xl tracking-tight">Copiloto</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Utilize a IA para resumir aulas ou anotações, planejar a semana ou a jornada de um
          projeto e decidir o que estudar primeiro
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setKind(a.id)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              kind === a.id ? "border-forest bg-leaf" : "border-line bg-surface hover:bg-bg-warm"
            }`}
          >
            <p className="font-medium">{a.title}</p>
            <p className="mt-1 text-xs text-muted">{a.hint}</p>
          </button>
        ))}
      </div>

      <Card className="grid gap-3">
        {kind === "modulos" ? (
          <label className="grid gap-1">
            <span className="text-xs text-muted">Curso ou projeto</span>
            <select
              className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              aria-label="Curso ou projeto para planejar"
            >
              <option value="">Escolher…</option>
              {courses.map((c) => (
                <option key={c.id} value={`c:${c.id}`}>
                  Curso · {c.name}
                </option>
              ))}
              {projects.map((p) => (
                <option key={p.id} value={`p:${p.id}`}>
                  Portfólio · {p.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={placeholder(kind)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" disabled={busy} onClick={() => void run()}>
            {busy ? "Pensando…" : "Pedir à IA"}
          </Button>
          {busy ? (
            <p className="text-sm text-muted">Aguarde. A resposta pode demorar um pouco.</p>
          ) : null}
          {kind === "modulos" && out ? (
            <Button type="button" tone="ghost" disabled={!target} onClick={applyPlan}>
              Aplicar no {target.startsWith("p:") ? "projeto" : "curso"}
            </Button>
          ) : null}
          {out ? (
            <Button type="button" tone="ghost" onClick={() => void copyOut()}>
              <Copy className="h-4 w-4" />
              {copied ? "Copiado" : "Copiar"}
            </Button>
          ) : null}
        </div>
        {applied ? <p className="text-sm text-forest">{applied}</p> : null}
        {error ? <p className="text-sm text-clay">{error}</p> : null}
        {out ? (
          <div className="rounded-lg border border-line bg-bg px-4 py-3">
            <ReadyText text={kind === "modulos" ? stripPlanJson(out) : out} />
          </div>
        ) : null}
      </Card>

      {aiLogs.length ? (
        <Card className="grid gap-3">
          <h2 className="font-display text-2xl tracking-tight">Histórico</h2>
          <ul className="grid gap-3">
            {aiLogs.map((log) => (
              <HistoryItem key={log.id} log={log} onRemove={() => removeAiLog(log.id)} />
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function HistoryItem({
  log,
  onRemove,
}: {
  log: { id: string; kind: string; result: string; prompt: string };
  onRemove: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyFormatted(markdownToHtml(log.result), markdownToPlain(log.result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <li className="border-b border-line pb-3 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-subtle">
          {KIND_LABEL[log.kind] ?? log.kind}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="text-xs text-forest" onClick={() => void copy()}>
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button type="button" className="inline-flex items-center text-xs text-clay" onClick={onRemove}>
            <Trash2 className="mr-1 h-3 w-3" />
            Excluir
          </button>
        </div>
      </div>
      <div className="mt-3">
        <ReadyText text={log.result} />
      </div>
    </li>
  );
}

function extraFromKind(kind: Kind) {
  if (kind === "briefing") return "Manhã livre para código. Entrega do POS esta semana.";
  if (kind === "priorizar") return "Tenho 2h. Dúvida: aula UniFECAF ou exercício JS.";
  if (kind === "plano") return "Proteger domingo para revisão.";
  if (kind === "aula") return "Cole aqui o trecho da aula.";
  if (kind === "modulos") return "Iniciante. Módulos curtos, PIs que eu consiga fazer numa sessão.";
  return "Quero um projeto que use o que eu já sei de Cartório.";
}

function placeholder(kind: Kind) {
  if (kind === "aula") return "Cole anotações ou transcrição da aula UniFECAF ou Rocketseat…";
  if (kind === "backlog") return "Ideias extras de portfólio (opcional)…";
  if (kind === "modulos") return "Detalhe o curso ou o projeto (nível, prazo, o que já sabe)…";
  return "Contexto extra para o copiloto? (opcional)";
}

function stripPlanJson(text: string) {
  return text.replace(/```json[\s\S]*?```/gi, "").trim();
}

function listFrom(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function bulletsAfter(heading: string, text: string) {
  const re = new RegExp(`${heading}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
  const chunk = text.match(re)?.[1] ?? "";
  return chunk
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
    .filter((line) => line && !line.startsWith("```"));
}

function parsePlan(text: string): { outcome: string; modules: string[]; packets: string[] } | null {
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      const data = JSON.parse(fence[1]) as {
        outcome?: string;
        modules?: unknown;
        packets?: unknown;
      };
      const modules = listFrom(data.modules);
      const packets = listFrom(data.packets);
      if (modules.length || packets.length) {
        return { outcome: String(data.outcome ?? "").trim(), modules, packets };
      }
    } catch {
      /* markdown fallback */
    }
  }
  const modules = bulletsAfter("## Módulos", text);
  const packets = bulletsAfter("## Pacotes", text);
  const outcome = text.match(/## Resultado\s*\n+([^\n#]+)/i)?.[1]?.trim() ?? "";
  if (!modules.length && !packets.length) return null;
  return { outcome, modules, packets };
}
