/**
 * Değerlendirme artefaktının sözleşmesi ve doğrulanması.
 *
 * Bu modül, `scripts/agent_eval.py` koşusunun ürettiği/üreteceği JSON raporu
 * tüketir. Rapor henüz üretilmemiş olabilir; o durumda hiçbir şey uydurulmaz,
 * yokluk açıkça bildirilir.
 *
 * Demo verisinden kesin olarak ayrıdır:
 *   - ayrı dosya (`content/eval-results.json`) ve ayrı modül,
 *   - üst seviyede `kind: "agent_evaluation"` ayrıştırıcısı -- demo dosyası
 *     `mode: "demo"` taşıdığı için buraya verildiğinde doğrulamadan geçemez.
 * Böylece hazırlanmış demo koşuları yanlışlıkla "değerlendirme sonucu" gibi
 * sayılamaz.
 *
 * Modül kendi kendine yeter (başka modülden içe aktarım yok): Node'un dahili
 * test runner'ı tip sıyırma ile doğrudan yükleyebiliyor.
 */

export const EVAL_REPORT_KIND = "agent_evaluation";

export const ASSERTION_DETAIL_MAX = 160;

export interface EvalAssertion {
  type: string;
  passed: boolean;
  /** Kısaltılmış, güvenli açıklama. Model muhakemesi buraya taşınmaz. */
  detail: string;
  score: number | null;
}

export interface EvalCase {
  id: string;
  /** Agent'ın o koşudaki status'u; koşu hiç başlayamadıysa null. */
  status: string | null;
  passed: boolean;
  assertions: EvalAssertion[];
  /** Agent'ın yaptığı LLM çağrısı sayısı (bilinmiyorsa null). */
  llm_calls: number | null;
  /** Judge için yapılan istek sayısı (yeniden denemeler dahil). */
  judge_calls: number;
  latency_ms: number | null;
  error: string | null;
}

export interface EvalGeminiCalls {
  agent: number;
  judge: number;
  total: number;
}

export interface EvalTotals {
  cases: number;
  passed: number;
  failed: number;
  assertions: number;
  assertions_passed: number;
  gemini_calls: EvalGeminiCalls;
  avg_latency_ms: number | null;
}

export interface EvalReport {
  schema_version: number;
  kind: typeof EVAL_REPORT_KIND;
  generated_at: string;
  suite: string;
  model: string;
  totals: EvalTotals;
  cases: EvalCase[];
}

export type EvalReportState =
  | { status: "missing" }
  | { status: "invalid"; problems: string[] }
  | { status: "ok"; report: EvalReport };

/* --- güvenli açıklama --- */

/**
 * Assertion açıklamasını arayüze güvenli biçimde taşır.
 *
 * `llm_judge` açıklamaları promptevals tarafında
 * "score=4/5 (threshold 3): <judge'ın gerekçe cümlesi>" biçiminde üretiliyor.
 * Gerekçe cümlesi bir modelin serbest metni olduğundan arayüze taşınmaz;
 * yalnızca skor ve eşik bilgisi bırakılır. Diğer açıklamalar makine tarafından
 * yazılmış kısa ifadelerdir ve uzunluk sınırıyla kesilir.
 */
export function sanitizeAssertionDetail(type: string, detail: string): string {
  const flat = (detail ?? "").replace(/\s+/gu, " ").trim();

  if (type === "llm_judge") {
    const scoreOnly = /^(score=\d+\/\d+(?:\s*\(threshold\s*\d+\))?)/u.exec(flat);
    if (scoreOnly) return scoreOnly[1];
    // Beklenen biçimde değilse hiç metin taşımamak en güvenlisi.
    return "judge verdict";
  }

  return flat.length > ASSERTION_DETAIL_MAX
    ? `${flat.slice(0, ASSERTION_DETAIL_MAX - 1)}…`
    : flat;
}

/* --- projeksiyon --- */

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function projectAssertion(raw: unknown): EvalAssertion {
  const entry = (raw ?? {}) as Partial<EvalAssertion>;
  const type = typeof entry.type === "string" ? entry.type : "unknown";
  return {
    type,
    passed: entry.passed === true,
    detail: sanitizeAssertionDetail(type, typeof entry.detail === "string" ? entry.detail : ""),
    score: toNumberOrNull(entry.score),
  };
}

