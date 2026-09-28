const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, LevelFormat, VerticalAlign,
} = require("docx");
const fs = require("fs");

const GREEN = "1F5C4A";
const INK = "1C1916";
const MUTED = "5C564E";
const LINE = "D8D0C2";
const LEAF = "E8F0EC";
const CREAM = "FAF7F1";

const pageW = 11906;
const margin = 1134; // 2 cm
const contentW = pageW - margin * 2; // 9638

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };

function r(text, opts = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: opts.size ?? 22,
    bold: opts.bold ?? false,
    italics: opts.italics ?? false,
    color: opts.color ?? INK,
  });
}

function p(children, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 200, before: opts.before ?? 0, line: 276 },
    alignment: opts.align ?? AlignmentType.JUSTIFIED,
    ...opts.extra,
    children: Array.isArray(children) ? children : [r(children)],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GREEN, space: 4 } },
    children: [r(text, { size: 28, bold: true, color: GREEN })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [r(text, { size: 24, bold: true, color: GREEN })],
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [r(text)],
  });
}

function cell(text, width, opts = {}) {
  const fill = opts.fill ?? "FFFFFF";
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: opts.align ?? AlignmentType.LEFT,
        children: [r(text, { bold: opts.bold, size: opts.size ?? 20, color: opts.color ?? INK })],
      }),
    ],
  });
}

