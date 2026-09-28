import { createServerFn } from "@tanstack/react-start";

type AskInput = {
  kind: "briefing" | "priorizar" | "mensagem" | "plano" | "aula" | "backlog" | "modulos";
  context: string;
};

const SYSTEM = `Você é o copiloto do Norte OS, Sistema Operacional Pessoal da Gabriela.
Ela saiu do Cartório de Registro de Imóveis e estuda UniFECAF (IA e Automação Digital), Rocketseat e portfólio.
Escreva em português brasileiro, claro, simples e objetivo. Frases curtas. Uma ideia por frase.
Use só palavras comuns e corretas. Se citar Parkinson, Pareto ou Eisenhower, explique em uma frase simples.
Nunca invente verbo (não escreva “inchá”). Parkinson: o trabalho se expande até ocupar o tempo disponível.
Quando o assunto for programar, escreva “prática de código”, não só “código”.
Horário: “de manhã” e “à tarde”. Não escreva “na tarde”.
Sem emoji. Sem aviso no final. Sem repetir a mesma recomendação.
Formatação:
- Título curto em linha própria, com ##.
- Parágrafos separados por linha em branco.
- Lista com um item por linha, começando com hífen.
- **Negrito** só no termo principal.
Assuntos padrão: estudo, prática de código, portfólio e pausa.
De manhã: leitura e videoaula. À tarde: exercícios e prática de código.
Não fale de vaga, candidatura, LinkedIn, lote de mensagens nem “não se candidatar”, a menos que o texto da pessoa seja sobre uma vaga, entrevista ou inscrição. Se não for o assunto, não use essas palavras.`;

function userPrompt(kind: AskInput["kind"], context: string) {
  const claro =
    "Seja direta. Sem seção extra. Não feche o texto falando de vaga ou de não se candidatar.";
  switch (kind) {
    case "briefing":
      return `Briefing do dia, curto. Só estas partes, uma frase cada:
## Manhã
leitura ou videoaula
## Tarde
exercício ou prática de código
## Risco
o que pode dispersar o estudo ou a prática
## Pausa
um gesto de bem-estar
Não crie seção de candidaturas. ${claro}
Contexto:\n${context}`;
    case "priorizar":
      return `Decida com a Matriz de Eisenhower: nesta janela, estudar a aula ou fazer prática de código? Três frases no máximo e três próximas ações. ${claro}
Contexto:\n${context}`;
    case "mensagem":
      return `Reescreva em tom profissional, humano e direto. Sem enrolação.
## Versão final
A mensagem pronta, em parágrafos curtos.
## Alternativa curta
A mesma mensagem, mais breve.
Texto:\n${context}`;
    case "plano":
      return `Plano da semana, objetivo. De manhã: leitura e videoaula. À tarde: exercícios e prática de código. Domingo: revisão. Inclua duas pausas. Um bloco por dia, em lista. ${claro}
Contexto:\n${context}`;
    case "aula":
      return `Notas da aula, linguagem simples, no máximo 180 palavras.
## Ideia central
uma frase
## Três pontos
três itens, cada um com o nome do conceito e o que ele significa
## Exercício de 25 min
passos numerados, com tempo. Quando falar de programar, escreva “prática de código”.
Pare no exercício. ${claro}
Texto da aula:\n${context}`;
    case "backlog":
      return `Escolha 1 projeto desta semana, 1 da quinzena e o que deixar para depois. Uma frase cada. ${claro}
Contexto:\n${context}`;
    case "modulos":
      return `Planeje o curso ou projeto em linguagem simples.
## Resultado
uma frase do que fica pronto
## Módulos
5 a 8 passos curtos, em ordem
## Pacotes intermediários
4 a 6 entregas pequenas (exercício, print, trecho de prática de código ou README)
${claro}
No final, um único bloco json, sem comentário:
\`\`\`json
{"outcome":"...","modules":["..."],"packets":["..."]}
\`\`\`
Contexto:\n${context}`;
  }
}

export const askNorte = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "A IA não está disponível neste ambiente." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 900,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt(data.kind, data.context).slice(0, 6000) },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `Falha na IA (${res.status}). Tente de novo.` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return { ok: true as const, text: body.choices?.[0]?.message?.content ?? "" };
  });
