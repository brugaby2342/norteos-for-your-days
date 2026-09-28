import { i as __toESM } from "./_runtime.mjs";
import { B as require_react, b as require_jsx_runtime, d as useRouterState, m as Outlet, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as cx, f as usePos } from "./_ssr/router-hMLxtw14.mjs";
import { a as MessageSquareText, c as LayoutDashboard, d as Brain, f as BookOpen, i as Sparkles, l as Compass, o as Menu, r as Timer, s as ListChecks, t as X, u as CalendarDays } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DoNZEtqv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Painel",
		icon: LayoutDashboard
	},
	{
		to: "/tarefas",
		label: "Tarefas",
		icon: ListChecks
	},
	{
		to: "/agenda",
		label: "Agenda",
		icon: CalendarDays
	},
	{
		to: "/foco",
		label: "Foco",
		icon: Timer
	},
	{
		to: "/frentes",
		label: "Segundo cérebro",
		icon: Brain
	},
	{
		to: "/ia",
		label: "Copiloto",
		icon: Sparkles
	},
	{
		to: "/comunicacao",
		label: "Comunicação",
		icon: MessageSquareText
	},
	{
		to: "/teoria",
		label: "Parte teórica",
		icon: BookOpen
	},
	{
		to: "/guia",
		label: "Guia e pitch",
		icon: Compass
	}
];
function Shell() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const profile = usePos((s) => s.profile);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-[1440px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-bg-warm/60 px-4 py-6 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
						pathname,
						onNavigate: () => setOpen(false)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-auto px-2 text-xs leading-relaxed text-subtle",
						children: [profile.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: profile.role
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": open ? "Fechar menu" : "Abrir menu",
							className: "grid size-11 place-items-center rounded-md border border-line",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-line bg-bg-warm px-3 py-3 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
							pathname,
							onNavigate: () => setOpen(false)
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 sm:px-8 sm:py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				]
			})]
		})
	});
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "mb-6 flex items-baseline gap-2 px-2 no-underline",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-xl tracking-tight text-forest",
				children: "Norte"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-[0.18em] text-subtle",
				children: "OS"
			}),
			compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Sistema operacional pessoal para transição de carreira"
			})
		]
	});
}
function Nav({ pathname, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid gap-1",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cx("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm no-underline transition-colors duration-150", active ? "bg-forest text-surface" : "text-muted hover:bg-surface hover:text-ink"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4 shrink-0",
					strokeWidth: 1.75
				}), item.label]
			}, item.to);
		})
	});
}
var SplitComponent = Shell;
//#endregion
export { SplitComponent as component };
