import { NextResponse } from "next/server";

import { AGENT_API_TIMEOUT_MS, AGENT_API_URL, APP_MODE, UPLOAD_ENABLED } from "@/lib/config";
import { resetCorpus } from "@/lib/documents-api";

/** Korpusu tamamen boşaltır. Kapılar `[name]/route.ts` ile aynı. */
export async function POST() {
  if (APP_MODE === "demo") {
    return NextResponse.json({ ok: false, kind: "not_configured" as const }, { status: 409 });
  }
  if (!UPLOAD_ENABLED) {
    return NextResponse.json({ ok: false, kind: "read_only" as const }, { status: 403 });
  }

  const result = await resetCorpus({
    baseUrl: AGENT_API_URL,
    timeoutMs: AGENT_API_TIMEOUT_MS,
  });

  return NextResponse.json(result, {
    status: result.ok ? 200 : result.kind === "read_only" ? 403 : 502,
  });
}
