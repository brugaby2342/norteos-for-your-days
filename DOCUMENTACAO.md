# Norte OS — documentação funcional

Norte OS é um sistema operacional pessoal executado no navegador. Foi concebido como o artefato prático da disciplina de Produtividade e Gestão do Tempo e, ao mesmo tempo, como ferramenta de uso diário na transição de carreira: da rotina de cartório para estudo, prática de código, portfólio e comunicação profissional.

O aplicativo não pretende substituir o gerenciador de arquivos, o aplicativo de notas longo nem a caixa de e-mail. Ele concentra o que precisa estar à mão no mesmo dia: capturar, decidir, proteger o foco, acompanhar curso e projeto, e pedir apoio de linguagem à IA. O restante permanece onde já funciona — pastas PARA no Google Drive, destilação longa no aplicativo de Notas, automatizações pontuais em outras ferramentas.

Os dados ficam no próprio dispositivo (armazenamento local do navegador). Não há banco de dados remoto nesta versão. O estado inicial é vazio. O rodapé do menu oferece um único botão que alterna entre gerar dados de demonstração e limpar o que estiver gravado, de modo que um avaliador possa percorrer o sistema preenchido ou começar do zero.

---

## Princípios que o produto implementa

O desenho das telas segue um ciclo curto, repetível.

**Capturar.** Tudo que aparece — ideia, trecho de aula, compromisso, vaga — entra primeiro numa caixa de entrada. Nada precisa nascer já classificado.

**Decidir.** A Matriz de Eisenhower separa o que é urgente e importante do que apenas parece urgente. O quadro Kanban acompanha o andamento depois que a decisão foi tomada.

**Organizar.** O método PARA (projetos, áreas, recursos e arquivo) estrutura as notas no Segundo cérebro. As frentes do dia a dia são tags: Estudos, Curiosidades, Portfólio, LinkedIn e Pessoal. UniFECAF e Rocketseat existem como instituições de curso, não como frentes.

**Destilar.** Em curso e em projeto do portfólio, a sumarização progressiva percorre quatro camadas: texto bruto, negrito, destaque e resumo executivo. As camadas 1 e 2 são feitas sobre o texto da camada 0.

**Expressar.** O trabalho grande é quebrado em pacotes intermediários. Cada pacote é um bloco concreto o bastante para receber feedback antes do próximo.

**Proteger o foco.** Pomodoro, time blocking e hábitos de saúde mental reduzem a carga de decidir o óbvio, para sobrar atenção ao que exige cabeça.

A rotina prevista nos dados de teste trata a manhã como janela de leitura e videoaula e a tarde como janela de exercício e prática de código. LinkedIn e lote de mensagens não competem com o bloco de estudo.

---

## Menu e persistência

O menu lateral percorre Painel, Tarefas, Agenda, Foco, Segundo cérebro, Copiloto e Mensagens. Cursos, portfólio e candidaturas ficam dentro do Segundo cérebro, acessíveis pelo atalho `+` ao lado das pastas PARA.

No rodapé, o botão único muda de rótulo conforme o estado. Com o aplicativo vazio, lê-se **Gerar dados de teste**. Depois de gerar, passa a **Limpar dados**. Gerar preenche o sistema com uma demonstração coerente (tarefas, agenda, cursos, projetos, hábitos e notas). Limpar devolve o aplicativo ao estado em branco, sem apagar o código.

---

## Painel

O painel é o ponto de chegada. Mostra o título **Bons estudos!**, a captura rápida (que envia o texto para o bloco de envio do Segundo cérebro), indicadores da semana e o que está em curso.

Os cartões de curso e de portfólio listam apenas o que ainda está em andamento. Um curso some do painel quando todos os módulos foram marcados como feitos. Um projeto de portfólio aparece somente com o status **Em progresso**; ideia e publicado no GitHub permanecem na gestão de projetos, não no resumo do dia.

Cada curso em andamento exibe instituição, percentual, módulo atual e o atalho **Entrar no curso**. Cada projeto em andamento exibe pilha, resultado esperado, próxima ação e **Entrar no projeto**. Abaixo, o gráfico da semana cruza tarefas concluídas e hábitos cumpridos. A coluna **Hoje na agenda** lista os blocos do dia, inclusive os que foram gravados sem horário de término.

---

## Tarefas

A guia se divide em **Matriz de Eisenhower** e **Quadro Kanban**.

