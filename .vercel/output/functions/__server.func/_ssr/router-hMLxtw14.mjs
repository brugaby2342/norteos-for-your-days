import { i as __toESM, n as __exportAll$1 } from "../_runtime.mjs";
import { B as require_react, _ as createRootRoute, b as require_jsx_runtime, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as CONNECTOR_TOKEN_READY_EVENT } from "./types-BU_vzhZ-.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-C1p7zOu_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-hMLxtw14.js
var router_hMLxtw14_exports = /* @__PURE__ */ __exportAll$1({
	a: () => weekDates,
	c: () => Field,
	d: () => Textarea,
	f: () => cx,
	getRouter: () => getRouter,
	i: () => usePos,
	l: () => Input,
	n: () => formatDay,
	o: () => Button,
	p: () => askNorte,
	r: () => todayIsoClient,
	s: () => Card,
	t: () => router_exports,
	u: () => Pill
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-C3b2rK7I.css";
var APP_NAME = "Norte OS";
var Route$10 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Sistema operacional pessoal para transição de carreira em tech: UniFECAF, Rocketseat, portfólio e candidaturas."
			},
			{
				name: "theme-color",
				content: "#1F5C4A"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("../_app-DoNZEtqv.mjs");
var Route$9 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_app-BveETrHm.mjs");
var Route$8 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./agenda-Bllzy7lF.mjs");
var Route$7 = createFileRoute("/_app/agenda")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var askNorte = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2351871cabd9c4301872e24b3b2456ed050a845258de81ee0a7206e42a78689d"));
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
function Button({ tone = "primary", className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cx("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-150", {
			primary: "bg-forest text-surface hover:bg-forest-deep disabled:opacity-50",
			ghost: "bg-transparent text-ink border border-line hover:border-line-strong hover:bg-bg-warm",
			quiet: "bg-leaf text-forest-deep hover:bg-bg-warm",
			danger: "bg-danger text-surface hover:opacity-90"
		}[tone], className),
		...props
	});
}
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cx("min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle outline-none focus:border-forest", props.className)
	});
}
function Textarea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cx("min-h-28 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-subtle outline-none focus:border-forest", props.className)
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-muted",
			children: label
		}), children]
	});
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx("rounded-xl border border-line bg-surface p-5 shadow-[0_1px_0_rgba(28,25,23,0.04)]", className),
		children
	});
}
function Pill({ children, tone = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-bg-warm text-muted",
			forest: "bg-leaf text-forest-deep",
			clay: "bg-amber-soft text-clay",
			sand: "bg-bg-warm text-ink"
		}[tone]),
		children
	});
}
function isoDaysFromToday(offset) {
	const d = /* @__PURE__ */ new Date();
	d.setHours(12, 0, 0, 0);
	d.setDate(d.getDate() + offset);
	return d.toISOString().slice(0, 10);
}
function nextSundayIso() {
	const d = /* @__PURE__ */ new Date();
	return isoDaysFromToday(d.getDay() === 0 ? 0 : 7 - d.getDay());
}
var seedProfile = {
	name: "Gabriela",
	role: "Transição de carreira · IA e Automação Digital",
	weeklyFocus: "Praticar código na Rocketseat sem largar a UniFECAF. Candidaturas só no lote da tarde — estudo não compete com ansiedade de vaga."
};
var seedTasks = [
	{
		id: "t1",
		title: "Entregar o POS da disciplina de Produtividade",
		notes: "Parte teórica, sistema funcionando, roteiro do pitch e prints.",
		status: "fazendo",
		quadrant: "urgente-importante",
		area: "unifecaf",
		energy: "alta",
		estimateMin: 90,
		due: isoDaysFromToday(2),
		createdAt: isoDaysFromToday(-5),
		completedAt: null,
		pomodoros: 3
	},
	{
		id: "t2",
		title: "Gravar vídeo pitch de até 4 minutos",
		notes: "Contar a saída do Cartório e o sistema da transição. Roteiro no Guia.",
		status: "inbox",
		quadrant: "urgente-importante",
		area: "unifecaf",
		energy: "media",
		estimateMin: 50,
		due: isoDaysFromToday(4),
		createdAt: isoDaysFromToday(-2),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t3",
		title: "Módulo JS da Rocketseat: funções e arrays",
		notes: "Dois Pomodoros de prática. Não só assistir: code along no editor.",
		status: "inbox",
		quadrant: "importante",
		area: "rocketseat",
		energy: "alta",
		estimateMin: 50,
		due: isoDaysFromToday(1),
		createdAt: isoDaysFromToday(-1),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t4",
		title: "Publicar o Norte OS no GitHub com README",
		notes: "Primeiro projeto visível do portfólio da transição.",
		status: "inbox",
		quadrant: "importante",
		area: "portfolio",
		energy: "media",
		estimateMin: 40,
		due: isoDaysFromToday(5),
		createdAt: isoDaysFromToday(-3),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t5",
		title: "Follow-up da proposta de landing page",
		notes: "Mensagem curta. Sem reabrir o projeto mentalmente o dia inteiro.",
		status: "espera",
		quadrant: "urgente",
		area: "candidaturas",
		energy: "baixa",
		estimateMin: 15,
		due: isoDaysFromToday(0),
		createdAt: isoDaysFromToday(-4),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t6",
		title: "Candidatar-se à vaga de assistente de automação",
		notes: "Só no bloco de lote. Não misturar com o Pomodoro de código.",
		status: "inbox",
		quadrant: "importante",
		area: "candidaturas",
		energy: "media",
		estimateMin: 35,
		due: isoDaysFromToday(3),
		createdAt: isoDaysFromToday(-1),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t7",
		title: "Rolagem no LinkedIn sem critério",
		notes: "Quadrante 4. Substitui a revisão semanal e o lote de candidaturas.",
		status: "inbox",
		quadrant: "nenhum",
		area: "pessoal",
		energy: "baixa",
		estimateMin: 20,
		due: null,
		createdAt: isoDaysFromToday(-6),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t8",
		title: "Caminhada de 25 minutos",
		notes: "Contrapeso da rotina de tela. Cartório tinha deslocamento; agora preciso criar o movimento.",
		status: "inbox",
		quadrant: "importante",
		area: "pessoal",
		energy: "baixa",
		estimateMin: 25,
		due: isoDaysFromToday(0),
		createdAt: isoDaysFromToday(-7),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t9",
		title: "Resumir aula UniFECAF com a IA e guardar em Cursos",
		notes: "Uma página de notas > reler a aula inteira.",
		status: "inbox",
		quadrant: "importante",
		area: "unifecaf",
		energy: "baixa",
		estimateMin: 20,
		due: isoDaysFromToday(1),
		createdAt: isoDaysFromToday(-2),
		completedAt: null,
		pomodoros: 0
	},
	{
		id: "t10",
		title: "Exercício prático: lista de tarefas em JavaScript",
		notes: "Feito no editor, não só no playground da aula.",
		status: "feito",
		quadrant: "importante",
		area: "rocketseat",
		energy: "alta",
		estimateMin: 45,
		due: isoDaysFromToday(-2),
		createdAt: isoDaysFromToday(-6),
		completedAt: isoDaysFromToday(-2),
		pomodoros: 2
	},
	{
		id: "t11",
		title: "Ler Trello Guide e espelhar o quadro no POS",
		notes: "Kanban das frentes da transição.",
		status: "feito",
		quadrant: "importante",
		area: "unifecaf",
		energy: "media",
		estimateMin: 30,
		due: isoDaysFromToday(-3),
		createdAt: isoDaysFromToday(-8),
		completedAt: isoDaysFromToday(-3),
		pomodoros: 1
	}
];
var seedEvents = [
	{
		id: "e1",
		title: "Pomodoro — Rocketseat (código)",
		date: isoDaysFromToday(0),
		start: "09:00",
		end: "11:00",
		kind: "foco",
		notes: "Celular fora. Praticar, não só assistir."
	},
	{
		id: "e2",
		title: "Pausa e caminhada",
		date: isoDaysFromToday(0),
		start: "12:30",
		end: "13:00",
		kind: "pausa",
		notes: "Longe da tela."
	},
	{
		id: "e3",
		title: "UniFECAF — Produtividade e Gestão do Tempo",
		date: isoDaysFromToday(0),
		start: "14:00",
		end: "15:30",
		kind: "aula",
		notes: "Depois: resumir no copiloto."
	},
	{
		id: "e4",
		title: "Lote: vagas, follow-up e mensagens",
		date: isoDaysFromToday(0),
		start: "17:00",
		end: "17:40",
		kind: "lote",
		notes: "Único horário em que LinkedIn é permitido."
	},
	{
		id: "e5",
		title: "Pomodoro — portfólio no GitHub",
		date: isoDaysFromToday(1),
		start: "09:00",
		end: "10:30",
		kind: "foco",
		notes: "README do Norte OS."
	},
	{
		id: "e6",
		title: "Revisão semanal (ritual de fechamento)",
		date: nextSundayIso(),
		start: "10:00",
		end: "11:00",
		kind: "pessoal",
		notes: "Domingo: o que avançou em cada frente. Sem candidatar no mesmo bloco."
	}
];
var seedHabits = [
	{
		id: "h1",
		name: "Dois Pomodoros de código antes do almoço",
		detail: "Rocketseat ou projeto. Teoria UniFECAF não substitui prática.",
		targetPerWeek: 5,
		logs: [
			isoDaysFromToday(-1),
			isoDaysFromToday(-2),
			isoDaysFromToday(-4)
		]
	},
	{
		id: "h2",
		name: "Candidaturas só no lote da tarde",
		detail: "Estudar e procurar vaga não ocupam o mesmo bloco.",
		targetPerWeek: 5,
		logs: [isoDaysFromToday(-1), isoDaysFromToday(-3)]
	},
	{
		id: "h3",
		name: "Revisão semanal no domingo",
		detail: "Fechar a semana nas quatro frentes. Ritual, não improviso.",
		targetPerWeek: 1,
		logs: [isoDaysFromToday(-4)]
	},
	{
		id: "h4",
		name: "Sono até 23h30",
		detail: "A rotina do Cartório tinha horário. Esta também precisa.",
		targetPerWeek: 6,
		logs: [
			isoDaysFromToday(-1),
			isoDaysFromToday(-2),
			isoDaysFromToday(-3)
		]
	}
];
var seedCheckins = [
	{
		date: isoDaysFromToday(-3),
		mood: 2,
		energy: 3,
		note: "Abri o LinkedIn no meio da aula. Saí pior do que entrei."
	},
	{
		date: isoDaysFromToday(-2),
		mood: 4,
		energy: 4,
		note: "Dois Pomodoros de JS de manhã. A tarde rendeu a disciplina."
	},
	{
		date: isoDaysFromToday(-1),
		mood: 4,
		energy: 3,
		note: "Saudade da rotina rígida do Cartório — o POS segura o dia."
	}
];
var seedInbox = [{
	id: "n1",
	text: "Ideia de projeto: calculadora de emolumentos / checklist de registro — usar o conhecimento do Cartório no portfólio.",
	createdAt: isoDaysFromToday(-2)
}, {
	id: "n2",
	text: "Edital de vaga júnior em automação de planilhas. Avaliar no lote, não agora.",
	createdAt: isoDaysFromToday(0)
}];
var seedCourses = [{
	id: "c1",
	name: "IA e Automação Digital",
	provider: "unifecaf",
	modules: 12,
	done: 4,
	current: "Produtividade e Gestão do Tempo"
}, {
	id: "c2",
	name: "Trilha de programação (Discover / fundamentos)",
	provider: "rocketseat",
	modules: 18,
	done: 5,
	current: "JavaScript: funções e arrays"
}];
var seedProjects = [
	{
		id: "p1",
		name: "Norte OS — POS da transição",
		stack: "React · produtividade · IA",
		status: "progresso",
		next: "README, prints e publicar no GitHub."
	},
	{
		id: "p2",
		name: "Checklist de registro de imóveis",
		stack: "HTML/CSS/JS · domínio do Cartório",
		status: "ideia",
		next: "Listar 8 documentos e o fluxo simples."
	},
	{
		id: "p3",
		name: "To-do com localStorage",
		stack: "JavaScript puro",
		status: "publicado",
		next: "Link no README do GitHub."
	}
];
var seedLeads = [
	{
		id: "l1",
		title: "Landing page para estúdio local",
		company: "Cliente freelancer",
		kind: "freela",
		status: "followup",
		nextAction: "Mandar mensagem curta de acompanhamento.",
		followUp: isoDaysFromToday(0)
	},
	{
		id: "l2",
		title: "Assistente de automação / planilhas",
		company: "Escritório em SC",
		kind: "vaga",
		status: "prospectar",
		nextAction: "Adaptar currículo com a transição Cartório → automação.",
		followUp: isoDaysFromToday(3)
	},
	{
		id: "l3",
		title: "Dashboard a partir de planilha",
		company: "Pequeno comércio",
		kind: "freela",
		status: "enviado",
		nextAction: "Esperar retorno até sexta; então follow-up.",
		followUp: isoDaysFromToday(2)
	},
	{
		id: "l4",
		title: "Estágio em suporte técnico",
		company: "Empresa de software",
		kind: "vaga",
		status: "recusado",
		nextAction: "Anotar o feedback e voltar ao código.",
		followUp: null
	}
];
var seedNotes = [{
	id: "sn1",
	course: "unifecaf",
	title: "GTD em uma frase",
	body: "Capturar tudo fora da cabeça. UniFECAF, Rocketseat, ideias de projeto e editais não podem viver só no WhatsApp.",
	para: "Recursos/IA",
	createdAt: isoDaysFromToday(-3)
}, {
	id: "sn2",
	course: "rocketseat",
	title: "Função é bloco reutilizável",
	body: "Pratiquei map/filter numa lista de tarefas. Assistir a aula sem digitar não conta como módulo feito.",
	para: "Recursos/Programação",
	createdAt: isoDaysFromToday(-2)
}];
function uid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
function todayIso() {
	const d = /* @__PURE__ */ new Date();
	d.setHours(12, 0, 0, 0);
	return d.toISOString().slice(0, 10);
}
var QUAD_SET = /* @__PURE__ */ new Set([
	"urgente-importante",
	"importante",
	"urgente",
	"nenhum"
]);
var AREA_SET = /* @__PURE__ */ new Set([
	"unifecaf",
	"rocketseat",
	"portfolio",
	"candidaturas",
	"pessoal"
]);
function defaultPara(course) {
	if (course === "rocketseat") return "Recursos/Programação";
	if (course === "outro") return "Recursos/Conhecimentos gerais e Curiosidades";
	return "Recursos/IA";
}
function migratePos(persisted) {
	const s = persisted && typeof persisted === "object" ? persisted : {};
	const notes = Array.isArray(s.notes) ? s.notes : [];
	return {
		...s,
		notes: notes.map((n) => ({
			...n,
			para: n.para || defaultPara(n.course)
		}))
	};
}
var demoSlice = () => ({
	profile: seedProfile,
	tasks: seedTasks,
	events: seedEvents,
	habits: seedHabits,
	checkins: seedCheckins,
	inbox: seedInbox,
	aiLogs: [],
	courses: seedCourses,
	projects: seedProjects,
	leads: seedLeads,
	notes: seedNotes,
	pomodorosToday: 0,
	lastPomodoroDate: todayIso()
});
var usePos = create()(persist((set, get) => ({
	...demoSlice(),
	setProfile: (p) => set({ profile: {
		...get().profile,
		...p
	} }),
	addTask: (t) => set({ tasks: [{
		...t,
		id: uid("t"),
		createdAt: todayIso(),
		completedAt: null,
		pomodoros: 0
	}, ...get().tasks] }),
	updateTask: (id, patch) => set({ tasks: get().tasks.map((t) => t.id === id ? {
		...t,
		...patch
	} : t) }),
	removeTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
	completeTask: (id) => set({ tasks: get().tasks.map((t) => t.id === id ? {
		...t,
		status: "feito",
		completedAt: todayIso()
	} : t) }),
	addEvent: (e) => set({ events: [...get().events, {
		...e,
		id: uid("e")
	}] }),
	removeEvent: (id) => set({ events: get().events.filter((e) => e.id !== id) }),
	toggleHabit: (id, date) => {
		const day = date ?? todayIso();
		set({ habits: get().habits.map((h) => {
			if (h.id !== id) return h;
			const has = h.logs.includes(day);
			return {
				...h,
				logs: has ? h.logs.filter((d) => d !== day) : [...h.logs, day]
			};
		}) });
	},
	saveCheckIn: (c) => set({ checkins: [c, ...get().checkins.filter((x) => x.date !== c.date)].sort((a, b) => b.date.localeCompare(a.date)) }),
	addInbox: (text) => set({ inbox: [{
		id: uid("n"),
		text,
		createdAt: todayIso()
	}, ...get().inbox] }),
	removeInbox: (id) => set({ inbox: get().inbox.filter((n) => n.id !== id) }),
	addAiLog: (kind, prompt, result) => set({ aiLogs: [{
		id: uid("ai"),
		kind,
		prompt,
		result,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...get().aiLogs].slice(0, 20) }),
	bumpPomodoro: () => {
		const day = todayIso();
		set({
			pomodorosToday: get().lastPomodoroDate === day ? get().pomodorosToday + 1 : 1,
			lastPomodoroDate: day
		});
	},
	applyAiTasks: (titles) => {
		set({ tasks: [...titles.map((item) => ({
			id: uid("t"),
			title: item.title,
			notes: item.notes ?? "Gerada pela IA a partir da captura.",
			status: "inbox",
			quadrant: QUAD_SET.has(item.quadrant) ? item.quadrant : "importante",
			area: AREA_SET.has(item.area) ? item.area : "rocketseat",
			energy: "media",
			estimateMin: 30,
			due: null,
			createdAt: todayIso(),
			completedAt: null,
			pomodoros: 0
		})), ...get().tasks] });
	},
	bumpCourse: (id, delta) => set({ courses: get().courses.map((c) => c.id === id ? {
		...c,
		done: Math.max(0, Math.min(c.modules, c.done + delta))
	} : c) }),
	addProject: (p) => set({ projects: [{
		...p,
		id: uid("p")
	}, ...get().projects] }),
	updateProject: (id, patch) => set({ projects: get().projects.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) }),
	removeProject: (id) => set({ projects: get().projects.filter((p) => p.id !== id) }),
	addLead: (l) => set({ leads: [{
		...l,
		id: uid("l")
	}, ...get().leads] }),
	updateLead: (id, patch) => set({ leads: get().leads.map((l) => l.id === id ? {
		...l,
		...patch
	} : l) }),
	removeLead: (id) => set({ leads: get().leads.filter((l) => l.id !== id) }),
	addNote: (n) => set({ notes: [{
		...n,
		para: n.para || "Recursos/IA",
		id: uid("sn"),
		createdAt: todayIso()
	}, ...get().notes] }),
	removeNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
	clarifyInbox: (id, dest) => {
		const item = get().inbox.find((n) => n.id === id);
		if (!item) return;
		if (dest.kind === "tarefa") get().addTask({
			title: item.text.slice(0, 90),
			notes: item.text,
			status: "inbox",
			quadrant: "importante",
			area: dest.area,
			energy: "media",
			estimateMin: 30,
			due: null
		});
		else if (dest.kind === "projeto") get().addProject({
			name: item.text.slice(0, 70),
			stack: "A definir",
			status: "ideia",
			next: "Esclarecer o primeiro passo."
		});
		else get().addNote({
			course: dest.course,
			title: item.text.slice(0, 80),
			body: item.text,
			para: dest.para
		});
		get().removeInbox(id);
	},
	resetDemo: () => set(demoSlice())
}), {
	name: "norte-os-v2",
	version: 3,
	migrate: migratePos
}));
function weekDates(from = /* @__PURE__ */ new Date()) {
	const start = new Date(from);
	const day = start.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	start.setDate(start.getDate() + diff);
	start.setHours(12, 0, 0, 0);
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return d.toISOString().slice(0, 10);
	});
}
function formatDay(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
		weekday: "short",
		day: "2-digit",
		month: "short"
	});
}
function todayIsoClient() {
	return todayIso();
}
var Route$6 = createFileRoute("/_app/comunicacao")({ component: Comunicacao });
var TEMPLATES = [
	{
		id: "freela",
		title: "Proposta de freelance",
		text: "Olá, sou a Gabriela. Estou em transição do Cartório de Registro de Imóveis para IA e automação (UniFECAF + Rocketseat). Posso montar a landing do estúdio em HTML/CSS com formulário de contato, em duas semanas, com uma revisão incluída. Valor: a combinar após um briefing de 20 min. Faz sentido conversarmos?"
	},
	{
		id: "follow",
		title: "Follow-up",
		text: "Oi, passo para retomar a proposta da landing. Continuo disponível esta semana para o briefing de 20 min. Se o momento não for agora, sem problema — me avise e eu fecho o assunto."
	},
	{
		id: "vaga",
		title: "Apresentação para vaga",
		text: "Olá. Venho de uns anos em Cartório (prazos, conferência, processo) e estou me formando em IA e Automação Digital, com prática de programação na Rocketseat. Busco uma vaga júnior/assistente em automação ou operação. Posso enviar um PDF com dois projetos (to-do e o POS da disciplina)?"
	},
	{
		id: "limite",
		title: "Proteger o bloco de estudo",
		text: "Recebi o convite para a call hoje às 18h. Não vou conseguir sem abrir mão do Pomodoro de código. Posso mandar um resumo escrito amanhã no fim da manhã?"
	}
];
function Comunicacao() {
	const addAiLog = usePos((s) => s.addAiLog);
	const [draft, setDraft] = (0, import_react.useState)(TEMPLATES[0].text);
	const [out, setOut] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function polish() {
		setBusy(true);
		setError("");
		try {
			const res = await askNorte({ data: {
				kind: "mensagem",
				context: draft
			} });
			if (!res.ok) {
				setError(res.error);
				return;
			}
			setOut(res.text);
			addAiLog("mensagem", draft, res.text);
		} catch {
			setError("A IA não respondeu. Tente novamente.");
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
					children: "Prospecção e limites"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Mensagens no lote da tarde"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Proposta, follow-up e candidatura saem daqui — não do meio do Pomodoro. A IA ajusta o tom; o lote protege o estudo."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-xl border border-line bg-surface p-4 text-left hover:bg-bg-warm",
					onClick: () => setDraft(t.text),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-3 text-xs text-muted",
						children: t.text
					})]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Rascunho"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							className: "min-h-48"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy || !draft.trim(),
							onClick: polish,
							children: busy ? "Reescrevendo…" : "Reescrever com IA"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-clay",
							children: error
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Versão pronta"
					}), out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "whitespace-pre-wrap text-sm leading-relaxed text-ink",
						children: out
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Copie para e-mail, WhatsApp do cliente ou formulário da vaga."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Regra da casa"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Um lote por dia, no fim da tarde. LinkedIn fora desse bloco é quadrante 4. Mensagem sem pedido claro não sai. Recusar uma call para proteger o código não é falta de educação — é o expediente que o Cartório já ensinava, agora autoimposto."
				})]
			})
		]
	});
}
var $$splitComponentImporter$5 = () => import("./foco-BmWu72ec.mjs");
var Route$5 = createFileRoute("/_app/foco")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./frentes-B8ZYA8az.mjs");
var Route$4 = createFileRoute("/_app/frentes")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./guia-D64z2Bek.mjs");
var Route$3 = createFileRoute("/_app/guia")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./ia-BkN7aiSn.mjs");
var Route$2 = createFileRoute("/_app/ia")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./tarefas-uUgQeL7g.mjs");
var Route$1 = createFileRoute("/_app/tarefas")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./teoria-kW6ypbRW.mjs");
var Route = createFileRoute("/_app/teoria")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var AppRoute = Route$9.update({
	id: "/_app",
	getParentRoute: () => Route$10
});
var AppIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAgendaRoute: Route$7.update({
		id: "/agenda",
		path: "/agenda",
		getParentRoute: () => AppRoute
	}),
	AppComunicacaoRoute: Route$6.update({
		id: "/comunicacao",
		path: "/comunicacao",
		getParentRoute: () => AppRoute
	}),
	AppFocoRoute: Route$5.update({
		id: "/foco",
		path: "/foco",
		getParentRoute: () => AppRoute
	}),
	AppFrentesRoute: Route$4.update({
		id: "/frentes",
		path: "/frentes",
		getParentRoute: () => AppRoute
	}),
	AppGuiaRoute: Route$3.update({
		id: "/guia",
		path: "/guia",
		getParentRoute: () => AppRoute
	}),
	AppIaRoute: Route$2.update({
		id: "/ia",
		path: "/ia",
		getParentRoute: () => AppRoute
	}),
	AppTarefasRoute: Route$1.update({
		id: "/tarefas",
		path: "/tarefas",
		getParentRoute: () => AppRoute
	}),
	AppTeoriaRoute: Route.update({
		id: "/teoria",
		path: "/teoria",
		getParentRoute: () => AppRoute
	}),
	AppIndexRoute
};
var rootRouteChildren = { AppRoute: AppRoute._addFileChildren(AppRouteChildren) };
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Pill as a, cx as c, todayIsoClient as d, usePos as f, Input as i, formatDay as l, createSsrRpc as m, Card as n, Textarea as o, weekDates as p, Field as r, askNorte as s, Button as t, router_hMLxtw14_exports as u };
