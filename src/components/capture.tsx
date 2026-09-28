import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DriveHint } from "@/components/para-panel";
import { NoteCard } from "@/components/note-card";
import { PARA_BUCKETS, paraLabel, type ParaBucket } from "@/lib/para";
import { NOTE_TAGS, tagLabel, type StudyNote } from "@/lib/types";
import { usePos } from "@/lib/store";
import { Button, Card, Input, Pill, Textarea } from "./ui";

function titleFrom(text: string) {
  const line = text.trim().split("\n")[0] ?? "";
  return line.slice(0, 80) || "Sem título";
}

const CAPTURE_KEY = "norte-os-pending-capture";

function stashCapture(text: string) {
  sessionStorage.setItem(CAPTURE_KEY, text);
}

function takePendingCapture() {
  const value = sessionStorage.getItem(CAPTURE_KEY) ?? "";
  if (value) sessionStorage.removeItem(CAPTURE_KEY);
  return value;
}

export function SecondBrain({
  bucket,
  onBucket,
  onMore,
}: {
  bucket: ParaBucket;
  onBucket: (id: ParaBucket) => void;
  onMore: () => void;
}) {
  const notes = usePos((s) => s.notes);
  const customTags = usePos((s) => s.customTags);
  const addNote = usePos((s) => s.addNote);
  const addTask = usePos((s) => s.addTask);
  const updateNote = usePos((s) => s.updateNote);
  const removeNote = usePos((s) => s.removeNote);
  const noteToTask = usePos((s) => s.noteToTask);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setQuery("");
    setTagFilter("");
  }, [bucket]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      if (n.para !== bucket) return false;
      if (tagFilter && !(n.tags ?? []).includes(tagFilter)) return false;
      if (bucket === "entrada" || !q) return true;
      const hay = `${n.title} ${n.body} ${(n.tags ?? []).map((id) => tagLabel(id, customTags)).join(" ")} ${(n.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [notes, bucket, query, tagFilter, customTags]);

  useEffect(() => {
    if (selected && !visible.some((n) => n.id === selected)) setSelected(null);
  }, [visible, selected]);

  const current = visible.find((n) => n.id === selected) ?? null;
  const hint = PARA_BUCKETS.find((b) => b.id === bucket)?.hint ?? "";

  function afterSend(message: string) {
    setSelected(null);
    setFormKey((k) => k + 1);
    setFlash(message);
    window.setTimeout(() => setFlash(""), 2200);
  }

  return (
    <div className="grid gap-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Segundo cérebro</p>
        <h1 className="font-display text-4xl tracking-tight">Capture. Organize. Lembre.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Método PARA: entrada, projetos, áreas, recursos e arquivo.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {PARA_BUCKETS.map((b) => (
          <Button
            key={b.id}
            type="button"
            tone={bucket === b.id ? "primary" : "ghost"}
            onClick={() => onBucket(b.id)}
          >
            {b.label}
          </Button>
        ))}
        <button
          type="button"
          onClick={onMore}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:bg-bg-warm"
          aria-label="Cursos, portfólio e candidaturas"
          title="Cursos, portfólio e candidaturas"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-subtle">{hint}</p>

      <DriveHint />

      {bucket === "entrada" ? (
        <p className="text-sm text-muted">
          Cadastre uma nota no bloco abaixo e a organize conforme o método PARA
        </p>
      ) : (
        <Card className="grid gap-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por texto ou tag…"
              className="pl-10"
              aria-label="Buscar notas por texto ou tag"
            />
          </label>
          <div className="flex flex-wrap gap-1">
            {[...NOTE_TAGS, ...customTags].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTagFilter((cur) => (cur === t.id ? "" : t.id))}
                className={`rounded-full border px-2 py-1 text-[11px] ${
                  tagFilter === t.id
                    ? "border-forest bg-leaf text-forest-deep"
                    : "border-line text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Card>
      )}

      {flash ? <p className="text-sm text-forest">{flash}</p> : null}

      {bucket === "entrada" ? (
        <ComposeCard
          key={`${formKey}-${current?.id ?? "new"}`}
          note={current}
          onRemove={(id) => {
            removeNote(id);
            setSelected(null);
            setFormKey((k) => k + 1);
          }}
          onTask={(id, draft) => {
            if (id) noteToTask(id);
            else {
              addTask({
                title: titleFrom(draft.title || draft.body),
                notes: draft.body.trim() || draft.title.trim(),
                status: "inbox",
                quadrant: null,
                area: "pessoal",
                energy: "media",
                estimateMin: 30,
                due: null,
              });
            }
            afterSend("Enviado às tarefas");
          }}
          onSend={(id, para, draft) => {
            if (id) {
              updateNote(id, {
                title: draft.title,
                body: draft.body,
                para,
                tags: draft.tags,
              });
            } else {
              addNote({
                title: titleFrom(draft.title || draft.body),
                body: draft.body.trim() || draft.title.trim(),
                para,
                area: null,
                tags: draft.tags,
                projectId: null,
                courseId: null,
              });
            }
            afterSend("Nota enviada");
          }}
        />
      ) : null}

      {bucket !== "entrada" && visible.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Nada em {paraLabel(bucket)}. Capture na Entrada e envie para esta pasta.
          </p>
        </Card>
      ) : null}

      {visible.length > 0 ? (
        <ul className="grid gap-2">
          {visible
            .filter((n) => (bucket === "entrada" ? n.id !== current?.id : true))
            .map((n) => (
              <li key={n.id}>
                {bucket === "entrada" ? (
                  <div className="flex items-start gap-2 rounded-xl border border-line bg-surface px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(n.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        <NoteTags note={n} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{n.body}</p>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line text-ink hover:bg-bg-warm"
                      aria-label="Editar nota"
                      onClick={() => setSelected(n.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line text-clay hover:bg-bg-warm"
                      aria-label="Apagar nota"
                      onClick={() => removeNote(n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <NoteCard
                    note={n}
                    onSave={(patch) => updateNote(n.id, patch)}
                    onRemove={() => removeNote(n.id)}
                  />
                )}
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  );
}

function NoteTags({ note }: { note: StudyNote }) {
  const extra = usePos((s) => s.customTags);
  const ids = note.tags?.length ? note.tags : note.area ? [note.area] : [];
  if (!ids.length) return null;
  return (
    <span className="mt-1 flex flex-wrap gap-1">
      {ids.map((id) => (
        <Pill key={id} tone="forest">{tagLabel(id, extra)}</Pill>
      ))}
    </span>
  );
}

function ComposeCard({
  note,
  onRemove,
  onTask,
  onSend,
}: {
  note: StudyNote | null;
  onRemove: (id: string) => void;
  onTask: (id: string | null, draft: { title: string; body: string }) => void;
  onSend: (
    id: string | null,
    para: ParaBucket,
    draft: { title: string; body: string; tags: string[] },
  ) => void;
}) {
  const customTags = usePos((s) => s.customTags);
  const addCustomTag = usePos((s) => s.addCustomTag);
  const catalog = [...NOTE_TAGS, ...customTags];
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [para, setPara] = useState<ParaBucket | "">("");
  const [tags, setTags] = useState<string[]>(note?.tags ?? (note?.area ? [note.area] : []));
  const [newTag, setNewTag] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (note) return;
    const pending = takePendingCapture();
    if (!pending) return;
    setTitle(titleFrom(pending));
    setBody(pending);
  }, [note]);

  const empty = !title.trim() && !body.trim();

  return (
    <Card className="grid gap-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        aria-label="Título da nota"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="para-compose">
          Pasta PARA
        </label>
        <select
          id="para-compose"
          className="min-h-11 rounded-md border border-line bg-surface px-3 text-sm"
          value={para}
          onChange={(e) => {
            setPara(e.target.value as ParaBucket | "");
            setSendError("");
          }}
        >
          <option value="">Pasta PARA</option>
          {PARA_BUCKETS.filter((b) => b.id !== "entrada").map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
        {note ? (
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-clay hover:bg-bg-warm"
            aria-label="Apagar nota"
            onClick={() => onRemove(note.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div>
        <p className="mb-1 text-xs text-muted">Tags</p>
        <div className="flex flex-wrap gap-1">
          {catalog.map((t) => {
            const on = tags.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setTags((list) =>
                    list.includes(t.id) ? list.filter((id) => id !== t.id) : [...list, t.id],
                  )
                }
                className={`rounded-full border px-2 py-1 text-[11px] ${
                  on ? "border-forest bg-leaf text-forest-deep" : "border-line text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nova tag"
            aria-label="Criar tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const id = addCustomTag(newTag);
                if (id) {
                  setTags((list) => (list.includes(id) ? list : [...list, id]));
                  setNewTag("");
                  setSendError("");
                }
              }
            }}
          />
          <Button
            type="button"
            tone="ghost"
            className="shrink-0 whitespace-nowrap"
            onClick={() => {
              const id = addCustomTag(newTag);
              if (id) {
                setTags((list) => (list.includes(id) ? list : [...list, id]));
                setNewTag("");
                setSendError("");
              }
            }}
          >
            Criar tag
          </Button>
        </div>
      </div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-40"
        placeholder="Escreva a nota…"
        aria-label="Texto da nota"
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <Button
          type="button"
          tone="ghost"
          disabled={empty}
          onClick={() => onTask(note?.id ?? null, { title, body })}
        >
          Mandar às tarefas
        </Button>
        <Button
          type="button"
          disabled={empty}
          onClick={() => {
            if (!para || tags.length === 0) {
              setSendError("Escolha a pasta PARA e ao menos uma tag.");
              return;
            }
            onSend(note?.id ?? null, para, { title, body, tags });
          }}
        >
          Enviar nota
        </Button>
        {sendError ? <p className="text-sm text-clay">{sendError}</p> : null}
      </div>
    </Card>
  );
}

export function CaptureMini() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    stashCapture(text.trim());
    setText("");
    void navigate({ to: "/frentes", search: { aba: "entrada" } });
  }

  return (
    <Card className="grid gap-3">
      <h2 className="font-display text-2xl tracking-tight">Captura rápida</h2>
      <p className="text-sm text-muted">Capture sua ideia antes que ela desapareça da memória</p>
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Minha nota…"
        />
        <button
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-surface hover:bg-forest-deep"
          aria-label="Guardar na Entrada"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>
    </Card>
  );
}
