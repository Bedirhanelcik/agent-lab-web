/** Português. Os termos técnicos permanecem em inglês; apenas o texto corrido é traduzido. */

import type { Messages } from "../types.ts";

export const pt = {
  meta: {
    siteTitle: "Agent Lab — um agente que sabe quando pesquisar",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "Um projeto independente de engenharia de IA construído sobre Hybrid Retrieval, raciocínio adaptativo e respostas com fontes.",
    ogDescription:
      "Hybrid Retrieval. Raciocínio adaptativo. Respostas com fontes. Um projeto independente de engenharia de IA.",
    systemTitle: "O sistema",
    systemDescription:
      "O detalhamento técnico do Hybrid Retrieval, do ciclo de decisão do agente e da camada de avaliação.",
    playgroundTitle: "Playground",
    playgroundDescription:
      "Execuções do agente: o rastro de decisão, as buscas realizadas, os trechos recuperados e a resposta com fontes.",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "Como o comportamento do agente é medido: casos, assertions estruturais, resultados e limites.",
    aboutTitle: "Sobre",
    aboutDescription:
      "Um projeto independente de engenharia de IA que reúne retrieval, decisão com ferramentas e avaliação em uma só arquitetura.",
    apiSetupTitle: "Configuração da API",
    apiSetupDescription:
      "Como executar o sistema com sua própria chave da API Gemini, localmente ou no Render.",
  },

  nav: {
    skipToContent: "Ir para o conteúdo",
    ariaLabel: "Navegação principal",
    home: "Início",
    system: "Como funciona",
    playground: "Playground",
    evaluation: "Evaluation",
    apiSetup: "Configuração da API",
    about: "Sobre",
    openMenu: "Abrir o menu",
    closeMenu: "Fechar o menu",
  },

  theme: {
    label: "Tema",
    toLight: "Mudar para o tema claro",
    toDark: "Mudar para o tema escuro",
  },

  language: {
    label: "Idioma",
    current: "Idioma selecionado",
  },

  mode: {
    label: "Estado",
    demo: "Demo",
    live: "Ao vivo",
    demoHint: "São exibidas execuções preparadas; nenhuma chamada de modelo é feita.",
    liveHint: "As chamadas ao agente ao vivo estão ativas.",
  },

  home: {
    heroEyebrow: "Sistema de retrieval agêntico",
    heroTitleLine1: "Um agente que sabe",
    heroTitleLine2: "quando pesquisar.",
    heroSubtitle: "Hybrid Retrieval. Raciocínio adaptativo. Respostas com fontes.",
    ctaPlayground: "Testar o agente",
    ctaSystem: "Explorar o sistema",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search e BM25 funcionam separadamente e seus resultados são combinados com Reciprocal Rank Fusion. Os identificadores de chunk são determinísticos.",
      },
      {
        title: "Agent",
        body: "Ele decide sozinho se deve pesquisar, inspeciona os trechos recebidos e, quando necessário, reformula a consulta e pesquisa de novo.",
      },
      {
        title: "Evaluation",
        body: "O comportamento é medido: qual status voltou, se o RAG foi realmente chamado, se a fonte está correta, se uma pergunta fora do corpus gerou invenção.",
      },
    ],
    whyEyebrow: "Por que existe",
    whyTitle: "Não é mais uma demo de RAG",
    whyDescription:
      "A maioria dos exemplos pega a pergunta, entrega ao Vector Search e repassa o resultado a um modelo de linguagem. A diferença aqui é a camada de decisão: o sistema decide sozinho se a busca é necessária, se o que voltou é suficiente e se vale uma nova tentativa. Com contexto insuficiente, ele se recusa a responder.",
    facts: [
      { value: "475", label: "testes locais" },
      { value: "6", label: "casos de avaliação" },
      { value: "2", label: "métodos de retrieval" },
      { value: "0", label: "camadas de framework" },
    ],
  },

  architecture: {
    eyebrow: "Arquitetura",
    title: "O caminho de uma pergunta pelo sistema",
    description:
      "O agente decide primeiro se a busca é necessária. Se for, dois métodos de retrieval rodam em paralelo, os resultados são combinados por rank e uma resposta só é produzida quando o contexto é suficiente.",
    nodes: {
      user: "pergunta",
      agent: "avaliar · inspecionar · refinar",
      ragSearch: "ferramenta rag_search",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · fonte · rank",
      synthesis: "síntese com fontes",
      answer: "resposta com citações",
      answerLabel: "Resposta com fontes",
    },
    points: [
      {
        title: "A camada de decisão",
        body: "O agente decide se é preciso consultar o arquivo. Para entradas como uma saudação, o retrieval nunca é chamado e a contagem de chamadas de ferramenta fica em zero.",
      },
      {
        title: "Retrieval em paralelo",
        body: "O Vector Search capta proximidade semântica e o BM25 capta a correspondência exata de palavras. Cada um cobre a fraqueza do outro, o que importa porque o turco muda as terminações por flexão.",
      },
      {
        title: "Fusão por rank",
        body: "Similaridade de cosseno e pontuação BM25 não estão na mesma escala. O RRF ignora as pontuações por completo e usa só os ranks, dispensando uma normalização frágil.",
      },
      {
        title: "Resposta com fontes",
        body: "A síntese usa apenas os trechos recuperados e cada afirmação fica presa a um identificador de chunk. Sem contexto suficiente, o agente se recusa a responder.",
      },
    ],
  },

  system: {
    heroEyebrow: "Detalhamento técnico",
    heroTitle: "O sistema",
    heroSubtitle:
      "Três camadas: o retrieval que encontra a informação, o agente que decide quando e como pesquisar, e a avaliação que mede o comportamento.",
    retrievalEyebrow: "Camada 01 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "O Vector Search capta proximidade semântica, mas borra termos raros e nomes próprios; o BM25 é forte na correspondência exata, mas perde formas flexionadas. Os dois rodam separados e seus rankings são combinados.",
    retrievalParts: [
      {
        title: "Chroma",
        body: "O armazenamento vetorial persistente. O texto do chunk e os metadados ficam em disco.",
      },
      {
        title: "BM25",
        body: "Correspondência exata de palavras. Vive em memória e é reconstruído a partir do Chroma na inicialização.",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "Ignora as escalas de pontuação e usa apenas o rank (k = 60).",
      },
      {
        title: "gemini-embedding-001",
        body: "Os embeddings são gerados pela API Gemini (768 dimensões), com task types distintos para consultas e trechos. Nenhum modelo de ML local é carregado, o que mantém o serviço abaixo do limite de 512 MB de memória.",
      },
      {
        title: "Identificadores de chunk determinísticos",
        body: "source_file::chunk_index. Usado como chave para a citation e para recuperar novamente.",
      },
    ],
    agentEyebrow: "Camada 02 — Agent",
    agentTitle: "O ciclo de decisão",
    agentDescription:
      "Não é um pipeline fixo, e sim uma pequena máquina de estados com limites explícitos. Há uma decisão em cada passo, e essas decisões mudam o fluxo.",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "A busca é necessária?",
          detail:
            "A pergunta é analisada. Se não houver necessidade de conhecimento documental, o retrieval nunca é chamado e o fluxo vai direto para a resposta.",
        },
        {
          label: "Search",
          summary: "rag_search é chamado",
          detail:
            "O agente escreve a própria consulta; não precisa repassar a frase do usuário sem mudanças. A consulta é escrita no idioma do corpus.",
        },
        {
          label: "Inspect",
          summary: "Os trechos bastam?",
          detail:
            "Verifica-se se os trechos devolvidos realmente respondem à pergunta. Sem esse passo não existiria a noção de 'contexto insuficiente'.",
        },
        {
          label: "Refine",
          summary: "A consulta é reformulada",
          detail:
            "Diante de um resultado insuficiente, a consulta muda e a busca é repetida. O número de tentativas é limitado e a mesma consulta nunca roda duas vezes.",
        },
        {
          label: "Answer",
          summary: "Só com contexto suficiente",
          detail:
            "A resposta se apoia nos trechos recuperados e os cita. Se o contexto é insuficiente, a síntese nunca é chamada e a situação é declarada com clareza.",
        },
      ],
      nextStates: "Possíveis estados seguintes:",
      terminal: "terminal",
    },
    evalEyebrow: "Camada 03 — Evaluation",
    evalTitle: "Comportamento medido",
    evalDescription:
      "O objetivo não é dizer 'fiz um agente', e sim 'medi o comportamento dele'. A avaliação olha o comportamento observável, não a redação da resposta.",
    evalParts: [
      { value: "475", label: "testes locais", detail: "Todos com dublês; zero chamadas de API." },
      {
        value: "6",
        label: "casos de avaliação",
        detail: "Medem comportamento, não uma simples correspondência de string.",
      },
      {
        value: "25",
        label: "assertions estruturais",
        detail: "Status, ferramenta usada, fonte, formato da citation, verificação de invenção.",
      },
      {
        value: "1",
        label: "chamada ao LLM juiz",
        detail: "Só no caso que realmente precisa de julgamento semântico.",
      },
    ],
    evalNote:
      "A avaliação se apoia em uma CLI de avaliação de prompts que vive em outro projeto; a lógica das assertions está definida lá e não é reescrita aqui.",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "Veja o agente trabalhando.",
    heroDemoSubtitle:
      "Esta página roda em modo demo: nenhuma chamada de modelo é feita e toda execução exibida foi preparada de antemão.",
    heroLiveSubtitle:
      "O modo ao vivo está ativo: sua pergunta vai ao serviço do agente e a resposta é produzida no idioma que você escolheu.",
    questionLabel: "Pergunta",
    placeholderDemo: "Escreva uma pergunta ou escolha um dos exemplos preparados",
    placeholderLive: "Escreva uma pergunta e pressione Enter",
    submit: "Enviar",
    submittingDemo: "Resolvendo…",
    submittingLive: "Executando…",
    examplesDemo: "Perguntas preparadas",
    examplesLive: "Perguntas de exemplo",
    syntheticTag: "synthetic",
    idleDemo:
      "No modo demo só as perguntas preparadas acima são respondidas. Escolha uma e verá a decisão que o agente tomou, as buscas que fez, os trechos que recuperou e sua resposta com fontes.",
    idleLive:
      "O modo ao vivo está ativo: sua pergunta vai ao serviço do agente, o agente decide sozinho se deve pesquisar e apoia a resposta somente nos trechos que encontrou.",
    runningDemo: "Resolvendo a execução preparada",
    runningLive: "O agente está trabalhando",
    runningHint:
      "As etapas de decisão, busca e síntese rodam em sequência; isso pode levar alguns segundos.",
    notFoundTitle: "Nenhum exemplo preparado encontrado",
    notFoundBody:
      "Não há exemplo preparado para esta pergunta. Como o modo demo não faz chamadas de modelo, preferimos não mostrar nada a oferecer uma execução que apenas se parece com o que você pediu. Escolha uma das perguntas preparadas acima.",
    notFoundQuery: "procurado:",
    demoDataTitle: "Os dados de demo não puderam ser lidos",
    demoDataBody:
      "As execuções preparadas não têm o formato esperado, então nenhum exemplo é exibido. Renderizar dados corrompidos mesmo assim seria enganoso.",
    originSynthetic: "Synthetic — execução de demo preparada",
    originPrepared: "Execução de demo preparada",
    originSyntheticBody:
      "Esta execução foi montada à mão e nunca foi executada. Existe apenas para mostrar o fluxo de reformulação bem-sucedido; não é saída real de modelo.",
    originPreparedBody:
      "Esta saída vem de uma execução que de fato ocorreu antes e não foi produzida aqui ao vivo.",
    originLanguageNote:
      "As execuções preparadas foram produzidas sobre um corpus em turco: mudar o idioma da interface não muda o texto da resposta registrada. Para receber a resposta no idioma escolhido é preciso o modo ao vivo.",
    reconstructedFields: "campos reconstruídos:",
    reconstructedNone: "todos os campos foram observados (nada reconstruído)",
  },

  result: {
    question: "Pergunta",
    status: "Status",
    answer: "Resposta",
    trace: "Rastro do agente",
    traceSteps: "passos",
    toolCalls: "Chamadas de ferramenta",
    sources: "Fontes",
    noSources:
      "Nenhuma fonte foi citada nesta execução. Ou o agente não pesquisou, ou não considerou os trechos devolvidos suficientes e por isso não apoiou a resposta em nenhum trecho.",
    noSteps: "Nenhum passo foi registrado nesta execução.",
    noToolCalls: "tool_calls:",
    noToolCallsBody:
      "O agente não recorreu ao retrieval nesta pergunta. Um pipeline fixo teria pesquisado de qualquer forma; aqui, não pesquisar também é uma decisão.",
    toolCallCount: "tool_calls:",
    attemptOf: "busca",
    fieldRank: "rank",
    fieldScore: "score",
    fieldPage: "página",
    fieldQuery: "consulta",
    fieldTopK: "top_k",
    fieldPassagesFound: "trechos encontrados",
    fieldSourceFile: "arquivo de origem",
    statusLabels: {
      answered: "Respondido",
      answered_without_retrieval: "Respondido sem retrieval",
      insufficient_context: "Contexto insuficiente",
      tool_failure: "Falha da ferramenta",
    },
    statusExplanations: {
      answered:
        "O agente pesquisou, considerou os trechos devolvidos suficientes e apoiou a resposta somente neles.",
      answered_without_retrieval:
        "O agente decidiu que não era preciso consultar o arquivo para esta pergunta; o retrieval nunca foi chamado.",
      insufficient_context:
        "Houve busca, mas os trechos devolvidos não bastaram para responder. O agente se recusou a responder.",
      tool_failure:
        "A camada de retrieval falhou. Nesse caso o agente não tenta de novo e não produz resposta.",
    },
    actionLabels: {
      assessed_question: "Pergunta avaliada",
      searched_rag: "Busca no RAG",
      refined_query: "Consulta reformulada",
      answered_from_context: "Respondido a partir do contexto",
      answered_without_retrieval: "Respondido sem retrieval",
      declared_insufficient_context: "Contexto insuficiente declarado",
      tool_failed: "Ferramenta falhou",
    },
  },

  errors: {
    title: {
      not_configured: "O serviço do agente não está configurado",
      invalid_request: "Não foi possível enviar a pergunta",
      quota_exhausted: "A cota gratuita acabou",
      generation_error: "Não foi possível produzir a resposta",
      corpus_empty: "Nenhum documento foi adicionado ainda",
      agent_unavailable: "O agente está indisponível no momento",
      upstream_error: "O serviço do agente devolveu um erro",
      bad_response: "A resposta não está no formato esperado",
      timeout: "Tempo esgotado",
      network: "Não foi possível alcançar o serviço do agente",
    },
    body: {
      not_configured:
        "O modo ao vivo parece ativo, mas o endereço do serviço do agente não está definido. Consultas ao vivo não são possíveis até a configuração do servidor ser concluída.",
      invalid_request:
        "O serviço do agente não aceitou a requisição. Verifique se a pergunta não está vazia e tente de novo.",
      quota_exhausted:
        "A cota gratuita do provedor do modelo está esgotada no momento. As consultas ao vivo voltam a funcionar quando ela for renovada; até lá você pode ver as execuções preparadas no modo demo.",
      generation_error:
        "O retrieval terminou, mas a etapa de síntese falhou. Isso costuma ser temporário; tentar de novo faz sentido.",
      corpus_empty:
        "O agente não encontrou nenhum documento para pesquisar: o arquivo está vazio. As perguntas poderão ser respondidas assim que um documento for adicionado.",
      agent_unavailable:
        "O serviço do agente está de pé, mas não em condição de aceitar consultas. Este endpoint responderá quando a configuração do servidor estiver concluída.",
      upstream_error:
        "A requisição chegou ao serviço do agente, mas terminou em um erro inesperado. Tentar de novo pode não ajudar.",
      bad_response:
        "O serviço do agente devolveu uma resposta fora do contrato. Mostrar uma resposta malformada como resultado seria enganoso, então nada é renderizado.",
      timeout:
        "O agente não respondeu no tempo previsto. A requisição foi cancelada; não há espera ilimitada.",
      network:
        "Não foi possível estabelecer conexão. Verifique se o serviço do agente está rodando e tente de novo.",
    },
  },

  upload: {
    heading: "Envio de documentos",
    availableBody:
      "Envie um arquivo PDF, TXT ou MD. O documento passa pelo pipeline de ingestion existente: é dividido em páginas, em chunks, recebe embeddings e é escrito tanto no índice vetorial quanto no de palavras-chave. Depois disso fica pesquisável pelo campo de pergunta acima.",
    disabledDemo:
      "O envio não faz nada no modo demo; as execuções exibidas são exemplos preparados.",
    disabledEnv: "O envio de documentos está desativado neste ambiente.",
    disabledReason:
      "O envio só é liberado em desenvolvimento local. A razão é arquitetural: o corpus é compartilhado entre todos os visitantes, então um documento enviado por um entra nas buscas dos outros. O envio não deve ser exposto publicamente antes de existir isolamento por usuário.",
    fileInputLabel: "Documentos para enviar",
    submit: "Enviar",
    submitting: "Adicionando…",
    runningTitle: "A ingestion está em andamento",
    runningHint:
      "O chunking e os embeddings podem levar alguns segundos, dependendo do tamanho do arquivo.",
    doneTitle: "Adicionado",
    doneBody:
      "O documento já é pesquisável. Quando você fizer uma pergunta acima, o agente também pode buscar neste conteúdo.",
    chunkUnit: "chunks",
    failedTitle: "O envio falhou",
    errors: {
      not_configured:
        "O endereço do serviço do agente não está definido, por isso o documento não pôde ser enviado.",
      upload_disabled: "O envio de documentos está desativado neste ambiente.",
      no_files: "Escolha um arquivo primeiro.",
      unsupported_file_type: "Só são aceitos arquivos PDF, TXT e MD.",
      file_too_large: "O arquivo é grande demais. O máximo é {max} MB.",
      invalid_request: "O nome do arquivo ou a requisição foi recusada. Tente outro nome.",
      upstream_error: "O serviço do agente devolveu um erro durante o envio.",
      bad_response:
        "A resposta do envio não está no formato esperado, por isso nenhum resultado é exibido.",
      timeout: "O envio não terminou no tempo previsto e foi cancelado.",
      network: "Não foi possível alcançar o serviço do agente. Verifique se ele está rodando.",
    },
  },

  evaluation: {
    heroEyebrow: "Comportamento medido",
    heroTitle: "Evaluation",
    heroSubtitle:
      "O objetivo não é dizer 'fiz um agente', e sim 'medi o comportamento dele'. A avaliação não olha o quanto a resposta soa bem, e sim o comportamento observável: qual status voltou, se o retrieval foi mesmo chamado, se a fonte certa foi citada, se uma pergunta fora do corpus gerou invenção.",
    methodologyEyebrow: "Metodologia",
    methodologyTitle: "Estrutura da suite",
    methodologyDescription:
      "Cada caso verifica o comportamento observável do agente em vez de uma única correspondência de string. As verificações são executadas por assertion checkers definidos em outro projeto; não são reescritas aqui.",
    suiteShape: [
      {
        value: "6",
        label: "casos",
        detail:
          "Uma pergunta factual de RAG, uma pergunta fora do corpus, uma resposta direta, exatidão da citation, uma consulta pouco especificada, qualidade semântica.",
      },
      {
        value: "25",
        label: "assertions",
        detail:
          "Status, ferramenta chamada, identidade da fonte, rastro de ações, formato da citation e verificação de invenção.",
      },
      {
        value: "1",
        label: "chamada ao LLM juiz",
        detail:
          "Só no único caso que precisa de julgamento semântico. Todas as outras verificações são determinísticas e gratuitas.",
      },
    ],
    suiteNote:
      "Esses números vêm da definição da suite (configuração), não do resultado de uma execução.",
    resultsEyebrow: "Resultados",
    resultsTitle: "Última execução",
    resultsDescription:
      "Os resultados são lidos apenas do artefato produzido por uma execução real de avaliação. Sem artefato, nenhum número é exibido aqui.",
    missingTitle: "Nenhum artefato de avaliação disponível",
    missingBody:
      "Não há artefato de avaliação para mostrar neste site. Em vez de inventar um resultado, informamos a ausência: quando o arquivo abaixo estiver no lugar, esta página lerá e mostrará os números reais.",
    missingExpectedFile: "arquivo esperado:",
    missingHowTo:
      "O artefato é produzido rodando a suite de avaliação no projeto que hospeda o serviço do agente. Essa execução gasta cota do Gemini, então não é disparada daqui; esta página apenas consome um artefato pronto.",
    invalidTitle: "O artefato é inválido",
    invalidBody:
      "O arquivo foi encontrado, mas não tem o formato esperado de relatório de avaliação. Mostrar um arquivo corrompido ou errado como resultado seria enganoso, então nenhum número é renderizado.",
    limitationsTitle: "Limites",
    limitations: [
      "A avaliação roda sobre um corpus pequeno; nessa escala a ordenação do retrieval não é pressionada e os resultados não devem ser tomados como representativos de um sistema em produção.",
      "Uma execução ao vivo é limitada pela cota gratuita: como só poucas requisições por minuto são permitidas, uma execução pode parar no meio por esgotamento de cota apesar das esperas entre os casos. Nesse caso os casos afetados são relatados como erro de cota, não como 'fail'.",
      "Os resultados desta página são totalmente separados das execuções de demo preparadas do playground. Dados de demo nunca contam como resultado de avaliação; as duas fontes vivem em arquivos separados e são validadas por schemas separados.",
    ],
    report: {
      cases: "casos",
      passed: "aprovados",
      failed: "falharam",
      assertions: "assertions",
      geminiCalls: "chamadas Gemini",
      callsNote: "{agent} agent + {judge} juiz",
      suite: "suite",
      model: "modelo",
      generatedAt: "gerado em",
      avgLatency: "latência média",
      casesHeading: "Casos",
      pass: "aprovado",
      fail: "falhou",
      status: "status",
      agentCalls: "chamadas agent",
      judgeCalls: "chamadas juiz",
      latency: "latência",
      error: "erro",
      score: "pontuação",
      assertionPassed: "aprovado",
      assertionFailed: "falhou",
    },
  },

  documents: {
    eyebrow: "Seus próprios documentos",
    heading: "Envie seus documentos e faça perguntas sobre eles",
    intro:
      "O arquivo que você envia é convertido em texto, dividido em chunks, transformado em embeddings com o Gemini e escrito no índice vetorial e no de palavras-chave. No instante em que isso termina, o agente pesquisa nos seus documentos.",
    dropTitle: "Solte seus arquivos aqui",
    dropHint: "ou escolha no seu computador",
    browse: "Escolher arquivos",
    accepted: "PDF, TXT, MD",
    maxSize: "até {max} MB por arquivo",
    selectedTitle: "Arquivos selecionados",
    clearSelection: "Limpar seleção",
    upload: "Enviar e indexar",
    uploading: "Enviando…",
    indexing: "Indexando",
    indexingHint:
      "A extração de texto, o chunking e os embeddings rodam em sequência; pode levar alguns segundos conforme o tamanho do arquivo.",
    successTitle: "Adicionado ao corpus",
    successBody: "Seus documentos agora fazem parte do corpus de retrieval.",
    corpusNote: "O corpus tem agora {chunks} chunks.",
    askNow: "Faça uma pergunta agora",
    failedTitle: "O envio falhou",
    listTitle: "Documentos do corpus",
    listEmptyTitle: "O corpus está vazio",
    listEmptyBody:
      "Nada foi indexado ainda. Envie um arquivo e o agente terá onde pesquisar ao responder às suas perguntas.",
    chunkCount: "{count} chunks",
    remove: "Remover",
    removing: "Removendo…",
    removeFailed: "Não foi possível remover o documento.",
    resetTitle: "Reiniciar o corpus",
    resetBody:
      "Apaga todos os documentos do índice vetorial e do de palavras-chave. Não há como desfazer.",
    reset: "Reiniciar corpus",
    resetting: "Reiniciando…",
    resetDone: "O corpus foi esvaziado.",
    resetFailed: "Não foi possível reiniciar o corpus.",
    corpusSize: "corpus",
    keywordIndex: "índice de palavras-chave",
    readOnlyTitle: "O corpus é somente leitura",
    readOnlyBody:
      "Adicionar e remover documentos está desativado neste ambiente. O corpus é compartilhado entre todos os visitantes, então a escrita não é exposta publicamente antes de existir isolamento por usuário. Rodando o projeto na sua máquina, você pode liberá-la com UPLOAD_ENABLED=true.",
    demoTitle: "O envio não faz nada no modo demo",
    demoBody:
      "Esta página mostra agora execuções preparadas e não faz nenhuma chamada de modelo. Para enviar seus próprios documentos, rode o sistema no modo ao vivo.",
    loading: "Lendo o corpus…",
    loadFailed: "Não foi possível ler o estado do corpus.",
  },

  howItWorks: {
    eyebrow: "Como funciona",
    heading: "De um documento a uma resposta com fontes",
    intro:
      "O sistema tem dois fluxos distintos: a indexação que torna seus documentos pesquisáveis e a consulta que transforma uma pergunta em resposta com fontes. Os dois são percorridos passo a passo abaixo.",
    stepLabel: "Passo",
    ingestTitle: "1. Indexação de documentos",
    ingestIntro: "Quando você envia um arquivo, isto acontece em ordem:",
    ingestSteps: [
      {
        title: "Envio",
        body: "Seu arquivo PDF, TXT ou MD vai do navegador para o servidor. O navegador nunca vê o endereço do backend nem qualquer chave; a requisição passa pelo servidor Next.js.",
      },
      {
        title: "Extração de texto",
        body: "O texto puro dentro do arquivo é lido. Em PDFs os números de página são preservados, para que depois uma resposta possa apontar a página de onde veio.",
      },
      {
        title: "Chunking",
        body: "O texto é dividido em pedaços de cerca de 1000 caracteres com 150 de sobreposição. A sobreposição evita que uma frase perca o contexto ao cair exatamente num limite.",
      },
      {
        title: "Gemini Embedding",
        body: "Cada chunk vira uma lista de números que representa seu significado. Textos com significado próximo ficam próximos nesse espaço.",
      },
      {
        title: "Índice vetorial Chroma",
        body: "Os embeddings são escritos num banco vetorial persistente junto com o texto do chunk e sua origem.",
      },
      {
        title: "Índice de palavras-chave BM25",
        body: "Os mesmos chunks também entram num índice por palavras. A busca vetorial capta o significado e o BM25 capta a palavra exata; os dois trabalham juntos.",
      },
    ],
    askTitle: "2. Responder a uma pergunta",
    askIntro: "Quando você pergunta algo, o fluxo é este:",
    askSteps: [
      {
        title: "Pergunta",
        body: "Você escreve a pergunta no seu idioma. A resposta é produzida no idioma de interface que escolheu.",
      },
      {
        title: "O agente avalia",
        body: "O agente se pergunta primeiro: preciso olhar os documentos para responder isto? Para uma saudação ou uma conta simples, não.",
      },
      {
        title: "Decisão de retrieval",
        body: "Se não for preciso, nenhuma busca roda e a contagem de chamadas de ferramenta fica em zero. É essa a diferença para um pipeline fixo: não pesquisar também é uma decisão.",
      },
      {
        title: "Ferramenta de retrieval",
        body: "Se for preciso, o agente escreve a própria consulta — não é obrigado a repassar sua frase sem mudanças — e chama a ferramenta rag_search.",
      },
      {
        title: "Vector Search + BM25",
        body: "Duas buscas rodam em paralelo: uma encontra proximidade semântica, a outra correspondências exatas de palavras.",
      },
      {
        title: "Fusão RRF",
        body: "Os dois rankings são combinados em um só. Como as pontuações estão em escalas diferentes, apenas os ranks são usados.",
      },
      {
        title: "Resposta com fontes do Gemini",
        body: "A resposta é produzida apenas a partir dos trechos recuperados, e cada afirmação fica presa a um identificador de chunk. Se os trechos não bastam, o agente se recusa a responder.",
      },
    ],
    glossaryTitle: "Termos",
    glossaryIntro:
      "Definições curtas e simples dos termos técnicos usados na interface. Os termos em si permanecem em inglês porque é assim que aparecem na literatura.",
    glossary: [
      {
        term: "RAG",
        body: "Retrieval-Augmented Generation. Em vez de pedir à IA que responda só com o conhecimento interno, o sistema primeiro recupera informação relevante dos seus documentos e apoia a resposta nela.",
      },
      {
        term: "Vector Search",
        body: "Encontra documentos pelo significado em vez de pelas palavras exatas.",
      },
      {
        term: "BM25",
        body: "Método de busca por palavras-chave que encontra documentos contendo os termos importantes da consulta.",
      },
      {
        term: "RRF",
        body: "Reciprocal Rank Fusion. Combina resultados de métodos de busca diferentes num único ranking.",
      },
      {
        term: "Agent",
        body: "Camada de decisão que pode determinar sozinha quando precisa usar uma ferramenta de retrieval antes de responder.",
      },
      {
        term: "Embedding",
        body: "Representação numérica de um texto que permite encontrar conteúdo de significado semelhante.",
      },
      {
        term: "Chunk",
        body: "Uma seção menor de um documento, criada para que a busca trabalhe em pedaços úteis em vez de um arquivo inteiro de uma vez.",
      },
      {
        term: "Citation",
        body: "Referência que mostra qual documento e qual chunk sustentam a resposta.",
      },
    ],
  },

  apiSetup: {
    navBadge: "API",
    heroEyebrow: "Guia de configuração",
    heroTitle: "Rode o sistema com sua própria chave da API Gemini",
    heroIntro:
      "Este projeto usa o Gemini tanto para geração quanto para embeddings. Com sua própria chave, as requisições contam na cota do seu projeto e você pode rodar o sistema inteiro no seu ambiente.",
    whyTitle: "Por que preciso da minha própria chave?",
    whyBody: [
      "A aplicação chama um modelo em dois pontos: gera embeddings ao indexar seus documentos e chama o Gemini para as decisões do agente e para redigir a resposta. Os dois precisam de uma chave de API.",
      "A chave é lida apenas no servidor e nunca é enviada ao navegador. Usar sua própria chave significa que as requisições ficam sujeitas à sua cota e aos seus limites.",
    ],
    quotaTitle: "Cota e preços",
    quotaBody:
      "A disponibilidade da API Gemini, as cotas do nível gratuito e os preços dependem das políticas atuais do Google, do modelo escolhido e da sua conta. Verifique as informações vigentes do Google antes de publicar.",
    quotaLink: "Preços e cotas da API Gemini",
    quotaNote:
      "Este projeto não promete uso ilimitado nem gratuidade permanente. Quando sua cota acaba, a aplicação informa com um erro claro em vez de produzir silenciosamente uma resposta errada.",
    githubTitle: "Código-fonte",
    githubBody:
      "Você pode clonar o projeto, rodá-lo na sua máquina, testá-lo com seus próprios documentos e mudar o que quiser.",
    githubButton: "Ver no GitHub",
    githubMissing: "O endereço do repositório não está configurado nesta instalação.",
    localTitle: "Configuração local",
    localIntro: "Quatro passos para rodar na sua máquina.",
    localSteps: [
      { title: "Clone o repositório", body: "Baixe o código-fonte e entre no diretório do projeto." },
      { title: "Obtenha uma chave de API", body: "Crie uma chave da API Gemini pelo Google AI Studio." },
      {
        title: "Crie o arquivo .env",
        body: "Copie o .env.example do repositório para .env e coloque sua chave. Esse arquivo está no .gitignore, então nunca vai para o repositório.",
      },
      { title: "Inicie o serviço", body: "Instale as dependências e suba a API; depois inicie a interface." },
    ],
    envTitle: "Variáveis de ambiente do backend",
    envIntro:
      "O único campo obrigatório é a chave de API; todo o resto tem um padrão razoável. Os nomes abaixo são exatamente os do .env.example do repositório.",
    envRequired: "obrigatório",
    envOptional: "opcional",
    envSecret: "secreto",
    envVars: [
      {
        name: "GEMINI_API_KEY",
        example: "YOUR_API_KEY",
        required: true,
        secret: true,
        description: "Sua chave da API Gemini. A geração e os embeddings funcionam com ela.",
      },
      {
        name: "GEMINI_AGENT_MODEL",
        example: "gemini-2.5-flash",
        required: false,
        secret: false,
        description: "O modelo usado nas decisões do agente e na redação das respostas.",
      },
      {
        name: "EMBEDDING_MODEL_NAME",
        example: "gemini-embedding-001",
        required: false,
        secret: false,
        description: "O modelo de embedding. Precisa ser um modelo do Gemini, não o nome de um modelo local.",
      },
      {
        name: "EMBEDDING_DIMENSIONS",
        example: "768",
        required: false,
        secret: false,
        description: "Tamanho do embedding. Precisa coincidir com o índice existente.",
      },
      {
        name: "CHROMA_PERSIST_DIR",
        example: "data/chroma",
        required: false,
        secret: false,
        description: "Onde o banco vetorial fica em disco.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Enviar e remover documentos pela interface. Desligado por padrão em produção porque o corpus é compartilhado.",
      },
      {
        name: "INGEST_API_TOKEN",
        example: "um-valor-aleatorio-longo",
        required: false,
        secret: true,
        description: "Protege o endpoint de ingestion do operador. Sem ele, esse endpoint não atende. Nunca é enviado ao navegador.",
      },
      {
        name: "ALLOWED_ORIGINS",
        example: "https://exemplo.vercel.app",
        required: false,
        secret: false,
        description: "Só é necessário se um navegador falar direto com o backend. Na configuração recomendada fica vazio.",
      },
    ],
    renderTitle: "Publicando no Render",
    renderIntro:
      "Se você publicar o backend no Render, as variáveis de ambiente vão nas configurações do próprio serviço, não num arquivo.",
    renderSteps: [
      { title: "Render", body: "Crie o projeto como um web service na sua conta." },
      {
        title: "Service",
        body: "O blueprint render.yaml do repositório já define o plano, o arquivo Docker e o health check.",
      },
      { title: "Environment", body: "Abra a seção Environment nas configurações do serviço." },
      {
        title: "Environment Variables",
        body: "Coloque aqui a GEMINI_API_KEY. O blueprint marca essa variável como não sincronizada, então o valor fica no painel e nunca no repositório.",
      },
    ],
    secretsTitle: "O que nunca deve ser commitado?",
    secretsBody: [
      "GEMINI_API_KEY e INGEST_API_TOKEN são segredos. O lugar deles é o seu arquivo .env local ou o painel de variáveis de ambiente do seu provedor, em nenhum outro lugar.",
      "O arquivo .env está no .gitignore e nunca vai para o repositório. Lá existe apenas o .env.example, que não carrega valores reais.",
      "Nenhum desses valores chega ao navegador: as chamadas de modelo acontecem no servidor e a interface só fala com o próprio servidor.",
    ],
    frontendTitle: "Variáveis de ambiente da interface",
    frontendBody:
      "A interface não carrega nenhuma chave de API. O servidor dela só precisa saber onde encontrar o backend.",
    frontendVars: [
      {
        name: "AGENT_API_URL",
        example: "http://localhost:8000",
        required: true,
        secret: false,
        description: "O endereço do backend. NÃO leva o prefixo NEXT_PUBLIC_: é lido apenas no servidor e o navegador nunca o vê.",
      },
      {
        name: "DEMO_MODE",
        example: "false",
        required: false,
        secret: false,
        description: "Definir como false liga o modo ao vivo, então as perguntas realmente vão ao agente.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Se a área de documentos fica ativa na interface. Funciona junto com a configuração de mesmo nome no backend.",
      },
      {
        name: "NEXT_PUBLIC_GITHUB_URL",
        example: "https://github.com/usuario/repositorio",
        required: false,
        secret: false,
        description: "O link público do repositório. Não é segredo, então pode ser exposto ao navegador com o prefixo NEXT_PUBLIC_.",
      },
    ],
    runTitle: "Comandos",
    runIntro: "O backend e a interface são processos separados; rode-os em dois terminais.",
    copy: "Copiar",
    copied: "Copiado",
  },

  about: {
    heroEyebrow: "O projeto",
    heroTitle: "Construído como um experimento em IA agêntica.",
    paragraphs: [
      "Este projeto explora como um sistema de IA pode ir além da simples geração de texto, reunindo retrieval, decisão baseada em ferramentas e avaliação numa única arquitetura.",
      "O sistema não foi desenhado como um chatbot de uso geral. Quem usa traz os próprios documentos, que são processados numa base de conhecimento pesquisável. Um agente decide quando o retrieval é necessário, usa a busca híbrida como ferramenta e gera respostas apoiadas nas evidências recuperadas.",
      "As três partes funcionam e são testadas de forma independente: a camada de Hybrid Retrieval, o agente com seu ciclo de decisão e o sistema de avaliação que mede esse comportamento com casos de teste mensuráveis. Esta interface reúne tudo numa aplicação interativa.",
    ],
    stackHeading: "Tecnologias",
    stackGroups: [
      { group: "Interface", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Serviço", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "Raciocínio", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "Links",
  },

  footer: {
    tagline: "Agent Lab — um projeto independente de engenharia de IA",
    about: "Sobre",
  },
} satisfies Messages;
