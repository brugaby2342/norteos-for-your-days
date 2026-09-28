import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy } from "lucide-react";
import { askNorte } from "@/lib/ai";
import { copyFormatted, markdownToHtml, markdownToPlain, ReadyText } from "@/components/md-text";
import { Button, Card, Textarea } from "@/components/ui";

export const Route = createFileRoute("/_app/comunicacao")({ component: Comunicacao });

const TEMPLATES = [
  {
    id: "freela",
    title: "Proposta de freelance",
    text: "Olá, sou a Gabriela. Estou em transição do Cartório de Registro de Imóveis para IA e automação (UniFECAF + Rocketseat). Posso montar a landing do estúdio em HTML/CSS com formulário de contato, em duas semanas, com uma revisão incluída. Valor: a combinar após um briefing de 20 min. Faz sentido conversarmos?",
  },
  {
    id: "follow",
    title: "Follow-up",
    text: "Oi, passo para retomar a proposta da landing. Continuo disponível esta semana para o briefing de 20 min. Se o momento não for agora, sem problema — me avise e eu fecho o assunto.",
  },
  {
    id: "vaga",
    title: "Apresentação para vaga",
    text: "Olá. Venho de uns anos em Cartório (prazos, conferência, processo) e estou me formando em IA e Automação Digital, com prática de programação na Rocketseat. Busco uma vaga júnior/assistente em automação ou operação. Posso enviar um PDF com dois projetos (to-do e o POS da disciplina)?",
  },
  {
    id: "limite",
    title: "Proteger o bloco de estudo",
    text: "Recebi o convite para a call hoje às 18h. Não vou conseguir sem abrir mão de minha agenda. Posso mandar um resumo escrito amanhã no fim da manhã?",
  },
];

export function Comunicacao() {
  const ask = useServerFn(askNorte);
  const [draft, setDraft] = useState(TEMPLATES[0].text);
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function polish() {
    setBusy(true);
    setError("");
    try {
      const res = await ask({ data: { kind: "mensagem", context: draft } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOut(res.text);
      setCopied(false);
    } catch {
      setError("A IA não respondeu. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function copyReady() {
    if (!out) return;
    await copyFormatted(markdownToHtml(out), markdownToPlain(out));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Mensagens</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A IA ajusta o tom da sua mensagem para fins profissionais e de carreira
        </p>
      </header>

      <div className="grid gap-3">
        <p className="text-sm text-muted">Abaixo, exemplos de mensagens para testes.</p>
        <div className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            className="rounded-xl border border-line bg-surface p-4 text-left hover:bg-bg-warm"
            onClick={() => setDraft(t.text)}
          >
            <p className="text-sm font-medium">{t.title}</p>
            <p className="mt-1 line-clamp-3 text-xs text-muted">{t.text}</p>
          </button>
        ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="grid gap-3">
          <h2 className="font-display text-2xl tracking-tight">Rascunho</h2>
          <p className="text-sm text-muted">Digite sua mensagem</p>
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="min-h-48" />
          <Button
            type="button"
            disabled={busy || !draft.trim()}
            onClick={() => {
              void polish();
            }}
          >
            {busy ? "Reescrevendo…" : "Reescrever com IA"}
          </Button>
          {busy ? (
            <p className="text-sm text-muted">Aguarde. A resposta pode demorar um pouco.</p>
          ) : null}
          {error ? <p className="text-sm text-clay">{error}</p> : null}
        </Card>
        <Card className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl tracking-tight">Versão pronta</h2>
            <Button type="button" tone="ghost" disabled={!out} onClick={() => void copyReady()}>
              <Copy className="h-4 w-4" />
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          {out ? (
            <ReadyText text={out} />
          ) : (
            <p className="text-sm text-muted">
              Copie para o e-mail, WhatsApp ou formulário de inscrições de vagas.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
