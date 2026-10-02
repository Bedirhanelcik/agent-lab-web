/**
 * Değerlendirme artefaktı katmanı testleri.
 *
 * Hiçbir ağ veya model çağrısı yok; artefakt üretilmiyor, yalnızca tüketim
 * mantığı sınanıyor.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  ASSERTION_DETAIL_MAX,
  EVAL_REPORT_KIND,
  projectEvalReport,
  readEvalReport,
  sanitizeAssertionDetail,
  validateEvalReport,
} from "../lib/eval-report.ts";

interface RawAssertion {
  type: string;
  passed: boolean;
  detail: string;
  score: number | null;
}

interface RawCase {
  [key: string]: unknown;
  id?: string;
  case_id?: string;
  status: string | null;
  passed?: boolean;
  llm_calls: number | null;
  judge_calls: number;
  latency_ms: number | null;
  error: string | null;
  assertions: RawAssertion[];
}

interface RawReport {
  [key: string]: unknown;
  schema_version: number;
  kind: string;
  generated_at: string;
  suite: string;
  model: string;
  totals: Record<string, unknown>;
  cases: RawCase[];
}

/** Geçerli bir raporun en küçük hali; testlerde parça parça bozulur. */
function validReport(): RawReport {
  return {
    schema_version: 1,
    kind: EVAL_REPORT_KIND,
    generated_at: "2026-10-02T21:00:00Z",
    suite: "agent_suite.yaml",
    model: "gemini-2.5-flash",
    totals: {
      cases: 2,
      passed: 1,
      failed: 1,
      assertions: 3,
      assertions_passed: 2,
      gemini_calls: { agent: 6, judge: 1, total: 7 },
      avg_latency_ms: 4400,
    },
    cases: [
      {
        id: "factual_rag_question",
        status: "answered",
        passed: true,
        llm_calls: 3,
        judge_calls: 0,
        latency_ms: 4400,
        error: null,
        assertions: [
          {
            type: "contains",
            passed: true,
            detail: "expected output to contain 'Ağrı'",
            score: null,
          },
          {
            type: "regex",
            passed: true,
            detail: "expected output to match pattern",
            score: null,
          },
        ],
      },
      {
        id: "ambiguous_query_refinement",
        status: null,
        passed: false,
        llm_calls: null,
        judge_calls: 0,
        latency_ms: 121000,
        error: "429 RESOURCE_EXHAUSTED",
        assertions: [{ type: "contains", passed: false, detail: "expected output", score: null }],
      },
    ],
  };
}

/* --- yokluk ve geçersizlik --- */

test("nesne olmayan artefakt geçersizdir", () => {
  assert.ok(validateEvalReport(null).length > 0);
  assert.ok(validateEvalReport("rapor").length > 0);
});

test("eksik alanlar tek tek bildirilir", () => {
  const { kind, ...withoutKind } = validReport();
  void kind;
  assert.ok(validateEvalReport(withoutKind).some((p) => p.includes("kind")));

  const noCases = { ...validReport(), cases: [] };
  assert.ok(validateEvalReport(noCases).some((p) => p.includes("cases")));

  const noTimestamp = { ...validReport(), generated_at: "" };
  assert.ok(validateEvalReport(noTimestamp).some((p) => p.includes("generated_at")));
});

test("vaka seviyesindeki eksikler bildirilir", () => {
  const broken = validReport();
  broken.cases[0] = { ...broken.cases[0], id: "", passed: undefined } as never;
  const problems = validateEvalReport(broken);
  assert.ok(problems.some((p) => p.includes("id yok")));
  assert.ok(problems.some((p) => p.includes("passed")));
});

test("geçerli rapor sorunsuz doğrulanır", () => {
  assert.deepEqual(validateEvalReport(validReport()), []);
  const state = readEvalReport(validReport());
  assert.equal(state.status, "ok");
});

/* --- demo verisi değerlendirme sonucu sayılamaz --- */

test("demo fixture dosyası değerlendirme artefaktı olarak kabul edilmez", () => {
  const demoPath = fileURLToPath(new URL("../content/demo-runs.json", import.meta.url));
  const demo = JSON.parse(readFileSync(demoPath, "utf8"));

  const state = readEvalReport(demo);

  assert.equal(state.status, "invalid");
  assert.ok(state.status === "invalid" && state.problems.some((p) => p.includes("kind")));
  assert.ok(
    state.status === "invalid" && state.problems.some((p) => p.includes('mode="demo"')),
    "demo dosyası olduğu açıkça söylenmeli",
  );
});

test("synthetic demo koşusu hiçbir toplama girmez", () => {
  const demoPath = fileURLToPath(new URL("../content/demo-runs.json", import.meta.url));
  const demo = JSON.parse(readFileSync(demoPath, "utf8")) as {
    fixtures: { id: string; synthetic: boolean }[];
  };
  const synthetic = demo.fixtures.filter((fixture) => fixture.synthetic);
  assert.equal(synthetic.length, 1);

  // Demo dosyası doğrulamadan geçemediği için synthetic koşu bir rapora
  // dönüşemez; sayfa bu veriyle sonuç gösteremez.
  assert.equal(readEvalReport(demo).status, "invalid");
});

/* --- projeksiyon --- */

