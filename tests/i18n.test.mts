/**
 * Dil katmanı testleri.
 *
 * Sekiz sözlüğü elle senkron tutmak hata üretir: bir dile anahtar eklenip
 * ötekilere eklenmemesi, yalnızca o dil seçildiğinde görünen boş bir alan
 * demektir. TypeScript eksik anahtarı yakalıyor (`satisfies Messages`), bu
 * testler onun yakalayamadıklarını yakalıyor: boş metinler, kopyala-yapıştır
 * ile aynı kalmış çeviriler, kaybolmuş yer tutucular ve sözleşme değerleriyle
 * (status, action, hata kodu) sözlüğün kayması.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AGENT_ACTIONS, AGENT_STATUSES } from "../lib/agent-contract.ts";
import { AGENT_API_ERROR_KINDS } from "../lib/agent-api.ts";
import { UPLOAD_ERROR_KINDS } from "../lib/upload-api.ts";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_INFO,
  format,
  getDirection,
  getMessages,
  isLocale,
  normalizeLocale,
  pickLocaleFromAcceptLanguage,
} from "../lib/i18n/index.ts";

const EXPECTED_LOCALES = ["tr", "en", "fr", "ar", "es", "pt", "zh", "hi"];

/** Sözlükteki her metnin yolunu ve değerini düz bir listeye açar. */
function flatten(node: unknown, path = ""): [string, string][] {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) {
    return node.flatMap((item, index) => flatten(item, `${path}[${index}]`));
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      flatten(value, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort();
}

const reference = flatten(getMessages("tr"));

describe("dil kayıtları", () => {
  it("tam olarak sekiz dil sunar", () => {
    assert.deepEqual([...LOCALES], EXPECTED_LOCALES);
  });

  it("varsayılan dil korpusun dilidir", () => {
    assert.equal(DEFAULT_LOCALE, "tr");
  });

  it("yalnızca Arapça sağdan sola akar", () => {
    for (const locale of LOCALES) {
      assert.equal(getDirection(locale), locale === "ar" ? "rtl" : "ltr");
    }
  });

  it("her dil kendi adıyla yazılır ve adlar birbirinden farklıdır", () => {
    const names = LOCALES.map((locale) => LOCALE_INFO[locale].nativeName);

    assert.equal(new Set(names).size, names.length);
    // Seçici yalnızca bayrakla değil, adla da gösterilmeli: adlar boş olamaz.
    for (const name of names) assert.ok(name.trim().length > 0);
    assert.equal(LOCALE_INFO.ar.nativeName, "العربية");
    assert.equal(LOCALE_INFO.zh.nativeName, "中文（简体）");
    assert.equal(LOCALE_INFO.hi.nativeName, "हिन्दी");
    assert.equal(LOCALE_INFO.pt.nativeName, "Português");
  });
});

describe("sözlük bütünlüğü", () => {
  for (const locale of LOCALES) {
    it(`${locale}: Türkçe referansla aynı anahtarları taşır`, () => {
      // Sıra değil küme karşılaştırılıyor: bir dilde bölümlerin dosya içindeki
      // yeri farklı olabilir, önemli olan hiçbir anahtarın eksik veya fazla
      // olmaması.
      const entries = flatten(getMessages(locale));

      assert.deepEqual(
        entries.map(([path]) => path).sort(),
        reference.map(([path]) => path).sort(),
      );
    });

    it(`${locale}: hiçbir metin boş değil`, () => {
      for (const [path, value] of flatten(getMessages(locale))) {
        assert.ok(value.trim().length > 0, `${locale}.${path} boş`);
      }
    });

    it(`${locale}: yer tutucular referansla aynı`, () => {
      const entries = new Map(flatten(getMessages(locale)));

      for (const [path, expected] of reference) {
        const actual = entries.get(path) ?? "";
        assert.deepEqual(
          placeholders(actual),
          placeholders(expected),
          `${locale}.${path} yer tutucuları uyuşmuyor`,
        );
      }
    });
  }

  it("çeviriler kopyala-yapıştır değil", () => {
    // Birkaç uzun cümlenin her dilde farklı olması, bir dosyanın başka bir
    // dilden kopyalanıp çevrilmeden bırakılmadığını gösterir.
    const probes = [
      "home.whyDescription",
      "playground.notFoundBody",
      "errors.body.quota_exhausted",
    ];

    for (const probe of probes) {
      const values = LOCALES.map((locale) => {
        const entries = new Map(flatten(getMessages(locale)));
        return entries.get(probe);
      });
      assert.equal(new Set(values).size, LOCALES.length, `${probe} dillerde aynı kalmış`);
    }
  });

  it("teknik terimler çevrilmemiş", () => {
    // Kullanıcı bu terimleri her dilde aynı adla tanımalı.
    for (const locale of LOCALES) {
      const t = getMessages(locale);
      const blob = flatten(t)
        .map(([, value]) => value)
        .join("\n");

      for (const term of ["RAG", "BM25", "Reciprocal Rank Fusion", "Chroma", "Gemini"]) {
        assert.ok(blob.includes(term), `${locale}: "${term}" terimi kaybolmuş`);
      }
      assert.equal(t.system.retrievalTitle, "Hybrid Retrieval");
      assert.equal(t.nav.playground, "Playground");
      assert.equal(t.nav.evaluation, "Evaluation");
      // Chunk kimliği biçimi teknik bir sözleşme: çevrilmemeli.
      assert.ok(
        t.system.retrievalParts.some((part) => part.body.includes("source_file::chunk_index")),
      );
    }
  });
});

describe("sözleşme değerleriyle hizalama", () => {
  for (const locale of LOCALES) {
    it(`${locale}: her agent status'ü için etiket ve açıklama var`, () => {
      const t = getMessages(locale);

      assert.deepEqual(Object.keys(t.result.statusLabels).sort(), [...AGENT_STATUSES].sort());
      assert.deepEqual(
        Object.keys(t.result.statusExplanations).sort(),
        [...AGENT_STATUSES].sort(),
      );
    });

    it(`${locale}: her agent aksiyonu için etiket var`, () => {
      assert.deepEqual(
        Object.keys(getMessages(locale).result.actionLabels).sort(),
        [...AGENT_ACTIONS].sort(),
      );
    });

    it(`${locale}: her API hata türü için başlık ve gövde var`, () => {
      const t = getMessages(locale);
      // "bad_response" zaten AGENT_API_ERROR_KINDS içinde: istemci tarafında
      // üretilen bu durum da sözleşmenin parçası.
      const expected = [...AGENT_API_ERROR_KINDS].sort();

      assert.deepEqual(Object.keys(t.errors.title).sort(), expected);
      assert.deepEqual(Object.keys(t.errors.body).sort(), expected);
    });

    it(`${locale}: her yükleme hata türü için mesaj var`, () => {
      assert.deepEqual(
        Object.keys(getMessages(locale).upload.errors).sort(),
        [...UPLOAD_ERROR_KINDS].sort(),
      );
    });
  }
});

describe("dil kodu çözümleme", () => {
  it("desteklenen kodları tanır", () => {
    for (const locale of LOCALES) assert.equal(isLocale(locale), true);
    assert.equal(isLocale("de"), false);
    assert.equal(isLocale(null), false);
    assert.equal(isLocale(42), false);
  });

  it("bölgeli ve büyük harfli kodları indirger", () => {
    assert.equal(normalizeLocale("en-US"), "en");
    assert.equal(normalizeLocale("ZH_Hans"), "zh");
    assert.equal(normalizeLocale("  fr  "), "fr");
  });

  it("tanınmayan kod varsayılana düşer", () => {
    assert.equal(normalizeLocale("de"), DEFAULT_LOCALE);
    assert.equal(normalizeLocale(""), DEFAULT_LOCALE);
    assert.equal(normalizeLocale(null), DEFAULT_LOCALE);
  });
});

describe("Accept-Language", () => {
  it("ağırlığı en yüksek desteklenen dili seçer", () => {
    assert.equal(pickLocaleFromAcceptLanguage("de;q=0.9,fr;q=0.8,en;q=0.7"), "fr");
  });

  it("ağırlık yazılmamışsa sırayı kullanır", () => {
    assert.equal(pickLocaleFromAcceptLanguage("ar,en;q=0.5"), "ar");
  });

  it("desteklenen dil yoksa null döner", () => {
    assert.equal(pickLocaleFromAcceptLanguage("de,it,pl"), null);
    assert.equal(pickLocaleFromAcceptLanguage(""), null);
    assert.equal(pickLocaleFromAcceptLanguage(null), null);
  });

  it("q=0 olan dil seçilmez", () => {
    assert.equal(pickLocaleFromAcceptLanguage("fr;q=0,en;q=0.4"), "en");
  });
});

describe("şablon doldurma", () => {
  it("yer tutucuları değerlerle değiştirir", () => {
    assert.equal(format("{agent} agent + {judge} judge", { agent: 12, judge: 1 }), "12 agent + 1 judge");
  });

  it("bilinmeyen yer tutucuyu olduğu gibi bırakır", () => {
    assert.equal(format("en fazla {max} MB", {}), "en fazla {max} MB");
  });

  it("aynı yer tutucu birden fazla geçebilir", () => {
    assert.equal(format("{n}/{n}", { n: 3 }), "3/3");
  });
});
