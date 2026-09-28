import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pill, f as usePos, i as Input, n as Card, o as Textarea, r as Field, t as Button } from "./router-hMLxtw14.mjs";
import { t as AREAS } from "./types-D-Ni9GkJ.mjs";
import { n as NOTE_PARA_SLOTS } from "./para-BhftVLTd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/capture-CeFMqc9B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CaptureDesk() {
	const addInbox = usePos((s) => s.addInbox);
	const addNote = usePos((s) => s.addNote);
	const addTask = usePos((s) => s.addTask);
	const inbox = usePos((s) => s.inbox);
	const notes = usePos((s) => s.notes);
	const removeNote = usePos((s) => s.removeNote);
	const [mode, setMode] = (0, import_react.useState)("ideia");
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [para, setPara] = (0, import_react.useState)("Recursos/IA");
	const [course, setCourse] = (0, import_react.useState)("unifecaf");
	const [area, setArea] = (0, import_react.useState)("rocketseat");
	const [saved, setSaved] = (0, import_react.useState)("");
	function submit(e) {
		e.preventDefault();
		const text = (body || title).trim();
		if (!text) return;
		if (mode === "ideia") {
			addInbox(text);
			setSaved("Ideia no inbox. Esclareça quando tiver um minuto.");
		} else if (mode === "nota") {
			addNote({
				course,
				title: title.trim() || text.slice(0, 80),
				body: text,
				para
			});
			setSaved(`Nota em ${para}.`);
		} else {
			addTask({
				title: title.trim() || text.slice(0, 90),
				notes: body,
				status: "inbox",
				quadrant: "importante",
				area,
				energy: "media",
				estimateMin: 30,
				due: null
			});
			setSaved("Tarefa capturada no GTD.");
		}
		setTitle("");
		setBody("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Capturar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Ideia vai para o inbox. Nota fica gravada aqui (PDF continua no Drive). Tarefa entra no GTD."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							["ideia", "Ideia (inbox)"],
							["nota", "Nota"],
							["tarefa", "Tarefa"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							tone: mode === id ? "primary" : "ghost",
							onClick: () => setMode(id),
							children: label
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "grid gap-3",
						children: [
							mode !== "ideia" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: mode === "nota" ? "Título" : "O que precisa ser feito?",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "Título curto"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: mode === "ideia" ? "Ideia solta" : "Texto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: body,
									onChange: (e) => setBody(e.target.value),
									placeholder: mode === "ideia" ? "Jogue aqui. Classifica depois." : mode === "nota" ? "Resumo da aula, insight, citação…" : "Contexto da tarefa (opcional)"
								})
							}),
							mode === "nota" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Origem",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
										value: course,
										onChange: (e) => {
											const next = e.target.value;
											setCourse(next);
											if (next === "rocketseat") setPara("Recursos/Programação");
											else if (next === "unifecaf") setPara("Recursos/IA");
											else setPara("Recursos/Conhecimentos gerais e Curiosidades");
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "unifecaf",
												children: "UniFECAF"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "rocketseat",
												children: "Rocketseat"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "outro",
												children: "Outro"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Pasta PARA",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
										value: para,
										onChange: (e) => setPara(e.target.value),
										children: NOTE_PARA_SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s.id,
											children: s.label
										}, s.id))
									})
								})]
							}) : null,
							mode === "tarefa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Frente",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
									value: area,
									onChange: (e) => setArea(e.target.value),
									children: AREAS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: a.id,
										children: a.label
									}, a.id))
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Guardar"
								}), saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: saved
								}) : null]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxList, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Notas gravadas"
				}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle",
					children: "Nenhuma nota ainda. Escreva acima ou peça um resumo no Copiloto."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3",
					children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-line bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: "forest",
									children: n.course === "unifecaf" ? "UniFECAF" : n.course === "rocketseat" ? "Rocketseat" : "Outro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: n.para
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-medium",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-sm text-muted",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-xs text-clay",
								onClick: () => removeNote(n.id),
								children: "Tirar"
							})
						]
					}, n.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [
					inbox.length,
					" ideia(s) no inbox · ",
					notes.length,
					" nota(s)"
				]
			})
		]
	});
}
function InboxList() {
	const inbox = usePos((s) => s.inbox);
	const removeInbox = usePos((s) => s.removeInbox);
	const clarifyInbox = usePos((s) => s.clarifyInbox);
	if (!inbox.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display text-2xl tracking-tight",
		children: "Inbox"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted",
		children: "Vazio. Ideias soltas aparecem aqui até você esclarecer."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl tracking-tight",
			children: "Inbox — esclarecer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: inbox.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxRow, {
				text: item.text,
				onDrop: () => removeInbox(item.id),
				onTask: (area) => clarifyInbox(item.id, {
					kind: "tarefa",
					area
				}),
				onProject: () => clarifyInbox(item.id, { kind: "projeto" }),
				onNote: (para, course) => clarifyInbox(item.id, {
					kind: "nota",
					para,
					course
				})
			}, item.id))
		})]
	});
}
function InboxRow({ text, onDrop, onTask, onProject, onNote }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [area, setArea] = (0, import_react.useState)("rocketseat");
	const [para, setPara] = (0, import_react.useState)("Recursos/IA");
	const [course, setCourse] = (0, import_react.useState)("unifecaf");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-md border border-line bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					tone: "ghost",
					onClick: () => setOpen((v) => !v),
					children: "Esclarecer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-clay",
					onClick: onDrop,
					children: "Descartar"
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Vira tarefa",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
								value: area,
								onChange: (e) => setArea(e.target.value),
								children: AREAS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: a.id,
									children: a.label
								}, a.id))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => onTask(area),
							children: "Mandar às tarefas"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted",
							children: "Vira projeto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							tone: "ghost",
							onClick: onProject,
							children: "Ir ao portfólio"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Vira nota",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
									value: para,
									onChange: (e) => setPara(e.target.value),
									children: NOTE_PARA_SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.label
									}, s.id))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
								value: course,
								onChange: (e) => setCourse(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "unifecaf",
										children: "UniFECAF"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rocketseat",
										children: "Rocketseat"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "outro",
										children: "Outro"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								tone: "ghost",
								onClick: () => onNote(para, course),
								children: "Guardar nota"
							})
						]
					})
				]
			}) : null
		]
	});
}
function CaptureMini() {
	const addInbox = usePos((s) => s.addInbox);
	const inbox = usePos((s) => s.inbox);
	const [text, setText] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	function submit(e) {
		e.preventDefault();
		if (!text.trim()) return;
		addInbox(text.trim());
		setText("");
		setSaved(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Inbox rápido"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Ideia solta agora. Nota longa e esclarecer ficam no Segundo cérebro."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "Anote sem classificar…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Guardar ideia"
					}), saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							"No inbox (",
							inbox.length,
							")."
						]
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { CaptureMini as n, CaptureDesk as t };
