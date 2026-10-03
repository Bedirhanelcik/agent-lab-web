/** 中文（简体）。技术术语保留英文原样，仅翻译说明性文字。 */

import type { Messages } from "../types.ts";

export const zh = {
  meta: {
    siteTitle: "Agent Lab — 知道何时该检索的 agent",
    titleTemplate: "%s — Agent Lab",
    siteDescription:
      "一个独立的 agentic AI 工程实验，基于 Hybrid Retrieval、自适应推理与有据可依的回答。",
    ogDescription:
      "Hybrid Retrieval。自适应推理。有据可依的回答。一个独立的 agentic AI 工程实验。",
    systemTitle: "系统",
    systemDescription: "Hybrid Retrieval、agent 决策循环与评估层的技术拆解。",
    playgroundTitle: "Playground",
    playgroundDescription:
      "agent 的运行记录：决策轨迹、执行的检索、取回的片段以及有据可依的回答。",
    evaluationTitle: "Evaluation",
    evaluationDescription:
      "如何衡量 agent 的行为：测试用例、结构化 assertion、结果与局限。",
    aboutTitle: "关于",
    aboutDescription:
      "一个独立的 AI 工程项目，把检索、基于工具的决策与评估整合进同一套架构。",
    apiSetupTitle: "API 配置",
    apiSetupDescription: "如何用你自己的 Gemini API 密钥在本地或 Render 上运行本系统。",
  },

  nav: {
    skipToContent: "跳到正文",
    ariaLabel: "主导航",
    home: "首页",
    system: "工作原理",
    playground: "Playground",
    evaluation: "Evaluation",
    apiSetup: "API 配置",
    about: "关于",
  },

  language: {
    label: "语言",
    current: "当前语言",
  },

  mode: {
    label: "状态",
    demo: "演示",
    live: "实时",
    demoHint: "展示的是预先准备好的运行记录；不会发起真实的模型调用。",
    liveHint: "实时 agent 调用已启用。",
  },

  home: {
    heroEyebrow: "Agentic retrieval 系统",
    heroTitleLine1: "一个知道何时",
    heroTitleLine2: "该检索的 agent。",
    heroSubtitle: "Hybrid Retrieval。自适应推理。有据可依的回答。",
    ctaPlayground: "上传你的文档",
    ctaSystem: "了解系统",
    pillars: [
      {
        title: "RAG",
        body: "Vector Search 与 BM25 各自独立运行，结果再由 Reciprocal Rank Fusion 合并。chunk 标识是确定性的。",
      },
      {
        title: "Agent",
        body: "它自行决定是否检索，检查取回的片段，必要时重写查询并再次检索。",
      },
      {
        title: "Evaluation",
        body: "衡量行为：返回了哪个 status、是否真的调用了 RAG、来源是否正确、对语料之外的问题是否凭空编造。",
      },
    ],
    whyEyebrow: "为什么做这个",
    whyTitle: "不只是又一个 RAG 演示",
    whyDescription:
      "上传你自己的文档，让系统把它们变成可检索的内容，然后向它们提问。多数示例把问题交给 Vector Search，再把结果喂给语言模型；这里的不同之处是决策层：系统自行判断是否需要检索、返回的内容是否足够、是否值得再试一次。上下文不足时它拒绝作答。",
    facts: [
      { value: "475", label: "本地测试" },
      { value: "6", label: "评估用例" },
      { value: "2", label: "retrieval 方法" },
      { value: "0", label: "framework 层" },
    ],
  },

  architecture: {
    eyebrow: "架构",
    title: "一个问题在系统中走过的路径",
    description:
      "agent 先判断是否需要检索。如果需要，两种 retrieval 方法并行运行，结果按排名合并，只有上下文足够时才生成回答。",
    nodes: {
      user: "问题",
      agent: "评估 · 检查 · 重写",
      ragSearch: "rag_search 工具",
      vector: "Chroma · Gemini embedding",
      keyword: "rank-bm25",
      fusion: "reciprocal rank fusion",
      passages: "chunk_id · 来源 · 排名",
      synthesis: "有据可依的综合",
      answer: "带引用的回答",
      answerLabel: "有据可依的回答",
    },
    points: [
      {
        title: "决策层",
        body: "agent 判断是否需要查阅档案。对于问候这类输入，retrieval 完全不会被调用，工具调用次数保持为零。",
      },
      {
        title: "并行 retrieval",
        body: "Vector Search 捕捉语义相近，BM25 捕捉字面匹配。两者互补彼此的弱点；土耳其语靠词尾变化构词，这一点尤其重要。",
      },
      {
        title: "按排名合并",
        body: "余弦相似度与 BM25 分数不在同一量纲。RRF 完全忽略分数、只用排名，因此不需要脆弱的归一化。",
      },
      {
        title: "有据可依的回答",
        body: "综合只使用取回的片段，每一处论断都绑定到一个 chunk 标识。上下文不足时 agent 拒绝作答。",
      },
    ],
  },

  system: {
    heroEyebrow: "技术拆解",
    heroTitle: "系统",
    heroSubtitle:
      "三层：负责找到信息的 retrieval、决定何时以及如何检索的 agent，以及衡量行为的评估层。",
    retrievalEyebrow: "第 01 层 — Retrieval",
    retrievalTitle: "Hybrid Retrieval",
    retrievalDescription:
      "Vector Search 能捕捉语义相近，但会模糊罕见术语和专有名词；BM25 在字面匹配上很强，但会漏掉词形变化。两者分别运行，再合并各自的排名。",
    retrievalParts: [
      {
        title: "Chroma",
        body: "持久化向量库。chunk 文本与 metadata 保存在磁盘上。",
      },
      {
        title: "BM25",
        body: "字面词匹配。驻留在内存中，启动时从 Chroma 重建。",
      },
      {
        title: "Reciprocal Rank Fusion",
        body: "忽略分数量纲，只使用排名（k = 60）。",
      },
      {
        title: "gemini-embedding-001",
        body: "embedding 通过 Gemini API 生成（768 维），查询与片段使用不同的 task type。不加载本地 ML 模型，因此服务能保持在 512 MB 内存限制之下。",
      },
      {
        title: "确定性的 chunk 标识",
        body: "source_file::chunk_index。用作 citation 和再次取回的键。",
      },
    ],
    agentEyebrow: "第 02 层 — Agent",
    agentTitle: "决策循环",
    agentDescription:
      "不是固定的流水线，而是边界明确的小型状态机。每一步都有一个决策，而这些决策会改变流程。",
    flow: {
      states: [
        {
          label: "Assess",
          summary: "需要检索吗？",
          detail:
            "先分析问题。如果不需要文档知识，retrieval 完全不会被调用，流程直接走向回答。",
        },
        {
          label: "Search",
          summary: "调用 rag_search",
          detail:
            "agent 自己写检索查询，不必原样转发用户的句子。查询使用语料的语言书写。",
        },
        {
          label: "Inspect",
          summary: "片段够用吗？",
          detail:
            "检查返回的片段是否真的回答了问题。没有这一步，就谈不上“上下文不足”这个概念。",
        },
        {
          label: "Refine",
          summary: "重写查询",
          detail:
            "结果不足时更换查询并再次检索。尝试次数有上限，同一个查询不会执行两次。",
        },
        {
          label: "Answer",
          summary: "仅在上下文充足时",
          detail:
            "回答基于取回的片段并给出引用。上下文不足时根本不会调用综合，并会明确说明情况。",
        },
      ],
      nextStates: "可能的后继状态：",
      terminal: "终止",
    },
    evalEyebrow: "第 03 层 — Evaluation",
    evalTitle: "被测量的行为",
    evalDescription:
      "目标不是说“我做了一个 agent”，而是“我测量了它的行为”。评估看的是可观察的行为，而不是回答的措辞。",
    evalParts: [
      { value: "475", label: "本地测试", detail: "全部使用替身；零 API 调用。" },
      { value: "6", label: "评估用例", detail: "衡量行为，而非单一字符串匹配。" },
      {
        value: "25",
        label: "结构化 assertion",
        detail: "status、调用的工具、来源、citation 格式、编造检查。",
      },
      { value: "1", label: "LLM judge 调用", detail: "只用在真正需要语义判断的那一个用例。" },
    ],
    evalNote:
      "评估建立在另一个项目中的 prompt 评估 CLI 之上；assertion 逻辑定义在那里，不会在此重写。",
  },

  playground: {
    heroEyebrow: "Playground",
    heroTitle: "看看 agent 如何工作。",
    heroDemoSubtitle:
      "本页运行在演示模式：不会发起任何模型调用，展示的每条运行记录都是预先准备好的。",
    heroLiveSubtitle:
      "实时模式已开启：你的问题会发送到 agent 服务，回答将以你选择的语言生成。",
    questionLabel: "问题",
    placeholderDemo: "输入一个问题，或从下面的预设示例中选择",
    placeholderLive: "输入一个问题并按 Enter",
    submit: "提交",
    submittingDemo: "正在解析…",
    submittingLive: "正在运行…",
    examplesDemo: "试试示例语料",
    examplesLive: "示例问题",
    syntheticTag: "synthetic",
    idleDemo:
      "演示模式只回答上面的预设问题。选择一个，下方会显示 agent 做出的决策、执行的检索、取回的片段以及有据可依的回答。",
    idleLive:
      "实时模式已开启：你的问题会发送到 agent 服务，agent 自行决定是否检索，并且只依据找到的片段作答。",
    runningDemo: "正在解析预设运行记录",
    runningLive: "agent 正在工作",
    runningHint: "决策、检索与综合三步依次执行，可能需要几秒钟。",
    notFoundTitle: "未找到预设示例",
    notFoundBody:
      "这个问题没有对应的预设示例。由于演示模式不做任何实时模型调用，我们选择什么都不显示，而不是拿一条仅仅相似的运行记录来充数。请从上面的预设问题中选择一个。",
    notFoundQuery: "查找的内容：",
    demoDataTitle: "无法读取演示数据",
    demoDataBody:
      "预设运行记录的结构不符合预期，因此不展示任何示例。照样渲染损坏的数据会造成误导。",
    originSynthetic: "Synthetic — 预设演示运行",
    originPrepared: "预设演示运行",
    originSyntheticBody:
      "这条运行记录是手工构造的，从未真正执行过。它只用于展示查询重写成功的流程，并非真实的模型输出。",
    originPreparedBody: "此输出来自此前真实执行过的一次运行，并非在此实时生成。",
    originLanguageNote:
      "预设运行记录是在土耳其语语料上生成的：切换界面语言不会改变已记录的回答文本。若要获得所选语言的回答，需要实时模式。",
    reconstructedFields: "重建的字段：",
    reconstructedNone: "所有字段均来自观测（没有重建字段）",
  },

  result: {
    question: "问题",
    status: "Status",
    answer: "回答",
    trace: "agent 轨迹",
    traceSteps: "步",
    toolCalls: "工具调用",
    sources: "来源",
    noSources:
      "本次运行没有引用任何来源。要么 agent 没有检索，要么它认为返回的片段不够，因而没有依据任何片段作答。",
    noSteps: "本次运行没有记录任何步骤。",
    noToolCalls: "tool_calls：",
    noToolCallsBody:
      "对这个问题，agent 完全没有动用 retrieval。固定流水线无论如何都会检索；而在这里，不检索同样是一个决策。",
    toolCallCount: "tool_calls：",
    attemptOf: "次检索",
    fieldRank: "排名",
    fieldScore: "分数",
    fieldPage: "页码",
    fieldQuery: "查询",
    fieldTopK: "top_k",
    fieldPassagesFound: "找到的片段",
    fieldSourceFile: "来源文件",
    statusLabels: {
      answered: "已回答",
      answered_without_retrieval: "未检索即回答",
      insufficient_context: "上下文不足",
      tool_failure: "工具失败",
    },
    statusExplanations: {
      answered: "agent 执行了检索，认为返回的片段足够，并且只依据这些片段作答。",
      answered_without_retrieval:
        "agent 判断这个问题不需要查阅档案；retrieval 完全没有被调用。",
      insufficient_context:
        "检索执行了，但返回的片段不足以回答问题。agent 拒绝作答。",
      tool_failure: "retrieval 层发生错误。这种情况下 agent 不会重试，也不会生成回答。",
    },
    actionLabels: {
      assessed_question: "评估问题",
      searched_rag: "检索 RAG",
      refined_query: "重写查询",
      answered_from_context: "依据上下文作答",
      answered_without_retrieval: "未检索即回答",
      declared_insufficient_context: "声明上下文不足",
      tool_failed: "工具失败",
    },
  },

  errors: {
    title: {
      not_configured: "agent 服务尚未配置",
      invalid_request: "问题未能发送",
      quota_exhausted: "免费配额已用完",
      generation_error: "无法生成回答",
      corpus_empty: "尚未添加任何文档",
      agent_unavailable: "agent 当前不可用",
      upstream_error: "agent 服务返回了错误",
      bad_response: "响应结构不符合预期",
      timeout: "请求超时",
      network: "无法连接到 agent 服务",
    },
    body: {
      not_configured:
        "实时模式看起来已开启，但 agent 服务的地址未设置。在服务端配置完成之前无法发起实时查询。",
      invalid_request: "agent 服务未接受该请求。请确认问题不为空后重试。",
      quota_exhausted:
        "模型提供方的免费额度目前已耗尽。配额刷新后实时查询会恢复；在此期间可以查看演示模式中的预设运行记录。",
      generation_error: "retrieval 已完成，但综合步骤失败。这通常是暂时性的，重试是合理的。",
      corpus_empty: "agent 找不到可检索的文档：档案目前是空的。添加文档后即可回答问题。",
      agent_unavailable:
        "agent 服务在运行，但还不能接收查询。服务器配置完成后该端点就会响应。",
      upstream_error: "请求到达了 agent 服务，但以意外错误结束。重试可能没有帮助。",
      bad_response:
        "agent 服务返回的响应不符合约定。把格式错误的响应当成回答展示会造成误导，因此不渲染任何内容。",
      timeout: "agent 未在预期时间内响应。请求已取消；不会无限等待。",
      network: "无法建立连接。请确认 agent 服务正在运行后重试。",
    },
  },

  upload: {
    heading: "文档上传",
    availableBody:
      "上传 PDF、TXT 或 MD 文件。文档会走现有的 ingestion 流程：分页、切分成 chunk、生成 embedding，并写入向量索引和关键词索引。之后就可以在上方的问题框中检索到它。",
    disabledDemo: "演示模式下上传不会执行任何操作；展示的运行记录都是预设示例。",
    disabledEnv: "此环境中文档上传已关闭。",
    disabledReason:
      "上传只在本地开发时开启。原因出在架构上：语料目前在所有访问者之间共享，也就是说一位访问者上传的文档会进入其他人的检索范围。在实现按用户隔离之前，上传不应对公网开放。",
    fileInputLabel: "要上传的文档",
    submit: "上传",
    submitting: "正在添加…",
    runningTitle: "ingestion 正在运行",
    runningHint: "切分与 embedding 生成可能需要几秒钟，取决于文件大小。",
    doneTitle: "已添加",
    doneBody: "文档现在可被检索。你在上方提问时，agent 也会检索这部分内容。",
    chunkUnit: "个 chunk",
    failedTitle: "上传失败",
    errors: {
      not_configured: "agent 服务的地址未设置，因此文档未能发送。",
      upload_disabled: "此环境中文档上传已关闭。",
      no_files: "请先选择一个文件。",
      unsupported_file_type: "只接受 PDF、TXT 和 MD 文件。",
      file_too_large: "文件过大。上限为 {max} MB。",
      invalid_request: "文件名或请求被拒绝。请换一个文件名再试。",
      upstream_error: "agent 服务在上传过程中返回了错误。",
      bad_response: "上传响应结构不符合预期，因此不展示结果。",
      timeout: "上传未在预期时间内完成，已取消。",
      network: "无法连接到 agent 服务。请确认它正在运行。",
    },
  },

  evaluation: {
    heroEyebrow: "被测量的行为",
    heroTitle: "Evaluation",
    heroSubtitle:
      "目标不是说“我做了一个 agent”，而是“我测量了它的行为”。评估不看回答写得漂不漂亮，而看可观察的行为：返回了哪个 status、retrieval 是否真的被调用、是否引用了正确来源、对语料之外的问题是否凭空编造。",
    methodologyEyebrow: "方法",
    methodologyTitle: "suite 结构",
    methodologyDescription:
      "每个用例检查的是 agent 可观察的行为，而不是单一的字符串匹配。这些检查由另一个项目中定义的 assertion checker 执行，不在此处重写。",
    suiteShape: [
      {
        value: "6",
        label: "用例",
        detail:
          "事实型 RAG 问题、语料之外的问题、直接回答、citation 准确性、表述不充分的查询、语义质量。",
      },
      {
        value: "25",
        label: "assertion",
        detail: "status、被调用的工具、来源标识、动作轨迹、citation 格式与编造检查。",
      },
      {
        value: "1",
        label: "LLM judge 调用",
        detail: "只用在唯一需要语义判断的用例。其余所有检查都是确定性且免费的。",
      },
    ],
    suiteNote: "这些数字来自 suite 定义（配置），不是某次运行的结果。",
    resultsEyebrow: "结果",
    resultsTitle: "最近一次运行",
    resultsDescription:
      "结果只从真实评估运行产出的工件中读取。没有工件时，这里不会显示任何数字。",
    missingTitle: "没有可用的评估工件",
    missingBody:
      "本站没有可展示的评估工件。我们选择声明它的缺失而不是编造结果：一旦下面这个文件就位，本页就会读取并展示真实数字。",
    missingExpectedFile: "期望的文件：",
    missingHowTo:
      "工件是在托管 agent 服务的那个项目中运行评估 suite 产生的。那次运行会消耗 Gemini 配额，因此不从这里触发；本页只消费已有的工件。",
    invalidTitle: "工件无效",
    invalidBody:
      "文件找到了，但不符合预期的评估报告结构。把损坏或错误的文件当作结果展示会造成误导，因此不渲染任何数字。",
    limitationsTitle: "局限",
    limitations: [
      "评估运行在一个小语料上；在这个规模下 retrieval 排序不会受到真正的压力，结果不应被视为对生产系统有代表性。",
      "实时运行受免费配额限制：每分钟允许的请求数很少，即使在用例之间等待，一次运行也可能因配额耗尽而中途停止。这种情况下相关用例会被报告为配额错误，而不是“fail”。",
      "本页的结果与 playground 中预设的演示运行完全无关。演示数据在任何情况下都不算作评估结果；两种数据存放在不同文件中，并由不同的 schema 校验。",
    ],
    report: {
      cases: "用例",
      passed: "通过",
      failed: "失败",
      assertions: "assertion",
      geminiCalls: "Gemini 调用",
      callsNote: "{agent} agent + {judge} judge",
      suite: "suite",
      model: "模型",
      generatedAt: "生成时间",
      avgLatency: "平均延迟",
      casesHeading: "用例",
      pass: "通过",
      fail: "失败",
      status: "status",
      agentCalls: "agent 调用",
      judgeCalls: "judge 调用",
      latency: "延迟",
      error: "错误",
      score: "分数",
      assertionPassed: "通过",
      assertionFailed: "失败",
    },
  },

  about: {
    heroEyebrow: "这个项目",
    heroTitle: "作为一次 agentic AI 工程实验而构建。",
    paragraphs: [
      "这个项目探索 AI 系统如何超越单纯的文本生成：把检索、基于工具的决策与可度量的评估整合进同一套架构。",
      "系统不是通用聊天机器人。你带来自己的文档，它们被处理成可检索的知识库；agent 自行判断何时需要检索，把混合检索当作工具使用，并且只依据找到的证据作答。",
      "三个部分各自独立运行、独立测试：Hybrid Retrieval 层、带决策循环的 agent，以及用可度量的测试用例而非主观印象来衡量该行为的评估系统。这个界面把三者合成一个可交互的应用。",
    ],
    stackHeading: "技术栈",
    stackGroups: [
      { group: "界面", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
      { group: "服务", items: ["FastAPI", "Python", "Pydantic"] },
      { group: "Retrieval", items: ["Chroma", "BM25", "RRF", "gemini-embedding-001"] },
      { group: "推理", items: ["Gemini", "Agentic workflow", "RAG"] },
    ],
    linksHeading: "链接",
  },

  theme: {
    label: "主题",
    toLight: "切换到浅色主题",
    toDark: "切换到深色主题",
  },

  documents: {
    eyebrow: "你自己的文档",
    heading: "上传你的文档并向它们提问",
    intro:
      "你上传的文件会被解析为文本、切分成 chunk、用 Gemini 生成 embedding，并同时写入向量索引和关键词索引。完成的那一刻，agent 检索的就是你的文档。",
    dropTitle: "把文件拖到这里",
    dropHint: "或从电脑中选择",
    browse: "选择文件",
    accepted: "PDF、TXT、MD",
    maxSize: "每个文件最大 {max} MB",
    selectedTitle: "已选文件",
    clearSelection: "清除选择",
    upload: "上传并索引",
    uploading: "上传中…",
    indexing: "索引中",
    indexingHint: "文本提取、切分与 embedding 依次执行；根据文件大小可能需要几秒钟。",
    successTitle: "已加入语料",
    successBody: "你的文档现在已是检索语料的一部分。",
    corpusNote: "语料当前共有 {chunks} 个 chunk。",
    askNow: "立即提问",
    failedTitle: "上传失败",
    listTitle: "语料中的文档",
    listEmptyTitle: "语料为空",
    listEmptyBody: "目前还没有任何索引内容。上传一个文件，agent 回答你的问题时才有可检索的材料。",
    chunkCount: "{count} 个 chunk",
    remove: "移除",
    removing: "移除中…",
    removeFailed: "无法移除该文档。",
    resetTitle: "重置语料",
    resetBody: "从向量索引和关键词索引中删除所有文档。此操作不可撤销。",
    reset: "重置语料",
    resetting: "重置中…",
    resetDone: "语料已清空。",
    resetFailed: "无法重置语料。",
    corpusSize: "语料",
    keywordIndex: "关键词索引",
    readOnlyTitle: "语料为只读",
    readOnlyBody:
      "此环境中已关闭文档的添加与删除。语料在所有访问者之间共享，因此在实现按用户隔离之前不会对公网开放写入。在自己的机器上运行时，可用 UPLOAD_ENABLED=true 开启。",
    demoTitle: "演示模式下上传不执行任何操作",
    demoBody: "本页当前展示预设运行记录，不会发起任何模型调用。若要上传自己的文档，请以实时模式运行系统。",
    loading: "正在读取语料…",
    loadFailed: "无法读取语料状态。",
  },

  howItWorks: {
    eyebrow: "工作原理",
    heading: "从一份文档到有据可依的回答",
    intro: "系统包含两条独立流程：让文档可被检索的索引流程，以及把问题变成带来源回答的问答流程。下面逐步说明。",
    stepLabel: "步骤",
    ingestTitle: "1. 文档索引",
    ingestIntro: "上传文件后依次发生：",
    ingestSteps: [
      { title: "上传", body: "你的 PDF、TXT 或 MD 文件从浏览器送到服务器。浏览器从不接触后端地址或任何密钥；请求经由 Next.js 服务器转发。" },
      { title: "文本提取", body: "读取文件中的纯文本。PDF 会保留页码，这样回答之后可以指出内容来自哪一页。" },
      { title: "切分 chunk", body: "文本被切成约 1000 字符的片段，相邻片段重叠 150 字符。重叠可避免一句话正好落在边界而失去上下文。" },
      { title: "Gemini Embedding", body: "每个 chunk 被转换成一串代表其含义的数字。含义相近的文本在这个空间中彼此靠近。" },
      { title: "Chroma 向量索引", body: "embedding 连同 chunk 文本与来源一起写入持久化向量数据库。" },
      { title: "BM25 关键词索引", body: "同样的 chunk 还会进入基于词的索引。向量检索捕捉含义，BM25 捕捉字面词；两者协同工作。" },
    ],
    askTitle: "2. 回答问题",
    askIntro: "当你提问时，流程如下：",
    askSteps: [
      { title: "问题", body: "你用自己的语言书写问题。回答会以你选择的界面语言生成。" },
      { title: "agent 先做判断", body: "agent 先问自己：回答这个问题需要查文档吗？对于问候或简单算术则不需要。" },
      { title: "检索决策", body: "如果不需要，就完全不执行检索，工具调用次数保持为零。这正是与固定流水线的区别：不检索同样是一个决策。" },
      { title: "检索工具", body: "如果需要，agent 自己写检索查询——不必原样转发你的句子——然后调用 rag_search 工具。" },
      { title: "Vector Search + BM25", body: "两种检索并行执行：一种找语义相近，一种找字面匹配。" },
      { title: "RRF 合并", body: "两个排名合并为一个。由于分数不在同一量纲，只使用排名。" },
      { title: "Gemini 生成有据可依的回答", body: "回答只基于取回的片段生成，每一处论断都绑定到一个 chunk 标识。若片段不足，agent 会拒绝作答。" },
    ],
    glossaryTitle: "术语",
    glossaryIntro: "界面中出现的技术术语的通俗解释。术语本身保留英文，因为文献中就是这样称呼的。",
    glossary: [
      { term: "RAG", body: "Retrieval-Augmented Generation。与其让 AI 只凭自身知识作答，系统会先从你的文档中检索相关信息，并据此生成回答。" },
      { term: "Vector Search", body: "按语义相近程度而非字面词匹配来查找文档。" },
      { term: "BM25", body: "基于关键词的检索方法，找出包含查询中重要词语的文档。" },
      { term: "RRF", body: "Reciprocal Rank Fusion。把不同检索方法的结果合并成单一排名。" },
      { term: "Agent", body: "一个决策层，可以自行判断在作答前是否需要调用检索工具。" },
      { term: "Embedding", body: "文本的数值表示，使语义相近的内容能够被找到。" },
      { term: "Chunk", body: "文档中的一个较小片段，便于检索系统在有用的片段上工作，而不是一次处理整份文件。" },
      { term: "Citation", body: "指明回答由哪份文档、哪个 chunk 支撑的来源引用。" },
    ],
  },

  apiSetup: {
    navBadge: "API",
    heroEyebrow: "配置指南",
    heroTitle: "用你自己的 Gemini API 密钥运行本系统",
    heroIntro: "本项目的生成与 embedding 都使用 Gemini。使用自己的密钥时，请求计入你自己项目的配额，并且可以在自己的环境中完整运行整个系统。",
    whyTitle: "为什么需要我自己的 API 密钥？",
    whyBody: [
      "应用在两处调用模型：索引文档时生成 embedding；提问时调用 Gemini 完成 agent 决策与回答综合。两者都需要 API 密钥。",
      "密钥只在服务器端读取，绝不会发送到浏览器。使用自己的密钥意味着请求受你的配额与限额约束。",
    ],
    quotaTitle: "配额与价格",
    quotaBody: "Gemini API 的可用性、免费层配额与价格取决于 Google 当前的政策、你选择的模型以及你的账户。部署前请查阅 Google 的最新信息。",
    quotaLink: "Gemini API 价格与配额说明",
    quotaNote: "本项目不承诺无限量或永久免费。配额用尽时，应用会给出明确的错误提示，而不会悄悄产生错误答案。",
    githubTitle: "源代码",
    githubBody: "你可以克隆项目、在自己的机器上运行、用自己的文档试用，并随意修改。",
    githubButton: "在 GitHub 上查看",
    githubMissing: "此部署中未配置仓库地址。",
    localTitle: "本地部署",
    localIntro: "四步即可在你的机器上运行。",
    localSteps: [
      { title: "克隆仓库", body: "下载源码并进入项目目录。" },
      { title: "获取 API 密钥", body: "通过 Google AI Studio 创建一个 Gemini API 密钥。" },
      { title: "创建 .env 文件", body: "把仓库中的 .env.example 复制为 .env，并填入你的密钥。该文件已列入 .gitignore，不会被推送到仓库。" },
      { title: "启动服务", body: "安装依赖并启动 API，然后启动前端界面。" },
    ],
    envTitle: "后端环境变量",
    envIntro: "唯一必填项是 API 密钥，其余都有合理默认值。下列名称与仓库 .env.example 中完全一致。",
    envRequired: "必填",
    envOptional: "可选",
    envSecret: "机密",
    envVars: [
      { name: "GEMINI_API_KEY", example: "YOUR_API_KEY", required: true, secret: true, description: "你的 Gemini API 密钥。生成与 embedding 都依赖它。" },
      { name: "GEMINI_AGENT_MODEL", example: "gemini-2.5-flash", required: false, secret: false, description: "用于 agent 决策与回答综合的模型。" },
      { name: "EMBEDDING_MODEL_NAME", example: "gemini-embedding-001", required: false, secret: false, description: "embedding 模型。必须是 Gemini 的 embedding 模型，而不是本地模型名。" },
      { name: "EMBEDDING_DIMENSIONS", example: "768", required: false, secret: false, description: "embedding 维度，必须与现有索引一致。" },
      { name: "CHROMA_PERSIST_DIR", example: "data/chroma", required: false, secret: false, description: "向量数据库在磁盘上的位置。" },
      { name: "UPLOAD_ENABLED", example: "true", required: false, secret: false, description: "是否允许从界面上传与删除文档。由于语料共享，部署环境默认关闭。" },
      { name: "INGEST_API_TOKEN", example: "一个足够长的随机值", required: false, secret: true, description: "保护运维用的 ingestion 端点。未设置时该端点不提供服务。它绝不会发送到浏览器。" },
      { name: "ALLOWED_ORIGINS", example: "https://example.vercel.app", required: false, secret: false, description: "仅当浏览器直接访问后端时才需要。推荐配置下保持为空。" },
    ],
    renderTitle: "在 Render 上部署",
    renderIntro: "若把后端部署到 Render，环境变量填写在服务自身的设置中，而不是文件里。",
    renderSteps: [
      { title: "Render", body: "在你的账户中把项目创建为 Web 服务。" },
      { title: "Service", body: "仓库中的 render.yaml 已定义好套餐、Docker 文件与健康检查。" },
      { title: "Environment", body: "进入服务设置中的 Environment 部分。" },
      { title: "Environment Variables", body: "在这里填入 GEMINI_API_KEY。blueprint 已将该变量标记为不同步，因此它的值只存在于控制台，而不在仓库中。" },
    ],
    secretsTitle: "哪些内容绝不能提交到仓库？",
    secretsBody: [
      "GEMINI_API_KEY 与 INGEST_API_TOKEN 是机密值，只应存在于本地 .env 文件或托管平台的环境变量面板中。",
      ".env 文件已列入 .gitignore，不会被推送。仓库中只有不含真实值的 .env.example。",
      "这些值都不会到达浏览器：模型调用在服务器端完成，界面只与自己的服务器通信。",
    ],
    frontendTitle: "前端环境变量",
    frontendBody: "前端本身不携带任何 API 密钥，它的服务器只需要知道后端在哪里。",
    frontendVars: [
      { name: "AGENT_API_URL", example: "http://localhost:8000", required: true, secret: false, description: "后端地址。它没有 NEXT_PUBLIC_ 前缀：只在服务器端读取，浏览器看不到。" },
      { name: "DEMO_MODE", example: "false", required: false, secret: false, description: "设为 false 即开启实时模式，问题会真正发送给 agent。" },
      { name: "UPLOAD_ENABLED", example: "true", required: false, secret: false, description: "界面中的文档区域是否启用，与后端同名设置配合使用。" },
      { name: "NEXT_PUBLIC_GITHUB_URL", example: "https://github.com/user/repo", required: false, secret: false, description: "公开仓库链接。不是机密，因此可以用 NEXT_PUBLIC_ 前缀暴露给浏览器。" },
    ],
    runTitle: "运行命令",
    runIntro: "后端与界面是两个独立进程，请在两个终端中分别运行。",
    copy: "复制",
    copied: "已复制",
  },

  footer: {
    tagline: "Agent Lab — 一个独立的 agentic AI 工程实验",
    about: "关于",
  },
} satisfies Messages;
