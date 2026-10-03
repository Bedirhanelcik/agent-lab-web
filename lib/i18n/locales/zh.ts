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
    aboutDescription: "一个由 agentic AI 课程内容出发、独立开展的工程项目。",
  },

  nav: {
    skipToContent: "跳到正文",
    ariaLabel: "主导航",
    home: "首页",
    system: "系统",
    playground: "Playground",
    evaluation: "Evaluation",
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
    ctaPlayground: "试用 agent",
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
      "多数示例把问题交给 Vector Search，再把结果喂给语言模型。这里的不同之处是决策层：系统自行判断是否需要检索、返回的内容是否足够、是否值得再试一次。上下文不足时它拒绝作答。",
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
    examplesDemo: "预设问题",
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
      "我是在一门软件工程课上第一次接触 agentic AI 的相关内容。它们引起了我的兴趣，于是我以课程大纲为参考，开始了一个独立项目，把自己的 AI 开发工作推得更远。",
      "这个项目不是作业提交：课程只是一个起点，整个系统的设计与实现都独立于它。目标不是做一个通用聊天界面，而是构建一个把 retrieval 当作工具、自行决定何时检索、并且不引用来源就不作答的系统。",
      "三个部分各自独立运行、独立测试：Hybrid Retrieval 层、带决策循环的 agent，以及衡量 agent 行为的评估系统。本站把它们统一在一条叙述之下。",
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

  footer: {
    tagline: "Agent Lab — 一个独立的 agentic AI 工程实验",
    about: "关于",
  },
} satisfies Messages;
