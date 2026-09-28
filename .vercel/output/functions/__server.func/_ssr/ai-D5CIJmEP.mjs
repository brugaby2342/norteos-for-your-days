import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-D5CIJmEP.js
var SYSTEM = `Você é o copiloto do Norte OS, Sistema Operacional Pessoal da Gabriela para transição de carreira em tecnologia.
Contexto dela: saiu do Cartório de Registro de Imóveis (rotina rígida, prazos, processos) e agora autogerencia três frentes — UniFECAF (IA e Automação Digital), Rocketseat (programação do zero) e portfólio + prospecção de vagas/freelas.
Responda SEMPRE em português brasileiro, concreta, curta e acionável.
Nunca misture “estudar” com “aplicar pra vaga” no mesmo bloco.
Proteja sono e pausas. Prefira prática de código a consumo passivo de aula.
Quando sugerir tarefas, use títulos curtos e uma das áreas: unifecaf, rocketseat, portfolio, candidaturas, pessoal.`;
function userPrompt(kind, context) {
	switch (kind) {
		case "briefing": return `Briefing do dia (máx. 180 palavras): 1) uma prioridade UniFECAF, uma Rocketseat e no máximo uma de candidatura, 2) risco de dispersão teoria vs prática vs vaga, 3) um gesto de bem-estar. Contexto:\n${context}`;
		case "priorizar": return `Decida com Eisenhower: nesta manhã ela deve terminar aula, praticar código ou aplicar pra vaga? Justifique em 3 linhas e liste as 3 próximas ações. Contexto:\n${context}`;
		case "mensagem": return `Reescreva em tom profissional, humano e direto — proposta de freelance, follow-up ou apresentação de candidatura. Entregue versão final + alternativa curta. Texto:\n${context}`;
		case "plano": return `Plano da semana para transição tech: manhã = prática (Rocketseat/portfólio), tarde = UniFECAF, um lote de candidaturas (não diário), revisão no domingo, 2 pausas protegidas. Contexto:\n${context}`;
		case "captura": return `Transforme o texto em tarefas. SOMENTE JSON válido: {"tasks":[{"title":"...","notes":"...","quadrant":"urgente-importante|importante|urgente|nenhum","area":"unifecaf|rocketseat|portfolio|candidaturas|pessoal"}]}. Texto:\n${context}`;
		case "aula": return `Resuma a aula em notas de estudo (máx. 220 palavras): 1) ideia central, 2) 3 pontos, 3) um exercício prático de 25 min. Linguagem simples, iniciante em programação. Texto da aula:\n${context}`;
		case "backlog": return `Priorize o backlog de portfólio e ideias. Escolha 1 projeto da semana, 1 da quinzena e o que esperar. Ligue com o conhecimento de Cartório quando fizer sentido. Contexto:\n${context}`;
	}
}
var askNorte_createServerFn_handler = createServerRpc({
	id: "2351871cabd9c4301872e24b3b2456ed050a845258de81ee0a7206e42a78689d",
	name: "askNorte",
	filename: "src/lib/ai.ts"
}, (opts) => askNorte.__executeServer(opts));
var askNorte = createServerFn({ method: "POST" }).validator((input) => input).handler(askNorte_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "A IA não está disponível neste ambiente."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 700,
			temperature: .4,
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: userPrompt(data.kind, data.context).slice(0, 6e3)
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Falha na IA (${res.status}). Tente de novo.`
	};
	return {
		ok: true,
		text: (await res.json()).choices?.[0]?.message?.content ?? ""
	};
});
//#endregion
export { askNorte_createServerFn_handler };
