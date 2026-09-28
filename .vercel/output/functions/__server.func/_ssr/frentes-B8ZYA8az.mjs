import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as CONNECTOR_TOKEN_READY_EVENT } from "./types-BU_vzhZ-.mjs";
import { a as Pill, f as usePos, i as Input, m as createSsrRpc, n as Card, r as Field, t as Button } from "./router-hMLxtw14.mjs";
import { i as PROJECT_STATUSES, r as LEAD_STATUSES } from "./types-D-Ni9GkJ.mjs";
import { a as driveFolderUrl, i as PARA_WHERE, r as PARA_TREE, t as DRIVE_HOME } from "./para-BhftVLTd.mjs";
import { t as CaptureDesk } from "./capture-CeFMqc9B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/frentes-B8ZYA8az.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isLoginRequired(result) {
	return result.ok === false && result.loginRequired === true;
}
function isConnectorPending(result) {
	return result.ok === false && result.pending === true;
}
function isFramed() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function redirectToLoginIfRequired(result) {
	if (!isLoginRequired(result)) return false;
	const url = result.loginUrl;
	if (!url) return false;
	if (typeof window === "undefined") return false;
	if (isFramed()) {
		const opened = window.open(url, "_blank");
		if (opened) {
			opened.opener = null;
			return true;
		}
	}
	window.location.assign(url);
	return true;
}
var MESSAGE_RULES = [
	{
		needles: ["not_connected", "failed_precondition"],
		kind: "not_connected",
		message: "Connect this connector in Grok to load your data."
	},
	{
		needles: ["scope_denied"],
		kind: "scope_denied",
		message: "This view isn't available — the app requested a tool outside its grant."
	},
	{
		needles: ["access_denied"],
		kind: "access_denied",
		message: "You don't have access to this data."
	}
];
function matchMessageRule(raw) {
	return MESSAGE_RULES.find((rule) => rule.needles.some((needle) => raw.includes(needle)));
}
function classifyCallToolError(result) {
	if (result.ok) return null;
	const detail = result.errorMessage || void 0;
	const raw = (result.errorMessage ?? "").toLowerCase();
	if (isConnectorPending(result)) return {
		kind: "pending",
		message: "Connecting to your data…",
		detail
	};
	if (raw.includes("missing_connector_token")) return {
		kind: "error",
		message: "Open this app from Grok to load your data.",
		detail
	};
	if (isLoginRequired(result)) return {
		kind: "login",
		message: "Continue with Grok to load your data.",
		detail
	};
	const rule = matchMessageRule(raw);
	if (rule) return {
		kind: rule.kind,
		message: rule.message,
		detail
	};
	return {
		kind: "error",
		message: detail ?? "Something went wrong. Try again.",
		detail
	};
}
var getConnectorReadiness = createServerFn({ method: "POST" }).handler(createSsrRpc("ac303419f3bd6f94ee837f95e91005a600278deed4876cb96a25aa0d69185951"));
var READINESS_PROBE_DELAYS_MS = [
	1e3,
	2e3,
	3e3,
	5e3
];
var READINESS_PROBE_MAX_TOTAL_MS = 18e4;
function readinessProbeDelayMs(attempt) {
	return READINESS_PROBE_DELAYS_MS[Math.min(Math.max(attempt, 0), READINESS_PROBE_DELAYS_MS.length - 1)];
}
function readinessProbeExhausted(startedAtMs, nowMs) {
	return nowMs - startedAtMs >= READINESS_PROBE_MAX_TOTAL_MS;
}
var READINESS_PROBE_TIMEOUT_MS = 1e4;
function withTimeout(promise, ms) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => resolve(null), ms);
		const settle = (value) => {
			clearTimeout(timer);
			resolve(value);
		};
		promise.then(settle, () => settle(null));
	});
}
async function isConnectorReady() {
	return (await withTimeout(getConnectorReadiness(), READINESS_PROBE_TIMEOUT_MS))?.ready === true;
}
/**
* While `waiting` is true (a connector call returned `pending`), probes the
* server for the connector token and calls `refetch` once it is present. The
* probe is a header check on the app's own server — it never reaches the gate.
* A `connector-token-ready` bridge event from the Grok preview chrome triggers
* `refetch` immediately. A top-level page (download/export, local dev, the
* sandbox's own `npm run preview`) is not framed by any preview, so no token
* can ever arrive: the hook reports `not_embedded` without probing. Any framed
* page probes, even when the parent origin cannot be resolved (empty referrer,
* no `ancestorOrigins`): the token comes through the preview proxy, and the
* bridge event is only the faster signal.
*/
function useRefetchWhenConnectorReady(waiting, refetch) {
	const refetchRef = (0, import_react.useRef)(refetch);
	const [timedOut, setTimedOut] = (0, import_react.useState)(false);
	const [notEmbedded, setNotEmbedded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		refetchRef.current = refetch;
	}, [refetch]);
	(0, import_react.useEffect)(() => {
		if (!waiting) return;
		if (!isFramed()) {
			setNotEmbedded(true);
			return () => setNotEmbedded(false);
		}
		let cancelled = false;
		let refetching = false;
		let attempt = 0;
		let timer;
		const startedAt = Date.now();
		const runRefetch = async () => {
			if (refetching) return;
			refetching = true;
			try {
				await refetchRef.current();
			} catch {} finally {
				refetching = false;
			}
		};
		const schedule = () => {
			timer = setTimeout(probe, readinessProbeDelayMs(attempt));
			attempt += 1;
		};
		const probe = async () => {
			if (cancelled || readinessProbeExhausted(startedAt, Date.now())) return;
			const ready = await isConnectorReady();
			if (cancelled) return;
			if (ready) await runRefetch();
			if (!cancelled) schedule();
		};
		const onTokenReady = () => {
			runRefetch();
		};
		const deadline = setTimeout(() => {
			if (!cancelled) setTimedOut(true);
		}, READINESS_PROBE_MAX_TOTAL_MS);
		window.addEventListener(CONNECTOR_TOKEN_READY_EVENT, onTokenReady);
		schedule();
		return () => {
			cancelled = true;
			clearTimeout(deadline);
			if (timer !== void 0) clearTimeout(timer);
			window.removeEventListener(CONNECTOR_TOKEN_READY_EVENT, onTokenReady);
			setTimedOut(false);
		};
	}, [waiting]);
	if (!waiting) return "idle";
	if (notEmbedded) return "not_embedded";
	return timedOut ? "timed_out" : "waiting";
}
var pingDrive = createServerFn({ method: "POST" }).handler(createSsrRpc("1e53cadf2a348c9cfb1bd959af2ea5f5416c5f4337cd77dc3a1ef57739df7eed"));
var inspectParaDrive = createServerFn({ method: "POST" }).handler(createSsrRpc("fd8a1e8e72c8dfae791d7bf0d0fe6a01340d19090a0f0637a047901bfe107754"));
var createParaDrive = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("1336b58da7d089cff3a03525b76407652f033a865e7ecb4b867b049127f6fc11"));
function asTool(res) {
	return {
		ok: res.ok,
		data: res.folders,
		errorMessage: res.error,
		loginRequired: res.loginRequired,
		pending: res.pending,
		loginUrl: res.loginUrl
	};
}
function statusCopy(classified, wait) {
	if (wait === "waiting" || classified?.kind === "pending") return "O Grok está pedindo acesso ao seu Drive. Autorize na janela do preview e aguarde — depois a busca roda sozinha.";
	if (wait === "timed_out") return "A permissão não chegou a tempo. Clique de novo em Conectar Drive.";
	if (wait === "not_embedded") return "Abra este app pelo preview do Grok (não em aba solta) para ligar o Drive.";
	if (classified?.kind === "login") return "Precisa continuar com o Grok para este app ler o Drive.";
	if (classified?.kind === "not_connected") return "Este app ainda não tem permissão de Drive. Clique em Conectar Drive e autorize quando o Grok pedir.";
	if (classified?.kind === "scope_denied" || classified?.kind === "access_denied") return "A conta conectada não pôde listar essas pastas.";
	if (classified?.kind === "error") return "Não deu para falar com o Drive. Tente Conectar de novo.";
	return null;
}
function ParaPanel() {
	const [report, setReport] = (0, import_react.useState)(null);
	const [action, setAction] = (0, import_react.useState)(null);
	const wait = useRefetchWhenConnectorReady(Boolean(report && !report.ok && report.pending), () => void runPing());
	async function apply(next) {
		setReport(next);
		const tool = asTool(next);
		if (isLoginRequired(tool)) redirectToLoginIfRequired(tool);
	}
	async function runPing() {
		setAction("ping");
		try {
			await apply(await pingDrive());
		} catch {
			setReport({
				ok: false,
				error: "Falha ao conectar o Drive.",
				folders: []
			});
		} finally {
			setAction(null);
		}
	}
	async function runInspect() {
		setAction("inspect");
		try {
			await apply(await inspectParaDrive());
		} catch {
			setReport({
				ok: false,
				error: "Falha ao conferir as pastas.",
				folders: []
			});
		} finally {
			setAction(null);
		}
	}
	async function runCreate() {
		if (!window.confirm("Criar no seu Google Drive só as pastas PARA que ainda não existem? Nada será apagado nem movido.")) return;
		setAction("create");
		try {
			await apply(await createParaDrive({ data: { confirm: true } }));
		} catch {
			setReport({
				ok: false,
				error: "Falha ao criar pastas.",
				folders: []
			});
		} finally {
			setAction(null);
		}
	}
	const classified = report && !report.ok ? classifyCallToolError(asTool(report)) : null;
	const hint = statusCopy(classified, wait);
	const found = report?.ok ? report.folders.filter((f) => f.status === "found").length : 0;
	const missing = report?.ok ? report.folders.filter((f) => f.status === "missing").length : 0;
	const connected = Boolean(report?.ok);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "PARA no Drive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Os documentos moram no seu Google Drive. Conectar liga esta conta. Conferir compara com o mapa PARA. Criar só acrescenta o que faltar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: DRIVE_HOME,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-4 text-sm font-medium text-surface no-underline hover:bg-forest-deep",
								children: "Abrir meu Drive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "ghost",
								disabled: action !== null,
								onClick: () => void runPing(),
								children: action === "ping" ? "Conectando…" : connected ? "Drive conectado — de novo" : "Conectar Drive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "ghost",
								disabled: action !== null,
								onClick: () => void runInspect(),
								children: action === "inspect" ? "Buscando no Drive…" : "Conferir pastas PARA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "ghost",
								disabled: action !== null,
								onClick: () => void runCreate(),
								children: action === "create" ? "Criando…" : "Criar pastas que faltam"
							})
						]
					}),
					hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: hint
					}) : null,
					classified?.kind === "login" && report?.loginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: report.loginUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 w-fit items-center rounded-md border border-line px-4 text-sm font-medium text-ink no-underline",
						children: "Continuar com Grok"
					}) : null,
					connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							found,
							" pasta(s) encontradas no Drive · ",
							missing,
							" do mapa ainda não existem",
							report?.created?.length ? ` · ${report.created.length} criadas agora` : ""
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: PARA_TREE.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeCard, {
					node: n,
					report
				}, n.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Onde guardar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: PARA_WHERE.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-1 border-b border-line py-2 last:border-0 sm:flex-row sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: row.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted sm:max-w-[28rem] sm:text-right",
							children: row.place
						})]
					}, row.kind))
				})]
			})
		]
	});
}
function TreeCard({ node, report }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: node.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: node.hint
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
				path: node.name,
				report
			})]
		}), node.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2",
			children: node.children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-line bg-bg p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							path: `${node.name}/${c.name}`,
							report
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: c.hint
					}),
					c.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-wrap gap-1",
						children: c.children.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "flex items-center gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: toneFor(`${node.name}/${c.name}/${g.name}`, report),
								children: g.name
							})
						}, g.name))
					}) : null
				]
			}, c.name))
		}) : null]
	});
}
function StatusPill({ path, report }) {
	if (!report?.ok) return null;
	const hit = report.folders.find((f) => f.path === path);
	if (!hit) return null;
	if (hit.status === "found" && (hit.id || hit.link)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: driveFolderUrl(hit.id, hit.link),
		target: "_blank",
		rel: "noreferrer",
		className: "shrink-0 text-xs text-forest",
		children: "Abrir pasta"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
		tone: hit.status === "found" ? "forest" : "clay",
		children: hit.status === "found" ? "ok" : "falta"
	});
}
function toneFor(path, report) {
	if (!report?.ok) return "neutral";
	const hit = report.folders.find((f) => f.path === path);
	if (!hit) return "neutral";
	return hit.status === "found" ? "forest" : "clay";
}
function Frentes() {
	const [tab, setTab] = (0, import_react.useState)("captura");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-subtle",
					children: "GTD · PARA · Drive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Segundo cérebro"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Ideias e notas ficam aqui. Documentos e PDFs, no seu Google Drive. Tarefas vão para o GTD."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					["captura", "Inbox e notas"],
					["para", "PARA / Drive"],
					["cursos", "Cursos"],
					["portfolio", "Portfólio"],
					["pipeline", "Candidaturas"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					tone: tab === id ? "primary" : "ghost",
					onClick: () => setTab(id),
					children: label
				}, id))
			}),
			tab === "captura" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureDesk, {}) : null,
			tab === "para" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParaPanel, {}) : null,
			tab === "cursos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CursosPanel, {}) : null,
			tab === "portfolio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioPanel, {}) : null,
			tab === "pipeline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelinePanel, {}) : null
		]
	});
}
function CursosPanel() {
	const courses = usePos((s) => s.courses);
	const notes = usePos((s) => s.notes);
	const bumpCourse = usePos((s) => s.bumpCourse);
	const removeNote = usePos((s) => s.removeNote);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 lg:grid-cols-2",
			children: courses.map((c) => {
				const pct = Math.round(c.done / c.modules * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-subtle",
							children: c.provider === "unifecaf" ? "UniFECAF · teoria" : "Rocketseat · prática"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Módulo atual: ", c.current]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 overflow-hidden rounded-full bg-bg-warm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-forest",
								style: { width: `${pct}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tabular-nums text-subtle",
							children: [
								c.done,
								"/",
								c.modules,
								" · ",
								pct,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "ghost",
								onClick: () => bumpCourse(c.id, 1),
								children: "Módulo feito"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								tone: "ghost",
								onClick: () => bumpCourse(c.id, -1),
								children: "Desfazer"
							})]
						})
					]
				}, c.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Notas de aula"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Escreva em Inbox e notas. Cópia longa (PDF) vai em Recursos no Drive."
				}),
				notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "Nenhuma nota ainda."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3",
					children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-md border border-line bg-bg p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: "forest",
									children: n.course === "unifecaf" ? "UniFECAF" : n.course === "rocketseat" ? "Rocketseat" : "Outro"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-subtle",
									children: n.para
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm font-medium",
									children: n.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-pre-wrap text-sm text-muted",
									children: n.body
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-clay",
								onClick: () => removeNote(n.id),
								children: "Tirar"
							})]
						})
					}, n.id))
				})
			]
		})]
	});
}
function PortfolioPanel() {
	const projects = usePos((s) => s.projects);
	const addProject = usePos((s) => s.addProject);
	const updateProject = usePos((s) => s.updateProject);
	const removeProject = usePos((s) => s.removeProject);
	const [name, setName] = (0, import_react.useState)("");
	const [stack, setStack] = (0, import_react.useState)("JavaScript");
	const [next, setNext] = (0, import_react.useState)("");
	function submit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		addProject({
			name: name.trim(),
			stack,
			status: "ideia",
			next: next || "Definir o primeiro commit."
		});
		setName("");
		setNext("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Projeto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Nome do projeto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stack",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: stack,
						onChange: (e) => setStack(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Próximo passo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: next,
						onChange: (e) => setNext(e.target.value),
						placeholder: "O que publicar primeiro"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Capturar ideia"
					})
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: PROJECT_STATUSES.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "min-h-56",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl tracking-tight",
					children: col.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: projects.filter((p) => p.status === col.id).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-line bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: p.stack
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: p.next
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1",
								children: [PROJECT_STATUSES.filter((s) => s.id !== p.status).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full border border-line px-2 py-1 text-[11px] text-muted",
									onClick: () => updateProject(p.id, { status: s.id }),
									children: s.label
								}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full px-2 py-1 text-[11px] text-clay",
									onClick: () => removeProject(p.id),
									children: "Remover"
								})]
							})
						]
					}, p.id))
				})]
			}, col.id))
		})]
	});
}
function PipelinePanel() {
	const leads = usePos((s) => s.leads);
	const addLead = usePos((s) => s.addLead);
	const updateLead = usePos((s) => s.updateLead);
	const removeLead = usePos((s) => s.removeLead);
	const [title, setTitle] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("freela");
	function submit(e) {
		e.preventDefault();
		if (!title.trim()) return;
		addLead({
			title: title.trim(),
			company: company.trim() || "A definir",
			kind,
			status: "prospectar",
			nextAction: "Preparar mensagem no bloco de lote.",
			followUp: null
		});
		setTitle("");
		setCompany("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Vaga ou projeto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Título"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Empresa / cliente",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: company,
						onChange: (e) => setCompany(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tipo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: kind,
						onChange: (e) => setKind(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "freela",
							children: "Freela"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "vaga",
							children: "Vaga"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Adicionar ao pipeline"
				}) })
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
			children: LEAD_STATUSES.filter((s) => s.id !== "fechado").map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "min-h-40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-lg tracking-tight",
					children: col.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: leads.filter((l) => l.status === col.id).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-line bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: l.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-subtle",
								children: [
									l.company,
									" · ",
									l.kind === "freela" ? "Freela" : "Vaga"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: l.nextAction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1",
								children: [LEAD_STATUSES.filter((s) => s.id !== l.status).slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full border border-line px-2 py-1 text-[11px] text-muted",
									onClick: () => updateLead(l.id, { status: s.id }),
									children: s.label
								}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full px-2 py-1 text-[11px] text-clay",
									onClick: () => removeLead(l.id),
									children: "Tirar"
								})]
							})
						]
					}, l.id))
				})]
			}, col.id))
		})]
	});
}
//#endregion
export { Frentes as component, redirectToLoginIfRequired as n, isLoginRequired as t };
