/**
 * Sözlük şekli ve dil kayıtları.
 *
 * `Messages` bilinçli olarak açıkça yazılmış bir arayüz: her dil dosyası onu
 * `satisfies Messages` ile karşıladığını beyan ediyor, böylece eksik veya
 * fazla bir anahtar derleme zamanında hata veriyor. Yedi dili elle senkron
 * tutmaya çalışmak yerine tip sistemi bunu garanti ediyor.
 *
 * Teknik terimler (RAG, BM25, RRF, Embedding, Chunk, Citation, Agent, API,
 * Playground, Evaluation, Gemini, Chroma, Vector Search, Hybrid Retrieval)
 * çevrilmez: kullanıcı bunları aynı adla tanımalı. Çevrilen şey, onları
 * açıklayan cümlelerdir.
 */

export const LOCALES = ["tr", "en", "fr", "ar", "es", "zh", "hi"] as const;

export type Locale = (typeof LOCALES)[number];

export type Direction = "ltr" | "rtl";

/** Seçicide gösterilen dil adı, dilin kendi yazımıyla. */
export interface LocaleInfo {
  code: Locale;
  /** Dilin kendi adı — İngilizce karşılığı değil. */
  nativeName: string;
  dir: Direction;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  tr: { code: "tr", nativeName: "Türkçe", dir: "ltr" },
  en: { code: "en", nativeName: "English", dir: "ltr" },
  fr: { code: "fr", nativeName: "Français", dir: "ltr" },
  ar: { code: "ar", nativeName: "العربية", dir: "rtl" },
  es: { code: "es", nativeName: "Español", dir: "ltr" },
  zh: { code: "zh", nativeName: "中文（简体）", dir: "ltr" },
  hi: { code: "hi", nativeName: "हिन्दी", dir: "ltr" },
};

export interface LabelledItem {
  title: string;
  body: string;
}

export interface ValueFact {
  value: string;
  label: string;
  detail?: string;
}

export interface FlowState {
  label: string;
  summary: string;
  detail: string;
}

export interface Messages {
  meta: {
    siteTitle: string;
    titleTemplate: string;
    siteDescription: string;
    ogDescription: string;
    systemTitle: string;
    systemDescription: string;
    playgroundTitle: string;
    playgroundDescription: string;
    evaluationTitle: string;
    evaluationDescription: string;
    aboutTitle: string;
    aboutDescription: string;
  };

  nav: {
    skipToContent: string;
    ariaLabel: string;
    home: string;
    system: string;
    playground: string;
    evaluation: string;
    about: string;
  };

  language: {
    /** Seçicinin erişilebilir adı. */
    label: string;
    /** Ekran okuyucuya seçili dili bildirir. */
    current: string;
  };

  mode: {
    label: string;
    demo: string;
    live: string;
    demoHint: string;
    liveHint: string;
  };

  home: {
    heroEyebrow: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    ctaPlayground: string;
    ctaSystem: string;
    pillars: [LabelledItem, LabelledItem, LabelledItem];
    whyEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    facts: ValueFact[];
  };

  architecture: {
    eyebrow: string;
    title: string;
    description: string;
    nodes: {
      user: string;
      agent: string;
      ragSearch: string;
      vector: string;
      keyword: string;
      fusion: string;
      passages: string;
      synthesis: string;
      answer: string;
      answerLabel: string;
    };
    points: LabelledItem[];
  };

  system: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    retrievalEyebrow: string;
    retrievalTitle: string;
    retrievalDescription: string;
    retrievalParts: LabelledItem[];
    agentEyebrow: string;
    agentTitle: string;
    agentDescription: string;
    flow: {
      states: FlowState[];
      nextStates: string;
      terminal: string;
    };
    evalEyebrow: string;
    evalTitle: string;
    evalDescription: string;
    evalParts: ValueFact[];
    evalNote: string;
  };

  playground: {
    heroEyebrow: string;
    heroTitle: string;
    heroDemoSubtitle: string;
    heroLiveSubtitle: string;
    questionLabel: string;
    placeholderDemo: string;
    placeholderLive: string;
    submit: string;
    submittingDemo: string;
    submittingLive: string;
    examplesDemo: string;
    examplesLive: string;
    syntheticTag: string;
    idleDemo: string;
    idleLive: string;
    runningDemo: string;
    runningLive: string;
    runningHint: string;
    notFoundTitle: string;
    notFoundBody: string;
    notFoundQuery: string;
    demoDataTitle: string;
    demoDataBody: string;
    originSynthetic: string;
    originPrepared: string;
    originSyntheticBody: string;
    originPreparedBody: string;
    originLanguageNote: string;
    reconstructedFields: string;
    reconstructedNone: string;
  };

  result: {
    question: string;
    status: string;
    answer: string;
    trace: string;
    traceSteps: string;
    toolCalls: string;
    sources: string;
    noSources: string;
    noSteps: string;
    noToolCalls: string;
    noToolCallsBody: string;
    toolCallCount: string;
    attemptOf: string;
    fieldRank: string;
    fieldScore: string;
    fieldPage: string;
    fieldQuery: string;
    fieldTopK: string;
    fieldPassagesFound: string;
    fieldSourceFile: string;
    statusLabels: Record<string, string>;
    statusExplanations: Record<string, string>;
    actionLabels: Record<string, string>;
  };

  errors: {
    title: Record<string, string>;
    body: Record<string, string>;
  };

  upload: {
    heading: string;
    availableBody: string;
    disabledDemo: string;
    disabledEnv: string;
    disabledReason: string;
    fileInputLabel: string;
    submit: string;
    submitting: string;
    runningTitle: string;
    runningHint: string;
    doneTitle: string;
    doneBody: string;
    chunkUnit: string;
    failedTitle: string;
    errors: Record<string, string>;
  };

  evaluation: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    methodologyEyebrow: string;
    methodologyTitle: string;
    methodologyDescription: string;
    suiteShape: ValueFact[];
    suiteNote: string;
    resultsEyebrow: string;
    resultsTitle: string;
    resultsDescription: string;
    missingTitle: string;
    missingBody: string;
    missingExpectedFile: string;
    missingHowTo: string;
    invalidTitle: string;
    invalidBody: string;
    limitationsTitle: string;
    limitations: string[];
    report: {
      cases: string;
      passed: string;
      failed: string;
      assertions: string;
      geminiCalls: string;
      callsNote: string;
      suite: string;
      model: string;
      generatedAt: string;
      avgLatency: string;
      casesHeading: string;
      pass: string;
      fail: string;
      status: string;
      agentCalls: string;
      judgeCalls: string;
      latency: string;
      error: string;
      score: string;
      assertionPassed: string;
      assertionFailed: string;
    };
  };

  about: {
    heroEyebrow: string;
    heroTitle: string;
    paragraphs: string[];
    stackHeading: string;
    stackGroups: { group: string; items: string[] }[];
    linksHeading: string;
  };

  footer: {
    tagline: string;
    about: string;
  };
}
