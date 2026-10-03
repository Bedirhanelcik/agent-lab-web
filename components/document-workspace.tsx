"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { format } from "@/lib/i18n";
import type { CorpusState, DocumentErrorKind } from "@/lib/documents-api";
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
  | { kind: "uploading" }
  | { kind: "done"; files: UploadedFileResult[]; corpusChunks: number }
  | { kind: "error"; code: UploadErrorKind };

const MAX_MB = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024));

/** Korpusu okur. Hiçbir React state'ine dokunmaz; sonucu çağırana bırakır. */
async function readCorpus(): Promise<
  { ok: true; corpus: CorpusState } | { ok: false; kind: DocumentErrorKind }
> {
  try {
    const response = await fetch("/api/documents", { cache: "no-store" });
    return (await response.json()) as
      | { ok: true; corpus: CorpusState }
      | { ok: false; kind: DocumentErrorKind };
  } catch {
    return { ok: false, kind: "network" };
  }
}

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 text-faint"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7.5A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V7l-4-4Z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

/**
 * Doküman çalışma alanı.
 *
 * Bu, uygulamanın asıl amacının göründüğü yer: kullanıcı kendi dosyalarını
 * getiriyor, sistem onları aranabilir hale getiriyor ve agent o korpusta
 * arıyor. Bu yüzden genel bir "dosya yükle" formu gibi değil, korpusun
 * durumunu da gösteren bir alan olarak kurulu.
 *
 * GÜVENLİK: tarayıcı backend'in adresini ve hiçbir sırrı görmez. Yükleme,
 * listeleme, silme ve sıfırlama isteklerinin tamamı Next.js route
 * handler'larına gider; `INGEST_API_TOKEN` bu yolun hiçbir yerinde yoktur --
 * o token yalnızca operatör ingestion ucuna ait ve sunucuda kalır.
 */
