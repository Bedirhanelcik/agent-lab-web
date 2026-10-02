/**
 * Agent sözleşmesi ve demo verisine erişim katmanı.
 *
 * Alan adları ve değerler backend'in `/agent/ask` yanıtıyla (`AgentAskResponse`,
 * `AgentStatus`, `AgentAction`, `ToolStatus`) birebir aynıdır; demo verisi de
 * aynı şekli taşıdığı için arayüz tek bir render yolu kullanır ve P5'te canlı
 * moda geçmek veri kaynağını değiştirmekten ibaret olur.
 *
 * Modül bilinçli olarak kendi kendine yeter (başka modülden içe aktarım yok):
 * böylece Node'un dahili test runner'ı tip sıyırma ile doğrudan yükleyebiliyor
 * ve test için ek bir bağımlılık kurulmuyor.
 *
 * `enum` yerine const dizi + union kullanılıyor: hem çalışma zamanında değer
 * listesine ihtiyaç var hem de tip sıyırma silinebilir sözdizimi istiyor.
 */

/* --- sözleşme --- */

export const AGENT_STATUSES = [
  "answered",
  "answered_without_retrieval",
  "insufficient_context",
  "tool_failure",
] as const;

export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const AGENT_ACTIONS = [
  "assessed_question",
  "searched_rag",
  "refined_query",
  "answered_from_context",
  "answered_without_retrieval",
  "declared_insufficient_context",
  "tool_failed",
] as const;

export type AgentAction = (typeof AGENT_ACTIONS)[number];

export const TOOL_STATUSES = ["ok", "empty", "failed"] as const;

export type ToolStatus = (typeof TOOL_STATUSES)[number];

export interface AgentSource {
  chunk_id: string;
  source_file: string;
  page_number: number | null;
  text: string;
  rank: number;
  score: number;
}

export interface AgentStep {
  action: AgentAction;
  /** Zaten kısaltılmış, güvenli özet. Modelin ham çıktısı değildir. */
  detail: string;
}

export interface AgentToolCall {
  tool: string;
  query: string;
  top_k: number;
  source_file: string | null;
  status: ToolStatus;
  passages_found: number;
}

/** `/agent/ask` yanıtının tamamı -- fazlası değil. */
export interface AgentRun {
  answer: string;
  status: AgentStatus;
  sources: AgentSource[];
  steps: AgentStep[];
  tool_calls: AgentToolCall[];
}

/* --- demo verisi --- */

export const PROVENANCE_SOURCES = [
  "live_smoke_test",
  "live_eval_suite",
  "handcrafted",
] as const;

export type ProvenanceSource = (typeof PROVENANCE_SOURCES)[number];

export interface DemoProvenance {
  source: ProvenanceSource;
  note: string;
  reconstructed_fields: string[];
}

export interface DemoRun extends AgentRun {
  id: string;
  question: string;
  /** true ise bu koşu hiç çalıştırılmamıştır; arayüzde açıkça işaretlenir. */
  synthetic: boolean;
  provenance: DemoProvenance;
}

export interface DemoRunFile {
  mode: "demo";
  note: string;
  fixtures: DemoRun[];
}

/**
 * Arayüzün gördüğü tek şey: sözleşme alanları + bunun hazırlanmış bir koşu
 * olduğunu söyleyen köken bilgisi. Başka hiçbir alan geçmez.
 */
export interface DemoRunView {
  id: string;
  question: string;
  synthetic: boolean;
  provenanceNote: string;
  reconstructedFields: string[];
  run: AgentRun;
}

/* --- Türkçe'ye uygun eşleştirme --- */

export function normalizeQuestion(question: string): string {
  return question.normalize("NFC").replace(/\s+/gu, " ").trim();
}

/**
 * Arama amaçlı katlama.
 *
 * Türkçe'de `toLowerCase()`/`toUpperCase()` kullanılamaz: "i" büyük harfe
 * çevrilince "I" olur ve geri dönüşte "ı" verir -- bilgi kaybolur, hiçbir
 * algoritma geri getiremez. `Intl.Collator` da tek başına yetmiyor: Türkçe
 * locale'de "ı" ile "i" ayrı temel harfler olduğundan büyük harfle yazılmış
 * girdi eşleşmiyor, İngilizce locale'de ise noktasız "ı" eşleşmiyor (ikisi de
 * ölçülerek doğrulandı).
 *
 * Bu yüzden karşılaştırma açık ve locale'den bağımsız bir katlama üzerinden
 * yapılır: Unicode ayrıştırmasıyla aksan işaretleri kaldırılır, noktasız "ı"
 * ile noktalı büyük "İ" açıkça "i"ye eşlenir, ve yalnızca ASCII A-Z aralığı
 * küçültülür. Sonuç deterministiktir; "TÜRKIYE'NIN BÖLGELERI" ile
 * "türkiye'nin bölgeleri" aynı dizeye katlanır.
 *
 * Katlama yalnızca eşitlik karşılaştırması içindir; benzerlik tahmini yapılmaz.
 */