Na matriz, cada quadrante corresponde a uma decisão: fazer agora, agendar, delegar ou eliminar. O cartão da tarefa mostra frente, energia e a quantidade de focos já registrados. O atalho **focar** abre a tela Foco já associada àquela tarefa. Uma sessão de Pomodoro iniciada a partir daí incrementa o contador no cartão.

No Kanban, as colunas seguem a ordem caixa de entrada, aguardando, em foco e concluído. Tarefas enviadas de outras telas (captura, pacote intermediário, nota) chegam na caixa de entrada sem quadrante, para que a classificação aconteça aqui: frente, energia, contexto e quadrante.

Novas tarefas podem ser cadastradas no formulário da própria tela. A frente padrão é Estudos.

---

## Agenda

A agenda distingue dois tipos de item.

**Time blocking** usa um conjunto fechado: estudo, exercícios, código, aula e lote (vagas, mensagens e e-mails). Pomodoro não entra nessa lista porque já vive em Foco.

**Compromisso** aceita texto livre — reunião, dentista, qualquer compromisso pessoal.

O formulário pede dia, início, fim e descrição. A opção **Sem fim** desativa o horário de término. Depois de agendar, o formulário é limpo.

O calendário semanal rola para a esquerda e revela as semanas seguintes. O cartão de cada item mostra o nome, se é time blocking ou compromisso (e o tipo do bloco), o intervalo ou a indicação “sem fim”, e a descrição preenchida.

---

## Foco

A tela reúne o timer Pomodoro, o vínculo com uma tarefa específica e os hábitos da semana.

Iniciar um Pomodoro já conta a sessão como feita. Não é necessário esperar o tempo acabar. Como a sessão registra uma vez por carregamento da página, um aviso informa que, para registrar outra rodada, é preciso atualizar a página.

Quando o Pomodoro parte de uma tarefa, o foco é somado no cartão correspondente em Tarefas.

A seção de hábitos não estende a tela além do necessário. Cada hábito tem meta semanal e uma fileira de pontos dos sete dias. Os hábitos de demonstração tratam de saúde mental (horário de sono, pausa sem tela, caminhada ou alongamento, um minuto em silêncio antes de estudar). A citação de James Clear, destacada em *Building a Second Brain*, permanece visível como lembrete do porquê o hábito existe: reduzir carga cognitiva para liberar atenção.

---

## Segundo cérebro

Esta é a camada PARA do aplicativo. As abas superiores percorrem Entrada, Projetos, Áreas, Recursos e Arquivo. O atalho `+` abre Cursos, Portfólio e Candidações.

### Captura e envio

A captura rápida existe somente no Painel. O que for escrito ali chega ao bloco de envio do Segundo cérebro. A Entrada não repete o campo de busca nem a captura rápida: nela se classifica o que já entrou.

No bloco de envio, a nota só segue quando o usuário pressiona um dos botões. Selecionar a pasta PARA não dispara o envio sozinho.

- **Enviar nota** exige pasta PARA e tag (frente). A nota vai direto para a pasta escolhida, já como nota, sem passar de novo pelo quadro de classificação.
- **Mandar às tarefas** ignora pasta e tag se estiverem preenchidas. A tarefa nasce na caixa de entrada, sem quadrante, para ser classificada em Tarefas.

Depois do envio, o formulário abre em branco.

As tags substituíram as antigas “frentes” como eixo de classificação. É possível criar tag nova. Notas de aula de curso não usam UniFECAF ou Rocketseat como tag de frente: essas instituições aparecem só no cadastro do curso. As notas pesquisáveis por tag permanecem nas pastas PARA.

Cada nota pode ser editada ou excluída. Nas notas da pasta **Projetos**, um seletor envia a nota a um curso específico ou a um projeto do portfólio. A nota continua na pasta e passa a aparecer também na página daquele curso ou projeto.

### Cursos

O cadastro pede nome, instituição em texto livre e a lista de módulos. A instituição admite, entre outras, UniFECAF (faculdade), Rocketseat (cursos) e qualquer outra plataforma.

Na página do curso — cujo título é o nome do curso, não um rótulo genérico — o trabalho segue o ciclo CODE.

**Organizar.** Resultado esperado, prazo, módulos na ordem do cronograma. Cada módulo pode ser editado, reordenado (subir e descer) ou removido. **Módulo feito** e **Desfazer** avançam ou recuam o ponteiro do módulo atual. O painel mostra só o módulo atual; a lista completa vive nesta página.

