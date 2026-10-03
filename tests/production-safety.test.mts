/**
 * Üretim güvenlik kontrolleri.
 *
 * Derlenmiş istemci paketini ve sunucu tarafı modüllerini kaynak düzeyinde
 * denetler: hiçbir sır veya backend adresi tarayıcıya gidebilecek bir yere
 * yazılmamalı. Ağ veya model çağrısı yoktur.
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function readIfExists(relative: string): string | null {
  try {
    return readFileSync(path.join(repoRoot, relative), "utf8");
  } catch {
    return null;
  }
}

function walkFiles(dir: string, extensions: string[]): string[] {
  const absolute = path.join(repoRoot, dir);
  const found: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(absolute);
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = path.join(absolute, entry);
    if (statSync(full).isDirectory()) {
      found.push(...walkFiles(path.join(dir, entry), extensions));
    } else if (extensions.some((ext) => entry.endsWith(ext))) {
      found.push(full);
    }
  }
  return found;
}

/** Tarayıcıya gidebilecek her dosya: istemci bileşenleri ve lib. */
function clientSourceFiles(): string[] {
  return [...walkFiles("components", [".tsx", ".ts"]), ...walkFiles("lib", [".ts"])];
}

/* --- sırlar istemci koduna girmiyor --- */

test("hiçbir kaynak dosyada gerçek API anahtarı kalıbı yok", () => {
  const files = [
    ...clientSourceFiles(),
    ...walkFiles("app", [".tsx", ".ts"]),
    ...walkFiles("tests", [".mts"]),
  ];

  for (const file of files) {
    const contents = readFileSync(file, "utf8");
    // Gerçek anahtar önekleri: Google AI Studio (AIza / AQ.) ve Anthropic.
    assert.ok(!/AIza[0-9A-Za-z_-]{10,}/u.test(contents), `${file}: Gemini anahtarı kalıbı`);
    assert.ok(!/sk-ant-api[0-9A-Za-z_-]{10,}/u.test(contents), `${file}: Anthropic anahtarı`);
    assert.ok(!/AQ\.Ab8[0-9A-Za-z_-]{10,}/u.test(contents), `${file}: Gemini anahtarı kalıbı`);
  }
});

test("GEMINI_API_KEY hiçbir web dosyasında OKUNMUYOR", () => {
  // Web katmanı Gemini'yi hiç çağırmaz; yalnızca FastAPI ile konuşur.
  //
  // Aranan şey değişkenin ADI değil, OKUNMASI: API kurulum sayfası kullanıcıya
  // hangi değişkenleri tanımlaması gerektiğini anlatırken adı metin olarak
  // gösteriyor ve bu bir sızıntı değil. Sızıntı, değerin gerçekten okunup
  // istemciye taşınmasıyla olurdu.
  const forbidden = [
    "process.env.GEMINI_API_KEY",
    "process.env.INGEST_API_TOKEN",
    "NEXT_PUBLIC_GEMINI",
  ];

  for (const file of [...clientSourceFiles(), ...walkFiles("app", [".tsx", ".ts"])]) {
    const contents = readFileSync(file, "utf8");
    for (const pattern of forbidden) {
      assert.ok(
        !contents.includes(pattern),
        `${file}: web katmanı ${pattern} okumamalı`,
      );
    }
  }
});

test("gerçek bir anahtar değeri hiçbir yerde gömülü değil", () => {
  // Dokümantasyon örnekleri yer tutucu olmalı: "YOUR_API_KEY" gibi.
  for (const file of walkFiles("lib/i18n", [".ts"])) {
    const contents = readFileSync(file, "utf8");
    assert.ok(!/AIza[0-9A-Za-z_-]{10,}/u.test(contents), `${file}: gerçek anahtar kalıbı`);
  }
});

test("AGENT_API_URL yalnızca sunucu tarafı modüllerde okunuyor", () => {
  const readers = [...walkFiles("app", [".tsx", ".ts"]), ...clientSourceFiles()].filter((file) =>
    readFileSync(file, "utf8").includes("process.env.AGENT_API_URL"),
  );

  assert.deepEqual(
    readers.map((file) => path.relative(repoRoot, file).replace(/\\/gu, "/")),
    ["lib/config.ts"],
    "backend adresi yalnızca sunucu tarafı yapılandırmasında okunmalı",
  );
});