test("toplamlar ve vaka alanları olduğu gibi taşınır", () => {
  const report = projectEvalReport(validReport());

  assert.equal(report.totals.cases, 2);
  assert.equal(report.totals.passed, 1);
  assert.equal(report.totals.failed, 1);
  assert.equal(report.totals.assertions, 3);
  assert.equal(report.totals.gemini_calls.total, 7);
  assert.equal(report.totals.gemini_calls.agent, 6);
  assert.equal(report.totals.gemini_calls.judge, 1);
  assert.equal(report.totals.avg_latency_ms, 4400);

  const [first, second] = report.cases;
  assert.equal(first.id, "factual_rag_question");
  assert.equal(first.status, "answered");
  assert.equal(first.passed, true);
  assert.equal(first.llm_calls, 3);
  assert.equal(first.latency_ms, 4400);
  assert.equal(first.error, null);
  assert.equal(second.status, null);
  assert.equal(second.error, "429 RESOURCE_EXHAUSTED");
});

test("eksik toplamlar vakalardan türetilir", () => {
  const raw = validReport() as Record<string, unknown>;
  raw.totals = { gemini_calls: {} };

  const report = projectEvalReport(raw);

  assert.equal(report.totals.cases, 2);
  assert.equal(report.totals.passed, 1);
  assert.equal(report.totals.failed, 1);
  assert.equal(report.totals.assertions, 3);
  assert.equal(report.totals.assertions_passed, 2);
  assert.equal(report.totals.avg_latency_ms, null);
});

test("case_id alanı da id olarak kabul edilir", () => {
  const raw = validReport() as Record<string, unknown>;
  (raw.cases as Record<string, unknown>[])[0] = {
    case_id: "legacy_id",
    passed: true,
    assertions: [],
  };

  assert.equal(projectEvalReport(raw).cases[0].id, "legacy_id");
});

/* --- gizli muhakeme taşınmaz --- */

test("judge açıklamasından gerekçe cümlesi düşer", () => {
  const detail =
    "score=4/5 (threshold 3): Cevap yalnızca verilen pasajlara dayanıyor ve atıf yapıyor.";

  const safe = sanitizeAssertionDetail("llm_judge", detail);

  assert.equal(safe, "score=4/5 (threshold 3)");
  assert.ok(!safe.includes("pasajlara dayanıyor"));
});

test("beklenmeyen biçimdeki judge açıklaması hiç metin taşımaz", () => {
  assert.equal(
    sanitizeAssertionDetail("llm_judge", "Modelin uzun serbest gerekçesi burada"),
    "judge verdict",
  );
});

test("judge gerekçesi projeksiyondan sonra raporda bulunmaz", () => {
  const raw = validReport();
  raw.cases[0].assertions.push({
    type: "llm_judge",
    passed: true,
    detail: "score=5/5 (threshold 3): GİZLİ GEREKÇE CÜMLESİ",
    score: 5,
  });

  const serialized = JSON.stringify(projectEvalReport(raw));

  assert.ok(!serialized.includes("GİZLİ GEREKÇE"));
  assert.ok(serialized.includes("score=5/5 (threshold 3)"));
});

test("artefakta eklenen prompt/ham çıktı alanları arayüze geçmez", () => {
  const raw = validReport() as Record<string, unknown>;
  raw.system_prompt = "SIZINTI";
  (raw.cases as Record<string, unknown>[])[0].raw_response = "SIZINTI";
  (raw.cases as Record<string, unknown>[])[0].observation = "SIZINTI";
  (
    (raw.cases as Record<string, unknown>[])[0].assertions as Record<string, unknown>[]
  )[0].reasoning = "SIZINTI";

  const serialized = JSON.stringify(projectEvalReport(raw));

  assert.ok(!serialized.includes("SIZINTI"));
});

test("assertion açıklamaları uzunluk sınırına uyar", () => {
  const long = "x".repeat(ASSERTION_DETAIL_MAX + 80);

  const safe = sanitizeAssertionDetail("contains", long);

  assert.ok(safe.length <= ASSERTION_DETAIL_MAX);
  assert.ok(safe.endsWith("…"));
});

test("projeksiyon yalnızca sözleşme alanlarını üretir", () => {
  const report = projectEvalReport(validReport());

  assert.deepEqual(Object.keys(report).sort(), [
    "cases",
    "generated_at",
    "kind",
    "model",
    "schema_version",
    "suite",
    "totals",
  ]);
  assert.deepEqual(Object.keys(report.cases[0]).sort(), [
    "assertions",
    "error",
    "id",
    "judge_calls",
    "latency_ms",
    "llm_calls",
    "passed",
    "status",
  ]);
  assert.deepEqual(Object.keys(report.cases[0].assertions[0]).sort(), [
    "detail",
    "passed",
    "score",
    "type",
  ]);
});

/* --- altı vakalık suite --- */

test("altı vakalık bir rapor eksiksiz taşınır", () => {
  const ids = [
    "factual_rag_question",
    "outside_corpus_no_hallucination",
    "direct_answer_no_retrieval",
    "citation_correctness",
    "ambiguous_query_refinement",
    "grounded_answer_quality",
  ];
  const raw = {
    ...validReport(),
    totals: { ...validReport().totals, cases: 6, passed: 6, failed: 0 },
    cases: ids.map((id) => ({
      id,
      status: "answered",
      passed: true,
      llm_calls: 3,
      judge_calls: id === "grounded_answer_quality" ? 1 : 0,
      latency_ms: 4200,
      error: null,
      assertions: [{ type: "contains", passed: true, detail: "ok", score: null }],
    })),
  };

  assert.deepEqual(validateEvalReport(raw), []);
  const report = projectEvalReport(raw);
  assert.equal(report.cases.length, 6);
  assert.deepEqual(
    report.cases.map((entry) => entry.id),
    ids,
  );
  assert.equal(
    report.cases.reduce((sum, entry) => sum + entry.judge_calls, 0),
    1,
    "yalnızca bir vaka judge çağrısı harcar",
  );
});
