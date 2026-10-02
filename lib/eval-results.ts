/**
 * Değerlendirme artefaktını diskten okur. Yalnızca sunucu tarafında çalışır.
 *
 * Artefakt isteğe bağlıdır: `content/eval-results.json` yoksa sayfa bunu
 * açıkça bildirir. Dosya, RAG repo'sundaki bir değerlendirme koşusunun
 * (`eval/results/latest.json`) kopyasıdır; bu repoda üretilmez ve burada
 * hiçbir değerlendirme çalıştırılmaz.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { readEvalReport, type EvalReportState } from "@/lib/eval-report";

/** Yalnızca arayüzde göstermek için; okuma yolu aşağıda literal kurulur. */
export const EVAL_RESULTS_RELATIVE_PATH = "content/eval-results.json";

export function loadEvalReport(filePath?: string): EvalReportState {
  // Yol literal segmentlerle kuruluyor: Turbopack'in statik analizi aksi halde
  // tüm projeyi sunucu çıktısına dahil ediyor.
  const target = filePath ?? path.join(process.cwd(), "content", "eval-results.json");

  let contents: string;
  try {
    // turbopackIgnore: tek bir isteğe bağlı artefakt dosyası okunuyor; bu
    // yönlendirme olmadan Turbopack statik analizi tüm projeyi sunucu
    // çıktısına dahil ediyor (kendi uyarısının önerdiği çözüm).
    contents = readFileSync(/* turbopackIgnore: true */ target, "utf8");
  } catch {
    // Dosyanın bulunmaması beklenen bir durum, hata değil.
    return { status: "missing" };
  }

  try {
    return readEvalReport(JSON.parse(contents));
  } catch (error) {
    return {
      status: "invalid",
      problems: [`artefakt JSON olarak ayrıştırılamadı: ${(error as Error).message}`],
    };
  }
}
