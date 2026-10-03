/** English. Technical terms stay as they are; only the prose is translated. */

import type { Messages } from "../types.ts";

export const en = {
  meta: {
    siteTitle: "Agent Lab — an agent that knows when to search",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "An independent agentic AI engineering experiment built on Hybrid Retrieval, adaptive reasoning and grounded answers.",
    ogDescription:
      "Hybrid Retrieval. Adaptive reasoning. Grounded answers. An independent agentic AI engineering experiment.",
    systemTitle: "The System",
    systemDescription:
      "A technical breakdown of Hybrid Retrieval, the agent decision loop and the evaluation layer.",
    playgroundTitle: "Playground",
    playgroundDescription:
      "Agent runs: the decision trace, the searches performed, the passages retrieved and the grounded answer.",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "How agent behaviour is measured: cases, structural assertions, results and limits.",
    aboutTitle: "About",
    aboutDescription:
      "An independent AI engineering project combining retrieval, tool-based decision making and evaluation in one architecture.",
    apiSetupTitle: "API Setup",
    apiSetupDescription:
      "How to run the system with your own Gemini API key, locally or on Render.",
  },

  nav: {
    skipToContent: "Skip to content",
    ariaLabel: "Main navigation",
    home: "Home",
    system: "How it works",
    playground: "Playground",
    evaluation: "Evaluation",
    apiSetup: "API Setup",
    about: "About",
  },

  language: {
    label: "Language",
    current: "Selected language",
  },

  mode: {
    label: "Status",
    demo: "Demo",
    live: "Live",
    demoHint: "Prepared example runs are shown; no live model call is made.",
    liveHint: "Live agent calls are enabled.",
  },

  home: {
    heroEyebrow: "Agentic retrieval system",
    heroTitleLine1: "An agent that",
    heroTitleLine2: "knows when to search.",
    heroSubtitle: "Hybrid Retrieval. Adaptive reasoning. Grounded answers.",
    ctaPlayground: "Upload your documents",
    ctaSystem: "Explore the system",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search and BM25 run separately and their results are merged with Reciprocal Rank Fusion. Chunk identifiers are deterministic.",
      },
      {
        title: "Agent",
        body: "It decides for itself whether to search, inspects the passages it gets back and, when needed, reformulates the query and searches again.",
      },
      {
        title: "Evaluation",
        body: "Behaviour is measured: which status came back, whether RAG was really called, whether the source is correct, whether an out-of-corpus question produced an invention.",
      },
    ],
    whyEyebrow: "Why it exists",
    whyTitle: "Not just another RAG demo",
    whyDescription:
      "Upload your own documents, let the system make them searchable, and ask questions about them. Most examples take a question, hand it to Vector Search and pass the result to a language model; the difference here is the decision layer: the system decides for itself whether a search is needed, whether what came back is sufficient and whether another attempt is worth making. It refuses to answer on insufficient context.",
    facts: [
      { value: "475", label: "local tests" },
      { value: "6", label: "evaluation cases" },
      { value: "2", label: "retrieval methods" },
      { value: "0", label: "framework layers" },
    ],
  },

  architecture: {
    eyebrow: "Architecture",
    title: "How a question travels through the system",
    description:
      "The agent first decides whether a search is needed. If it is, two different retrieval methods run in parallel, the results are merged by rank, and an answer is produced only when the context is sufficient.",
    nodes: {
      user: "question",
      agent: "assess · inspect · refine",
      ragSearch: "rag_search tool",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · source · rank",
      synthesis: "grounded synthesis",
      answer: "answer with citations",
      answerLabel: "Grounded Answer",
    },
    points: [
      {
        title: "The decision layer",
        body: "The agent decides whether the archive needs to be consulted at all. For input like a greeting, retrieval is never called and the tool call count stays at zero.",
      },
      {
        title: "Parallel retrieval",
        body: "Vector Search captures semantic proximity, BM25 captures exact word matches. Each covers the other's weak spot, which matters because Turkish inflection changes word endings.",
      },
      {
        title: "Rank-based fusion",
        body: "Cosine similarity and a BM25 score are not on the same scale. RRF ignores the scores entirely and uses only the ranks, so no fragile normalisation is needed.",
      },
      {
        title: "Grounded answer",
        body: "Synthesis uses only the retrieved passages and every claim is tied to a chunk identifier. Without sufficient context the agent refuses to answer.",
      },
    ],
  },

  system: {
    heroEyebrow: "Technical breakdown",
    heroTitle: "The system",
    heroSubtitle:
      "Three layers: the retrieval that finds information, the agent that decides when and how to search, and the evaluation that measures the behaviour.",
    retrievalEyebrow: "Layer 01 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "Vector Search captures semantic proximity but blurs rare terms and proper nouns; BM25 is strong on exact matches but misses inflected forms. The two run separately and their rankings are merged.",
    retrievalParts: [
      {
        title: "Chroma",
        body: "The persistent vector store. Chunk text and metadata live on disk.",
      },
      {
        title: "BM25",
        body: "Exact word matching. It lives in memory and is rebuilt from Chroma at startup.",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "Ignores score scales and uses rank alone (k = 60).",
      },
      {
        title: "gemini-embedding-001",
        body: "Embeddings are produced through the Gemini API (768 dimensions), with separate task types for queries and passages. No local ML model is loaded, which keeps the service under a 512 MB memory limit.",
      },
      {
        title: "Deterministic chunk identifiers",
        body: "source_file::chunk_index. Used as the key for citation and re-retrieval.",
      },
    ],
    agentEyebrow: "Layer 02 — Agent",
    agentTitle: "The decision loop",
    agentDescription:
      "Not a fixed pipeline but a small state machine with explicit boundaries. There is a decision at every step, and those decisions change the flow.",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "Is a search needed?",
          detail:
            "The question is analysed. If no document knowledge is needed, retrieval is never called and the flow goes straight to the answer.",
        },
        {
          label: "Search",
          summary: "rag_search is called",
          detail:
            "The agent writes its own search query; it does not have to pass the user's sentence through unchanged. The query is written in the language of the corpus.",
        },
        {
          label: "Inspect",
          summary: "Are the passages enough?",
          detail:
            "The returned passages are checked for whether they actually answer the question. Without this step there would be no notion of 'insufficient context'.",
        },
        {
          label: "Refine",
          summary: "The query is reformulated",
          detail:
            "On an insufficient result the query is changed and the search repeated. The number of attempts is bounded and the same query is never run twice.",
        },
        {
          label: "Answer",
          summary: "Only on sufficient context",
          detail:
            "The answer rests on the retrieved passages and cites them. If the context is insufficient, synthesis is never called and the situation is stated plainly.",
        },
      ],
      nextStates: "Possible next states:",
      terminal: "terminal",
    },
    evalEyebrow: "Layer 03 — Evaluation",
    evalTitle: "Measured behaviour",
    evalDescription:
      "The goal is not to say 'I built an agent' but 'I measured its behaviour'. Evaluation looks at observable behaviour rather than the wording of the answer.",
    evalParts: [
      {
        value: "475",
        label: "local tests",
        detail: "All of them with fakes; zero API calls.",
      },
      {
        value: "6",
        label: "evaluation cases",
        detail: "They measure behaviour, not a single string match.",
      },
      {
        value: "25",
        label: "structural assertions",
        detail: "Status, tool used, source, citation format, invention check.",
      },
      {
        value: "1",
        label: "LLM judge call",
        detail: "Only in the case that genuinely needs semantic judgement.",
      },
    ],
    evalNote:
      "Evaluation is built on a prompt evaluation CLI that lives in a separate project; the assertion logic is defined there and is not rewritten here.",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "See the agent at work.",
    heroDemoSubtitle:
      "This page runs in demo mode: no model call is made and every run shown was prepared in advance.",
    heroLiveSubtitle:
      "Live mode is on: your question goes to the agent service and the answer is produced in the language you selected.",
    questionLabel: "Question",
    placeholderDemo: "Type a question or pick one of the prepared examples below",
    placeholderLive: "Type a question and press Enter",
    submit: "Submit",
    submittingDemo: "Resolving…",
    submittingLive: "Running…",
    examplesDemo: "Try the sample corpus",
    examplesLive: "Example questions",
    syntheticTag: "synthetic",
    idleDemo:
      "In demo mode only the prepared questions above are answered. Pick one and you will see the decision the agent made, the searches it ran, the passages it retrieved and its grounded answer.",
    idleLive:
      "Live mode is on: your question goes to the agent service, the agent decides for itself whether to search, and it grounds the answer only in the passages it found.",
    runningDemo: "Resolving the prepared run",
    runningLive: "The agent is working",
    runningHint:
      "The decision, search and synthesis steps run in sequence; this can take a few seconds.",
    notFoundTitle: "No prepared example found",
    notFoundBody:
      "There is no prepared example for this question. Because demo mode makes no live model call, we show nothing rather than offering a run that merely resembles what you asked. Pick one of the prepared questions above.",
    notFoundQuery: "searched for:",
    demoDataTitle: "The demo data could not be read",
    demoDataBody:
      "The prepared runs do not have the expected shape, so no example is shown. Rendering broken data anyway would be misleading.",
    originSynthetic: "Synthetic — prepared demo run",
    originPrepared: "Prepared demo run",
    originSyntheticBody:
      "This run was handcrafted and never executed. It exists only to show the successful query-refinement flow; it is not real model output.",
    originPreparedBody:
      "This output is derived from a run that was really executed earlier and was not produced live here.",
    originLanguageNote:
      "Prepared runs were produced against a Turkish corpus: changing the interface language does not change the recorded answer text. To get an answer in your selected language, live mode is required.",
    reconstructedFields: "reconstructed fields:",
    reconstructedNone: "every field was observed (nothing reconstructed)",
  },

  result: {
    question: "Question",
    status: "Status",
    answer: "Answer",
    trace: "Agent trace",
    traceSteps: "steps",
    toolCalls: "Tool calls",
    sources: "Sources",
    noSources:
      "No source was cited in this run. Either the agent did not search, or it did not find the returned passages sufficient and so grounded the answer in nothing.",
    noSteps: "No steps were recorded for this run.",
    noToolCalls: "tool_calls:",
    noToolCallsBody:
      "The agent never reached for retrieval on this question. A fixed pipeline would have searched regardless; here, not searching is also a decision.",
    toolCallCount: "tool_calls:",
    attemptOf: "search",
    fieldRank: "rank",
    fieldScore: "score",
    fieldPage: "page",
    fieldQuery: "query",
    fieldTopK: "top_k",
    fieldPassagesFound: "passages found",
    fieldSourceFile: "source file",
    statusLabels: {
      answered: "Answered",
      answered_without_retrieval: "Answered without retrieval",
      insufficient_context: "Insufficient context",
      tool_failure: "Tool failure",
    },
    statusExplanations: {
      answered:
        "The agent searched, found the returned passages sufficient and grounded the answer only in those passages.",
      answered_without_retrieval:
        "The agent decided the archive did not need to be consulted for this question; retrieval was never called.",
      insufficient_context:
        "A search ran but the returned passages were not enough to answer the question. The agent refused to answer.",
      tool_failure:
        "The retrieval layer failed. In this case the agent does not retry and produces no answer.",
    },
    actionLabels: {
      assessed_question: "Assessed question",
      searched_rag: "Searched RAG",
      refined_query: "Refined query",
      answered_from_context: "Answered from context",
      answered_without_retrieval: "Answered without retrieval",
      declared_insufficient_context: "Declared insufficient context",
      tool_failed: "Tool failed",
    },
  },

  errors: {
    title: {
      not_configured: "The agent service is not configured",
      invalid_request: "The question could not be sent",
      quota_exhausted: "The free quota is used up",
      generation_error: "The answer could not be produced",
      corpus_empty: "No document has been added yet",
      agent_unavailable: "The agent is currently unavailable",
      upstream_error: "The agent service returned an error",
      bad_response: "The response is not in the expected shape",
      timeout: "The request timed out",
      network: "The agent service could not be reached",
    },
    body: {
      not_configured:
        "Live mode appears to be on but the agent service address is not set. Live queries are not possible until the server-side configuration is complete.",
      invalid_request:
        "The agent service did not accept the request. Make sure the question is not empty and try again.",
      quota_exhausted:
        "The model provider's free allowance is currently exhausted. Live queries will work again once the quota resets; in the meantime you can look at the prepared runs in demo mode.",
      generation_error:
        "Retrieval finished but the synthesis step failed. This is usually temporary; retrying makes sense.",
      corpus_empty:
        "The agent found no document to search: the archive is currently empty. Questions can be answered once a document has been added.",
      agent_unavailable:
        "The agent service is up but not in a state to accept queries. This endpoint will respond once the server configuration is complete.",
      upstream_error:
        "The request reached the agent service but ended in an unexpected error. Retrying may not help.",
      bad_response:
        "The agent service returned a response that does not match the contract. Showing a malformed response as an answer would be misleading, so nothing is rendered.",
      timeout:
        "The agent did not answer within the expected time. The request was cancelled; there is no unbounded wait.",
      network:
        "No connection could be made. Make sure the agent service is running and try again.",
    },
  },

  upload: {
    heading: "Document upload",
    availableBody:
      "Upload a PDF, TXT or MD file. The document goes through the existing ingestion pipeline: it is split into pages, chunked, embedded and written to both the vector and the keyword index. After that it is searchable from the question field above.",
    disabledDemo:
      "Document upload does nothing in demo mode; the runs shown are prepared examples.",
    disabledEnv: "Document upload is disabled in this environment.",
    disabledReason:
      "Upload is only enabled in local development. The reason is architectural: the corpus is currently shared across all visitors, so a document one visitor uploads enters everyone else's searches. Upload should not be exposed publicly before per-user isolation exists.",
    fileInputLabel: "Documents to upload",
    submit: "Upload",
    submitting: "Ingesting…",
    runningTitle: "Ingestion is running",
    runningHint:
      "Chunking and embedding can take a few seconds depending on the file size.",
    doneTitle: "Ingested",
    doneBody:
      "The document is now searchable. When you ask a question above, the agent can search this content too.",
    chunkUnit: "chunks",
    failedTitle: "Upload failed",
    errors: {
      not_configured:
        "The agent service address is not set, so the document could not be sent.",
      upload_disabled: "Document upload is disabled in this environment.",
      no_files: "Select a file first.",
      unsupported_file_type: "Only PDF, TXT and MD files are accepted.",
      file_too_large: "The file is too large. The maximum is {max} MB.",
      invalid_request: "The file name or request was rejected. Try a different file name.",
      upstream_error: "The agent service returned an error during the upload.",
      bad_response:
        "The upload response is not in the expected shape, so no result is shown.",
      timeout: "The upload did not finish within the expected time and was cancelled.",
      network: "The agent service could not be reached. Make sure it is running.",
    },
  },

  evaluation: {
    heroEyebrow: "Measured behaviour",
    heroTitle: "Evaluation",
    heroSubtitle:
      "The goal is not to say 'I built an agent' but 'I measured its behaviour'. Evaluation does not look at how pleasant the answer reads; it looks at observable behaviour: which status came back, whether retrieval was really called, whether the right source was cited, whether an out-of-corpus question produced an invention.",
    methodologyEyebrow: "Methodology",
    methodologyTitle: "Suite shape",
    methodologyDescription:
      "Each case checks the agent's observable behaviour rather than a single string match. The checks are executed by assertion checkers defined in a separate project; they are not rewritten here.",
    suiteShape: [
      {
        value: "6",
        label: "cases",
        detail:
          "A factual RAG question, an out-of-corpus question, a direct answer, citation accuracy, an underspecified query, semantic quality.",
      },
      {
        value: "25",
        label: "assertions",
        detail:
          "Status, the tool called, source identity, the action trace, citation format and the invention check.",
      },
      {
        value: "1",
        label: "LLM judge call",
        detail:
          "Only in the single case that needs semantic judgement. Every other check is deterministic and free.",
      },
    ],
    suiteNote:
      "These numbers come from the suite definition (configuration), not from the result of a run.",
    resultsEyebrow: "Results",
    resultsTitle: "Latest run",
    resultsDescription:
      "Results are read only from the artifact a real evaluation run produced. With no artifact, no number is shown here.",
    missingTitle: "No live evaluation artifact available",
    missingBody:
      "There is no evaluation artifact to show on this site. Rather than inventing a result we report its absence: once the file below is in place, this page will read and show the real numbers.",
    missingExpectedFile: "expected file:",
    missingHowTo:
      "The artifact is produced by running the evaluation suite in the project that hosts the agent service. That run spends Gemini quota, so it is not triggered from here; this page only consumes a ready artifact.",
    invalidTitle: "The artifact is invalid",
    invalidBody:
      "The file was found but does not have the expected evaluation report shape. Showing a broken or wrong file as a result would be misleading, so no number is rendered.",
    limitationsTitle: "Limitations",
    limitations: [
      "The evaluation runs over a small corpus; at this scale retrieval ranking is not stressed and the results should not be taken as representative of a production system.",
      "A live run is bounded by the free quota: because only a few requests per minute are allowed, a run can stop halfway on quota exhaustion despite the waits between cases. When that happens the affected cases are reported as a quota error, not as a 'fail'.",
      "The results on this page are entirely separate from the prepared demo runs in the playground. Demo data never counts as an evaluation result; the two data sources live in separate files and are validated against separate schemas.",
    ],
    report: {
      cases: "cases",
      passed: "passed",
      failed: "failed",
      assertions: "assertions",
      geminiCalls: "Gemini calls",
      callsNote: "{agent} agent + {judge} judge",
      suite: "suite",
      model: "model",
      generatedAt: "generated at",
      avgLatency: "avg latency",
      casesHeading: "Cases",
      pass: "pass",
      fail: "fail",
      status: "status",
      agentCalls: "agent calls",
      judgeCalls: "judge calls",
      latency: "latency",
      error: "error",
      score: "score",
      assertionPassed: "passed",
      assertionFailed: "failed",
    },
  },

  about: {
    heroEyebrow: "The project",
    heroTitle: "Built as an experiment in agentic AI.",
    paragraphs: [
      "This project explores how an AI system can go beyond plain text generation by combining retrieval, tool-based decision making and measurable evaluation into a single architecture.",
      "The system is not a general-purpose chatbot. You bring your own documents, they are processed into a searchable knowledge base, and an agent decides for itself when retrieval is necessary, uses hybrid retrieval as a tool, and grounds its answer only in the evidence it found.",
      "The three parts work and are tested independently: the Hybrid Retrieval layer, the agent with its decision loop, and an evaluation system that measures that behaviour with measurable test cases rather than subjective impressions. This interface brings all three together into one interactive application.",
    ],
    stackHeading: "Stack",
    stackGroups: [
      { group: "Interface", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "Service", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "Reasoning", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "Links",
  },

  theme: {
    label: "Theme",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },

  documents: {
    eyebrow: "Your own documents",
    heading: "Upload your documents and ask questions about them",
    intro:
      "The file you upload is parsed into text, split into chunks, embedded with Gemini and written to both the vector and the keyword index. The moment that finishes, the agent searches your documents.",
    dropTitle: "Drop your files here",
    dropHint: "or pick them from your computer",
    browse: "Choose files",
    accepted: "PDF, TXT, MD",
    maxSize: "up to {max} MB per file",
    selectedTitle: "Selected files",
    clearSelection: "Clear selection",
    upload: "Upload and index",
    uploading: "Uploading…",
    indexing: "Indexing",
    indexingHint:
      "Text extraction, chunking and embedding run in sequence; this can take a few seconds depending on file size.",
    successTitle: "Added to the corpus",
    successBody: "Your documents are now part of the retrieval corpus.",
    corpusNote: "The corpus now holds {chunks} chunks.",
    askNow: "Ask a question now",
    failedTitle: "Upload failed",
    listTitle: "Documents in the corpus",
    listEmptyTitle: "The corpus is empty",
    listEmptyBody:
      "Nothing has been indexed yet. Upload a file and the agent will have something to search when answering your questions.",
    chunkCount: "{count} chunks",
    remove: "Remove",
    removing: "Removing…",
    removeFailed: "The document could not be removed.",
    resetTitle: "Reset the corpus",
    resetBody:
      "Deletes every document from both the vector and the keyword index. This cannot be undone.",
    reset: "Reset corpus",
    resetting: "Resetting…",
    resetDone: "The corpus has been emptied.",
    resetFailed: "The corpus could not be reset.",
    corpusSize: "corpus",
    keywordIndex: "keyword index",
    readOnlyTitle: "The corpus is read-only",
    readOnlyBody:
      "Adding and removing documents is disabled in this environment. The corpus is shared across all visitors, so write access is not exposed publicly before per-user isolation exists. Running the project on your own machine, you can enable it with UPLOAD_ENABLED=true.",
    demoTitle: "Uploading does nothing in demo mode",
    demoBody:
      "This page currently shows prepared example runs and makes no model calls. To upload your own documents, run the system in live mode.",
    loading: "Reading the corpus…",
    loadFailed: "The corpus state could not be read.",
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "From a document to a grounded answer",
    intro:
      "The system has two separate flows: the indexing that makes your documents searchable, and the querying that turns a question into an answer with sources. Both are walked through below.",
    stepLabel: "Step",
    ingestTitle: "1. Document indexing",
    ingestIntro: "When you upload a file, this happens in order:",
    ingestSteps: [
      {
        title: "Upload",
        body: "Your PDF, TXT or MD file goes from the browser to the server. The browser never sees the backend address or any key; the request passes through the Next.js server.",
      },
      {
        title: "Text extraction",
        body: "The plain text inside the file is read. Page numbers are kept for PDFs, so an answer can later point at the page it came from.",
      },
      {
        title: "Chunking",
        body: "The text is split into pieces of roughly 1000 characters with a 150-character overlap. The overlap keeps a sentence from losing its context when it falls exactly on a boundary.",
      },
      {
        title: "Gemini Embedding",
        body: "Each chunk is turned into a list of numbers representing its meaning. Texts that mean similar things end up close together in that space.",
      },
      {
        title: "Chroma vector index",
        body: "The embeddings are written to a persistent vector database together with the chunk text and its source.",
      },
      {
        title: "BM25 keyword index",
        body: "The same chunks also go into a word-based index. Vector search catches meaning, BM25 catches the exact word; they work together.",
      },
    ],
    askTitle: "2. Answering a question",
    askIntro: "When you ask something, the flow goes like this:",
    askSteps: [
      {
        title: "Question",
        body: "You write the question in your own language. The answer is produced in the interface language you selected.",
      },
      {
        title: "The agent assesses it",
        body: "The agent asks itself first: do I need to look at the documents to answer this? For a greeting or simple arithmetic, it does not.",
      },
      {
        title: "Retrieval decision",
        body: "If it is not needed, no search runs at all and the tool call count stays at zero. That is the difference from a fixed pipeline: not searching is also a decision.",
      },
      {
        title: "Retrieval tool",
        body: "If it is needed, the agent writes its own search query — it does not have to forward your sentence unchanged — and calls the rag_search tool.",
      },
      {
        title: "Vector Search + BM25",
        body: "Two searches run in parallel: one finds semantic proximity, the other exact word matches.",
      },
      {
        title: "RRF fusion",
        body: "The two rankings are merged into one. Because the scores are on different scales, only the ranks are used.",
      },
      {
        title: "Grounded answer from Gemini",
        body: "The answer is produced only from the retrieved passages, and every claim is tied to a chunk identifier. If the passages are not enough, the agent refuses to answer.",
      },
    ],
    glossaryTitle: "Terms",
    glossaryIntro:
      "Short plain-language definitions of the technical terms used in the interface. The terms themselves stay in English because that is how they appear in the literature.",
    glossary: [
      {
        term: "RAG",
        body: "Retrieval-Augmented Generation. Instead of asking the AI to answer only from its internal knowledge, the system first retrieves relevant information from your documents and grounds the answer in it.",
      },
      {
        term: "Vector Search",
        body: "Finds documents based on semantic meaning rather than exact words.",
      },
      {
        term: "BM25",
        body: "A keyword-based search method that finds documents containing the important matching terms.",
      },
      {
        term: "RRF",
        body: "Reciprocal Rank Fusion. Combines results from different search methods into a single ranking.",
      },
      {
        term: "Agent",
        body: "An AI decision layer that can decide when it needs to use a retrieval tool before answering.",
      },
      {
        term: "Embedding",
        body: "A numerical representation of text that allows semantically similar content to be found.",
      },
      {
        term: "Chunk",
        body: "A smaller section of a document, created so the retrieval system can search useful pieces instead of an entire file at once.",
      },
      {
        term: "Citation",
        body: "A reference showing which document and which chunk supports the answer.",
      },
    ],
  },

  apiSetup: {
    navBadge: "API",
    heroEyebrow: "Setup guide",
    heroTitle: "Run the system with your own Gemini API key",
    heroIntro:
      "This project uses Gemini for both generation and embeddings. With your own key, requests count against your own project's quota and you can run the whole system in your own environment.",
    whyTitle: "Why do I need my own API key?",
    whyBody: [
      "The application calls a model in two places: it generates embeddings while indexing your documents, and it calls Gemini for the agent's decisions and for synthesising the answer. Both need an API key.",
      "The key is read on the server only and is never sent to the browser. Using your own key means the requests are subject to your quota and your limits.",
    ],
    quotaTitle: "Quota and pricing",
    quotaBody:
      "Gemini API availability, free-tier quotas and pricing depend on Google's current policies, the model you choose and your account. Check Google's current information before deploying.",
    quotaLink: "Gemini API pricing and quota information",
    quotaNote:
      "This project makes no promise of unlimited or permanently free usage. When your quota runs out, the application says so with a clear error instead of quietly producing a wrong answer.",
    githubTitle: "Source code",
    githubBody:
      "You can clone the project, run it on your own machine, try it with your own documents and change whatever you like.",
    githubButton: "View on GitHub",
    githubMissing: "The repository address is not configured in this deployment.",
    localTitle: "Local setup",
    localIntro: "Four steps to get it running on your own machine.",
    localSteps: [
      { title: "Clone the repository", body: "Download the source and change into the project directory." },
      { title: "Get an API key", body: "Create a Gemini API key through Google AI Studio." },
      {
        title: "Create the .env file",
        body: "Copy the repository's .env.example to .env and put your key in it. That file is in .gitignore, so it is never pushed to the repository.",
      },
      { title: "Start the service", body: "Install the dependencies and bring the API up, then start the interface." },
    ],
    envTitle: "Backend environment variables",
    envIntro:
      "The only required field is the API key; everything else has a sensible default. The names below are exactly the ones in the repository's .env.example.",
    envRequired: "required",
    envOptional: "optional",
    envSecret: "secret",
    envVars: [
      {
        name: "GEMINI_API_KEY",
        example: "YOUR_API_KEY",
        required: true,
        secret: true,
        description: "Your Gemini API key. Both generation and embeddings run on this key.",
      },
      {
        name: "GEMINI_AGENT_MODEL",
        example: "gemini-2.5-flash",
        required: false,
        secret: false,
        description: "The model used for the agent's decisions and for synthesising answers.",
      },
      {
        name: "EMBEDDING_MODEL_NAME",
        example: "gemini-embedding-001",
        required: false,
        secret: false,
        description: "The embedding model. It must be a Gemini embedding model, not a local model name.",
      },
      {
        name: "EMBEDDING_DIMENSIONS",
        example: "768",
        required: false,
        secret: false,
        description: "Embedding size. It has to match the existing index.",
      },
      {
        name: "CHROMA_PERSIST_DIR",
        example: "data/chroma",
        required: false,
        secret: false,
        description: "Where the vector database lives on disk.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Uploading and removing documents from the interface. Off by default in deployments because the corpus is shared.",
      },
      {
        name: "INGEST_API_TOKEN",
        example: "a-long-random-value",
        required: false,
        secret: true,
        description: "Protects the operator ingestion endpoint. Without it that endpoint refuses to serve. It is never sent to the browser.",
      },
      {
        name: "ALLOWED_ORIGINS",
        example: "https://example.vercel.app",
        required: false,
        secret: false,
        description: "Only needed if a browser talks to the backend directly. In the recommended setup it stays empty.",
      },
    ],
    renderTitle: "Deploying on Render",
    renderIntro:
      "If you deploy the backend to Render, the environment variables go into the service's own settings rather than into a file.",
    renderSteps: [
      { title: "Render", body: "Create the project as a web service in your account." },
      { title: "Service", body: "The render.yaml blueprint in the repository already defines the plan, the Docker file and the health check." },
      { title: "Environment", body: "Open the Environment section in the service settings." },
      {
        title: "Environment Variables",
        body: "Enter GEMINI_API_KEY here. The blueprint marks that variable as not synced, so its value lives in the dashboard and never in the repository.",
      },
    ],
    secretsTitle: "What must never be committed?",
    secretsBody: [
      "GEMINI_API_KEY and INGEST_API_TOKEN are secrets. They belong in your local .env file or in your hosting provider's environment variable panel, nowhere else.",
      "The .env file is in .gitignore and is never pushed. The repository only carries .env.example, which holds no real values.",
      "None of these values reach the browser: model calls happen on the server, and the interface only talks to its own server.",
    ],
    frontendTitle: "Interface environment variables",
    frontendBody:
      "The interface carries no API key at all. Its server only needs to know where to find the backend.",
    frontendVars: [
      {
        name: "AGENT_API_URL",
        example: "http://localhost:8000",
        required: true,
        secret: false,
        description: "The backend address. It is NOT prefixed with NEXT_PUBLIC_: it is read on the server only and the browser never sees it.",
      },
      {
        name: "DEMO_MODE",
        example: "false",
        required: false,
        secret: false,
        description: "Setting it to false turns on live mode, so questions really go to the agent.",
      },
      {
        name: "UPLOAD_ENABLED",
        example: "true",
        required: false,
        secret: false,
        description: "Whether the document area is active in the interface. It works together with the backend setting of the same name.",
      },
      {
        name: "NEXT_PUBLIC_GITHUB_URL",
        example: "https://github.com/user/repository",
        required: false,
        secret: false,
        description: "The public repository link. It is not a secret, so it may be exposed to the browser with the NEXT_PUBLIC_ prefix.",
      },
    ],
    runTitle: "Commands",
    runIntro: "The backend and the interface are separate processes; run them in two terminals.",
    copy: "Copy",
    copied: "Copied",
  },

  footer: {
    tagline: "Agent Lab — an independent agentic AI engineering experiment",
    about: "About",
  },
} satisfies Messages;
