"use client";

import { useRef, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { format } from "@/lib/i18n";
import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  validateUploadFiles,
  type UploadErrorKind,
  type UploadOutcome,
  type UploadedFileResult,
} from "@/lib/upload-api";
import type { AppMode } from "@/lib/ui-config";

type Phase =
  | { kind: "idle" }
  | { kind: "uploading"; names: string[] }
  | { kind: "done"; files: UploadedFileResult[]; corpusChunks: number }
  | { kind: "error"; code: UploadErrorKind };

/**
 * Doküman yükleme alanı.
 *
 * Demo modunda ve yükleme kapalıyken hiçbir istek yapılmaz; kullanıcıya durumun
 * nedeni açıkça söylenir. Yüklenen doküman aynı ingestion pipeline'ından geçer,
 * yani sonrasında playground'daki sorularla aranabilir hale gelir.
 */
export function UploadPanel({
  mode,
  uploadEnabled,
}: {
  mode: AppMode;
  uploadEnabled: boolean;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [selected, setSelected] = useState<File[]>([]);

  const available = mode === "live" && uploadEnabled;
  const busy = phase.kind === "uploading";

  /** Boyut sınırı mesajı tek bir şablondan doldurulur: sayı her dilde
   *  cümlenin farklı yerinde duruyor. */
  function errorMessage(code: UploadErrorKind): string {
    const template = t.upload.errors[code] ?? code;
    return format(template, { max: Math.round(MAX_UPLOAD_BYTES / (1024 * 1024)) });
  }

  async function submit() {
    if (!available || busy || selected.length === 0) return;

    const problem = validateUploadFiles(
      selected.map((file) => ({ name: file.name, size: file.size })),
    );
    if (problem) {
      setPhase({ kind: "error", code: problem });
      return;
    }

    setPhase({ kind: "uploading", names: selected.map((file) => file.name) });

    const form = new FormData();
    for (const file of selected) form.append("files", file, file.name);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const payload = (await response.json()) as UploadOutcome;
      if (payload.ok) {
        setPhase({ kind: "done", files: payload.files, corpusChunks: payload.corpus_chunks });
        setSelected([]);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setPhase({ kind: "error", code: payload.kind });
      }
    } catch {
      setPhase({ kind: "error", code: "network" });
    }
  }

  if (!available) {
    return (
      <section className="border border-line border-dashed p-5">
        <h2 className="eyebrow">{t.upload.heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {mode === "demo" ? t.upload.disabledDemo : t.upload.disabledEnv}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-faint">
          {t.upload.disabledReason}
        </p>
        <p className="mt-3 font-mono text-xs text-faint" dir="ltr">
          UPLOAD_ENABLED=false
        </p>
      </section>
    );
  }

  return (
    <section className="border border-line p-5">
      <h2 className="eyebrow">{t.upload.heading}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {t.upload.availableBody}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_UPLOAD_EXTENSIONS.join(",")}
          disabled={busy}
          onChange={(event) => {
            setSelected(Array.from(event.target.files ?? []));
            setPhase({ kind: "idle" });
          }}
          aria-label={t.upload.fileInputLabel}
          className="min-w-0 flex-1 border border-line-field bg-surface px-4 py-3 text-sm text-muted file:me-4 file:border-0 file:bg-transparent file:font-mono file:text-xs file:text-fg disabled:border-line-bright"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || selected.length === 0}
          className="mono-label shrink-0 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
        >
          {busy ? t.upload.submitting : t.upload.submit}
        </button>
      </div>

      <div aria-live="polite" aria-busy={busy} className="mt-5">
        {phase.kind === "uploading" ? (
          <div className="border border-line bg-surface p-4">
            <p className="mono-label text-faint">
              <span className="pulse-dot me-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              {t.upload.runningTitle}
            </p>
            <p className="mt-2 truncate text-sm text-muted" dir="auto">
              {phase.names.join(", ")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-faint">{t.upload.runningHint}</p>
          </div>
        ) : null}

        {phase.kind === "done" ? (
          <div className="border border-accent/40 bg-surface-2 p-4">
            <p className="mono-label text-accent">{t.upload.doneTitle}</p>
            <ul className="mt-3 space-y-1">
              {phase.files.map((file) => (
                <li
                  key={file.filename}
                  className="flex min-w-0 flex-wrap items-baseline gap-x-3 font-mono text-xs"
                >
                  <span className="break-all text-fg" dir="auto">
                    {file.filename}
                  </span>
                  <span className="text-muted tabular-nums">
                    {file.chunks_created} {t.upload.chunkUnit}
                  </span>
                  <span className={file.status === "ingested" ? "text-accent" : "text-faint"}>
                    {file.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {t.upload.doneBody}{" "}
              <span className="font-mono tabular-nums text-fg">
                {phase.corpusChunks} {t.upload.chunkUnit}
              </span>
            </p>
          </div>
        ) : null}

        {phase.kind === "error" ? (
          <div className="border border-line bg-surface p-4">
            <p className="mono-label text-fg">{t.upload.failedTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {errorMessage(phase.code)}
            </p>
            <p className="mt-2 font-mono text-xs text-faint" dir="ltr">
              {phase.code}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
