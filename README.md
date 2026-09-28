# Norte OS — Norte for your days

Sistema Operacional Pessoal para gerenciar tempo, comunicação e produtividade com apoio de Inteligência Artificial, desenvolvido para um momento de transição de carreira para a tecnologia.

## 💡 Sobre o projeto

O Norte OS foi desenvolvido como prática do trabalho da disciplina Produtividade e Gestão do Tempo, do curso de Inteligência Artificial e Automação Digital (UniFECAF/Rocketseat).

A proposta da disciplina é construir um Personal Operating System (POS) que integre métodos de produtividade, planejamento, comunicação e cuidado com a saúde mental, apoiado por ferramentas digitais e IA. O Norte OS centraliza agenda, tarefas, foco, copiloto de IA e comunicação em um único fluxo de trabalho.<br/>

## 🎯 O problema

A transição de uma rotina institucional rígida (trabalhava com prazos legais e fluxo predeterminado) para uma rotina autogerenciada trouxe três prioridades simultâneas disputando a mesma agenda:

Formação acadêmica — aulas, leituras e entregas da graduação.
Trilha de programação — prática de código em módulos sequenciais, exercícios de lógica e algoritmos.
Portfólio e prospecção — projetos pessoais, candidaturas e freelas.

O diagnóstico foi sobreposição de frentes sem uma estrutura para decidir, capturar e revisar. Os principais desafios identificados:

- Dispersão entre teoria e prática.
- Priorização falsa entre urgente e importante.
- Fragmentação de ferramentas (tarefas, notas, agenda e arquivos em lugares diferentes).
- Prospecção invadindo os blocos de estudo.
- Revisão sempre para depois.
- Procrastinação disfarçada.

## ✨ Funcionalidades

Módulo
O que faz
Agenda
Time-blocking com separação entre blocos de estudo, exercícios, programação, tarefas em lote e compromissos fixos
Tarefas
Classificação pela Matriz de Eisenhower (Fazer agora · Agendar · Delegar · Eliminar) e quadro Kanban
Foco
Pomodoro vinculado a uma tarefa específica + painel de Hábitos da Semana com metas e acompanhamento diário
Destilar
Sumarização progressiva em quatro camadas para cursos e projetos do portfólio
Expressão / PIs
Organização de cursos e projetos em módulos e pacotes intermediários (tela, README, exercício, trecho de código)
Copiloto (IA)
Resumos de aulas, briefings diários, planos semanais e estruturação de módulos e PIs
Mensagens (IA)
Reescrita de propostas de freela, follow-ups e apresentações profissionais em versão pronta para copiar e colar

## Fluxo

1. Capturar ideia, nota ou tarefa no **Segundo cérebro** (inbox → esclarecer)
2. Eisenhower: código e portfólio no quadrante 2; LinkedIn sem fim no 4
3. Manhã = Pomodoro de prática · tarde = UniFECAF · lote = candidaturas
4. Mover projetos (ideia → GitHub) e leads no **Segundo cérebro**
5. Documentos no **Google Drive** (pastas PARA). Notas de aula no app.
6. Domingo: revisão semanal — sem candidatar nesse bloco

## 🧠 Métodos de produtividade aplicados

Lei de Parkinson — limites rígidos de duração (Pomodoro e time-blocking) e critérios claros de conclusão: um módulo só termina com os exercícios feitos; um projeto só avança com um pacote intermediário funcional.<br/>
Princípio de Pareto (80/20) — foco nos esforços de maior impacto: praticar o módulo vigente, publicar no GitHub e cumprir as entregas acadêmicas.<br/>
Matriz de Eisenhower — quadrantes com nomes operacionais. A categorização é uma decisão consciente.<br/>

Quadrante
Significado
Exemplo
Fazer agora
Urgente e importante
Entrega do POS com prazo na semana
Agendar
Importante, sem urgência
README do portfólio
Delegar
Urgente, pouco importante
Agrupar mensagens e respostas a vagas em um lote único
Eliminar
Nem urgente nem importante
Consumo passivo de conteúdo sem prática


GTD (David Allen) — capturar, esclarecer, organizar, revisar e executar. A captura acontece no app Notas; tarefas acionáveis vão para o Norte OS; conteúdo e referenciais vão para o Drive.