test("backend adresi ve mod NEXT_PUBLIC_ ile taşınmıyor", () => {
  const config = readIfExists("lib/config.ts");
  assert.ok(config);

  for (const forbidden of [
    "NEXT_PUBLIC_AGENT_API_URL",
    "NEXT_PUBLIC_DEMO_MODE",
    "NEXT_PUBLIC_UPLOAD_ENABLED",
    "NEXT_PUBLIC_GEMINI",
  ]) {
    assert.ok(!config.includes(forbidden), `${forbidden} kullanılmamalı`);
  }

  // NEXT_PUBLIC_ ile yalnızca herkese açık profil bağlantıları taşınır.
  const publicVars = [...config.matchAll(/NEXT_PUBLIC_[A-Z_]+/gu)].map((match) => match[0]);
  assert.deepEqual(
    [...new Set(publicVars)].sort(),
    ["NEXT_PUBLIC_GITHUB_URL", "NEXT_PUBLIC_LINKEDIN_URL"],
  );
});

test("istemci bileşenleri yalnızca kendi proxy yollarını çağırır", () => {
  const clientFiles = clientSourceFiles().filter((file) =>
    readFileSync(file, "utf8").startsWith('"use client"'),
  );
  assert.ok(clientFiles.length > 0, "en az bir istemci bileşeni olmalı");

  for (const file of clientFiles) {
    const contents = readFileSync(file, "utf8");
    for (const call of [...contents.matchAll(/fetch\(\s*"([^"]+)"/gu)]) {
      assert.ok(
        call[1].startsWith("/api/"),
        `${file}: istemci yalnızca /api/* çağırmalı, bulunan: ${call[1]}`,
      );
    }
  }
});

/* --- derlenmiş istemci paketi --- */

test("derlenmiş istemci paketinde sır veya backend adresi yok", () => {
  const chunks = walkFiles(path.join(".next", "static"), [".js"]);
  if (chunks.length === 0) {
    // Build çalıştırılmadıysa bu kontrol atlanır; CI'da build'den sonra koşar.
    return;
  }

  for (const chunk of chunks) {
    const contents = readFileSync(chunk, "utf8");
    assert.ok(!contents.includes("GEMINI_API_KEY"), `${chunk}: Gemini anahtarı adı`);
    assert.ok(!contents.includes("ANTHROPIC_API_KEY"), `${chunk}: Anthropic anahtarı adı`);
    assert.ok(!contents.includes("AGENT_API_URL"), `${chunk}: backend adresi değişkeni`);
    assert.ok(!/AIza[0-9A-Za-z_-]{10,}/u.test(contents), `${chunk}: Gemini anahtarı kalıbı`);
    assert.ok(!/sk-ant-api[0-9A-Za-z_-]{10,}/u.test(contents), `${chunk}: Anthropic anahtarı`);
  }
});

/* --- üretim varsayılanları --- */

test("env örneği gerçek sır içermiyor ve üretim varsayılanlarını anlatıyor", () => {
  const example = readIfExists(".env.example");
  assert.ok(example);

  assert.ok(!/AIza[0-9A-Za-z_-]{10,}/u.test(example));
  assert.ok(!/sk-ant-api[0-9A-Za-z_-]{10,}/u.test(example));

  for (const variable of ["DEMO_MODE", "AGENT_API_URL", "UPLOAD_ENABLED", "NEXT_PUBLIC_GITHUB_URL"]) {
    assert.ok(example.includes(variable), `${variable} env örneğinde belgelenmeli`);
  }
});

test("demo modu ve kapalı upload varsayılan davranış", () => {
  const config = readIfExists("lib/config.ts");
  assert.ok(config);

  // DEMO_MODE yalnızca açıkça "false" yazılırsa canlıya geçer.
  assert.ok(config.includes('process.env.DEMO_MODE === "false" ? "live" : "demo"'));
  // UPLOAD_ENABLED yalnızca açıkça "true" ise açılır.
  assert.ok(config.includes('process.env.UPLOAD_ENABLED === "true"'));
});

test("upload proxy'si demo modunda ve kapalıyken backend'e gitmez", () => {
  const route = readIfExists("app/api/upload/route.ts");
  assert.ok(route);

  const demoGate = route.indexOf('APP_MODE === "demo"');
  const flagGate = route.indexOf("!UPLOAD_ENABLED");
  const call = route.indexOf("uploadDocuments(");

  assert.ok(demoGate > -1 && flagGate > -1 && call > -1);
  assert.ok(demoGate < call, "demo kapısı backend çağrısından önce olmalı");
  assert.ok(flagGate < call, "bayrak kapısı backend çağrısından önce olmalı");
});

test("ask proxy'si demo modunda backend'e gitmez", () => {
  const route = readIfExists("app/api/ask/route.ts");
  assert.ok(route);

  const demoGate = route.indexOf('APP_MODE === "demo"');
  const call = route.indexOf("askAgent(");

  assert.ok(demoGate > -1 && call > -1);
  assert.ok(demoGate < call, "demo kapısı backend çağrısından önce olmalı");
});
