/**
 * Korpus yönetimi istemcisi testleri.
 *
 * Gerçek bir ağ isteği yapılmaz: `fetch` enjekte edilir. Backend, Gemini ve
 * Chroma hiç çağrılmaz.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  fetchCorpus,
  mapDocumentError,
  normalizeCorpus,
  removeDocument,
  resetCorpus,
} from "../lib/documents-api.ts";

const BASE = "http://127.0.0.1:8000";

interface Captured {
  url: string;
  method: string;
}

function fakeFetch(
  response: { status: number; body?: unknown } | Error,
  captured: Captured[] = [],
) {
  const impl = (async (url: string | URL, init?: RequestInit) => {
    captured.push({ url: String(url), method: init?.method ?? "GET" });
    if (response instanceof Error) throw response;
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.body ?? null,
    } as Response;
  }) as unknown as typeof fetch;

  return { impl, captured };
}

function validCorpus() {
  return {
    documents: [
      { source_file: "tarih.md", chunk_count: 3 },
      { source_file: "cografya.md", chunk_count: 2 },
    ],
    total_chunks: 5,
    keyword_index_size: 5,
    can_modify: true,
  };
}

// --- listeleme ---------------------------------------------------------------

test("korpus doğru uç noktadan okunur", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validCorpus() });

  const result = await fetchCorpus({ baseUrl: BASE, fetchImpl: impl });

  assert.equal(result.ok, true);
  assert.equal(captured[0].url, `${BASE}/documents`);
  assert.equal(captured[0].method, "GET");
});

test("baseUrl yoksa istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validCorpus() });

  const result = await fetchCorpus({ baseUrl: null, fetchImpl: impl });

  assert.deepEqual(result, { ok: false, kind: "not_configured" });
  assert.equal(captured.length, 0);
});

test("sondaki eğik çizgi iki kez eklenmez", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: validCorpus() });

  await fetchCorpus({ baseUrl: `${BASE}/`, fetchImpl: impl });

  assert.equal(captured[0].url, `${BASE}/documents`);
});

test("beklenen alanları taşımayan gövde reddedilir", async () => {
  for (const body of [
    null,
    {},
    { documents: [], total_chunks: 1 },
    { documents: [{ source_file: "a" }], total_chunks: 1, keyword_index_size: 1, can_modify: true },
    { documents: "x", total_chunks: 1, keyword_index_size: 1, can_modify: true },
  ]) {
    const { impl } = fakeFetch({ status: 200, body });

    const result = await fetchCorpus({ baseUrl: BASE, fetchImpl: impl });

    assert.deepEqual(result, { ok: false, kind: "bad_response" }, JSON.stringify(body));
  }
});

test("geçerli gövde olduğu gibi aktarılır", () => {
  const corpus = normalizeCorpus(validCorpus());

  assert.ok(corpus);
  assert.equal(corpus.documents.length, 2);
  assert.equal(corpus.total_chunks, 5);
  assert.equal(corpus.can_modify, true);
});

// --- silme -------------------------------------------------------------------

test("doküman adı URL'de kodlanır", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: {} });

  await removeDocument("boşluklu ad.md", { baseUrl: BASE, fetchImpl: impl });

  assert.equal(captured[0].method, "DELETE");
  assert.ok(captured[0].url.endsWith(encodeURIComponent("boşluklu ad.md")));
});

test("yol bileşeni taşıyan ad hiç gönderilmez", async () => {
  for (const name of ["../gizli", "a/b.md", "a\\b.md", "..", "  "]) {
    const { impl, captured } = fakeFetch({ status: 200, body: {} });

    const result = await removeDocument(name, { baseUrl: BASE, fetchImpl: impl });

    assert.deepEqual(result, { ok: false, kind: "not_found" }, name);
    assert.equal(captured.length, 0, `${name}: istek atılmamalı`);
  }
});

test("403 salt okunur korpus olarak raporlanır", async () => {
  const { impl } = fakeFetch({
    status: 403,
    body: { detail: { code: "upload_disabled", message: "kapalı" } },
  });

  const result = await removeDocument("a.md", { baseUrl: BASE, fetchImpl: impl });

  assert.deepEqual(result, { ok: false, kind: "read_only" });
});

test("404 bulunamadı olarak raporlanır", async () => {
  const { impl } = fakeFetch({
    status: 404,
    body: { detail: { code: "document_not_found", message: "yok" } },
  });

  const result = await removeDocument("a.md", { baseUrl: BASE, fetchImpl: impl });

  assert.deepEqual(result, { ok: false, kind: "not_found" });
});

// --- sıfırlama ---------------------------------------------------------------

test("sıfırlama POST ile yapılır", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: {} });

  const result = await resetCorpus({ baseUrl: BASE, fetchImpl: impl });

  assert.deepEqual(result, { ok: true });
  assert.equal(captured[0].url, `${BASE}/documents/reset`);
  assert.equal(captured[0].method, "POST");
});

// --- hata eşlemesi -----------------------------------------------------------

test("hata kodu HTTP durumundan önce gelir", () => {
  assert.equal(
    mapDocumentError(500, { detail: { code: "upload_disabled" } }),
    "read_only",
    "gövdedeki kod belirleyici olmalı",
  );
  assert.equal(mapDocumentError(403, null), "read_only");
  assert.equal(mapDocumentError(404, null), "not_found");
  assert.equal(mapDocumentError(500, null), "upstream_error");
});

test("ağ hatası ve zaman aşımı ayrılır", async () => {
  const timeout = Object.assign(new Error("timeout"), { name: "TimeoutError" });
  const { impl: timedOut } = fakeFetch(timeout);
  assert.deepEqual(await fetchCorpus({ baseUrl: BASE, fetchImpl: timedOut }), {
    ok: false,
    kind: "timeout",
  });

  const { impl: offline } = fakeFetch(new Error("offline"));
  assert.deepEqual(await fetchCorpus({ baseUrl: BASE, fetchImpl: offline }), {
    ok: false,
    kind: "network",
  });
});

test("hiçbir istekte operatör token'ı taşınmaz", async () => {
  // Bu uç noktalar UPLOAD_ENABLED bayrağına bağlı; INGEST_API_TOKEN'a değil.
  const headers: unknown[] = [];
  const impl = (async (_url: string | URL, init?: RequestInit) => {
    headers.push(init?.headers);
    return { ok: true, status: 200, json: async () => validCorpus() } as Response;
  }) as unknown as typeof fetch;

  await fetchCorpus({ baseUrl: BASE, fetchImpl: impl });
  await removeDocument("a.md", { baseUrl: BASE, fetchImpl: impl });
  await resetCorpus({ baseUrl: BASE, fetchImpl: impl });

  const serialised = JSON.stringify(headers).toLowerCase();
  assert.ok(!serialised.includes("authorization"));
  assert.ok(!serialised.includes("bearer"));
  assert.ok(!serialised.includes("token"));
});
