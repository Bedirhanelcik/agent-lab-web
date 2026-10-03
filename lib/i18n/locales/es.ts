/** Español. Los términos técnicos se mantienen en inglés; solo se traduce la prosa. */

import type { Messages } from "../types.ts";

export const es = {
  meta: {
    siteTitle: "Agent Lab — un agente que sabe cuándo buscar",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "Un experimento independiente de ingeniería en IA agéntica, construido sobre Hybrid Retrieval, razonamiento adaptativo y respuestas con fuentes.",
    ogDescription:
      "Hybrid Retrieval. Razonamiento adaptativo. Respuestas con fuentes. Un experimento independiente de ingeniería en IA agéntica.",
    systemTitle: "El sistema",
    systemDescription:
      "El desglose técnico del Hybrid Retrieval, el bucle de decisión del agente y la capa de evaluación.",
    playgroundTitle: "Playground",
    playgroundDescription:
      "Ejecuciones del agente: la traza de decisión, las búsquedas realizadas, los pasajes recuperados y la respuesta con fuentes.",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "Cómo se mide el comportamiento del agente: casos, assertions estructurales, resultados y límites.",
    aboutTitle: "Acerca de",
    aboutDescription:
      "Un proyecto de ingeniería independiente surgido de una asignatura sobre IA agéntica.",
  },

  nav: {
    skipToContent: "Ir al contenido",
    ariaLabel: "Navegación principal",
    home: "Inicio",
    system: "Sistema",
    playground: "Playground",
    evaluation: "Evaluation",
    about: "Acerca de",
  },

  language: {
    label: "Idioma",
    current: "Idioma seleccionado",
  },

  mode: {
    label: "Estado",
    demo: "Demo",
    live: "En vivo",
    demoHint: "Se muestran ejecuciones preparadas; no se hace ninguna llamada al modelo.",
    liveHint: "Las llamadas al agente en vivo están activas.",
  },

  home: {
    heroEyebrow: "Sistema de retrieval agéntico",
    heroTitleLine1: "Un agente que sabe",
    heroTitleLine2: "cuándo buscar.",
    heroSubtitle: "Hybrid Retrieval. Razonamiento adaptativo. Respuestas con fuentes.",
    ctaPlayground: "Probar el agente",
    ctaSystem: "Explorar el sistema",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search y BM25 funcionan por separado y sus resultados se combinan con Reciprocal Rank Fusion. Los identificadores de chunk son deterministas.",
      },
      {
        title: "Agent",
        body: "Decide por sí mismo si debe buscar, inspecciona los pasajes que recibe y, si hace falta, reformula la consulta y vuelve a buscar.",
      },
      {
        title: "Evaluation",
        body: "Se mide el comportamiento: qué status se devolvió, si realmente se llamó al RAG, si la fuente es correcta, si una pregunta fuera del corpus produjo una invención.",
      },
    ],
    whyEyebrow: "Por qué existe",
    whyTitle: "No es otra demo de RAG",
    whyDescription:
      "La mayoría de los ejemplos toman una pregunta, la entregan al Vector Search y pasan el resultado a un modelo de lenguaje. La diferencia aquí es la capa de decisión: el sistema decide por sí mismo si hace falta buscar, si lo que vuelve es suficiente y si merece la pena otro intento. Se niega a responder con contexto insuficiente.",
    facts: [
      { value: "475", label: "pruebas locales" },
      { value: "6", label: "casos de evaluación" },
      { value: "2", label: "métodos de retrieval" },
      { value: "0", label: "capas de framework" },
    ],
  },

  architecture: {
    eyebrow: "Arquitectura",
    title: "El camino de una pregunta por el sistema",
    description:
      "El agente decide primero si hace falta buscar. Si hace falta, dos métodos de retrieval se ejecutan en paralelo, los resultados se combinan por rango y solo se produce una respuesta cuando el contexto es suficiente.",
    nodes: {
      user: "pregunta",
      agent: "evaluar · inspeccionar · refinar",
      ragSearch: "herramienta rag_search",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · fuente · rango",
      synthesis: "síntesis con fuentes",
      answer: "respuesta con citas",
      answerLabel: "Respuesta con fuentes",
    },
    points: [
      {
        title: "La capa de decisión",
        body: "El agente decide si hace falta consultar el archivo. Con una entrada como un saludo, el retrieval nunca se llama y el número de llamadas a herramientas se queda en cero.",
      },
      {
        title: "Retrieval en paralelo",
        body: "Vector Search capta la proximidad semántica y BM25 la coincidencia exacta de palabras. Cada uno cubre la debilidad del otro, lo que importa porque el turco cambia las terminaciones por flexión.",
      },
      {
        title: "Fusión por rango",
        body: "La similitud del coseno y una puntuación BM25 no están en la misma escala. RRF ignora las puntuaciones por completo y usa solo los rangos, de modo que no hace falta una normalización frágil.",
      },
      {
        title: "Respuesta con fuentes",
        body: "La síntesis usa solo los pasajes recuperados y cada afirmación queda ligada a un identificador de chunk. Sin contexto suficiente el agente se niega a responder.",
      },
    ],
  },

  system: {
    heroEyebrow: "Desglose técnico",
    heroTitle: "El sistema",
    heroSubtitle:
      "Tres capas: el retrieval que encuentra la información, el agente que decide cuándo y cómo buscar, y la evaluación que mide el comportamiento.",
    retrievalEyebrow: "Capa 01 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "Vector Search capta la proximidad semántica pero difumina términos raros y nombres propios; BM25 es fuerte en coincidencias exactas pero se pierde las formas flexionadas. Los dos funcionan por separado y sus clasificaciones se combinan.",
    retrievalParts: [
      {
        title: "Chroma",
        body: "El almacén vectorial persistente. El texto de los chunks y los metadatos viven en disco.",
      },
      {
        title: "BM25",
        body: "Coincidencia exacta de palabras. Vive en memoria y se reconstruye desde Chroma al arrancar.",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "Ignora las escalas de puntuación y usa solo el rango (k = 60).",
      },
      {
        title: "gemini-embedding-001",
        body: "Los embeddings se generan a través de la API de Gemini (768 dimensiones), con task types distintos para consultas y pasajes. No se carga ningún modelo de ML local, lo que mantiene el servicio por debajo del límite de 512 MB de memoria.",
      },
      {
        title: "Identificadores de chunk deterministas",
        body: "source_file::chunk_index. Se usa como clave para la citation y para volver a recuperar.",
      },
    ],
    agentEyebrow: "Capa 02 — Agent",
    agentTitle: "El bucle de decisión",
    agentDescription:
      "No es una tubería fija sino una pequeña máquina de estados con límites explícitos. Hay una decisión en cada paso y esas decisiones cambian el flujo.",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "¿Hace falta buscar?",
          detail:
            "La pregunta se analiza. Si no se necesita conocimiento documental, el retrieval nunca se llama y el flujo va directo a la respuesta.",
        },
        {
          label: "Search",
          summary: "Se llama a rag_search",
          detail:
            "El agente escribe su propia consulta; no está obligado a pasar la frase del usuario tal cual. La consulta se escribe en el idioma del corpus.",
        },
        {
          label: "Inspect",
          summary: "¿Bastan los pasajes?",
          detail:
            "Se comprueba si los pasajes devueltos responden de verdad a la pregunta. Sin este paso no existiría la noción de «contexto insuficiente».",
        },
        {
          label: "Refine",
          summary: "La consulta se reformula",
          detail:
            "Ante un resultado insuficiente se cambia la consulta y se busca otra vez. El número de intentos está acotado y la misma consulta nunca se ejecuta dos veces.",
        },
        {
          label: "Answer",
          summary: "Solo con contexto suficiente",
          detail:
            "La respuesta se apoya en los pasajes recuperados y los cita. Si el contexto es insuficiente, la síntesis nunca se llama y la situación se declara con claridad.",
        },
      ],
      nextStates: "Posibles estados siguientes:",
      terminal: "terminal",
    },
    evalEyebrow: "Capa 03 — Evaluation",
    evalTitle: "Comportamiento medido",
    evalDescription:
      "El objetivo no es decir «hice un agente» sino «medí su comportamiento». La evaluación mira el comportamiento observable, no la redacción de la respuesta.",
    evalParts: [
      {
        value: "475",
        label: "pruebas locales",
        detail: "Todas con dobles de prueba; cero llamadas a la API.",
      },
      {
        value: "6",
        label: "casos de evaluación",
        detail: "Miden comportamiento, no una simple coincidencia de cadena.",
      },
      {
        value: "25",
        label: "assertions estructurales",
        detail: "Status, herramienta usada, fuente, formato de citation, control de invención.",
      },
      {
        value: "1",
        label: "llamada al LLM juez",
        detail: "Solo en el caso que realmente necesita un juicio semántico.",
      },
    ],
    evalNote:
      "La evaluación se apoya en una CLI de evaluación de prompts que vive en un proyecto aparte; la lógica de las assertions está definida allí y no se reescribe aquí.",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "Mira al agente trabajando.",
    heroDemoSubtitle:
      "Esta página funciona en modo demo: no se hace ninguna llamada al modelo y cada ejecución mostrada se preparó de antemano.",
    heroLiveSubtitle:
      "El modo en vivo está activo: tu pregunta se envía al servicio del agente y la respuesta se produce en el idioma que elegiste.",
    questionLabel: "Pregunta",
    placeholderDemo: "Escribe una pregunta o elige uno de los ejemplos preparados",
    placeholderLive: "Escribe una pregunta y pulsa Enter",
    submit: "Enviar",
    submittingDemo: "Resolviendo…",
    submittingLive: "Ejecutando…",
    examplesDemo: "Preguntas preparadas",
    examplesLive: "Preguntas de ejemplo",
    syntheticTag: "synthetic",
    idleDemo:
      "En modo demo solo se responden las preguntas preparadas de arriba. Elige una y verás la decisión que tomó el agente, las búsquedas que hizo, los pasajes que recuperó y su respuesta con fuentes.",
    idleLive:
      "El modo en vivo está activo: tu pregunta se envía al servicio del agente, el agente decide por sí mismo si buscar y solo apoya la respuesta en los pasajes que encontró.",
    runningDemo: "Resolviendo la ejecución preparada",
    runningLive: "El agente está trabajando",
    runningHint:
      "Los pasos de decisión, búsqueda y síntesis se ejecutan en secuencia; esto puede tardar unos segundos.",
    notFoundTitle: "No se encontró ningún ejemplo preparado",
    notFoundBody:
      "No hay un ejemplo preparado para esta pregunta. Como el modo demo no hace ninguna llamada al modelo, no mostramos nada en lugar de ofrecer una ejecución que solo se parezca a lo que pediste. Elige una de las preguntas preparadas de arriba.",
    notFoundQuery: "se buscó:",
    demoDataTitle: "No se pudieron leer los datos de demo",
    demoDataBody:
      "Las ejecuciones preparadas no tienen la forma esperada, así que no se muestra ningún ejemplo. Renderizar datos corruptos de todos modos sería engañoso.",
    originSynthetic: "Synthetic — ejecución de demo preparada",
    originPrepared: "Ejecución de demo preparada",
    originSyntheticBody:
      "Esta ejecución se compuso a mano y nunca se ejecutó. Existe solo para mostrar el flujo de reformulación exitoso; no es una salida real del modelo.",
    originPreparedBody:
      "Esta salida se deriva de una ejecución que sí se lanzó antes y no se produjo aquí en vivo.",
    originLanguageNote:
      "Las ejecuciones preparadas se produjeron sobre un corpus en turco: cambiar el idioma de la interfaz no cambia el texto de respuesta guardado. Para obtener una respuesta en el idioma elegido hace falta el modo en vivo.",
    reconstructedFields: "campos reconstruidos:",
    reconstructedNone: "todos los campos fueron observados (nada reconstruido)",
  },

  result: {
    question: "Pregunta",
    status: "Status",
    answer: "Respuesta",
    trace: "Traza del agente",
    traceSteps: "pasos",
    toolCalls: "Llamadas a herramientas",
    sources: "Fuentes",
    noSources:
      "En esta ejecución no se citó ninguna fuente. O el agente no buscó, o no encontró suficientes los pasajes devueltos y por eso no apoyó la respuesta en ningún pasaje.",
    noSteps: "No se registró ningún paso para esta ejecución.",
    noToolCalls: "tool_calls:",
    noToolCallsBody:
      "El agente no recurrió al retrieval en esta pregunta. Una tubería fija habría buscado igualmente; aquí, no buscar también es una decisión.",
    toolCallCount: "tool_calls:",
    attemptOf: "búsqueda",
    fieldRank: "rango",
    fieldScore: "puntuación",
    fieldPage: "página",
    fieldQuery: "consulta",
    fieldTopK: "top_k",
    fieldPassagesFound: "pasajes encontrados",
    fieldSourceFile: "archivo fuente",
    statusLabels: {
      answered: "Respondido",
      answered_without_retrieval: "Respondido sin retrieval",
      insufficient_context: "Contexto insuficiente",
      tool_failure: "Fallo de la herramienta",
    },
    statusExplanations: {
      answered:
        "El agente buscó, encontró suficientes los pasajes devueltos y apoyó la respuesta solo en esos pasajes.",
      answered_without_retrieval:
        "El agente decidió que no hacía falta consultar el archivo para esta pregunta; el retrieval nunca se llamó.",
      insufficient_context:
        "Se hizo una búsqueda pero los pasajes devueltos no bastaron para responder. El agente se negó a responder.",
      tool_failure:
        "La capa de retrieval falló. En ese caso el agente no reintenta y no produce respuesta.",
    },
    actionLabels: {
      assessed_question: "Pregunta evaluada",
      searched_rag: "Búsqueda en RAG",
      refined_query: "Consulta reformulada",
      answered_from_context: "Respondido desde el contexto",
      answered_without_retrieval: "Respondido sin retrieval",
      declared_insufficient_context: "Contexto insuficiente declarado",
      tool_failed: "Herramienta fallida",
    },
  },

  errors: {
    title: {
      not_configured: "El servicio del agente no está configurado",
      invalid_request: "No se pudo enviar la pregunta",
      quota_exhausted: "La cuota gratuita se agotó",
      generation_error: "No se pudo producir la respuesta",
      corpus_empty: "Todavía no se ha añadido ningún documento",
      agent_unavailable: "El agente no está disponible ahora",
      upstream_error: "El servicio del agente devolvió un error",
      bad_response: "La respuesta no tiene la forma esperada",
      timeout: "Tiempo de espera agotado",
      network: "No se pudo contactar con el servicio del agente",
    },
    body: {
      not_configured:
        "El modo en vivo parece activo pero la dirección del servicio del agente no está definida. No se pueden hacer consultas en vivo hasta que se complete la configuración del servidor.",
      invalid_request:
        "El servicio del agente no aceptó la petición. Asegúrate de que la pregunta no esté vacía e inténtalo de nuevo.",
      quota_exhausted:
        "La cuota gratuita del proveedor del modelo está agotada ahora mismo. Las consultas en vivo volverán a funcionar cuando se renueve; mientras tanto puedes ver las ejecuciones preparadas en modo demo.",
      generation_error:
        "El retrieval terminó pero el paso de síntesis falló. Esto suele ser temporal; tiene sentido reintentar.",
      corpus_empty:
        "El agente no encontró ningún documento donde buscar: el archivo está vacío. Se podrán responder preguntas en cuanto se añada un documento.",
      agent_unavailable:
        "El servicio del agente está en pie pero no en condiciones de aceptar consultas. Este endpoint responderá cuando se complete la configuración del servidor.",
      upstream_error:
        "La petición llegó al servicio del agente pero terminó en un error inesperado. Reintentar puede no ayudar.",
      bad_response:
        "El servicio del agente devolvió una respuesta que no cumple el contrato. Mostrar una respuesta malformada como resultado sería engañoso, así que no se renderiza nada.",
      timeout:
        "El agente no respondió en el tiempo previsto. La petición se canceló; no hay espera ilimitada.",
      network:
        "No se pudo establecer conexión. Asegúrate de que el servicio del agente está funcionando e inténtalo de nuevo.",
    },
  },

  upload: {
    heading: "Subida de documentos",
    availableBody:
      "Sube un archivo PDF, TXT o MD. El documento pasa por la pipeline de ingestion existente: se divide en páginas, se trocea en chunks, se generan embeddings y se escribe tanto en el índice vectorial como en el de palabras clave. Después es consultable desde el campo de pregunta de arriba.",
    disabledDemo:
      "La subida no hace nada en modo demo; las ejecuciones mostradas son ejemplos preparados.",
    disabledEnv: "La subida de documentos está desactivada en este entorno.",
    disabledReason:
      "La subida solo se activa en desarrollo local. La razón es arquitectónica: el corpus está compartido entre todos los visitantes, así que un documento que sube uno entra en las búsquedas de los demás. La subida no debería exponerse públicamente antes de tener aislamiento por usuario.",
    fileInputLabel: "Documentos para subir",
    submit: "Subir",
    submitting: "Añadiendo…",
    runningTitle: "La ingestion está en marcha",
    runningHint:
      "El chunking y los embeddings pueden tardar unos segundos según el tamaño del archivo.",
    doneTitle: "Añadido",
    doneBody:
      "El documento ya es consultable. Cuando hagas una pregunta arriba, el agente también puede buscar en este contenido.",
    chunkUnit: "chunks",
    failedTitle: "La subida falló",
    errors: {
      not_configured:
        "La dirección del servicio del agente no está definida, así que el documento no se pudo enviar.",
      upload_disabled: "La subida de documentos está desactivada en este entorno.",
      no_files: "Elige primero un archivo.",
      unsupported_file_type: "Solo se aceptan archivos PDF, TXT y MD.",
      file_too_large: "El archivo es demasiado grande. El máximo es {max} MB.",
      invalid_request:
        "El nombre del archivo o la petición fue rechazada. Prueba con otro nombre.",
      upstream_error: "El servicio del agente devolvió un error durante la subida.",
      bad_response:
        "La respuesta de la subida no tiene la forma esperada, así que no se muestra resultado.",
      timeout: "La subida no terminó en el tiempo previsto y se canceló.",
      network: "No se pudo contactar con el servicio del agente. Comprueba que está activo.",
    },
  },

  evaluation: {
    heroEyebrow: "Comportamiento medido",
    heroTitle: "Evaluation",
    heroSubtitle:
      "El objetivo no es decir «hice un agente» sino «medí su comportamiento». La evaluación no mira lo bien que suena la respuesta, sino el comportamiento observable: qué status se devolvió, si el retrieval se llamó de verdad, si se citó la fuente correcta, si una pregunta fuera del corpus produjo una invención.",
    methodologyEyebrow: "Metodología",
    methodologyTitle: "Estructura de la suite",
    methodologyDescription:
      "Cada caso comprueba el comportamiento observable del agente en lugar de una única coincidencia de cadena. Los controles los ejecutan assertion checkers definidos en un proyecto aparte; no se reescriben aquí.",
    suiteShape: [
      {
        value: "6",
        label: "casos",
        detail:
          "Una pregunta RAG factual, una pregunta fuera del corpus, una respuesta directa, exactitud de la citation, una consulta poco especificada, calidad semántica.",
      },
      {
        value: "25",
        label: "assertions",
        detail:
          "Status, herramienta llamada, identidad de la fuente, traza de acciones, formato de citation y control de invención.",
      },
      {
        value: "1",
        label: "llamada al LLM juez",
        detail:
          "Solo en el único caso que necesita juicio semántico. Todos los demás controles son deterministas y gratuitos.",
      },
    ],
    suiteNote:
      "Estos números vienen de la definición de la suite (configuración), no del resultado de una ejecución.",
    resultsEyebrow: "Resultados",
    resultsTitle: "Última ejecución",
    resultsDescription:
      "Los resultados se leen solo del artefacto que produjo una ejecución de evaluación real. Sin artefacto, aquí no se muestra ningún número.",
    missingTitle: "No hay artefacto de evaluación disponible",
    missingBody:
      "No hay un artefacto de evaluación que mostrar en este sitio. En lugar de inventar un resultado informamos de su ausencia: cuando el archivo de abajo esté en su sitio, esta página leerá y mostrará los números reales.",
    missingExpectedFile: "archivo esperado:",
    missingHowTo:
      "El artefacto se produce ejecutando la suite de evaluación en el proyecto que aloja el servicio del agente. Esa ejecución gasta cuota de Gemini, así que no se dispara desde aquí; esta página solo consume un artefacto ya listo.",
    invalidTitle: "El artefacto no es válido",
    invalidBody:
      "El archivo se encontró pero no tiene la forma esperada de un informe de evaluación. Mostrar un archivo corrupto o equivocado como resultado sería engañoso, así que no se renderiza ningún número.",
    limitationsTitle: "Límites",
    limitations: [
      "La evaluación corre sobre un corpus pequeño; a esta escala la ordenación del retrieval no se pone a prueba y los resultados no deben tomarse como representativos de un sistema en producción.",
      "Una ejecución en vivo está limitada por la cuota gratuita: como solo se permiten unas pocas peticiones por minuto, una ejecución puede detenerse a medias por agotamiento de cuota pese a las esperas entre casos. En ese caso los casos afectados se informan como error de cuota, no como «fail».",
      "Los resultados de esta página son completamente independientes de las ejecuciones de demo preparadas del playground. Los datos de demo nunca cuentan como resultado de evaluación; las dos fuentes viven en archivos separados y se validan con esquemas separados.",
    ],
    report: {
      cases: "casos",
      passed: "superados",
      failed: "fallidos",
      assertions: "assertions",
      geminiCalls: "llamadas a Gemini",
      callsNote: "{agent} agent + {judge} juez",
      suite: "suite",
      model: "modelo",
      generatedAt: "generado el",
      avgLatency: "latencia media",
      casesHeading: "Casos",
      pass: "superado",
      fail: "fallido",
      status: "status",
      agentCalls: "llamadas agent",
      judgeCalls: "llamadas juez",
      latency: "latencia",
      error: "error",
      score: "puntuación",
      assertionPassed: "superado",
      assertionFailed: "fallido",
    },
  },

  about: {
    heroEyebrow: "El proyecto",
    heroTitle: "Hecho como un experimento en IA agéntica.",
    paragraphs: [
      "Conocí los temas de IA agéntica en una asignatura de ingeniería del software. Me interesaron y, tomando el programa como referencia, empecé un proyecto independiente para llevar más lejos mi propio trabajo de desarrollo en IA.",
      "El proyecto no es una entrega de clase: la asignatura fue un punto de partida y todo el sistema se diseñó y escribió al margen de ella. El objetivo no era producir una interfaz de chat de propósito general, sino construir un sistema que use el retrieval como herramienta, decida por sí mismo cuándo buscar y no responda sin citar una fuente.",
      "Las tres partes funcionan y se prueban de forma independiente: la capa de Hybrid Retrieval, el agente con su bucle de decisión y el sistema de evaluación que mide su comportamiento. Este sitio las reúne en un solo relato.",
    ],
    stackHeading: "Tecnologías",
    stackGroups: [
      { group: "Interfaz", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Servicio", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "Razonamiento", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "Enlaces",
  },

  footer: {
    tagline: "Agent Lab — un experimento independiente de ingeniería en IA agéntica",
    about: "Acerca de",
  },
} satisfies Messages;
