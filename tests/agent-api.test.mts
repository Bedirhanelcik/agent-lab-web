/**
 * Canlı mod istemcisi testleri.
 *
 * Gerçek bir ağ isteği yapılmaz: `fetch` enjekte edilir. Gemini veya FastAPI
 * hiç çağrılmaz, kota harcanmaz.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DEFAULT_TIMEOUT_MS,
  askAgent,
  mapErrorResponse,
  type AgentApiResult,
} from "../lib/agent-api.ts";
import { normalizeAgentRun } from "../lib/agent-contract.ts";

const BASE = "http://127.0.0.1:8000";

interface Captured {
  url: string;
  method: string;
  body: unknown;
  headers: Record<string, string>;
  hasSignal: boolean;
}

/** Çağrıları kaydeden, istenen yanıtı döndüren fake fetch. */
function fakeFetch(
  response: { status: number; body?: unknown; invalidJson?: boolean } | Error,
  captured: Captured[] = [],
) {
  const impl = (async (url: string | URL, init?: RequestInit) => {
    captured.push({
      url: String(url),
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? JSON.parse(init.body) : null,
      headers: (init?.headers ?? {}) as Record<string, string>,
      hasSignal: Boolean(init?.signal),
    });

    if (response instanceof Error) throw response;

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => {
        if (response.invalidJson) throw new SyntaxError("geçersiz JSON");
        return response.body ?? null;
      },
    } as Response;
  }) as unknown as typeof fetch;

  return { impl, captured };
}

function validBackendResponse() {
  return {
    answer: "Ağrı Dağı, 5137 metre [turkiye_cografyasi.md::0].",
    status: "answered",
    sources: [
      {
        chunk_id: "turkiye_cografyasi.md::0",
        source_file: "turkiye_cografyasi.md",
        page_number: null,
        text: "Ağrı Dağı 5137 metredir.",
        rank: 1,
        score: 0.0328,
      },
    ],
    steps: [
      { action: "assessed_question", detail: "olgusal bilgi gerekiyor" },
      { action: "searched_rag", detail: "deneme 1: 1 pasaj bulundu" },
      { action: "answered_from_context", detail: "1 pasaj temel alinarak cevaplandi" },
    ],
    tool_calls: [
      {
        tool: "rag_search",
        query: "Türkiye en yüksek dağ",
        top_k: 5,
        source_file: null,
        status: "ok",
        passages_found: 1,
      },
    ],
  };
}

function expectOk(result: AgentApiResult) {
  assert.ok(result.ok, `beklenen başarı, alınan: ${JSON.stringify(result)}`);
  return result.run;
}

function expectError(result: AgentApiResult) {
  assert.ok(!result.ok, "beklenen hata");
  return result.kind;
}

/* --- doğru uç noktaya doğru istek --- */

test("doğru endpoint'e POST atılır", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl });

  assert.equal(captured.length, 1);
  assert.equal(captured[0].url, "http://127.0.0.1:8000/agent/ask");
  assert.equal(captured[0].method, "POST");
  assert.equal(captured[0].headers["content-type"], "application/json");
});

test("baseUrl sonundaki eğik çizgi iki kez eklenmez", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  await askAgent("Soru?", { baseUrl: "http://127.0.0.1:8000/", fetchImpl: impl });

  assert.equal(captured[0].url, "http://127.0.0.1:8000/agent/ask");
});

test("gövdede question gönderilir, top_k verilmezse hiç gönderilmez", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  await askAgent("  Başkent neresi?  ", { baseUrl: BASE, fetchImpl: impl });

  assert.deepEqual(captured[0].body, { question: "Başkent neresi?" });
});

test("top_k verildiğinde gövdeye eklenir", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  await askAgent("Soru?", { baseUrl: BASE, topK: 3, fetchImpl: impl });

  assert.deepEqual(captured[0].body, { question: "Soru?", top_k: 3 });
});