**Destilar.** Quatro camadas de sumarização progressiva. A caixa de texto editável está nas camadas 0 e 3. As camadas 1 e 2 explicam o gesto (negrito e destaque) e o trabalho acontece sobre o texto da camada 0.

**Expressar.** Pacotes intermediários com conclusão por caixa de seleção, edição, reordenação e exclusão. O botão **Tarefa** envia aquele pacote para a caixa de entrada de Tarefas, sem classificá-lo. O pacote permanece na lista do curso.

As notas capturadas nesta página ficam ligadas ao curso.

### Portfólio

O cadastro de projeto pede nome, pilha e status (ideia, em progresso, no GitHub). A página do projeto replica o mesmo ciclo CODE do curso, adaptado ao contexto de entrega: resultado, prazo, destilação e pacotes intermediários, com as mesmas ações de editar, reordenar, excluir e transformar PI em tarefa.

Notas da página ficam ligadas ao projeto. O painel lista apenas os que estão em progresso.

### Candidações

O funil percorre prospectar, enviado, follow-up, entrevista e encerrado. Não existe fase “fechado”. Ao cadastrar a vaga, o campo de descrição e contexto nasce em branco. Um ícone e um texto no formulário deixam claro que essa descrição pode ser preenchida depois, durante o processo. No cartão, o texto aparece integrado; um clique abre a caixa, Enter devolve o texto ao cartão.

Em cada cartão é possível avançar ou voltar para qualquer etapa que não seja a atual, respeitando a ordem do funil.

---

## Copiloto

O Copiloto concentra pedidos pontuais à IA: briefing do dia, priorização, plano da semana, notas de aula, escolha de backlog e planejamento de módulos e pacotes intermediários.

As respostas saem formatadas (títulos, listas, negrito) e prontas para copiar. Enquanto a IA processa, um aviso pede para aguardar. Depois do envio, o formulário é limpo.

O histórico fica somente nesta tela. Cada item pode ser expandido, copiado ou excluído. A resposta não é enviada ao Segundo cérebro.

A opção **Planejar módulos e PIs** devolve um plano em linguagem simples e, por baixo, um bloco estruturado que o botão **Aplicar** usa para gravar resultado, módulos e pacotes no curso ou no projeto escolhido. Esse bloco técnico não aparece no texto visível nem na cópia.

As instruções da IA privilegiam clareza. Não mencionam vaga, candidatura ou lote quando o pedido não for sobre isso. A hipótese de rotina usada no plano da semana é a mesma do sistema: manhã para leitura e videoaula, tarde para exercício e prática de código.

---

## Mensagens

A tela reescreve um rascunho em tom profissional. O resultado aparece em **Versão pronta**, formatado, sem emoji. O botão **Copiar** leva o texto já formatado para a área de transferência, de modo que a colagem preserve parágrafos e ênfase.

Enquanto a IA trabalha, o mesmo aviso de espera da tela Copiloto é exibido.

---

## O que o Norte OS não faz — de propósito

Não há conta, sincronização em nuvem nem banco de dados nesta versão. Fechar o navegador não apaga os dados do dispositivo; outro navegador ou outro aparelho começa vazio.

Não há integração com Google Drive. A classificação PARA no Drive permanece uma prática do usuário, fora do aplicativo.

As notas longas e a destilação de artigos inteiros continuam no aplicativo de Notas. O Norte OS guarda a nota curta ligada ao curso, ao projeto ou à pasta PARA do dia.

Automatizações de briefing de notícias, resumo de e-mail e gestão de LinkedIn ficam nas ferramentas que já as executam. O Copiloto e a tela Mensagens cobrem só o que precisa ser escrito ou planejado agora.

---

## Como começar

1. Abra o aplicativo. Ele nasce em branco.
2. Use **Gerar dados de teste** se quiser percorrer um dia já povoado, ou ignore o botão e cadastre o próprio material.
3. Capture uma frase no Painel. Classifique-a no Segundo cérebro como nota ou como tarefa.
4. Crie um curso com instituição e módulos, ou um projeto de portfólio com resultado e pacotes.
5. Proteja um bloco na Agenda e inicie um Pomodoro em Foco.
6. Peça ao Copiloto o plano da semana ou o desenho dos módulos quando quiser um rascunho para aplicar — e revise antes de aceitar.

O sistema está pronto quando a próxima ação do dia cabe numa tela só, sem reabrir a cabeça inteira.
