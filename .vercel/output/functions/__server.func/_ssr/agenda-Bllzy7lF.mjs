import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pill, d as todayIsoClient, f as usePos, i as Input, l as formatDay, n as Card, p as weekDates, r as Field, t as Button } from "./router-hMLxtw14.mjs";
import { n as KINDS } from "./types-D-Ni9GkJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agenda-Bllzy7lF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Agenda() {
	const events = usePos((s) => s.events);
	const addEvent = usePos((s) => s.addEvent);
	const removeEvent = usePos((s) => s.removeEvent);
	const week = weekDates();
	const today = todayIsoClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(today);
	const [start, setStart] = (0, import_react.useState)("09:00");
	const [end, setEnd] = (0, import_react.useState)("10:00");
	const [kind, setKind] = (0, import_react.useState)("foco");
	const [notes, setNotes] = (0, import_react.useState)("");
	function submit(e) {
		e.preventDefault();
		if (!title.trim()) return;
		addEvent({
			title: title.trim(),
			date,
			start,
			end,
			kind,
			notes
		});
		setTitle("");
		setNotes("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-subtle",
					children: "Time blocking"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Agenda da semana"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Compromissos e Pomodoros no mesmo lugar. Manhã = prática. Tarde = UniFECAF. Fim do dia = lote. Domingo = revisão."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bloco",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Nome do compromisso"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Dia",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tipo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k.id,
								children: k.label
							}, k.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Início",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: start,
							onChange: (e) => setStart(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: end,
							onChange: (e) => setEnd(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notas",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							placeholder: "Intenção do bloco"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Agendar"
						})
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-7",
				children: week.map((d) => {
					const list = events.filter((e) => e.date === d).sort((a, b) => a.start.localeCompare(b.start));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-4 ${d === today ? "border-forest bg-leaf/40" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-wide text-muted",
							children: formatDay(d)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-2",
							children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs text-subtle",
								children: "Livre"
							}) : list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border border-line bg-surface p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium leading-snug",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: e.start }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-[11px] text-clay",
										onClick: () => removeEvent(e.id),
										children: "Tirar"
									})]
								})]
							}, e.id))
						})]
					}, d);
				})
			})
		]
	});
}
//#endregion
export { Agenda as component };
