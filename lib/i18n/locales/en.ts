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
      "An independent engineering project that grew out of agentic AI coursework.",
  },

  nav: {
    skipToContent: "Skip to content",
    ariaLabel: "Main navigation",
    home: "Home",
    system: "System",
    playground: "Playground",
    evaluation: "Evaluation",
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
    ctaPlayground: "Try the agent",
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
      "Most examples take a question, hand it to Vector Search and pass the result to a language model. The difference here is the decision layer: the system decides for itself whether a search is needed, whether what came back is sufficient and whether another attempt is worth making. It refuses to answer on insufficient context.",
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
    examplesDemo: "Prepared questions",
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
      "I first encountered agentic AI topics in a software engineering course. They caught my interest, and taking the syllabus as a reference I started an independent project to push my own AI development work further.",
      "The project is not a homework submission: the course was a starting point, and the whole system was designed and written independently of it. The aim was not to produce a general-purpose chat interface but to build a system that uses retrieval as a tool, decides for itself when to search, and does not answer without citing a source.",
      "The three parts work independently and are tested independently: the Hybrid Retrieval layer, the agent with its decision loop, and the evaluation system that measures the agent's behaviour. This site brings them together under one narrative.",
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

  footer: {
    tagline: "Agent Lab — an independent agentic AI engineering experiment",
    about: "About",
  },
} satisfies Messages;