Segundo Cérebro e método PARA (Tiago Forte) — Projetos, Áreas, Recursos e Arquivo organizados no Google Drive, seguindo a metodologia CODE (capturar, organizar, destilar, expressar).

Sumarização progressiva — Camada 0 (material bruto) → Camada 1 (negrito) → Camada 2 (marca-texto) → Camada 3 (resumo executivo).

Pacote intermediário — progresso medido pela entrega do próximo PI concluído, e não pelo projeto finalizado.

Revisão semanal — cerca de meia hora para esvaziar a caixa de entrada e redefinir prioridades do ciclo seguinte.

Regra dos dois minutos — demandas rápidas são resolvidas na hora e não entram na caixa de entrada.

## Ferramentas

- Norte OS (este app) — equivalente a um workspace Notion (bases + dashboard + IA)
- Google Drive com pastas PARA (Áreas, Projetos, Recursos, Arquivo)
- Métodos: GTD, Eisenhower, Pomodoro, PARA, time blocking
- IA Grok: resumir aula, plano da semana, criar PIs, rascunhar proposta
- Referência: "Criando um Segundo Cérebro", Tiago Forte

## 🗂️ Ecossistema: onde mora cada informação
O Norte OS não tenta guardar tudo. Ele convive com ferramentas nativas para evitar duplicidade:

Necessidade
Ferramenta
Papel
Arquivo PARA (pastas)
Google Drive
Projetos, Áreas, Recursos e Arquivo
Conhecimento reunido
App Notas
Captura, destilação e sumarização
Nota curta de contexto
Norte OS
Só o essencial do curso, projeto ou ação
Agenda
Norte OS
Time-blocking e compromissos
Tarefas e prioridade
Norte OS
Matriz de Eisenhower e Kanban
Foco
Norte OS
Pomodoro ligado à tarefa e hábitos da semana
Resumo e plano com IA
Norte OS · Copiloto
Aula, semana, módulos e PIs
Reescrever texto
Norte OS · Mensagens
Versão pronta e formatada para copiar e colar

## 🏗️ Arquitetura

O Norte OS não usa banco de dados remoto. Ele roda direto no navegador e armazena os dados no próprio dispositivo do usuário.<br/>
Essa é uma escolha deliberada para a fase atual de uso pessoal e testes:<br/>
- sem servidores, contas na nuvem ou sincronização entre dispositivos;
- menos configuração, mais validação prática do sistema;
- coerente com o próprio diagnóstico do projeto, que aponta a busca pela "configuração perfeita" como forma de procrastinação.

## 🤖 Inteligência Artificial

A IA funciona como apoio cognitivo: sintetiza conteúdo repetitivo e estrutura rascunhos, mas nunca decide prioridades. As sugestões são analisadas, ajustadas e aplicadas manualmente.<br/>

Copiloto — resumos, briefings, planos semanais, módulos e pacotes intermediários.<br/>
Mensagens — propostas de freela, follow-ups e apresentações para e-mail ou LinkedIn.

## 🚀 Como usar

https://img.shields.io/badge/status-concluído-yellow<br/>
https://img.shields.io/badge/UniFECAF/Rocketseat-Produtividade%20e%20Gest%C3%A3o%20do%20Tempo-blue<br/>

Link app<br/>
*https://norteos-for-your-days.grok.me*<br/>

Depois de abrir o sistema, use o menu para alternar entre Gerar dados de teste e Limpar dados. Os dados ficam no navegador neste momento. 

Navegue pelas telas: Painel, Tarefas, Agenda, Foco, Segundo cérebro, Copiloto, Comunicação.

## Tecnologias: 



## 🖼️ Capturas de tela
imagens das principais telas: Agenda, Tarefas (Eisenhower/Kanban), Foco, Segundo Cérebro, Copiloto e Mensagens.

## 👩‍💻 Autora
Bruna Gabriela Ribeiro Sartor 

Estudante de Inteligência Artificial e Automação Digital — UniFECAF / Rocketseat


Projeto desenvolvido para a disciplina Produtividade e Gestão do Tempo · Agosto/Setembro de 2026





