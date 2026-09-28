import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as usePos, n as Card, o as Textarea, s as askNorte, t as Button } from "./router-hMLxtw14.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ia-BkN7aiSn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		id: "briefing",
		title: "Briefing do dia",
		hint: "Uma prioridade por frente, sem misturar vaga e código."
	},
	{
		id: "priorizar",
		title: "Aula, código ou vaga?",
		hint: "Eisenhower para as próximas duas horas."
	},
	{
		id: "plano",
		title: "Plano da semana",
		hint: "Manhã prática, tarde UniFECAF, lote, domingo."
	},
	{
		id: "aula",
		title: "Resumir aula",
		hint: "Notas + exercício de 25 min. Salva no Segundo cérebro."
	},
	{
		id: "captura",
		title: "Texto virar tarefas",
		hint: "Aula, edital ou ideia → inbox com tag."
	},
	{
		id: "backlog",
		title: "Priorizar portfólio",
		hint: "Um projeto da semana, um da quinzena."
	}
];
function Copiloto() {
	const tasks = usePos((s) => s.tasks);
	const events = usePos((s) => s.events);
	const inbox = usePos((s) => s.inbox);
	const profile = usePos((s) => s.profile);
	const courses = usePos((s) => s.courses);
	const projects = usePos((s) => s.projects);
	const leads = usePos((s) => s.leads);
	const addInbox = usePos((s) => s.addInbox);
	const addAiLog = usePos((s) => s.addAiLog);
	const applyAiTasks = usePos((s) => s.applyAiTasks);
	const addNote = usePos((s) => s.addNote);
	const aiLogs = usePos((s) => s.aiLogs);
	const [kind, setKind] = (0, import_react.useState)("briefing");
	const [extra, setExtra] = (0, import_react.useState)("");
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	function snapshot() {
		const open = tasks.filter((t) => t.status !== "feito").map((t) => `- [${t.quadrant}/${t.status}/${t.area}] ${t.title}`).join("\n");
		const agenda = events.map((e) => `- ${e.date} ${e.start} ${e.title}`).join("\n");
		const notes = inbox.map((n) => `- ${n.text}`).join("\n");
		const curso = courses.map((c) => `${c.provider}: ${c.current} (${c.done}/${c.modules})`).join("; ");
		const port = projects.map((p) => `${p.status} ${p.name}`).join("; ");
		const pipe = leads.filter((l) => l.status !== "recusado" && l.status !== "fechado").map((l) => `${l.status} ${l.title}`).join("; ");
		return `Pessoa: ${profile.name}, ${profile.role}.
Foco da semana: ${profile.weeklyFocus}
Cursos: ${curso}
Portfólio: ${port}
Pipeline: ${pipe}
Tarefas abertas:\n${open || "(nenhuma)"}
Agenda:\n${agenda || "(vazia)"}
Inbox:\n${notes || "(vazio)"}
Pedido extra:\n${extra || extraFromKind(kind)}`;
	}
	async function run() {
		setBusy(true);
		setError("");
		setOut("");
		try {
			const res = await askNorte({ data: {
				kind,
				context: snapshot()
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setOut(res.text);
			addAiLog(kind, extra || kind, res.text);
			if (kind === "captura") {
				const parsed = extractTasks(res.text);
				if (parsed.length) applyAiTasks(parsed);
			}
			if (kind === "aula" && res.text.trim()) {
				const first = extra.trim().split("\n")[0]?.slice(0, 80) || "Notas de aula";
				const rocket = extra.toLowerCase().includes("rocket");
				addNote({
					course: rocket ? "rocketseat" : "unifecaf",
					title: first,
					body: res.text.slice(0, 1200),
					para: rocket ? "Recursos/Programação" : "Recursos/IA"
				});
			}
		} catch {
			setError("Não foi possível falar com a IA agora.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-subtle",
					children: "Inteligência artificial"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Copiloto da transição"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Resume aula, monta a semana, prioriza portfólio e escreve proposta. Não escolhe por você entre estudar e candidatar — só deixa o dilema visível."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: ACTIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setKind(a.id),
					className: `rounded-xl border p-4 text-left transition-colors ${kind === a.id ? "border-forest bg-leaf" : "border-line bg-surface hover:bg-bg-warm"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: a.hint
					})]
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: extra,
						onChange: (e) => setExtra(e.target.value),
						placeholder: placeholder(kind)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: run,
							children: busy ? "Pensando…" : "Pedir à IA"
						}), kind === "captura" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							tone: "ghost",
							onClick: () => {
								if (extra.trim()) addInbox(extra.trim());
							},
							children: "Só guardar no inbox"
						}) : null]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-clay",
						children: error
					}) : null,
					out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "whitespace-pre-wrap rounded-lg border border-line bg-bg px-4 py-3 text-sm leading-relaxed",
						children: out
					}) : null
				]
			}),
			aiLogs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Histórico recente"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3",
					children: aiLogs.slice(0, 4).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-line pb-3 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-subtle",
							children: log.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-4 text-sm text-muted",
							children: log.result
						})]
					}, log.id))
				})]
			}) : null
		]
	});
}
function extraFromKind(kind) {
	if (kind === "briefing") return "Manhã livre para código. Entrega do POS esta semana.";
	if (kind === "priorizar") return "Tenho 2h. Dúvida: aula UniFECAF ou exercício JS.";
	if (kind === "plano") return "Não candidatar todos os dias. Proteger domingo.";
	if (kind === "aula") return "Cole aqui o trecho da aula.";
	if (kind === "backlog") return "Quero um projeto que use o que eu já sei de Cartório.";
	return "Transforme em tarefas pequenas.";
}
function placeholder(kind) {
	if (kind === "aula") return "Cole anotações ou transcrição da aula UniFECAF ou Rocketseat…";
	if (kind === "captura") return "Cole edital, ideia de projeto ou lista solta…";
	if (kind === "backlog") return "Ideias extras de portfólio (opcional)…";
	return "Contexto extra para o copiloto? (opcional)";
}
function extractTasks(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end < 0) return [];
	try {
		return (JSON.parse(text.slice(start, end + 1)).tasks ?? []).filter((t) => t.title).slice(0, 8);
	} catch {
		return [];
	}
}
//#endregion
export { Copiloto as component };
