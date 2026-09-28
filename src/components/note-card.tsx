import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { NOTE_TAGS, tagLabel, type StudyNote } from "@/lib/types";
import { usePos } from "@/lib/store";
import { Button, Input, Pill, Textarea } from "./ui";

export function NoteCard({
  note,
  onSave,
  onRemove,
}: {
  note: StudyNote;
  onSave: (patch: { title: string; body: string; tags: string[] }) => void;
  onRemove: () => void;
}) {
  const extra = usePos((s) => s.customTags);
  const catalog = [...NOTE_TAGS, ...extra];
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [tags, setTags] = useState<string[]>(note.tags ?? []);

  function start() {
    setTitle(note.title);
    setBody(note.body);
    setTags(note.tags ?? []);
    setEditing(true);
  }

  function save() {
    onSave({
      title: title.trim() || "Sem título",
      body: body.trim(),
      tags,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="grid gap-2 rounded-xl border border-line bg-surface px-4 py-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Título" />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-28"
          aria-label="Texto da nota"
        />
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
                  on ? "border-forest bg-leaf text-forest-deep" : "border-line text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={save}>
            Salvar
          </Button>
          <Button type="button" tone="ghost" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{note.title}</p>
          {(note.tags ?? []).length ? (
            <span className="mt-1 flex flex-wrap gap-1">
              {note.tags.map((id) => (
                <Pill key={id} tone="forest">
                  {tagLabel(id, extra)}
                </Pill>
              ))}
            </span>
          ) : null}
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{note.body}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink hover:bg-bg-warm"
            aria-label="Editar nota"
            onClick={start}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-clay hover:bg-bg-warm"
            aria-label="Apagar nota"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
