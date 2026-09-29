import { useEffect, useRef, useState } from "react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { NoteCard } from "@/components/note-card";
import { ProjectModules } from "@/components/project-modules";
import { packetProgress, asLayers, slugTag, type DistillLayers, type Packet, type ProjectStatus } from "@/lib/types";
import { usePos } from "@/lib/store";

function pid() {
  return `pk-${Math.random().toString(36).slice(2, 9)}`;
}

function PacketsEditor({
  packets,
  onChange,
}: {
  packets: Packet[];
  onChange: (next: Packet[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const title = draft.trim();
    if (!title) return;
    onChange([...packets, { id: pid(), title, done: false }]);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <ul className="grid gap-1">
        {packets.map((p) => (
          <li key={p.id} className="flex items-center gap-2 rounded-md border border-line bg-bg px-3 py-2">
            <input
              type="checkbox"
              checked={p.done}
              onChange={() =>
                onChange(packets.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))
              }
              className="size-4 accent-[var(--forest,#1f5c4a)]"
            />
            <span className={`flex-1 text-sm ${p.done ? "text-subtle line-through" : ""}`}>
              {p.title}
            </span>
            <button
              type="button"
              className="text-xs text-clay"
              onClick={() => onChange(packets.filter((x) => x.id !== p.id))}
            >
              Tirar
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Novo pacote intermediário"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" tone="ghost" onClick={add}>
          Adicionar
        </Button>
      </div>
    </div>
  );
}
