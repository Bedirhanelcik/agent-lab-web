/**
 * Demo veri katmanı testleri.
 *
 * Node'un dahili test runner'ı ve tip sıyırma ile çalışır; ek bir test
 * bağımlılığı kurulmaz. Hiçbir ağ veya model çağrısı yoktur.
 *
 *   node --experimental-strip-types --test tests/
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  findDemoRun,
  findDemoRunById,
  foldForSearch,
  normalizeQuestion,
  questionsMatch,
  toAgentRun,
  toDemoRunView,
  validateDemoRunFile,
  type DemoRun,
  type DemoRunFile,
} from "../lib/agent-contract.ts";

const dataPath = fileURLToPath(new URL("../content/demo-runs.json", import.meta.url));
const file = JSON.parse(readFileSync(dataPath, "utf8")) as DemoRunFile;
const runs = file.fixtures;

function requireRun(id: string): DemoRun {
  const run = findDemoRunById(runs, id);
  assert.ok(run, `${id} fixture'ı bulunamadı`);
  return run;
}

/* --- veri bütünlüğü --- */

test("demo verisi doğrulamadan geçer", () => {
  assert.deepEqual(validateDemoRunFile(file), []);
});

test("beş desteklenen fixture mevcut", () => {
  assert.equal(runs.length, 5);
  assert.deepEqual(
    runs.map((run) => run.id).sort(),
    [
      "citation_correctness",
      "direct_answer_without_retrieval",
      "factual_rag_answer",
      "outside_corpus_no_hallucination",
      "synthetic_query_refinement",
    ],
  );
});

test("bozuk veri sessizce kabul edilmez", () => {
  assert.ok(validateDemoRunFile(null).length > 0);
  assert.ok(validateDemoRunFile({ mode: "demo", fixtures: [] }).length > 0);
  const badStatus = {
    ...file,
    fixtures: [{ ...runs[0], status: "uydurma_status" }],
  };
  assert.ok(validateDemoRunFile(badStatus).some((p) => p.includes("status")));
});

/* --- Türkçe'ye uygun eşleştirme --- */

test("boşluk ve satır farkları eşleşmeyi bozmaz", () => {
  const run = requireRun("factual_rag_answer");
  assert.equal(findDemoRun(runs, `   ${run.question}\n`)?.id, run.id);
  assert.equal(normalizeQuestion("  a   b \n c "), "a b c");
});

test("büyük harfle yazılmış Türkçe soru eşleşir", () => {
  // Kullanıcı caps lock ile yazmış olabilir; "ö" -> "Ö" dönüşümü eşleşmeyi
  // bozmamalı.
  const run = requireRun("synthetic_query_refinement");
  assert.equal(findDemoRun(runs, "BÖLGELER")?.id, run.id);

  const citation = requireRun("citation_correctness");
  assert.equal(
    findDemoRun(runs, "OSMANLI DEVLETI HANGI YILDA VE KIM TARAFINDAN KURULMUŞTUR?")?.id,
    citation.id,
  );
});

test("noktasız ı içeren soru büyük harfle de eşleşir", () => {
  const run = requireRun("direct_answer_without_retrieval");
  assert.equal(findDemoRun(runs, "MERHABA, BUGÜN NASILSIN?")?.id, run.id);
  assert.equal(findDemoRun(runs, "merhaba, bugün nasılsın?")?.id, run.id);
});

test("aksansız yazım da eşleşir", () => {
  assert.equal(findDemoRun(runs, "bolgeler")?.id, "synthetic_query_refinement");
  assert.equal(
    findDemoRun(runs, "Merhaba, bugun nasilsin?")?.id,
    "direct_answer_without_retrieval",
  );
});

test("katlama toLowerCase'in Türkçe tuzağına düşmez", () => {
  // Hem noktalı hem noktasız i aynı dizeye katlanır; bilgi kaybına dayanan
  // bir round-trip yapılmaz.
  assert.equal(foldForSearch("İstanbul"), foldForSearch("istanbul"));
  assert.equal(foldForSearch("ISTANBUL"), foldForSearch("ıstanbul"));
  assert.equal(foldForSearch("dağı"), foldForSearch("DAĞI"));
  assert.equal(foldForSearch("ŞÜKRAN"), foldForSearch("şükran"));
  assert.ok(questionsMatch("Çağrı", "cagri"));
});

test("alakasız sorular eşleşmez", () => {
  assert.equal(findDemoRun(runs, "Japonya'nın en yüksek dağı?"), null);
  assert.equal(findDemoRun(runs, "bu soru hiç hazırlanmadı"), null);
  assert.ok(!questionsMatch("bölgeler", "başkent"));
});

test("boş soru eşleşme üretmez", () => {
  assert.equal(findDemoRun(runs, ""), null);
  assert.equal(findDemoRun(runs, "    "), null);
});

/* --- durumlar --- */

test("answered koşusu kaynak ve atıf taşır", () => {
  const view = toDemoRunView(requireRun("factual_rag_answer"));
  assert.equal(view.run.status, "answered");
  assert.ok(view.run.sources.length > 0);
  assert.ok(view.run.answer.includes("[turkiye_cografyasi.md::0]"));
  assert.deepEqual(
    view.run.steps.map((step) => step.action),
    ["assessed_question", "searched_rag", "answered_from_context"],
  );
});

test("insufficient_context koşusu kaynak göstermez ve reddi açıkça söyler", () => {
  const view = toDemoRunView(requireRun("outside_corpus_no_hallucination"));
  assert.equal(view.run.status, "insufficient_context");
  assert.deepEqual(view.run.sources, []);
  assert.equal(view.run.answer, "Dokümanlarda bu bilgi yok.");
  assert.ok(view.run.steps.some((step) => step.action === "declared_insufficient_context"));
  assert.ok(!view.run.answer.includes("Tokyo"));
});