export function DocumentWorkspace({
  mode,
  uploadEnabled,
}: {
  mode: AppMode;
  uploadEnabled: boolean;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [corpus, setCorpus] = useState<CorpusState | null>(null);
  const [corpusError, setCorpusError] = useState<DocumentErrorKind | null>(null);
  // Canlı modda ilk okuma hemen başlıyor, bu yüzden başlangıç değeri `true`:
  // yükleniyor durumunu bir efekt içinden set etmek gerekmiyor.
  const [loadingCorpus, setLoadingCorpus] = useState(mode === "live");
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const live = mode === "live";
  const busy = phase.kind === "uploading";

  /** Durumu uygular. Okuma işi `readCorpus`'ta ve state'e hiç dokunmuyor. */
  const applyCorpus = useCallback(
    (result: { ok: true; corpus: CorpusState } | { ok: false; kind: DocumentErrorKind }) => {
      if (result.ok) {
        setCorpus(result.corpus);
        setCorpusError(null);
      } else {
        setCorpus(null);
        setCorpusError(result.kind);
      }
      setLoadingCorpus(false);
    },
    [],
  );

  const loadCorpus = useCallback(async () => {
    if (!live) return;
    applyCorpus(await readCorpus());
  }, [live, applyCorpus]);

  useEffect(() => {
    if (!live) return;

    // Bileşen sökülürse geç gelen yanıt state'e yazılmaz. Okuma ile yazma
    // ayrı: efektin gövdesinde state'e dokunan hiçbir çağrı yok, güncelleme
    // yalnızca `await` sonrasında yapılıyor.
    let cancelled = false;
    void (async () => {
      const result = await readCorpus();
      if (!cancelled) applyCorpus(result);
    })();

    return () => {
      cancelled = true;
    };
  }, [live, applyCorpus]);

  function addFiles(incoming: FileList | File[]) {
    const next = Array.from(incoming);
    if (next.length === 0) return;
    setPhase({ kind: "idle" });
    setSelected((current) => {
      const seen = new Set(current.map((file) => file.name));
      return [...current, ...next.filter((file) => !seen.has(file.name))];
    });
  }

  async function submit() {
    if (!live || !uploadEnabled || busy || selected.length === 0) return;

    const problem = validateUploadFiles(
      selected.map((file) => ({ name: file.name, size: file.size })),
    );
    if (problem) {
      setPhase({ kind: "error", code: problem });
      return;
    }

    setPhase({ kind: "uploading" });

    const form = new FormData();
    for (const file of selected) form.append("files", file, file.name);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: form });
      const payload = (await response.json()) as UploadOutcome;
      if (payload.ok) {
        setPhase({ kind: "done", files: payload.files, corpusChunks: payload.corpus_chunks });
        setSelected([]);
        if (inputRef.current) inputRef.current.value = "";
        void loadCorpus();
      } else {
        setPhase({ kind: "error", code: payload.kind });
      }
    } catch {
      setPhase({ kind: "error", code: "network" });
    }
  }

  async function remove(sourceFile: string) {
    setActionError(null);
    setPendingRemoval(sourceFile);
    try {
      const response = await fetch(`/api/documents/${encodeURIComponent(sourceFile)}`, {
        method: "DELETE",
      });
      if (!response.ok) setActionError(t.documents.removeFailed);
      await loadCorpus();
    } catch {
      setActionError(t.documents.removeFailed);
    } finally {
      setPendingRemoval(null);
    }
  }

  async function reset() {
    setActionError(null);
    setResetting(true);
    try {
      const response = await fetch("/api/documents/reset", { method: "POST" });
      if (!response.ok) setActionError(t.documents.resetFailed);
      await loadCorpus();
    } catch {
      setActionError(t.documents.resetFailed);
    } finally {
      setResetting(false);
    }
  }

  function uploadError(code: UploadErrorKind): string {
    return format(t.upload.errors[code] ?? code, { max: MAX_MB });
  }

  // --- demo ve salt okunur durumlar -----------------------------------------

  if (!live) {
    return (
      <section className="border border-line border-dashed p-6 sm:p-8">
        <p className="eyebrow">{t.documents.eyebrow}</p>
        <h2 className="display mt-3 text-2xl text-fg sm:text-3xl">{t.documents.demoTitle}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {t.documents.demoBody}
        </p>
      </section>
    );
  }

  const canModify = uploadEnabled && (corpus?.can_modify ?? false);

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow">{t.documents.eyebrow}</p>
        <h2 className="display mt-3 text-2xl text-fg sm:text-3xl">{t.documents.heading}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{t.documents.intro}</p>
      </div>

      {!uploadEnabled ? (
        <div className="border border-line bg-surface p-5">
          <h3 className="mono-label text-fg">{t.documents.readOnlyTitle}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {t.documents.readOnlyBody}
          </p>
        </div>
      ) : (
        <>
          {/* --- bırakma alanı --- */}
          <div
            data-active={dragging}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className="dropzone flex flex-col items-center gap-3 p-8 text-center sm:p-12"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-7 text-faint"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V4m0 0L8 8m4-4 4 4" />
              <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
            </svg>

            <div>
              <p className="text-base text-fg">{t.documents.dropTitle}</p>
              <p className="mt-1 text-sm text-muted">{t.documents.dropHint}</p>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="mono-label border border-line-field px-4 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-faint"
            >
              {t.documents.browse}
            </button>

            <p className="font-mono text-xs text-faint">
              {t.documents.accepted} · {format(t.documents.maxSize, { max: MAX_MB })}
            </p>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPTED_UPLOAD_EXTENSIONS.join(",")}
              onChange={(event) => {
                if (event.target.files) addFiles(event.target.files);
              }}
              aria-label={t.upload.fileInputLabel}
              className="sr-only"
            />
          </div>

          {/* --- seçilen dosyalar --- */}
          {selected.length > 0 ? (
            <div className="border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="mono-label text-fg">{t.documents.selectedTitle}</h3>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  disabled={busy}
                  className="font-mono text-xs text-faint underline-offset-4 transition-colors hover:text-fg hover:underline disabled:cursor-not-allowed"
                >
                  {t.documents.clearSelection}
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {selected.map((file) => (
                  <li key={file.name} className="flex min-w-0 items-center gap-3">
                    <FileIcon />
                    <span className="min-w-0 flex-1 truncate text-sm text-fg" dir="auto">
                      {file.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs text-faint tabular-nums">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="mono-label mt-5 w-full border border-accent/50 bg-surface-2 px-5 py-3 text-accent transition-colors hover:border-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint sm:w-auto"
              >
                {busy ? t.documents.uploading : t.documents.upload}
              </button>
            </div>
          ) : null}

          {/* --- yükleme durumları --- */}
          <div aria-live="polite" aria-busy={busy}>
            {phase.kind === "uploading" ? (
              <div className="border border-line bg-surface p-5">
                <p className="mono-label text-faint">
                  <span className="pulse-dot me-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
                  {t.documents.indexing}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t.documents.indexingHint}
                </p>
              </div>
            ) : null}

            {phase.kind === "done" ? (
              <div className="border border-accent/40 bg-surface-2 p-5">
                <p className="mono-label text-accent">{t.documents.successTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-fg">
                  {t.documents.successBody}
                </p>
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
                        {format(t.documents.chunkCount, { count: file.chunks_created })}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs text-muted tabular-nums">
                  {format(t.documents.corpusNote, { chunks: phase.corpusChunks })}
                </p>
                <a
                  href="#question"
                  className="mono-label mt-4 inline-flex items-center gap-2 border border-line-bright px-4 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  {t.documents.askNow}
                  <span aria-hidden="true" className="rtl:rotate-180">
                    →
                  </span>
                </a>
              </div>
            ) : null}

            {phase.kind === "error" ? (
              <div className="border border-line bg-surface p-5">
                <p className="mono-label text-fg">{t.documents.failedTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {uploadError(phase.code)}
                </p>
                <p className="mt-2 font-mono text-xs text-faint" dir="ltr">
                  {phase.code}
                </p>
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* --- korpustaki dokümanlar --- */}
      <div className="border border-line">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-4">
          <h3 className="mono-label text-fg">{t.documents.listTitle}</h3>
          {corpus ? (
            <p className="font-mono text-xs text-faint tabular-nums">
              {t.documents.corpusSize} {corpus.total_chunks} · {t.documents.keywordIndex}{" "}
              {corpus.keyword_index_size}
            </p>
          ) : null}
        </div>

        {loadingCorpus && corpus === null ? (
          <p className="px-5 py-6 text-sm text-muted">{t.documents.loading}</p>
        ) : null}

        {corpusError !== null ? (
          <p className="px-5 py-6 text-sm text-muted">
            {t.documents.loadFailed}{" "}
            <span className="font-mono text-xs text-faint" dir="ltr">
              {corpusError}
            </span>
          </p>
        ) : null}

        {corpus !== null && corpus.documents.length === 0 ? (
          <div className="px-5 py-8">
            <p className="mono-label text-fg">{t.documents.listEmptyTitle}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {t.documents.listEmptyBody}
            </p>
          </div>
        ) : null}

        {corpus !== null && corpus.documents.length > 0 ? (
          <ul className="divide-y divide-line">
            {corpus.documents.map((document) => (
              <li
                key={document.source_file}
                className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
              >
                <FileIcon />
                <span className="min-w-0 flex-1 truncate text-sm text-fg" dir="auto">
                  {document.source_file}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted tabular-nums">
                  {format(t.documents.chunkCount, { count: document.chunk_count })}
                </span>
                {canModify ? (
                  <button
                    type="button"
                    onClick={() => remove(document.source_file)}
                    disabled={pendingRemoval !== null || resetting}
                    className="mono-label shrink-0 border border-line px-3 py-1.5 text-faint transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed"
                  >
                    {pendingRemoval === document.source_file
                      ? t.documents.removing
                      : t.documents.remove}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {actionError !== null ? (
          <p className="border-t border-line px-5 py-3 text-sm text-danger">{actionError}</p>
        ) : null}
      </div>

      {/* --- sıfırlama --- */}
      {canModify && corpus !== null && corpus.documents.length > 0 ? (
        <div className="flex flex-col gap-3 border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="mono-label text-fg">{t.documents.resetTitle}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {t.documents.resetBody}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={resetting || pendingRemoval !== null}
            className="mono-label shrink-0 border border-line-field px-4 py-2.5 text-muted transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed"
          >
            {resetting ? t.documents.resetting : t.documents.reset}
          </button>
        </div>
      ) : null}
    </section>
  );
}
