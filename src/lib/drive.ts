import { createServerFn } from "@tanstack/react-start";
import {
  ConnectorType,
  GoogleDriveTools,
  type CallToolResult,
} from "@/lib/app-data/types";
import { PARA_TREE } from "./para";

export type DriveFolderHit = {
  path: string;
  name: string;
  status: "found" | "missing";
  id?: string;
  link?: string;
};

export type DriveInspect = {
  ok: boolean;
  pending?: boolean;
  loginRequired?: boolean;
  loginUrl?: string;
  error?: string;
  folders: DriveFolderHit[];
  created?: string[];
};

type DriveFile = {
  id?: string;
  file_id?: string;
  folder_id?: string;
  name?: string;
  title?: string;
  mimeType?: string;
  mime_type?: string;
  is_folder?: boolean;
  webViewLink?: string;
  web_view_link?: string;
};

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : {};
}

function filesFrom(data: unknown): DriveFile[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter((x) => x && typeof x === "object") as DriveFile[];
  }
  const rec = asRecord(data);
  if (rec.data && typeof rec.data === "object") {
    const nested = filesFrom(rec.data);
    if (nested.length) return nested;
  }
  const raw =
    rec.items ?? rec.files ?? rec.results ?? rec.folders ?? rec.contents ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.filter((x) => x && typeof x === "object") as DriveFile[];
}

function fileId(f: DriveFile | undefined) {
  if (!f) return undefined;
  return f.id || f.file_id || f.folder_id;
}

function fileName(f: DriveFile) {
  return (f.name || f.title || "").trim();
}

function fileLink(f: DriveFile | undefined) {
  if (!f) return undefined;
  return f.webViewLink || f.web_view_link;
}

function isFolder(f: DriveFile) {
  if (f.is_folder === true) return true;
  const mime = f.mimeType || f.mime_type || "";
  return mime.includes("folder");
}

function sameName(a: string, b: string) {
  return a.localeCompare(b, "pt-BR", { sensitivity: "accent" }) === 0;
}

async function driveMod() {
  return import("@/lib/app-data/client.server.ts");
}

async function callDrive(
  tool: string,
  args: Record<string, unknown>,
): Promise<CallToolResult> {
  const { callTool } = await driveMod();
  return callTool(tool, args, { connectorType: ConnectorType.GoogleDrive });
}

function withParaReturn(url?: string) {
  if (!url) return undefined;
  try {
    const next = new URL(url);
    const ret = next.searchParams.get("return_to");
    if (ret) {
      const dest = new URL(ret);
      dest.pathname = "/frentes";
      dest.searchParams.set("aba", "para");
      next.searchParams.set("return_to", dest.toString());
    }
    return next.toString();
  } catch {
    return url;
  }
}

function failFrom(res: CallToolResult): DriveInspect {
  const raw = (res.errorMessage ?? "").toLowerCase();
  const missing = raw.includes("missing_connector_token");
  return {
    ok: false,
    pending: Boolean(res.pending) && !missing,
    loginRequired: Boolean(res.loginRequired) && !missing,
    loginUrl: withParaReturn(res.loginUrl),
    error: missing
      ? "missing_token"
      : (res.errorMessage ?? "Não foi possível falar com o Drive."),
    folders: [],
  };
}

async function listRoot(): Promise<
  { ok: true; files: DriveFile[] } | { ok: false; err: CallToolResult }
> {
  const res = await callDrive(GoogleDriveTools.listFolder, { max_results: 200 });
  if (!res.ok) return { ok: false, err: res };
  return { ok: true, files: filesFrom(res.data).filter(isFolder) };
}

function pickChild(files: DriveFile[], name: string) {
  return files.find((f) => sameName(fileName(f), name)) ?? null;
}

function hitsFrom(files: DriveFile[]): DriveFolderHit[] {
  return PARA_TREE.map((n) => {
    const hit = pickChild(files, n.name);
    return {
      path: n.name,
      name: n.name,
      status: hit && fileId(hit) ? "found" : "missing",
      id: fileId(hit ?? undefined),
      link: fileLink(hit ?? undefined),
    };
  });
}

async function inspect(createMissing: boolean): Promise<DriveInspect> {
  const listed = await listRoot();
  if (!listed.ok) {
    return failFrom(listed.err);
  }
  const created: string[] = [];
  let files = listed.files;

  if (createMissing) {
    for (const node of PARA_TREE) {
      if (pickChild(files, node.name)) continue;
      const made = await callDrive(GoogleDriveTools.createFolder, {
        folder_name: node.name,
      });
      if (!made.ok) return failFrom(made);
      created.push(node.name);
    }
    if (created.length) {
      const again = await listRoot();
      if (!again.ok) return failFrom(again.err);
      files = again.files;
    }
  }

  return {
    ok: true,
    folders: hitsFrom(files),
    created: createMissing ? created : undefined,
  };
}

export const pingDrive = createServerFn({ method: "POST" }).handler(
  async (): Promise<DriveInspect> => inspect(false),
);

export const inspectParaDrive = createServerFn({ method: "POST" }).handler(
  async (): Promise<DriveInspect> => inspect(false),
);

export const createParaDrive = createServerFn({ method: "POST" })
  .validator((input: { confirm: boolean }) => input)
  .handler(async ({ data }): Promise<DriveInspect> => {
    if (!data.confirm) {
      return { ok: false, error: "Confirme para criar as pastas-mãe.", folders: [] };
    }
    return inspect(true);
  });
