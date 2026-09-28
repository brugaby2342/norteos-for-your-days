//#region node_modules/.nitro/vite/services/ssr/assets/para-BhftVLTd.js
/** Espelho das pastas PARA no Google Drive da Gabriela. */
var PARA_TREE = [
	{
		name: "Áreas",
		hint: "Responsabilidades contínuas, sem data de fim.",
		children: [{
			name: "pessoal",
			hint: "Casa, saúde, rotina fora do trabalho.",
			children: [
				{
					name: "projetos",
					hint: "Projetos da vida pessoal com início e fim."
				},
				{
					name: "recursos",
					hint: "Materiais de consulta da vida pessoal."
				},
				{
					name: "arquivo",
					hint: "O que já não está ativo."
				}
			]
		}, {
			name: "profissional",
			hint: "Transição tech: estudo, vaga, rotina de trabalho.",
			children: [
				{
					name: "projetos",
					hint: "Entregas profissionais com prazo."
				},
				{
					name: "recursos",
					hint: "Modelos, checklists, anotações de ofício."
				},
				{
					name: "arquivo",
					hint: "Ciclos encerrados."
				}
			]
		}]
	},
	{
		name: "Projetos",
		hint: "Tem início e fim. Cada um tem recursos, ok (concluído) e arquivo.",
		children: [
			{
				name: "projeto disciplina atual",
				hint: "POS / Produtividade e Gestão do Tempo (UniFECAF).",
				children: [
					{
						name: "recursos",
						hint: "Aulas, enunciado, prints."
					},
					{
						name: "ok",
						hint: "Versão pronta para entregar."
					},
					{
						name: "arquivo",
						hint: "Rascunhos velhos."
					}
				]
			},
			{
				name: "projeto appbooks",
				hint: "Projeto de portfólio em andamento.",
				children: [
					{
						name: "recursos",
						hint: "Referências e assets."
					},
					{
						name: "ok",
						hint: "Builds e entregas."
					},
					{
						name: "arquivo",
						hint: "Tentativas descartadas."
					}
				]
			},
			{
				name: "projeto storytelling peças",
				hint: "Peças de storytelling no portfólio.",
				children: [
					{
						name: "recursos",
						hint: "Textos, imagens, roteiros."
					},
					{
						name: "arquivo",
						hint: "Versões antigas."
					},
					{
						name: "ok",
						hint: "Peça final."
					}
				]
			}
		]
	},
	{
		name: "Recursos",
		hint: "Temas de interesse — o segundo cérebro de consulta.",
		children: [
			{
				name: "IA",
				hint: "UniFECAF, ferramentas, prompts."
			},
			{
				name: "Programação",
				hint: "Rocketseat, JS, exercícios."
			},
			{
				name: "Conhecimentos gerais e Curiosidades",
				hint: "O que não é projeto nem área."
			}
		]
	},
	{
		name: "Arquivo",
		hint: "Inativo, mas recuperável. Não mistura com o dia a dia."
	}
];
var PARA_WHERE = [
	{
		kind: "Reunião ou aula",
		place: "Agenda no Norte OS + pasta do projeto/área no Drive"
	},
	{
		kind: "Tarefa isolada",
		place: "Tarefas (GTD) no Norte OS"
	},
	{
		kind: "Documento ou PDF",
		place: "Google Drive, na pasta PARA correspondente"
	},
	{
		kind: "Anotação ou resumo",
		place: "Segundo cérebro → Inbox e notas, e Recursos/ no Drive"
	},
	{
		kind: "Ideia solta",
		place: "Inbox do Norte OS; depois esclarecer para Projeto, Tarefa ou Recurso"
	}
];
var DRIVE_HOME = "https://drive.google.com/drive/my-drive";
function driveFolderUrl(id, link) {
	if (link) return link;
	if (id) return `https://drive.google.com/drive/folders/${id}`;
	return DRIVE_HOME;
}
var NOTE_PARA_SLOTS = [
	{
		id: "Recursos/IA",
		label: "Recursos · IA"
	},
	{
		id: "Recursos/Programação",
		label: "Recursos · Programação"
	},
	{
		id: "Recursos/Conhecimentos gerais e Curiosidades",
		label: "Recursos · Conhecimentos gerais"
	},
	{
		id: "Projetos/projeto disciplina atual/recursos",
		label: "Projeto disciplina atual"
	},
	{
		id: "Projetos/projeto appbooks/recursos",
		label: "Projeto appbooks"
	},
	{
		id: "Projetos/projeto storytelling peças/recursos",
		label: "Projeto storytelling peças"
	},
	{
		id: "Áreas/profissional/recursos",
		label: "Área profissional · recursos"
	},
	{
		id: "Áreas/pessoal/recursos",
		label: "Área pessoal · recursos"
	},
	{
		id: "Arquivo",
		label: "Arquivo"
	}
];
//#endregion
export { driveFolderUrl as a, PARA_WHERE as i, NOTE_PARA_SLOTS as n, PARA_TREE as r, DRIVE_HOME as t };
