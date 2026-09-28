import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pill, f as usePos, i as Input, n as Card, r as Field, t as Button } from "./router-hMLxtw14.mjs";
import { a as QUADRANTS, o as STATUSES, t as AREAS } from "./types-D-Ni9GkJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tarefas-uUgQeL7g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Tarefas() {
	const tasks = usePos((s) => s.tasks);
	const addTask = usePos((s) => s.addTask);
	const updateTask = usePos((s) => s.updateTask);
	const completeTask = usePos((s) => s.completeTask);
	const removeTask = usePos((s) => s.removeTask);
	const [view, setView] = (0, import_react.useState)("matriz");
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [quadrant, setQuadrant] = (0, import_react.useState)("importante");
	const [area, setArea] = (0, import_react.useState)("rocketseat");
	const [energy, setEnergy] = (0, import_react.useState)("media");
	function submit(e) {
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
			due: null
		});
		setTitle("");
		setNotes("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.2em] text-subtle",
						children: "GTD + Eisenhower"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: "Tarefas e prioridades"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
						children: "Capture aula, exercício, projeto ou edital. A matriz decide se agora é código, faculdade ou vaga."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: view === "matriz" ? "primary" : "ghost",
						onClick: () => setView("matriz"),
						children: "Matriz"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						tone: view === "quadro" ? "primary" : "ghost",
						onClick: () => setView("quadro"),
						children: "Quadro"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nova captura",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "O que precisa ser feito?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notas",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: "Contexto curto"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quadrante",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
							value: quadrant,
							onChange: (e) => setQuadrant(e.target.value),
							children: QUADRANTS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: q.id,
								children: q.label
							}, q.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Frente",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "min-h-11 rounded-md border border-line bg-surface px-3 text-sm",
									value: area,
									onChange: (e) => setArea(e.target.value),
									children: AREAS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: a.id,
										children: a.label
									}, a.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Energia",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "min-h-11 rounded-md border border-line bg-surface px-3 text-sm",
									value: energy,
									onChange: (e) => setEnergy(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "alta",
											children: "Alta"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "media",
											children: "Média"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "baixa",
											children: "Baixa"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Capturar"
							})
						]
					})
				]
			}) }),
			view === "matriz" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: QUADRANTS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-h-56",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl tracking-tight",
							children: q.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: q.hint
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: tasks.filter((t) => t.quadrant === q.id && t.status !== "feito").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
							title: t.title,
							meta: `${AREAS.find((a) => a.id === t.area)?.label ?? t.area} · ${t.energy}`,
							onDone: () => completeTask(t.id),
							onDrop: () => removeTask(t.id),
							onMove: (status) => updateTask(t.id, { status })
						}, t.id))
					})]
				}, q.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: STATUSES.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-h-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-xl tracking-tight",
						children: col.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: tasks.filter((t) => t.status === col.id).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-md border border-line bg-bg p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-subtle",
									children: t.notes
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: "forest",
										children: AREAS.find((a) => a.id === t.area)?.label ?? t.area
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-1",
									children: STATUSES.filter((s) => s.id !== t.status).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-full border border-line px-2 py-1 text-[11px] text-muted hover:text-ink",
										onClick: () => s.id === "feito" ? completeTask(t.id) : updateTask(t.id, { status: s.id }),
										children: s.label
									}, s.id))
								})
							]
						}, t.id))
					})]
				}, col.id))
			})
		]
	});
}
function TaskRow({ title, meta, onDone, onDrop, onMove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md border border-line bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: meta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-forest",
						onClick: () => onMove("fazendo"),
						children: "Focar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-forest",
						onClick: onDone,
						children: "Concluir"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-clay",
						onClick: onDrop,
						children: "Remover"
					})
				]
			})
		]
	});
}
//#endregion
export { Tarefas as component };
