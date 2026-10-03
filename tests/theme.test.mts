/**
 * Tema seçimi testleri.
 *
 * Buradaki asıl güvence davranışsal: uygulamanın varsayılanı KOYU ve bu karar
 * işletim sistemi tercihine bırakılmamış. Seçimin çerezde saklanması ise
 * hydration'ın temeli -- sunucu `data-theme` niteliğini üretebiliyorsa,
 * istemcinin ilk render'ı onunla birebir aynı oluyor.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  DEFAULT_THEME,
  THEMES,
  THEME_COOKIE,
  isTheme,
  normalizeTheme,
} from "../lib/theme.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relative: string): string {
  return readFileSync(path.join(repoRoot, relative), "utf8");
}

/**
 * Yorumları atar.
 *
 * Bu dosyadaki kontroller kaynakta GEÇEN bir adı değil, gerçekten KULLANILAN
 * bir şeyi arıyor. Yorumlar neden bir yaklaşımdan kaçınıldığını anlatmak için
 * o adları anıyor; onları eşleşme saymak testi yanlış yere kızdırırdı.
 */
function readCode(relative: string): string {
  return read(relative)
    .replace(/\/\*[\s\S]*?\*\//gu, "")
    .replace(/^\s*\/\/.*$/gmu, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/gu, "");
}

test("uygulamanın varsayılan teması koyu", () => {
  assert.equal(DEFAULT_THEME, "dark");
});

test("yalnızca iki tema var", () => {
  assert.deepEqual([...THEMES], ["dark", "light"]);
});

test("tanınan değerler kabul edilir", () => {
  for (const theme of THEMES) assert.equal(isTheme(theme), true);
  assert.equal(isTheme("system"), false);
  assert.equal(isTheme(null), false);
  assert.equal(isTheme(1), false);
});

test("eksik veya tanınmayan değer koyuya düşer", () => {
  assert.equal(normalizeTheme(undefined), "dark", "ilk ziyaret koyu olmalı");
  assert.equal(normalizeTheme(null), "dark");
  assert.equal(normalizeTheme(""), "dark");
  assert.equal(normalizeTheme("system"), "dark");
});

test("kullanıcının açık seçimi korunur", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
});

test("tema çerezi dil çereziyle karışmaz", () => {
  assert.equal(THEME_COOKIE, "agentlab_theme");
});

// --- hydration güvencesi -----------------------------------------------------

test("tema sunucuda çözülüp html niteliğine yazılıyor", () => {
  const layout = read("app/layout.tsx");

  assert.ok(layout.includes("resolveTheme"), "tema sunucuda okunmalı");
  assert.ok(layout.includes("data-theme={theme}"), "nitelik sunucuda üretilmeli");
});

test("hydration uyarısı bastırılmıyor", () => {
  // `suppressHydrationWarning` uyuşmazlığı çözmez, yalnızca gizler. Sunucu
  // niteliği zaten doğru ürettiği için ihtiyaç da yok.
  for (const file of ["app/layout.tsx", "components/theme-toggle.tsx"]) {
    assert.ok(
      !readCode(file).includes("suppressHydrationWarning"),
      `${file}: uyarı bastırılmamalı`,
    );
  }
});

test("boyamadan önce çalışan bir tema betiği kalmadı", () => {
  assert.ok(
    !readCode("app/layout.tsx").includes("dangerouslySetInnerHTML"),
    "tema artık inline betikle değil sunucuda uygulanıyor",
  );
});

test("tema localStorage'dan okunmuyor", () => {
  // localStorage sunucuda okunamaz; tema oradan gelseydi ya flash ya
  // uyuşmazlık kaçınılmaz olurdu.
  for (const file of ["lib/theme.ts", "components/theme-toggle.tsx"]) {
    assert.ok(
      !readCode(file).includes("localStorage"),
      `${file}: localStorage kullanılmamalı`,
    );
  }
});

test("tema düğmesi başlangıç değerini prop olarak alıyor", () => {
  const toggle = read("components/theme-toggle.tsx");

  assert.ok(toggle.includes("initialTheme"), "başlangıç değeri sunucudan gelmeli");
  // Render sırasında DOM okumak, sunucu render'ıyla farklı bir sonuç üretir.
  const code = readCode("components/theme-toggle.tsx");
  assert.ok(!code.includes("useSyncExternalStore"), "DOM'dan okunmamalı");
  assert.ok(!code.includes("matchMedia"), "sistem tercihi belirleyici olmamalı");
});

test("CSS sistem tercihine göre tema seçmiyor", () => {
  const css = read("app/globals.css");
  const rules = css
    .split("\n")
    .filter((line) => line.includes("@media") && line.includes("prefers-color-scheme"));

  assert.deepEqual(rules, [], "tema kuralı sistem tercihine bağlanmamalı");
  assert.ok(css.includes(':root[data-theme="light"]'), "aydınlık tema açık seçimle gelmeli");
});
