import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pill, d as todayIsoClient, f as usePos, n as Card, t as Button } from "./router-hMLxtw14.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/foco-BmWu72ec.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WORK = 1500;
var BREAK = 300;
function Foco() {
	const tasks = usePos((s) => s.tasks);
	const habits = usePos((s) => s.habits);
	const checkins = usePos((s) => s.checkins);
	const updateTask = usePos((s) => s.updateTask);
	const bumpPomodoro = usePos((s) => s.bumpPomodoro);
	const toggleHabit = usePos((s) => s.toggleHabit);
	const saveCheckIn = usePos((s) => s.saveCheckIn);
	const pomodorosToday = usePos((s) => s.pomodorosToday);
	const lastPomodoroDate = usePos((s) => s.lastPomodoroDate);
	const [mode, setMode] = (0, import_react.useState)("work");
	const [left, setLeft] = (0, import_react.useState)(WORK);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [mood, setMood] = (0, import_react.useState)(4);
	const [energy, setEnergy] = (0, import_react.useState)(3);
	const [note, setNote] = (0, import_react.useState)("");
	const today = todayIsoClient();
	const poms = lastPomodoroDate === today ? pomodorosToday : 0;
	const focusTasks = tasks.filter((t) => t.status !== "feito");
	(0, import_react.useEffect)(() => {
		if (!running) return;
		const id = window.setInterval(() => {
			setLeft((s) => {
				if (s <= 1) {
					window.clearInterval(id);
					setRunning(false);
					if (mode === "work") {
						bumpPomodoro();
						if (activeId) {
							const t = usePos.getState().tasks.find((x) => x.id === activeId);
							if (t) updateTask(activeId, { pomodoros: t.pomodoros + 1 });
						}
						setMode("break");
						return BREAK;
					}
					setMode("work");
					return WORK;
				}
				return s - 1;
			});
		}, 1e3);
		return () => window.clearInterval(id);
	}, [
		running,
		mode,
		activeId,
		bumpPomodoro,
		updateTask
	]);
	const mm = (0, import_react.useMemo)(() => {
		return `${Math.floor(left / 60).toString().padStart(2, "0")}:${(left % 60).toString().padStart(2, "0")}`;
	}, [left]);
	const todayCheck = checkins.find((c) => c.date === today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.2em] text-subtle",
				children: "Técnica Pomodoro"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Foco e bem-estar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
				children: "25 minutos no editor — o expediente que o Cartório já não impõe. Código de manhã; vaga só no lote."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-[1.1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid place-items-center gap-5 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: mode === "work" ? "forest" : "sand",
						children: mode === "work" ? "Sessão de foco" : "Pausa protegida"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-7xl tabular-nums tracking-tight sm:text-8xl",
						children: mm
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [poms, " pomodoros concluídos hoje"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setRunning((v) => !v),
							children: running ? "Pausar" : "Iniciar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							tone: "ghost",
							onClick: () => {
								setRunning(false);
								setLeft(mode === "work" ? WORK : BREAK);
							},
							children: "Reiniciar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid w-full max-w-md gap-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Tarefa desta sessão"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "min-h-11 rounded-md border border-line bg-bg px-3",
							value: activeId ?? "",
							onChange: (e) => setActiveId(e.target.value || null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Escolher…"
							}), focusTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.title
							}, t.id))]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Hábitos da semana"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: habits.map((h) => {
							const weekHits = h.logs.length;
							const on = h.logs.includes(today);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: h.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-subtle",
									children: [
										h.detail,
										" · ",
										weekHits,
										"/",
										h.targetPerWeek
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									tone: on ? "quiet" : "ghost",
									onClick: () => toggleHabit(h.id),
									children: on ? "Feito hoje" : "Marcar"
								})]
							}, h.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Check-in de ânimo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Um minuto para notar o estado — reduz procrastinação disfarçada de cansaço."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["Ânimo ", mood]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 5,
									value: mood,
									onChange: (e) => setMood(Number(e.target.value))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["Energia ", energy]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 5,
									value: energy,
									onChange: (e) => setEnergy(Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "min-h-11 rounded-md border border-line bg-bg px-3 text-sm",
							placeholder: "O que está pesando agora?",
							value: note,
							onChange: (e) => setNote(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								saveCheckIn({
									date: today,
									mood,
									energy,
									note
								});
								setNote("");
							},
							children: "Registrar"
						}),
						todayCheck ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								"Hoje já registrado: ânimo ",
								todayCheck.mood,
								", energia ",
								todayCheck.energy,
								"."
							]
						}) : null
					]
				})]
			})]
		})]
	});
}
//#endregion
export { Foco as component };