test("geçersiz top_k istek atmadan reddedilir", async () => {
  for (const topK of [0, -1, 2.5]) {
    const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });
    const result = await askAgent("Soru?", { baseUrl: BASE, topK, fetchImpl: impl });
    assert.equal(expectError(result), "invalid_request");
    assert.equal(captured.length, 0, `top_k=${topK} için istek atılmamalı`);
  }
});

test("boş soru istek atmadan reddedilir", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  assert.equal(expectError(await askAgent("   ", { baseUrl: BASE, fetchImpl: impl })), "invalid_request");
  assert.equal(captured.length, 0);
});

test("baseUrl yoksa istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: null, fetchImpl: impl })), "not_configured");
  assert.equal(expectError(await askAgent("Soru?", { baseUrl: "  ", fetchImpl: impl })), "not_configured");
  assert.equal(captured.length, 0);
});

test("zaman aşımı sinyali her istekte verilir", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validBackendResponse() });

  await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl });

  assert.equal(captured[0].hasSignal, true, "sonsuz bekleme olmamalı");
  assert.ok(DEFAULT_TIMEOUT_MS > 0 && DEFAULT_TIMEOUT_MS <= 60_000);
});

/* --- 200 yanıtın normalizasyonu --- */

test("200 yanıt AgentRun'a normalize edilir", async () => {
  const { impl } = fakeFetch({ status: 200, body: validBackendResponse() });

  const run = expectOk(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl }));

  assert.equal(run.status, "answered");
  assert.equal(run.sources.length, 1);
  assert.equal(run.sources[0].chunk_id, "turkiye_cografyasi.md::0");
  assert.deepEqual(
    run.steps.map((step) => step.action),
    ["assessed_question", "searched_rag", "answered_from_context"],
  );
  assert.equal(run.tool_calls[0].tool, "rag_search");
  assert.equal(run.tool_calls[0].passages_found, 1);
});

test("tool_calls boş olan yanıt geçerlidir", async () => {
  const body = {
    ...validBackendResponse(),
    status: "answered_without_retrieval",
    sources: [],
    steps: [{ action: "answered_without_retrieval", detail: "" }],
    tool_calls: [],
  };
  const { impl } = fakeFetch({ status: 200, body });

  const run = expectOk(await askAgent("Merhaba", { baseUrl: BASE, fetchImpl: impl }));

  assert.equal(run.status, "answered_without_retrieval");
  assert.deepEqual(run.tool_calls, []);
  assert.deepEqual(run.sources, []);
});

test("insufficient_context ve tool_failure durumları taşınır", async () => {
  for (const status of ["insufficient_context", "tool_failure"]) {
    const body = {
      ...validBackendResponse(),
      status,
      sources: [],
      steps: [{ action: "declared_insufficient_context", detail: "yeterli baglam yok" }],
      tool_calls: [],
    };
    const { impl } = fakeFetch({ status: 200, body });

    const run = expectOk(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl }));

    assert.equal(run.status, status);
  }
});

test("tanınmayan status bad_response olur", async () => {
  const { impl } = fakeFetch({
    status: 200,
    body: { ...validBackendResponse(), status: "uydurma_status" },
  });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "bad_response");
});

test("eksik alanlı 200 yanıt bad_response olur", async () => {
  const { impl } = fakeFetch({ status: 200, body: { answer: "cevap" } });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "bad_response");
});

test("ayrıştırılamayan JSON bad_response olur", async () => {
  const { impl } = fakeFetch({ status: 200, invalidJson: true });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "bad_response");
});

/* --- hata eşlemesi --- */

test("429 kota hatası olarak ayrıştırılır", async () => {
  const { impl } = fakeFetch({
    status: 429,
    body: { detail: { code: "quota_exhausted", message: "kota doldu" } },
  });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "quota_exhausted");
});

test("502 generation hatası olarak ayrıştırılır", async () => {
  const { impl } = fakeFetch({
    status: 502,
    body: { detail: { code: "generation_error", message: "upstream" } },
  });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "generation_error");
});

