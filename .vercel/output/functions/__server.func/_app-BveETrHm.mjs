import { b as require_jsx_runtime, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Pill, d as todayIsoClient, f as usePos, l as formatDay, n as Card, p as weekDates } from "./_ssr/router-hMLxtw14.mjs";
import { p as ArrowRight } from "./_libs/lucide-react.mjs";
import { t as AREAS } from "./_ssr/types-D-Ni9GkJ.mjs";
import { n as CaptureMini } from "./_ssr/capture-CeFMqc9B.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-BveETrHm.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const profile = usePos((s) => s.profile);
	const tasks = usePos((s) => s.tasks);
	const events = usePos((s) => s.events);
	const habits = usePos((s) => s.habits);
	const checkins = usePos((s) => s.checkins);
	const courses = usePos((s) => s.courses);
	const projects = usePos((s) => s.projects);
	const leads = usePos((s) => s.leads);
	const pomodorosToday = usePos((s) => s.pomodorosToday);
	const lastPomodoroDate = usePos((s) => s.lastPomodoroDate);
	const today = todayIsoClient();
	const week = weekDates();
	const open = tasks.filter((t) => t.status !== "feito");
	const doneWeek = tasks.filter((t) => t.completedAt && week.includes(t.completedAt));
	const todayEvents = events.filter((e) => e.date === today).sort((a, b) => a.start.localeCompare(b.start));
	const poms = lastPomodoroDate === today ? pomodorosToday : 0;
	const followToday = leads.filter((l) => l.followUp === today && l.status !== "fechado" && l.status !== "recusado");
	const chart = week.map((d) => ({
		dia: formatDay(d).split(" ")[0],
		concluidas: tasks.filter((t) => t.completedAt === d).length,
		habitos: habits.filter((h) => h.logs.includes(d)).length
	}));
	const byArea = AREAS.map((a) => ({
		...a,
		n: open.filter((t) => t.area === a.id).length
	}));
	const published = projects.filter((p) => p.status === "publicado").length;
	const inFlight = projects.filter((p) => p.status === "progresso").length;
	const pipelineOpen = leads.filter((l) => l.status !== "fechado" && l.status !== "recusado").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] text-subtle",
						children: "POS para transição de carreira tech"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl",
						children: [
							"Bom estudo, ",
							profile.name,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-base leading-relaxed text-muted",
						children: profile.weeklyFocus
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureMini, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pomodoros hoje",
						value: String(poms),
						hint: "prática de código"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Concluídas na semana",
						value: String(doneWeek.length),
						hint: "nas quatro frentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Portfólio",
						value: `${inFlight} · ${published}`,
						hint: "em curso · no GitHub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pipeline aberto",
						value: String(pipelineOpen),
						hint: followToday.length ? `${followToday.length} follow-up hoje` : "vagas e freelas"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: courses.map((c) => {
					const pct = Math.round(c.done / c.modules * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.14em] text-subtle",
									children: c.provider === "unifecaf" ? "UniFECAF" : "Rocketseat"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl tracking-tight",
									children: c.name
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
									tone: "forest",
									children: [pct, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["Agora: ", c.current]
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
									" de ",
									c.modules,
									" módulos"
								]
							})
						]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Pulso da semana"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Tarefas feitas e hábitos — consistência da transição"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chart,
							barGap: 4,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#d8d0c2",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "dia",
									tick: {
										fill: "#6b645b",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									tick: {
										fill: "#6b645b",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "#faf7f1",
									border: "1px solid #d8d0c2",
									borderRadius: 12,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "concluidas",
									name: "Concluídas",
									fill: "#1f5c4a",
									radius: [
										4,
										4,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "habitos",
									name: "Hábitos",
									fill: "#c9a27a",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Hoje na agenda"
						}),
						todayEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Nenhum bloco. Proteja ao menos um Pomodoro de código."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-3",
							children: todayEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: e.notes
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, { children: [
									e.start,
									"–",
									e.end
								] })]
							}, e.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/agenda",
							className: "inline-flex items-center gap-1 text-sm text-forest no-underline",
							children: ["Abrir agenda ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Carga por frente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-3",
							children: byArea.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-muted",
										children: a.n
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 overflow-hidden rounded-full bg-bg-warm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-forest",
										style: { width: `${Math.min(100, a.n * 18)}%` }
									})
								})]
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/frentes",
							className: "inline-flex items-center gap-1 text-sm text-forest no-underline",
							children: ["Segundo cérebro ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Próximas ações do pipeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: leads.filter((l) => l.status !== "fechado" && l.status !== "recusado").slice(0, 4).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-b border-line pb-3 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: l.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-subtle",
								children: [
									l.kind === "freela" ? "Freela" : "Vaga",
									" · ",
									l.nextAction
								]
							})]
						}, l.id))
					})]
				})]
			}),
			checkins[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-subtle",
				children: "Último check-in"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Ânimo ",
					checkins[0].mood,
					"/5 · Energia ",
					checkins[0].energy,
					"/5 — ",
					checkins[0].note
				]
			})] }) : null
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "grid gap-1 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.14em] text-subtle",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl tabular-nums tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: hint
			})
		]
	});
}
//#endregion
export { Dashboard as component };