function table(headers, rows, widths) {
  const head = new TableRow({
    children: headers.map((h, i) =>
      cell(h, widths[i], { fill: GREEN, bold: true, color: "FFFFFF", size: 18 }),
    ),
  });
  const body = rows.map((row, ri) =>
    new TableRow({
      children: row.map((c, i) =>
        cell(c, widths[i], { fill: ri % 2 === 0 ? CREAM : "FFFFFF", size: 18 }),
      ),
    }),
  );
  return new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: widths,
    rows: [head, ...body],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: GREEN },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GREEN },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "desafios",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1360, left: 1134 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [r("UniFECAF  ·  Produtividade e Gestão do Tempo", { size: 16, color: MUTED, italics: true })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                r("Gabriela Sartor  ·  Parte teórica  ·  p. ", { size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [r("CENTRO UNIVERSITÁRIO UniFECAF", { size: 20, bold: true, color: GREEN })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [r("Curso de Inteligência Artificial e Automação Digital", { size: 20, color: MUTED })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 360 },
          children: [r("Disciplina: Produtividade e Gestão do Tempo", { size: 20, color: MUTED })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [r("PARTE TEÓRICA — ANÁLISE E DISCUSSÃO", { size: 18, bold: true, color: GREEN })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, line: 276 },
          children: [
            r("Meu Sistema Operacional Pessoal:", { size: 32, bold: true, color: INK }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 360, line: 276 },
          children: [
            r("utilizando IA para gerenciar tempo, comunicação e produtividade", { size: 26, italics: true, color: MUTED }),
          ],
        }),
        p([
          r("Aluna: ", { bold: true }),
          r("Gabriela Sartor"),
        ], { align: AlignmentType.CENTER, after: 40 }),
        p([
          r("Sistema prático associado: ", { bold: true }),
          r("Norte OS (Personal Operating System)"),
        ], { align: AlignmentType.CENTER, after: 40 }),
        p("Setembro de 2026", { align: AlignmentType.CENTER, after: 400 }),

        h1("1. Introdução"),
        p("O enunciado da disciplina afirma que um dos maiores desafios enfrentados por profissionais de tecnologia não é a falta de conhecimento técnico, mas a dificuldade em organizar demandas, priorizar atividades, comunicar-se com clareza e manter equilíbrio entre produtividade e bem-estar. Essa formulação descreve o momento em que escrevo este trabalho: saí de uma rotina institucional rígida e passei a uma rotina autogerenciada, em que estudo, prática de código, portfólio e prospecção competem pelo mesmo calendário."),
        p("A missão proposta é construir um Sistema Operacional Pessoal (Personal Operating System — POS) que integre métodos de produtividade, planejamento, comunicação e acompanhamento de hábitos, com apoio de ferramentas digitais e de Inteligência Artificial. Este documento corresponde à Parte Teórica (1,5 ponto): diagnostico a minha rotina, nomeio os desafios, justifico os métodos e as ferramentas, explico o uso da IA e descrevo as estratégias que adotei para comunicação, procrastinação e saúde mental."),
        p("A parte prática materializa essas escolhas no Norte OS, aplicativo que eu mesma desenvolvi para a transição. A teoria, aqui, não é um ornamento: cada método só entra no sistema se resolver um problema concreto da rotina que descrevo a seguir."),

        h1("2. Diagnóstico da rotina atual"),
        p("Até recentemente, eu trabalhava em um Cartório de Registro de Imóveis: processos padronizados, prazos legais, filas de protocolo e pouca margem para decidir “o que importa hoje”. A clareza vinha de fora. A transição para tecnologia inverteu o problema. Em vez de um fluxo único, passaram a coexistir três frentes contínuas e um conjunto de projetos com data de término."),
        h2("2.1 As três frentes e os projetos"),
        bullet("UniFECAF — formação em Inteligência Artificial e Automação Digital: aulas, leituras, entregas da disciplina e o próprio POS como artefato avaliativo."),
        bullet("Rocketseat — trilha de programação do zero: módulos sequenciais, exercícios de JavaScript e o risco permanente de “assistir sem digitar”."),
        bullet("Portfólio e prospecção — projetos (Norte OS, calculadora de emolumentos, AppBooks, storytelling de peças), candidaturas a vagas e contatos de freelance."),
        p("O contraste com o cartório é o dado mais útil do diagnóstico. Lá, a urgência era externa e o “pronto” estava no carimbo. Aqui, se eu não definir critério de conclusão, prazo curto e um lugar para capturar o que chega (aula, ideia, edital, mensagem), o trabalho se espalha pelo WhatsApp, pelo caderno e pela memória — exatamente o que a aula sobre o Segundo Cérebro pede para evitar."),
        h2("2.2 Como o tempo se organiza na prática"),
        p("A manhã tende a ser o meu bloco de maior energia para código e exercícios. A tarde acomoda UniFECAF e leitura. A noite, se não for protegida, vira lote misturado de mensagens, vagas e “só mais um vídeo”. Compromissos fixos (aula ao vivo, prazo de entrega) convivem com blocos que preciso agendar de propósito — estudo, exercícios, código, lote administrativo —, senão o dia inteiro vira reação."),
        p("Trato o conhecimento do cartório como ativo, não como passado a esconder. Projetos como a calculadora de emolumentos existem para transformar experiência setorial em evidência técnica. O diagnóstico, portanto, não é “falta de ocupação”. É excesso de frentes sem um sistema que decida, capture e revise."),

        h1("3. Principais desafios de produtividade identificados"),
        bullet("Dispersão entre teoria e prática. Assistir à aula da Rocketseat sem abrir o editor gera a ilusão de progresso. O mesmo ocorre com a disciplina: anotar sem destilar e sem um pacote intermediário (print, README, função) deixa o conhecimento no ar."),
        bullet("Priorização falsa. Em um dia curto, “estudar mais”, “aplicar para a vaga agora” e “avançar o portfólio” parecem todos urgentes. Sem a distinção entre importante e urgente, a agenda obedece ao que grita, não ao que constrói a transição."),
        bullet("Fragmentação de ferramentas. Tarefa no bloco de notas, prazo no calendário do celular, ideia no WhatsApp, PDF na pasta aleatória. O cérebro vira o único índice — e falha."),
        bullet("Ansiedade da transição. A busca por emprego invade o bloco de estudo. Sem um lote específico para vagas e mensagens, a prospecção vaza para o Pomodoro de código e o estudo vaza para a madrugada."),
        bullet("Lei de Parkinson na rotina autogerenciada. Sem limite de duração, a revisão da aula ocupa a tarde inteira. Sem critério de “pronto”, o projeto de portfólio nunca publica."),
        bullet("Risco de configurar o sistema em vez de usá-lo. A própria disciplina alerta: gastar a semana escolhendo ferramenta é uma forma elegante de procrastinar."),
        p("Esses desafios não são fraqueza de caráter. São o resultado previsível de eu ter saído de um sistema externo (o cartório) sem ainda ter um sistema interno-externo (o POS). O restante deste texto responde a cada um deles com método, ferramenta e hábito de revisão."),

        h1("4. Métodos utilizados"),
        p("A gestão do tempo eficiente, conforme a Aula 2, combina clareza, prioridade, planejamento, foco e revisão contínua. Nenhum método isolado cobre as cinco peças. Por isso o POS combina poucos métodos, cada um com um papel explícito."),

        h2("4.1 Lei de Parkinson e Princípio de Pareto"),
        p("Parkinson observa que o trabalho se expande até preencher o tempo disponível. Na transição, isso aparece como “estudar o dia todo” sem módulo concluído. A resposta prática é limite de duração (Pomodoro, time-blocking), prazo no projeto e critério de conclusão: o módulo só conta quando há exercício digitado; o projeto só avança quando existe um pacote intermediário (função, tela, README)."),
        p("Pareto (80/20) evita a armadilha de tratar todas as frentes como iguais. Os 20% que mais movem a transição, neste momento, são: praticar o módulo atual, publicar um artefato no GitHub e cumprir a entrega da disciplina. Consumir aula extra, reorganizar pastas e “dar uma olhada em vagas” durante o bloco de código entram nos 80% que ocupam tempo e rendem pouco."),

        h2("4.2 Matriz de Eisenhower"),
        p("A matriz divide o que é urgente e o que é importante em quatro quadrantes. No Norte OS ela aparece com nomes operacionais, para não ficar jargão:"),
        table(
          ["Quadrante", "Significado", "Exemplo na transição"],
          [
            ["Fazer agora", "Urgente e importante", "Entrega do POS com prazo esta semana"],
            ["Agendar", "Importante, sem urgência", "Módulo de JavaScript; README do portfólio"],
            ["Delegar ou lote", "Urgente, pouco importante", "Responder mensagens e vagas em um bloco só"],
            ["Eliminar", "Nem urgente nem importante", "Aula aleatória que não vira exercício"],
          ],
          [2000, 3200, 4438],
        ),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        p("A matriz resolve o desafio de “aula ou código, vaga ou portfólio”. Ela não executa a tarefa: ela impede que a ansiedade escolha no lugar da intenção. Tarefas que chegam sem quadrante ficam “para classificar”, de propósito — classificar é o ato consciente, não um rótulo automático."),

        h2("4.3 GTD — Getting Things Done"),
        p("David Allen propõe esvaziar a mente em cinco movimentos: capturar, esclarecer, organizar, revisar e executar. Na minha rotina as entradas são heterogêneas (slide de aula, ideia de freelance, prazo de edital, frase ouvida na disciplina). Se permanecem na cabeça ou no chat, competem com o raciocínio que deveria estar no exercício."),
        p("A captura começa no aplicativo Notas (caixa de entrada) e, quando vira ação, no Norte OS. Esclarecer é perguntar: isso é ação, referência ou lixo? Organizar é mandar o arquivo para o PARA no Google Drive e a ação para Tarefas. Revisar é o ritual semanal. Executar é o Foco e a Agenda. O GTD justifica-se aqui porque as fontes de informação são muitas e o cérebro não deve ser o arquivo."),

        h2("4.4 Segundo Cérebro e método PARA"),
        p("Tiago Forte parte de uma premissa simples: o cérebro existe para pensar, não para armazenar listas. O Segundo Cérebro é o sistema externo que captura, organiza, destila e expressa (CODE). O PARA classifica o acervo em Projetos (começo e fim), Áreas (responsabilidade contínua), Recursos (interesse e referência) e Arquivo (inativo, mas recuperável)."),
        p("Na minha prática, as pastas PARA ficam no Google Drive — é lá que reúno PDFs, prints e materiais longos. O Norte OS só reproduz essa divisão em casos específicos (curso, projeto ou ação em andamento), para eu não duplicar o arquivo. Um curso vira projeto quando tem resultado (“POS entregue e pitch gravado”), prazo, módulos e pacotes intermediários; “formação contínua” e “saúde” permanecem área. Essa distinção impede que tudo vire “projeto eterno” e que o Drive vire um depósito sem critério."),

        h2("4.5 Sumarização progressiva"),
        p("A destilação do Segundo Cérebro acontece em dois lugares, com papéis distintos. O arquivo longo permanece no aplicativo Notas. No Norte OS, a seção Destilar de cada curso e de cada projeto do portfólio aplica a mesma lógica em quatro camadas, para eu não resumir cedo demais nem guardar o texto inteiro para sempre:"),
        bullet("Camada 0 — material bruto: colo a aula, o artigo ou as anotações no próprio card."),
        bullet("Camada 1 — destaque em negrito: no mesmo texto, marco só o que importa."),
        bullet("Camada 2 — marca-texto: do que já está em negrito, destaco o que vou consultar de novo."),
        bullet("Camada 3 — resumo executivo: poucas frases, o que sobra para reler em um minuto."),
        p("As camadas 1 e 2 não ganham caixa própria: o negrito e o marca-texto acontecem no material bruto. O conhecimento reunido — artigos, briefings e destilação longa — permanece no Notas. O Norte OS guarda o essencial do curso ou do projeto. Assim evito transformar o POS em mais um arquivo morto."),

        h2("4.6 Pacote intermediário"),
        p("O pacote intermediário (PI) é a unidade de “expressar” do CODE. Os PIs são os blocos de construção concretos e individuais que compõem o trabalho. Crio apenas um bloco de cada vez — uma tela, um README, um exercício, um parágrafo — e obtenho consideração externa antes de seguir. No Norte OS, a seção Expressar de cursos e de projetos lista esses pacotes com o mesmo critério: o avanço não é o certificado nem o repositório inteiro, é o próximo PI marcado como feito."),

        h2("4.7 Revisão semanal"),
        p("A revisão semanal é o hábito que mantém a confiança no sistema. Uma vez por semana, limpo a caixa de entrada do aplicativo Notas — decido o que vira referência destilada, o que vira tarefa no Norte OS e o que pode ser apagado — e escolho as prioridades da semana seguinte. Sem esse ritual de cerca de meia hora, a Entrada cresce, o Drive perde o PARA e eu volto a usar a memória como índice."),

        h2("4.8 Pomodoro, time-blocking e a regra dos dois minutos"),
        p("O foco profundo pede ciclo de concentração e pausa. O Pomodoro no Norte OS registra a sessão na tarefa ao iniciar: o ponto não é a perfeição do timer, é constatar que houve prática. Time-blocking separa na agenda o que é bloco de estudo, exercício, código, aula ou lote (vagas, mensagens e e-mails) daquilo que é compromisso (reunião ou compromisso pessoal). A regra dos dois minutos, da Aula 2, evita inflar a caixa de entrada com o que posso resolver na hora."),
        p("A agenda, segundo a mesma aula, precisa de compromissos fixos, momentos de produção, lote administrativo e margem para imprevisto. Sem essa margem, o primeiro atraso derruba o plano e a confiança no sistema."),

        h1("5. Ferramentas escolhidas e justificativa"),
        p("A Aula 4 recomenda escolher a ferramenta a partir do problema, não o contrário, e alerta contra o tempo gasto em configuração. O problema da minha rotina era a fragmentação. Em vez de empilhar Notion, Trello e um timer solto, separei três papéis e construí o Norte OS só para o que o calendário e a execução exigem no dia."),
        h2("5.1 Onde mora cada tipo de informação"),
        table(
          ["Necessidade", "Ferramenta", "Papel"],
          [
            ["Arquivo PARA (pastas)", "Google Drive", "Projetos, Áreas, Recursos e Arquivo"],
            ["Conhecimento reunido", "Aplicativo Notas", "Captura, destilação e sumarização"],
            ["Nota curta de contexto", "Norte OS", "Só o essencial do curso, projeto ou ação"],
            ["Agenda", "Norte OS", "Time-blocking e compromissos"],
            ["Tarefas e prioridade", "Norte OS", "Matriz de Eisenhower e quadro Kanban"],
            ["Foco", "Norte OS", "Pomodoro ligado à tarefa e hábitos da semana"],
            ["Resumo e plano com IA", "Norte OS · Copiloto", "Aula, semana, módulos e PIs; histórico na própria tela"],
            ["Reescrever texto", "Norte OS · Mensagens", "Versão pronta, formatada, para copiar e colar"],
          ],
          [2600, 2800, 4238],
        ),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        p("As pastas PARA ficam no Google Drive. O Norte OS só replica essa divisão em casos específicos — quando estou dentro de um curso ou de um projeto e preciso ver o próximo módulo ou o próximo pacote. As informações reunidas (artigos, briefings, destilação em camadas) ficam no aplicativo Notas. Se eu tentasse guardar tudo no POS, voltaria ao erro que a disciplina aponta: configurar um segundo arquivo em vez de usar o que já funciona no dispositivo."),
        h2("5.2 O Norte OS sem banco de dados"),
        p("O Norte OS não possui banco de dados remoto. O aplicativo roda no navegador ou no dispositivo e grava os dados no próprio aparelho (armazenamento local). Nesta etapa, isso é deliberado. O sistema está em teste e, para uso pessoal, a gravação no dispositivo é suficiente: não há, no momento, necessidade de servidor, conta na nuvem nem sincronização entre máquinas. O app abre em branco. Um único botão no menu — “Gerar dados de teste” ou “Limpar dados”, conforme o estado — permite ao avaliador ver o sistema vazio, pronto para o uso do zero, ou preenchido com a demonstração. Se no futuro o POS deixar de ser um laboratório pessoal, a decisão sobre banco de dados poderá ser revista; hoje, um servidor só aumentaria configuração — exatamente o tipo de trabalho que a Aula 4 classifica como procrastinação elegante."),
        p("O enunciado admite Notion, Trello, Asana, Google Agenda ou similares. O Norte OS é a similar que eu construí: agenda, tarefas, foco, copiloto e comunicação no mesmo fluxo. Drive e Notas completam o Segundo Cérebro. Construir o POS, em vez de apenas configurar um modelo pronto, também vira evidência da transição no portfólio."),

        h1("6. Como a Inteligência Artificial apoia a organização"),
        p("A IA, neste trabalho, não substitui a priorização nem a revisão semanal. Ela comprime trabalho cognitivo repetitivo e devolve texto pronto para eu usar. Distingo o que acontece dentro do Norte OS do que acontece em automações externas."),
        h2("6.1 Dentro do Norte OS"),
        bullet("Copiloto — resumos e planejamento. Resumo de aula, briefing do dia, plano da semana e planejamento de módulos e pacotes intermediários. As respostas ficam formatadas no Histórico desta tela, com opção de copiar ou excluir; não vão para o Segundo Cérebro. A IA propõe; eu aplico e ajusto. Só trata de vaga quando o pedido é sobre vaga."),
        bullet("Mensagens — reescrever com IA. Proposta de freelance, follow-up e apresentação saem em versão pronta e alternativa curta, já formatadas para colar no e-mail ou no LinkedIn."),
        h2("6.2 Automações externas"),
        bullet("ChatGPT — briefing diário de notícias. Entrega o artigo ou o recorte que inicia a camada 0 da sumarização progressiva no aplicativo Notas."),
        bullet("Claude — resumo diário de e-mails. Reduz a caixa de entrada a o que exige ação, para eu não misturar leitura de mensagem com o bloco de código."),
        bullet("Grok — bot de gestão do LinkedIn. Apoia a presença profissional em lote, sem invadir o Pomodoro nem a revisão da aula."),
        p("Há um limite que eu mantenho de propósito: a IA não classifica sozinha o quadrante de Eisenhower e não marca módulo como feito. Se o sistema decidisse sozinho, voltaria ao problema do cartório invertido — a urgência viria de um algoritmo, não de um critério. A IA acelera captura e expressão; a revisão continua minha."),

        h1("7. Comunicação, procrastinação e saúde mental"),
        h2("7.1 Comunicação"),
        p("Comunicação profissional, na minha transição, não é “postar mais”. É ter lote protegido na agenda para mensagens, um texto reescrito no Norte OS antes de enviar e a gestão do LinkedIn em automação (Grok), fora do bloco de estudo. Misturar follow-up com Pomodoro de código aumenta erro e tom ansioso. Separar o lote reduz retrabalho e preserva o destinatário."),
        h2("7.2 Procrastinação"),
        p("A procrastinação, no meu diagnóstico, tem duas faces. A primeira é a configuração infinita do sistema — por isso o Norte OS fica sem banco de dados e o PARA permanece no Drive que eu já uso. A segunda é trocar uma tarefa importante (publicar o README) por uma urgente e pequena (abrir mais uma vaga). As respostas são captura no Notas, classificação consciente, pacote intermediário para expressar cedo e o critério de Parkinson: a sessão começa mesmo que o texto não esteja perfeito."),
        h2("7.3 Saúde mental, bem-estar e revisão"),
        p("A disciplina trata saúde mental como parte da produtividade, não como apêndice. No Norte OS, a tela Foco reúne o Pomodoro e a seção Hábitos da semana: cadastro do hábito, meta semanal e sete dias para marcar ou desmarcar. Os hábitos de demonstração são de saúde mental — dormir no horário, pausa sem tela, caminhada ou alongamento, um minuto em silêncio antes de estudar —, porque a carga cognitiva da transição não se resolve só com matriz. Forte cita James Clear neste ponto: os hábitos reduzem a carga cognitiva e libertam capacidade mental para o pensamento livre e a criatividade (CLEAR, apud FORTE, p. 181). Sem o básico da vida mais fácil, não sobra espaço para o exercício de código."),
        p("Três rituais sustentam isso. Primeiro, blocos protegidos de estudo profundo, com pausa. Segundo, a revisão semanal: limpar a caixa de entrada do aplicativo Notas e decidir as prioridades da semana. Sem esse ritual, o sistema deixa de ser confiável e a ansiedade volta a usar a memória como arquivo. Terceiro, a separação entre “tempo de estudar” e “tempo de buscar trabalho”. Quando a prospecção tem hora marcada — e o LinkedIn tem bot —, ela para de assombrar a prática de código."),
        p("Produtividade sustentável, no enunciado, é exatamente isso: menos retrabalho, comunicação mais limpa e uma rotina que eu consiga repetir depois da entrega."),

        h1("8. Considerações finais"),
        p("O Sistema Operacional Pessoal que construí assenta em um diagnóstico (saí do cartório rumo a três frentes autogerenciadas) e em poucos métodos com papel claro: Parkinson e Pareto para limitar e focar; Eisenhower para decidir; GTD para capturar; PARA no Drive; sumarização progressiva no Notas e na seção Destilar do Norte OS; pacote intermediário para expressar cedo; revisão semanal para reabrir a semana; Pomodoro, hábitos e time-blocking para executar."),
        p("O Norte OS não pretende ser o arquivo da minha vida. Ele agenda, prioriza, foca e conversa com a IA. O conhecimento reunido fica no Notas; as pastas PARA, no Drive; os dados do app, no próprio dispositivo, sem banco de dados, enquanto o sistema estiver em teste e em uso pessoal. A Inteligência Artificial entra no Copiloto e na Comunicação e, fora do app, no ChatGPT, no Claude e no Grok — nunca como gestora da prioridade."),
        p("A parte prática demonstra o sistema funcionando. Este texto demonstra por que ele é assim, e não outro: cada escolha responde a um desafio que eu nomeei. Se o POS cumprir o que a disciplina pede — organização, clareza, uso consciente da tecnologia e aplicação dos conceitos —, o ganho não será só a nota. Será uma rotina que eu consiga habitar depois da entrega."),

        h1("9. Referências"),
        p("ALLEN, David. A arte de fazer acontecer: o método GTD. Rio de Janeiro: Sextante, [s.d.]. Método Getting Things Done — capturar, esclarecer, organizar, revisar, executar.", { align: AlignmentType.LEFT }),
        p("CIRILLO, Francesco. The Pomodoro Technique. [S.l.]: [s.n.], [s.d.]. Ciclos de concentração e pausa aplicados a blocos de estudo e código.", { align: AlignmentType.LEFT }),
        p("EISENHOWER, Dwight D. Quadro de urgência e importância. Discussão clássica recuperada na literatura de priorização e na Aula 2 da disciplina.", { align: AlignmentType.LEFT }),
        p("CLEAR, James. Hábitos atômicos. Citado em FORTE, Tiago. Construindo um segundo cérebro. Rio de Janeiro: Sextante, [s.d.]. p. 181. Hábitos como redução da carga cognitiva.", { align: AlignmentType.LEFT }),
        p("FORTE, Tiago. Construindo um segundo cérebro. Rio de Janeiro: Sextante, [s.d.]. Métodos PARA e CODE; sumarização progressiva; pacotes intermediários.", { align: AlignmentType.LEFT }),
        p("PARKINSON, C. Northcote. Parkinson's Law. Relação entre trabalho e tempo disponível; base para prazos curtos e time-blocking.", { align: AlignmentType.LEFT }),
        p("PARETO, Vilfredo. Princípio 80/20. Aplicação contemporânea à priorização de esforços de maior impacto.", { align: AlignmentType.LEFT }),
        p("UniFECAF. Disciplina Produtividade e Gestão do Tempo. Aulas 2 e 4: fundamentos da gestão do tempo, Eisenhower, foco, agenda, Segundo Cérebro, GTD, PARA, escolha de ferramentas e hábitos de revisão. Material da disciplina, 2026.", { align: AlignmentType.LEFT }),
        p("ASANA. Asana Academy. Disponível em: https://academy.asana.com. Acesso em: set. 2026.", { align: AlignmentType.LEFT }),
        p("NOTION. Notion Guides. Disponível em: https://www.notion.so/help. Acesso em: set. 2026.", { align: AlignmentType.LEFT }),
        p("TRELLO. Trello Guide. Disponível em: https://trello.com/guide. Acesso em: set. 2026.", { align: AlignmentType.LEFT }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "/home/workdir/artifacts/Parte_Teorica_Norte_OS_Gabriela_Sartor.docx";
  fs.writeFileSync(out, buf);
  console.log("Wrote", out, buf.length);
});
