/**
 * Upload istemcisi testleri.
 *
 * Gerçek bir ağ isteği yapılmaz: `fetch` enjekte edilir. Gemini veya FastAPI
 * hiç çağrılmaz.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  fileExtension,
  isAcceptedUploadName,
  mapUploadError,
  normalizeUploadResponse,
  uploadDocuments,
  validateUploadFiles,
  type UploadOutcome,
} from "../lib/upload-api.ts";

const BASE = "http://127.0.0.1:8000";

interface Captured {
  url: string;
  method: string;
  filenames: string[];
  hasSignal: boolean;
}

function fakeFetch(
  response: { status: number; body?: unknown; invalidJson?: boolean } | Error,
) {
  const captured: Captured[] = [];

  const impl = (async (url: string | URL, init?: RequestInit) => {
    const form = init?.body instanceof FormData ? init.body : null;
    captured.push({
      url: String(url),
      method: init?.method ?? "GET",
      filenames: form
        ? form.getAll("files").map((entry) => (entry instanceof File ? entry.name : String(entry)))
        : [],
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

function file(name: string, bytes = 8): File {
  return new File([new Uint8Array(bytes)], name);
}

function successBody() {
  return {
    files: [{ filename: "notlar.txt", chunks_created: 3, status: "ingested" }],
    total_chunks: 3,
    corpus_chunks: 7,
  };
}

function expectError(result: UploadOutcome) {
  assert.ok(!result.ok, "beklenen hata");
  return result.kind;
}

/* --- kabul edilen türler --- */

test("PDF, TXT ve MD kabul edilir", () => {
  for (const name of ["rapor.pdf", "notlar.txt", "belge.md", "BELGE.MD", "Rapor.PDF"]) {
    assert.ok(isAcceptedUploadName(name), `${name} kabul edilmeli`);
  }
  assert.deepEqual([...ACCEPTED_UPLOAD_EXTENSIONS], [".pdf", ".txt", ".md"]);
});

test("desteklenmeyen uzantılar reddedilir", () => {
  for (const name of ["kotu.exe", "resim.png", "arsiv.zip", "uzantisiz", "script.sh"]) {
    assert.ok(!isAcceptedUploadName(name), `${name} reddedilmeli`);
  }
});

test("uzantı çıkarma büyük/küçük harf duyarsız ve locale'den bağımsız", () => {
  assert.equal(fileExtension("a.TXT"), ".txt");
  assert.equal(fileExtension("a.tar.gz"), ".gz");
  assert.equal(fileExtension("uzantisiz"), "");
  // Türkçe karakterli dosya adı uzantıyı bozmamalı.
  assert.equal(fileExtension("Ağrı Dağı raporu.PDF"), ".pdf");
});

/* --- doğrulama: istek atılmadan --- */

test("desteklenmeyen uzantıda istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  const result = await uploadDocuments([file("kotu.exe")], { baseUrl: BASE, fetchImpl: impl });

  assert.equal(expectError(result), "unsupported_file_type");
  assert.equal(captured.length, 0);
});

test("boyut sınırını aşan dosyada istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  const result = await uploadDocuments([file("buyuk.txt", 64)], {
    baseUrl: BASE,
    maxBytes: 16,
    fetchImpl: impl,
  });

  assert.equal(expectError(result), "file_too_large");
  assert.equal(captured.length, 0);
});

test("sınırın tam üstünde kalan dosya kabul edilir", () => {
  assert.equal(validateUploadFiles([{ name: "a.txt", size: 16 }], 16), null);
  assert.equal(validateUploadFiles([{ name: "a.txt", size: 17 }], 16), "file_too_large");
});

test("dosya seçilmediğinde istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  assert.equal(expectError(await uploadDocuments([], { baseUrl: BASE, fetchImpl: impl })), "no_files");
  assert.equal(captured.length, 0);
});

test("varsayılan boyut sınırı backend ile aynı", () => {
  assert.equal(MAX_UPLOAD_BYTES, 10 * 1024 * 1024);
});

/* --- kapalı / yapılandırılmamış --- */

test("upload kapalıyken hiç istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  const result = await uploadDocuments([file("a.txt")], {
    baseUrl: BASE,
    enabled: false,
    fetchImpl: impl,
  });

  assert.equal(expectError(result), "upload_disabled");
  assert.equal(captured.length, 0, "kapalıyken backend'e dokunulmamalı");
});

test("baseUrl yoksa istek atılmaz", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: null, fetchImpl: impl })),
    "not_configured",
  );
  assert.equal(captured.length, 0);
});

/* --- başarılı ingestion --- */