test("answered_without_retrieval koşusunda hiç tool çağrısı yok", () => {
  const view = toDemoRunView(requireRun("direct_answer_without_retrieval"));
  assert.equal(view.run.status, "answered_without_retrieval");
  assert.equal(view.run.tool_calls.length, 0);
  assert.deepEqual(view.run.sources, []);
  assert.ok(view.run.steps.some((step) => step.action === "answered_without_retrieval"));
});

test("citation_correctness koşusu beklenen chunk kimliğine atıf yapar", () => {
  const view = toDemoRunView(requireRun("citation_correctness"));
  assert.equal(view.run.status, "answered");
  assert.match(view.run.answer, /\[osmanli_tarihi\.md::\d+\]/u);
  assert.ok(view.run.sources.some((source) => source.chunk_id === "osmanli_tarihi.md::0"));
});

/* --- synthetic işaretlemesi --- */

test("yalnızca bir koşu synthetic ve açıkça işaretli", () => {
  const synthetic = runs.filter((run) => run.synthetic);
  assert.equal(synthetic.length, 1);
  assert.equal(synthetic[0].id, "synthetic_query_refinement");

  const view = toDemoRunView(synthetic[0]);
  assert.equal(view.synthetic, true);
  assert.ok(view.provenanceNote.length > 0);
  assert.ok(view.reconstructedFields.length > 0);
});

test("gerçek koşulardan türetilenler synthetic değil", () => {
  for (const run of runs) {
    if (run.id === "synthetic_query_refinement") continue;
    assert.equal(toDemoRunView(run).synthetic, false);
  }
});

test("synthetic koşu iki ayrı aramayı ve refined_query adımını taşır", () => {
  const view = toDemoRunView(requireRun("synthetic_query_refinement"));
  assert.equal(view.run.tool_calls.length, 2);
  assert.deepEqual(
    view.run.steps.map((step) => step.action),
    [
      "assessed_question",
      "searched_rag",
      "refined_query",
      "searched_rag",
      "answered_from_context",
    ],
  );
  const [first, second] = view.run.tool_calls;
  assert.notEqual(first.query, second.query);
  assert.equal(first.status, "empty");
  assert.equal(first.passages_found, 0);
  assert.equal(second.status, "ok");
  assert.ok(second.passages_found >= 1);
});

/* --- kaynak / trace / tool call projeksiyonu --- */

test("kaynaklar arayüzün ihtiyaç duyduğu alanları taşır", () => {
  const view = toDemoRunView(requireRun("factual_rag_answer"));
  for (const source of view.run.sources) {
    assert.deepEqual(Object.keys(source).sort(), [
      "chunk_id",
      "page_number",
      "rank",
      "score",
      "source_file",
      "text",
    ]);
    assert.ok(source.chunk_id.startsWith(`${source.source_file}::`));
    assert.equal(typeof source.rank, "number");
    assert.equal(typeof source.score, "number");
  }
  assert.deepEqual(
    view.run.sources.map((source) => source.rank),
    view.run.sources.map((_, index) => index + 1),
  );
});

test("tool çağrıları arayüzün ihtiyaç duyduğu alanları taşır", () => {
  const view = toDemoRunView(requireRun("factual_rag_answer"));
  for (const call of view.run.tool_calls) {
    assert.deepEqual(Object.keys(call).sort(), [
      "passages_found",
      "query",
      "source_file",
      "status",
      "tool",
      "top_k",
    ]);
    assert.equal(call.tool, "rag_search");
  }
});

/* --- gizli muhakeme sızmıyor --- */

test("view model yalnızca sözleşme alanlarını içerir", () => {
  for (const run of runs) {
    const view = toDemoRunView(run);
    assert.deepEqual(Object.keys(view).sort(), [
      "id",
      "provenanceNote",
      "question",
      "reconstructedFields",
      "run",
      "synthetic",
    ]);
    assert.deepEqual(Object.keys(view.run).sort(), [
      "answer",
      "sources",
      "status",
      "steps",
      "tool_calls",
    ]);
  }
});

test("adımlarda yalnızca action ve detail bulunur", () => {
  const polluted = {
    ...requireRun("factual_rag_answer"),
    steps: [
      {
        action: "assessed_question",
        detail: "kısa özet",
        reasoning: "GİZLİ DÜŞÜNCE ZİNCİRİ",
        prompt: "sistem promptu",
      },
    ],
  } as unknown as DemoRun;

  const projected = toAgentRun(polluted);

  assert.deepEqual(Object.keys(projected.steps[0]).sort(), ["action", "detail"]);
  const serialized = JSON.stringify(projected);
  assert.ok(!serialized.includes("GİZLİ DÜŞÜNCE ZİNCİRİ"));
  assert.ok(!serialized.includes("sistem promptu"));
});

test("kaynak ve tool çağrılarına eklenen fazla alanlar da düşer", () => {
  const polluted = {
    ...requireRun("factual_rag_answer"),
    sources: [{ ...requireRun("factual_rag_answer").sources[0], raw_response: "SIZINTI" }],
    tool_calls: [{ ...requireRun("factual_rag_answer").tool_calls[0], scratchpad: "SIZINTI" }],
  } as unknown as DemoRun;

  const serialized = JSON.stringify(toAgentRun(polluted));

  assert.ok(!serialized.includes("SIZINTI"));
});

test("her adım detayı kısa tutulmuş", () => {
  for (const run of runs) {
    for (const step of run.steps) {
      assert.ok(step.detail.length <= 200, `${run.id}: detay çok uzun`);
    }
  }
});