function projectCase(raw: unknown): EvalCase {
  const entry = (raw ?? {}) as Partial<EvalCase> & { case_id?: string };
  const assertions = Array.isArray(entry.assertions) ? entry.assertions.map(projectAssertion) : [];
  return {
    id: entry.id ?? entry.case_id ?? "unknown",
    status: typeof entry.status === "string" ? entry.status : null,
    passed: entry.passed === true,
    assertions,
    llm_calls: toNumberOrNull(entry.llm_calls),
    judge_calls: toNumberOrNull(entry.judge_calls) ?? 0,
    latency_ms: toNumberOrNull(entry.latency_ms),
    error: typeof entry.error === "string" && entry.error ? entry.error : null,
  };
}

/**
 * Raporu arayüzün göreceği şekle indirger. Bilinmeyen alanlar düşer, böylece
 * artefakta sonradan eklenen bir ham çıktı/prompt alanı arayüze sızamaz.
 */
export function projectEvalReport(raw: unknown): EvalReport {
  const data = (raw ?? {}) as Partial<EvalReport>;
  const totals = (data.totals ?? {}) as Partial<EvalTotals>;
  const calls = (totals.gemini_calls ?? {}) as Partial<EvalGeminiCalls>;
  const cases = Array.isArray(data.cases) ? data.cases.map(projectCase) : [];

  return {
    schema_version: toNumberOrNull(data.schema_version) ?? 0,
    kind: EVAL_REPORT_KIND,
    generated_at: typeof data.generated_at === "string" ? data.generated_at : "",
    suite: typeof data.suite === "string" ? data.suite : "",
    model: typeof data.model === "string" ? data.model : "",
    totals: {
      cases: toNumberOrNull(totals.cases) ?? cases.length,
      passed: toNumberOrNull(totals.passed) ?? cases.filter((c) => c.passed).length,
      failed: toNumberOrNull(totals.failed) ?? cases.filter((c) => !c.passed).length,
      assertions:
        toNumberOrNull(totals.assertions) ??
        cases.reduce((sum, c) => sum + c.assertions.length, 0),
      assertions_passed:
        toNumberOrNull(totals.assertions_passed) ??
        cases.reduce((sum, c) => sum + c.assertions.filter((a) => a.passed).length, 0),
      gemini_calls: {
        agent: toNumberOrNull(calls.agent) ?? 0,
        judge: toNumberOrNull(calls.judge) ?? 0,
        total:
          toNumberOrNull(calls.total) ??
          (toNumberOrNull(calls.agent) ?? 0) + (toNumberOrNull(calls.judge) ?? 0),
      },
      avg_latency_ms: toNumberOrNull(totals.avg_latency_ms),
    },
    cases,
  };
}

/* --- doğrulama --- */

/**
 * Artefaktın beklenen şekli taşıdığını doğrular. Hata fırlatmaz; sorun listesi
 * döndürür, böylece arayüz "geçersiz artefakt" durumunu gösterebilir.
 */
export function validateEvalReport(data: unknown): string[] {
  if (!data || typeof data !== "object") return ["artefakt bir nesne değil"];

  const report = data as Partial<EvalReport> & { mode?: string };
  const problems: string[] = [];

  if (report.kind !== EVAL_REPORT_KIND) {
    // Demo dosyası (mode: "demo") buraya verilirse tam bu dalda yakalanır.
    problems.push(
      `kind alanı "${EVAL_REPORT_KIND}" değil${
        report.mode ? ` (bu dosya demo verisi gibi görünüyor: mode="${report.mode}")` : ""
      }`,
    );
  }
  if (typeof report.schema_version !== "number") problems.push("schema_version yok");
  if (!Array.isArray(report.cases) || report.cases.length === 0) {
    problems.push("cases listesi boş veya yok");
  }
  if (!report.totals || typeof report.totals !== "object") problems.push("totals yok");
  if (typeof report.generated_at !== "string" || !report.generated_at) {
    problems.push("generated_at yok");
  }

  if (Array.isArray(report.cases)) {
    report.cases.forEach((entry, index) => {
      const where = `cases[${index}]`;
      const item = (entry ?? {}) as Partial<EvalCase> & { case_id?: string };
      if (!item.id && !item.case_id) problems.push(`${where}: id yok`);
      if (typeof item.passed !== "boolean") problems.push(`${where}: passed bayrağı yok`);
      if (!Array.isArray(item.assertions)) problems.push(`${where}: assertions dizisi yok`);
    });
  }

  return problems;
}

/** Ham veriyi tek adımda duruma çevirir. */
export function readEvalReport(raw: unknown): EvalReportState {
  const problems = validateEvalReport(raw);
  if (problems.length > 0) return { status: "invalid", problems };
  return { status: "ok", report: projectEvalReport(raw) };
}
