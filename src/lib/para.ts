import type { ParaBucket } from "./types";

export type { ParaBucket };

export const PARA_BUCKETS: { id: ParaBucket; label: string; hint: string }[] = [
  { id: "entrada", label: "Entrada", hint: "Capture agora, organize depois." },
  { id: "projetos", label: "Projetos", hint: "Tem prazo: começa e termina." },
  { id: "areas", label: "Áreas", hint: "Responsabilidade contínua." },
  { id: "recursos", label: "Recursos", hint: "Referência para consultar." },
  { id: "arquivo", label: "Arquivo", hint: "Concluído, mas recuperável." },
];

export function paraLabel(id: ParaBucket) {
  return PARA_BUCKETS.find((b) => b.id === id)?.label ?? "Entrada";
}

export function asParaBucket(raw?: string): ParaBucket {
  const s = (raw ?? "").toLowerCase();
  if (s.startsWith("entrada") || s === "inbox") return "entrada";
  if (s.startsWith("projeto")) return "projetos";
  if (s.startsWith("área") || s.startsWith("area")) return "areas";
  if (s.startsWith("arquivo")) return "arquivo";
  if (s.startsWith("recurso") || s.includes("/")) return "recursos";
  if (!s) return "entrada";
  return "recursos";
}

export const DRIVE_HOME = "https://drive.google.com/drive/my-drive";

export const PARA_TREE = [
  { name: "Áreas", hint: "Responsabilidades contínuas." },
  { name: "Projetos", hint: "Tem início e fim." },
  { name: "Recursos", hint: "Consulta permanente." },
  { name: "Arquivo", hint: "Inativo, mas recuperável." },
];


export const PARA_WHERE: { kind: string; place: string }[] = [
  { kind: "Ideia ou resumo", place: "Segundo cérebro (esta tela)" },
  { kind: "Tarefa", place: "Tarefas (GTD)" },
  { kind: "PDF ou documento", place: "Google Drive, na pasta PARA correspondente" },
];