test("503 agent kullanılamıyor olarak ayrıştırılır", async () => {
  const { impl } = fakeFetch({
    status: 503,
    body: { detail: { code: "agent_unavailable", message: "key yok" } },
  });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "agent_unavailable");
});

test("500 ve diğer durumlar upstream_error olur", async () => {
  const { impl } = fakeFetch({ status: 500, body: { detail: { code: "retrieval_error" } } });
  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "upstream_error");

  const other = fakeFetch({ status: 418, body: null });
  assert.equal(
    expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: other.impl })),
    "upstream_error",
  );
});

test("422 geçersiz istek olarak ayrıştırılır", async () => {
  const { impl } = fakeFetch({ status: 422, body: { detail: [{ msg: "field required" }] } });

  assert.equal(expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl })), "invalid_request");
});

test("kod gelmezse HTTP durumuna düşülür", () => {
  assert.equal(mapErrorResponse(429, null), "quota_exhausted");
  assert.equal(mapErrorResponse(502, {}), "generation_error");
  assert.equal(mapErrorResponse(503, { detail: {} }), "agent_unavailable");
  assert.equal(mapErrorResponse(400, null), "invalid_request");
  assert.equal(mapErrorResponse(504, null), "upstream_error");
});

test("zaman aşımı ve ağ hatası ayrı ayrı raporlanır", async () => {
  const timeoutError = Object.assign(new Error("timed out"), { name: "TimeoutError" });
  const timeout = fakeFetch(timeoutError);
  assert.equal(
    expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: timeout.impl })),
    "timeout",
  );

  const abortError = Object.assign(new Error("aborted"), { name: "AbortError" });
  const aborted = fakeFetch(abortError);
  assert.equal(
    expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: aborted.impl })),
    "timeout",
  );

  const network = fakeFetch(new TypeError("fetch failed"));
  assert.equal(
    expectError(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: network.impl })),
    "network",
  );
});

/* --- demo meta verisi canlı sonuca taşınmaz --- */

test("canlı yanıta eklenen demo alanları düşer", async () => {
  const body = {
    ...validBackendResponse(),
    synthetic: true,
    provenance: { source: "handcrafted", note: "SIZINTI", reconstructed_fields: ["answer"] },
    id: "synthetic_query_refinement",
    question: "bölgeler",
  };
  const { impl } = fakeFetch({ status: 200, body });

  const run = expectOk(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl }));

  assert.deepEqual(Object.keys(run).sort(), [
    "answer",
    "sources",
    "status",
    "steps",
    "tool_calls",
  ]);
  const serialized = JSON.stringify(run);
  assert.ok(!serialized.includes("synthetic"));
  assert.ok(!serialized.includes("SIZINTI"));
  assert.ok(!serialized.includes("provenance"));
});

test("canlı yanıta eklenen prompt/ham çıktı alanları düşer", async () => {
  const body = validBackendResponse() as Record<string, unknown>;
  body.system_prompt = "SIZINTI";
  body.raw_response = "SIZINTI";
  (body.steps as Record<string, unknown>[])[0].reasoning = "SIZINTI";
  (body.sources as Record<string, unknown>[])[0].scratchpad = "SIZINTI";
  const { impl } = fakeFetch({ status: 200, body });

  const run = expectOk(await askAgent("Soru?", { baseUrl: BASE, fetchImpl: impl }));

  assert.ok(!JSON.stringify(run).includes("SIZINTI"));
  assert.deepEqual(Object.keys(run.steps[0]).sort(), ["action", "detail"]);
  assert.deepEqual(Object.keys(run.sources[0]).sort(), [
    "chunk_id",
    "page_number",
    "rank",
    "score",
    "source_file",
    "text",
  ]);
});

test("normalizeAgentRun demo meta verisini hiç üretmez", () => {
  const result = normalizeAgentRun({
    ...validBackendResponse(),
    synthetic: true,
    provenance: { note: "SIZINTI" },
  });

  assert.ok(result.ok);
  assert.ok(!("synthetic" in result.run));
  assert.ok(!("provenance" in result.run));
});