test("başarılı yükleme dosya başına sonuç döndürür", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  const result = await uploadDocuments([file("notlar.txt")], { baseUrl: BASE, fetchImpl: impl });

  assert.ok(result.ok);
  assert.deepEqual(result.files, [
    { filename: "notlar.txt", chunks_created: 3, status: "ingested" },
  ]);
  assert.equal(result.total_chunks, 3);
  assert.equal(result.corpus_chunks, 7);

  assert.equal(captured[0].url, "http://127.0.0.1:8000/upload");
  assert.equal(captured[0].method, "POST");
  assert.deepEqual(captured[0].filenames, ["notlar.txt"]);
  assert.equal(captured[0].hasSignal, true, "sonsuz bekleme olmamalı");
});

test("çoklu dosya aynı alan adıyla gönderilir", async () => {
  const body = {
    files: [
      { filename: "bir.txt", chunks_created: 2, status: "ingested" },
      { filename: "iki.md", chunks_created: 0, status: "failed" },
    ],
    total_chunks: 2,
    corpus_chunks: 9,
  };
  const { impl, captured } = fakeFetch({ status: 200, body });

  const result = await uploadDocuments([file("bir.txt"), file("iki.md")], {
    baseUrl: BASE,
    fetchImpl: impl,
  });

  assert.ok(result.ok);
  assert.deepEqual(captured[0].filenames, ["bir.txt", "iki.md"]);
  assert.equal(result.files[1].status, "failed");
  assert.equal(result.files[1].chunks_created, 0);
});

test("baseUrl sonundaki eğik çizgi iki kez eklenmez", async () => {
  const { impl, captured } = fakeFetch({ status: 200, body: successBody() });

  await uploadDocuments([file("a.txt")], { baseUrl: `${BASE}/`, fetchImpl: impl });

  assert.equal(captured[0].url, "http://127.0.0.1:8000/upload");
});

/* --- ingestion / taşıma hataları --- */

test("backend 403 upload_disabled olarak ayrıştırılır", async () => {
  const { impl } = fakeFetch({
    status: 403,
    body: { detail: { code: "upload_disabled", message: "kapalı" } },
  });

  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: impl })),
    "upload_disabled",
  );
});

test("backend 413 ve 400 doğru ayrıştırılır", async () => {
  const big = fakeFetch({ status: 413, body: { detail: { code: "file_too_large" } } });
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: big.impl })),
    "file_too_large",
  );

  const bad = fakeFetch({ status: 400, body: { detail: { code: "invalid_filename" } } });
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: bad.impl })),
    "invalid_request",
  );
});

test("kod gelmezse HTTP durumuna düşülür", () => {
  assert.equal(mapUploadError(403, null), "upload_disabled");
  assert.equal(mapUploadError(413, {}), "file_too_large");
  assert.equal(mapUploadError(422, null), "invalid_request");
  assert.equal(mapUploadError(500, null), "upstream_error");
  assert.equal(mapUploadError(400, { detail: { code: "unsupported_file_type" } }), "unsupported_file_type");
});

test("ingestion çökmesi upstream_error olur", async () => {
  const { impl } = fakeFetch({ status: 500, body: { detail: { code: "retrieval_error" } } });

  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: impl })),
    "upstream_error",
  );
});

test("zaman aşımı ve ağ hatası ayrı raporlanır", async () => {
  const timeout = fakeFetch(Object.assign(new Error("t"), { name: "TimeoutError" }));
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: timeout.impl })),
    "timeout",
  );

  const network = fakeFetch(new TypeError("fetch failed"));
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: network.impl })),
    "network",
  );
});

test("beklenen biçimde olmayan 200 yanıt bad_response olur", async () => {
  const broken = fakeFetch({ status: 200, body: { files: [{ filename: 1 }] } });
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: broken.impl })),
    "bad_response",
  );

  const noFiles = fakeFetch({ status: 200, body: { total_chunks: 3 } });
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: noFiles.impl })),
    "bad_response",
  );

  const invalidJson = fakeFetch({ status: 200, invalidJson: true });
  assert.equal(
    expectError(await uploadDocuments([file("a.txt")], { baseUrl: BASE, fetchImpl: invalidJson.impl })),
    "bad_response",
  );
});

test("tanınmayan status değeri reddedilir", () => {
  assert.equal(
    normalizeUploadResponse({
      files: [{ filename: "a.txt", chunks_created: 1, status: "belirsiz" }],
    }),
    null,
  );
});

test("yanıttaki fazla alanlar arayüze geçmez", () => {
  const result = normalizeUploadResponse({
    files: [
      {
        filename: "a.txt",
        chunks_created: 1,
        status: "ingested",
        raw_response: "SIZINTI",
        system_prompt: "SIZINTI",
      },
    ],
    total_chunks: 1,
    corpus_chunks: 1,
    observation: "SIZINTI",
  });

  assert.ok(result?.ok);
  assert.ok(!JSON.stringify(result).includes("SIZINTI"));
  assert.deepEqual(Object.keys(result.files[0]).sort(), [
    "chunks_created",
    "filename",
    "status",
  ]);
});
