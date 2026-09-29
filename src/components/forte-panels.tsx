import { useEffect, useRef, useState } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { type DistillLayers, type Packet } from "@/lib/types";

export function pid() {
  return `pk-${Math.random().toString(36).slice(2, 9)}`;
}

export function PacketsEditor({
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

function markupToHtml(src: string) {
  const html = src
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/==([^=\n]+)==/g, "<mark>$1</mark>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
  return html;
}

function htmlToMarkup(html: string) {
  let out = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>\s*<div>/gi, "\n")
    .replace(/<\/?div>/gi, "")
    .replace(/<\/?span[^>]*>/gi, "")
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "");
  for (let i = 0; i < 4; i += 1) {
    out = out
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<mark>([\s\S]*?)<\/mark>/gi, "==$1==");
  }
  return out
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/^\n/, "");
}

function RawLayer({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    const html = markupToHtml(value);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [value]);

  function publish() {
    const el = ref.current;
    if (!el) return;
    onChange(htmlToMarkup(el.innerHTML));
  }

  function apply(kind: "bold" | "mark") {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) return;
    const wrap = document.createElement(kind === "bold" ? "strong" : "mark");
    try {
      range.surroundContents(wrap);
    } catch {
      wrap.appendChild(range.extractContents());
      range.insertNode(wrap);
    }
    sel.removeAllRanges();
    publish();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          tone="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply("bold")}
        >
          Negrito
        </Button>
        <Button
          type="button"
          tone="ghost"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply("mark")}
        >
          Marca-texto
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Camada 0, material bruto"
        data-placeholder="Cole a aula, o artigo ou as anotações."
        className="min-h-28 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-forest empty:before:text-subtle empty:before:content-[attr(data-placeholder)] [&_mark]:rounded-sm [&_mark]:bg-[#f3e2a0] [&_mark]:px-0.5 [&_strong]:font-semibold"
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          publish();
        }}
        onInput={publish}
      />
      <p className="text-xs text-subtle">
        Selecione um trecho e use Negrito ou Marca-texto.
      </p>
    </div>
  );
}

export function DistillPanel({
  layers,
  onChange,
}: {
  layers: DistillLayers;
  onChange: (next: DistillLayers) => void;
}) {
  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl tracking-tight">Destilar</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Sumarização progressiva para refinar e destilar informações em camadas cada vez menores,
          facilitando a consulta futura
        </p>
      </div>
      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 0 · Material bruto</span>
        <span className="text-xs text-subtle">O texto original.</span>
        <RawLayer value={layers.raw} onChange={(raw) => onChange({ ...layers, raw })} />
      </div>
      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 1 · Destaque em negrito</span>
        <p className="text-sm leading-relaxed text-muted">
          Selecione no material bruto só o que importa e toque em Negrito.
        </p>
      </div>
      <div className="grid gap-1">
        <span className="text-sm font-medium">Camada 2 · Destaque marca-texto</span>
        <p className="text-sm leading-relaxed text-muted">
          Do que já está em negrito, selecione apenas o que você vai consultar de novo e toque em
          Marca-texto.
        </p>
      </div>
      <label className="grid gap-1">
        <span className="text-sm font-medium">Camada 3 · Resumo executivo</span>
        <span className="text-xs text-subtle">Poucas frases. É o que sobra para consultar depois.</span>
        <Textarea
          value={layers.summary}
          onChange={(e) => onChange({ ...layers, summary: e.target.value })}
          placeholder="O resumo que você leria daqui a um mês."
        />
      </label>
    </Card>
  );
}

export function ExpressPanel({
  packets,
  onChange,
}: {
  packets: Packet[];
  onChange: (next: Packet[]) => void;
}) {
  return (
    <Card className="grid gap-3">
      <h2 className="font-display text-2xl tracking-tight">
        Expressar · Pacotes intermediários (PIs)
      </h2>
      <p className="text-sm leading-relaxed text-muted">
        Os PIs são os blocos de construção concretos e individuais que compõem seu trabalho. Você
        cria apenas um pequeno bloco de construção de cada vez e obtém as considerações externas
        antes de seguir em frente.
      </p>
      <PacketsEditor packets={packets} onChange={onChange} />
    </Card>
  );
}

export function ModuleAdder({ onAdd }: { onAdd: (title: string) => void }) {
  const [draft, setDraft] = useState("");
  function add() {
    const title = draft.trim();
    if (!title) return;
    onAdd(title);
    setDraft("");
  }
  return (
    <div className="flex gap-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Novo módulo"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
      />
      <Button type="button" tone="ghost" onClick={add}>
        Adicionar módulo
      </Button>
    </div>
  );
}

export function ProjectNoteComposer({
  onAdd,
}: {
  onAdd: (title: string, body: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const empty = !title.trim() && !body.trim();
  return (
    <div className="grid gap-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da nota" />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Capturar ideia, trecho, decisão…"
        className="min-h-24"
      />
      <Button
        type="button"
        disabled={empty}
        onClick={() => {
          onAdd(title.trim() || body.trim().split("\n")[0] || "Sem título", body.trim());
          setTitle("");
          setBody("");
        }}
      >
        Guardar nota
      </Button>
    </div>
  );
}
