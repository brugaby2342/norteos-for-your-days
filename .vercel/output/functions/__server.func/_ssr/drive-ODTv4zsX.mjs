import { t as createServerFn } from "./ssr.mjs";
import { i as GoogleDriveTools, r as ConnectorType } from "./types-BU_vzhZ-.mjs";
import { r as PARA_TREE } from "./para-BhftVLTd.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drive-ODTv4zsX.js
function asRecord(data) {
	return data && typeof data === "object" && !Array.isArray(data) ? data : {};
}
function filesFrom(data) {
	if (!data) return [];
	if (Array.isArray(data)) return data.filter((x) => x && typeof x === "object");
	const rec = asRecord(data);
	if (rec.data && typeof rec.data === "object") {
		const nested = filesFrom(rec.data);
		if (nested.length) return nested;
	}
	const raw = rec.items ?? rec.files ?? rec.results ?? rec.folders ?? rec.contents ?? [];
	if (!Array.isArray(raw)) return [];
	return raw.filter((x) => x && typeof x === "object");
}
function fileId(f) {
	if (!f) return void 0;
	return f.id || f.file_id || f.folder_id;
}
function fileName(f) {
	return (f.name || f.title || "").trim();
}
function fileLink(f) {
	if (!f) return void 0;
	return f.webViewLink || f.web_view_link;
}
function isFolder(f) {
	if (f.is_folder === true) return true;
	return (f.mimeType || f.mime_type || "").includes("folder");
}
function sameName(a, b) {
	return a.localeCompare(b, "pt-BR", { sensitivity: "accent" }) === 0;
}
async function callDrive(tool, args) {
	const { callTool } = await import("./client.server-B_vr9_N9.mjs");
	return callTool(tool, args, { connectorType: ConnectorType.GoogleDrive });
}
function failFrom(res) {
	return {
		ok: false,
		pending: res.pending,
		loginRequired: res.loginRequired,
		loginUrl: res.loginUrl,
		error: res.errorMessage ?? "Não foi possível falar com o Drive.",
		folders: []
	};
}
async function listChildren(folderId, cache) {
	const key = folderId ?? "root";
	const cached = cache.get(key);
	if (cached) return {
		ok: true,
		files: cached
	};
	const args = { max_results: 200 };
	if (folderId) args.folder_id = folderId;
	const res = await callDrive(GoogleDriveTools.listFolder, args);
	if (!res.ok) return {
		ok: false,
		err: res
	};
	const files = filesFrom(res.data).filter(isFolder);
	cache.set(key, files);
	return {
		ok: true,
		files
	};
}
function pickChild(files, name) {
	return files.find((f) => sameName(fileName(f), name)) ?? null;
}
async function ensureFolder(name, parentId, cache) {
	const listed = await listChildren(parentId, cache);
	if (!listed.ok) return {
		err: listed.err,
		created: false
	};
	const existing = pickChild(listed.files, name);
	if (existing && fileId(existing)) return {
		file: existing,
		created: false
	};
	const made = await callDrive(GoogleDriveTools.createFolder, {
		folder_name: name,
		...parentId ? { parent_folder_id: parentId } : {}
	});
	if (!made.ok) return {
		err: made,
		created: false
	};
	cache.delete(parentId ?? "root");
	const rec = asRecord(made.data);
	const created = {
		id: typeof rec.id === "string" && rec.id || typeof rec.file_id === "string" && rec.file_id || typeof rec.folder_id === "string" && rec.folder_id || void 0,
		name,
		webViewLink: fileLink(rec),
		is_folder: true
	};
	if (!fileId(created)) {
		const again = await listChildren(parentId, cache);
		if (again.ok) {
			const found = pickChild(again.files, name);
			if (found) return {
				file: found,
				created: true
			};
		}
	}
	return {
		file: created,
		created: true
	};
}
function flattenNames(nodes, parent) {
	const acc = [];
	for (const n of nodes) {
		const p = `${parent}/${n.name}`;
		acc.push(p);
		if (n.children) acc.push(...flattenNames(n.children, p));
	}
	return acc;
}
async function walk(nodes, parentPath, parentId, out, createMissing, created, cache) {
	const listed = await listChildren(parentId, cache);
	if (!listed.ok) return listed.err;
	for (const node of nodes) {
		const path = parentPath ? `${parentPath}/${node.name}` : node.name;
		let hit = pickChild(listed.files, node.name);
		if (!hit && createMissing) {
			const made = await ensureFolder(node.name, parentId, cache);
			if (made.err) return made.err;
			hit = made.file ?? null;
			if (made.created) created.push(path);
		}
		if (hit && fileId(hit)) {
			out.push({
				path,
				name: node.name,
				status: "found",
				id: fileId(hit),
				link: fileLink(hit)
			});
			if (node.children) {
				const nested = await walk(node.children, path, fileId(hit), out, createMissing, created, cache);
				if (nested) return nested;
			}
		} else {
			out.push({
				path,
				name: node.name,
				status: "missing"
			});
			if (node.children) for (const child of flattenNames(node.children, path)) out.push({
				path: child,
				name: child.split("/").pop() ?? child,
				status: "missing"
			});
		}
	}
	return null;
}
async function inspect(createMissing) {
	const folders = [];
	const created = [];
	const err = await walk(PARA_TREE, "", void 0, folders, createMissing, created, /* @__PURE__ */ new Map());
	if (err) return failFrom(err);
	return {
		ok: true,
		folders,
		created: createMissing ? created : void 0
	};
}
var pingDrive_createServerFn_handler = createServerRpc({
	id: "1e53cadf2a348c9cfb1bd959af2ea5f5416c5f4337cd77dc3a1ef57739df7eed",
	name: "pingDrive",
	filename: "src/lib/drive.ts"
}, (opts) => pingDrive.__executeServer(opts));
var pingDrive = createServerFn({ method: "POST" }).handler(pingDrive_createServerFn_handler, async () => {
	const res = await callDrive(GoogleDriveTools.listFolder, { max_results: 200 });
	if (!res.ok) return failFrom(res);
	const files = filesFrom(res.data).filter(isFolder);
	return {
		ok: true,
		folders: PARA_TREE.map((n) => {
			const hit = pickChild(files, n.name);
			return {
				path: n.name,
				name: n.name,
				status: hit && fileId(hit) ? "found" : "missing",
				id: fileId(hit ?? void 0),
				link: fileLink(hit ?? void 0)
			};
		})
	};
});
var inspectParaDrive_createServerFn_handler = createServerRpc({
	id: "fd8a1e8e72c8dfae791d7bf0d0fe6a01340d19090a0f0637a047901bfe107754",
	name: "inspectParaDrive",
	filename: "src/lib/drive.ts"
}, (opts) => inspectParaDrive.__executeServer(opts));
var inspectParaDrive = createServerFn({ method: "POST" }).handler(inspectParaDrive_createServerFn_handler, async () => inspect(false));
var createParaDrive_createServerFn_handler = createServerRpc({
	id: "1336b58da7d089cff3a03525b76407652f033a865e7ecb4b867b049127f6fc11",
	name: "createParaDrive",
	filename: "src/lib/drive.ts"
}, (opts) => createParaDrive.__executeServer(opts));
var createParaDrive = createServerFn({ method: "POST" }).validator((input) => input).handler(createParaDrive_createServerFn_handler, async ({ data }) => {
	if (!data.confirm) return {
		ok: false,
		error: "Confirme para criar pastas no Drive.",
		folders: []
	};
	return inspect(true);
});
//#endregion
export { createParaDrive_createServerFn_handler, inspectParaDrive_createServerFn_handler, pingDrive_createServerFn_handler };