export function foldForSearch(value: string): string {
  const withoutMarks = normalizeQuestion(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "");

  let folded = "";
  for (const char of withoutMarks) {
    if (char === "ı" || char === "İ" || char === "I") {
      folded += "i";
      continue;
    }
    const code = char.codePointAt(0) ?? 0;
    // Yalnızca ASCII büyük harfler; locale'e bağlı bir dönüşüm yok.
    folded += code >= 65 && code <= 90 ? String.fromCodePoint(code + 32) : char;
  }
  return folded;
}

export function questionsMatch(a: string, b: string): boolean {
  return foldForSearch(a) === foldForSearch(b);
}

/**
 * Soruya karşılık gelen hazırlanmış koşuyu bulur.
 *
 * Yalnızca tam (katlanmış) eşleşme kabul edilir. Benzerlik tahmini yapılmaz:
 * yanlış bir koşuyu "yakın" diye göstermek, kullanıcıya sormadığı sorunun
 * cevabını vermek olurdu.
 */
export function findDemoRun(runs: readonly DemoRun[], question: string): DemoRun | null {
  if (!normalizeQuestion(question)) return null;
  return runs.find((run) => questionsMatch(run.question, question)) ?? null;
}

export function findDemoRunById(runs: readonly DemoRun[], id: string): DemoRun | null {
  return runs.find((run) => run.id === id) ?? null;
}

/* --- projeksiyon: arayüze yalnızca sözleşme alanları --- */

function projectSource(source: AgentSource): AgentSource {
  return {
    chunk_id: source.chunk_id,
    source_file: source.source_file,
    page_number: source.page_number,
    text: source.text,
    rank: source.rank,
    score: source.score,
  };
}

function projectStep(step: AgentStep): AgentStep {
  // Yalnızca aksiyon etiketi ve kısa özet; fazlası düşer.
  return { action: step.action, detail: step.detail };
}

function projectToolCall(call: AgentToolCall): AgentToolCall {
  return {
    tool: call.tool,
    query: call.query,
    top_k: call.top_k,
    source_file: call.source_file,
    status: call.status,
    passages_found: call.passages_found,
  };
}

export function toAgentRun(run: DemoRun): AgentRun {
  return {
    answer: run.answer,
    status: run.status,
    sources: run.sources.map(projectSource),
    steps: run.steps.map(projectStep),
    tool_calls: run.tool_calls.map(projectToolCall),
  };
}

export function toDemoRunView(run: DemoRun): DemoRunView {
  return {
    id: run.id,
    question: run.question,
    synthetic: run.synthetic,
    provenanceNote: run.provenance.note,
    reconstructedFields: [...run.provenance.reconstructed_fields],
    run: toAgentRun(run),
  };
}

/* --- doğrulama: bozuk veri sessizce render edilmesin --- */

function isAgentStatus(value: unknown): value is AgentStatus {
  return typeof value === "string" && (AGENT_STATUSES as readonly string[]).includes(value);
}

function isAgentAction(value: unknown): value is AgentAction {
  return typeof value === "string" && (AGENT_ACTIONS as readonly string[]).includes(value);
}

function isToolStatus(value: unknown): value is ToolStatus {
  return typeof value === "string" && (TOOL_STATUSES as readonly string[]).includes(value);
}

/**
 * Dosyanın beklenen şekli taşıdığını doğrular. Hata fırlatmak yerine sorun
 * listesi döndürür; arayüz bunu bir hata durumu olarak gösterebilir.
 */
export function validateDemoRunFile(data: unknown): string[] {
  const problems: string[] = [];
  const file = data as Partial<DemoRunFile> | null;

  if (!file || typeof file !== "object") return ["demo verisi bir nesne değil"];
  if (file.mode !== "demo") problems.push('mode alanı "demo" değil');
  if (!Array.isArray(file.fixtures) || file.fixtures.length === 0) {
    return [...problems, "fixtures listesi boş veya yok"];
  }

  file.fixtures.forEach((run, index) => {
    const where = `fixtures[${index}]`;
    if (!run.id) problems.push(`${where}: id yok`);
    if (!run.question) problems.push(`${where}: question yok`);
    if (typeof run.synthetic !== "boolean") problems.push(`${where}: synthetic bayrağı yok`);
    if (!isAgentStatus(run.status)) problems.push(`${where}: geçersiz status`);
    if (!run.provenance?.source) problems.push(`${where}: provenance yok`);
    if (!Array.isArray(run.sources)) problems.push(`${where}: sources dizisi yok`);
    if (!Array.isArray(run.steps)) problems.push(`${where}: steps dizisi yok`);
    if (!Array.isArray(run.tool_calls)) problems.push(`${where}: tool_calls dizisi yok`);
    run.steps?.forEach((step, i) => {
      if (!isAgentAction(step.action)) problems.push(`${where}.steps[${i}]: geçersiz action`);
    });
    run.tool_calls?.forEach((call, i) => {
      if (!isToolStatus(call.status)) problems.push(`${where}.tool_calls[${i}]: geçersiz status`);
    });
  });

  return problems;
}
