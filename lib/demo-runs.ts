/**
 * Demo verisini bağlar. Saf mantık `lib/demo-data.ts` içinde durur; burada
 * yalnızca JSON dosyası ile o fonksiyonlar birleştirilir.
 *
 * Veri, RAG repo'sundaki `demo/fixtures.json` dosyasının kopyasıdır. Web ayrı
 * bir deployable olduğu için kendi kopyasını taşır; şekil birebir aynı
 * olduğundan güncelleme düz bir dosya kopyalamadır.
 */

import demoFile from "@/content/demo-runs.json";

import {
  findDemoRun,
  findDemoRunById,
  toDemoRunView,
  validateDemoRunFile,
  type DemoRun,
  type DemoRunView,
} from "@/lib/agent-contract";

const problems = validateDemoRunFile(demoFile);

export const DEMO_DATA_PROBLEMS: readonly string[] = problems;

export const DEMO_RUNS: readonly DemoRun[] =
  problems.length === 0 ? (demoFile.fixtures as DemoRun[]) : [];

export const DEMO_NOTE = demoFile.note;

/** Arayüzde tıklanabilir örnek sorular olarak gösterilir. */
export const DEMO_QUESTIONS: readonly { id: string; question: string; synthetic: boolean }[] =
  DEMO_RUNS.map((run) => ({ id: run.id, question: run.question, synthetic: run.synthetic }));

export function resolveDemoRun(question: string): DemoRunView | null {
  const run = findDemoRun(DEMO_RUNS, question);
  return run ? toDemoRunView(run) : null;
}

export function resolveDemoRunById(id: string): DemoRunView | null {
  const run = findDemoRunById(DEMO_RUNS, id);
  return run ? toDemoRunView(run) : null;
}
