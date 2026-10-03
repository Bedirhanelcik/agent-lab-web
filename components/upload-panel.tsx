"use client";

import { useRef, useState } from "react";

import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_BYTES,
  validateUploadFiles,
  type UploadErrorKind,
  type UploadOutcome,
  type UploadedFileResult,
} from "@/lib/upload-api";
import type { AppMode } from "@/lib/ui-config";

const ERROR_COPY: Record<UploadErrorKind, string> = {
  not_configured:
    "Agent servisinin adresi tanımlı değil, bu yüzden doküman gönderilemedi.",
  upload_disabled: "Doküman yükleme bu ortamda kapalı.",
  no_files: "Önce bir dosya seçin.",
  unsupported_file_type: "Yalnızca PDF, TXT ve MD dosyaları kabul ediliyor.",
  file_too_large: `Dosya çok büyük. En fazla ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`,
  invalid_request: "Dosya adı veya istek kabul edilmedi. Farklı bir dosya adıyla deneyin.",
  upstream_error: "Agent servisi yükleme sırasında hata döndürdü.",
  bad_response: "Yükleme yanıtı beklenen biçimde değil, bu yüzden sonuç gösterilmiyor.",
  timeout: "Yükleme beklenen süre içinde tamamlanmadı ve iptal edildi.",
  network: "Agent servisine ulaşılamadı. Servisin çalıştığından emin olun.",
};

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [selected, setSelected] = useState<File[]>([]);

  const available = mode === "live" && uploadEnabled;
  const busy = phase.kind === "uploading";

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
        <h2 className="eyebrow">Upload</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {mode === "demo"
            ? "Demo modunda doküman yükleme yapılmaz; gösterilen koşular hazırlanmış örneklerdir."
            : "Doküman yükleme bu ortamda kapalı."}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-faint">
          Yükleme yalnızca yerel geliştirmede açılır. Sebebi mimari: korpus şu an tüm
          ziyaretçiler arasında paylaşımlı, yani bir ziyaretçinin yüklediği doküman
          diğerlerinin aramalarına da girer. Kullanıcı bazlı izolasyon eklenmeden
          yükleme internete açık bırakılmamalı.
        </p>
        <p className="mt-3 font-mono text-xs text-faint">UPLOAD_ENABLED=false</p>
      </section>
    );
  }

  return (
    <section className="border border-line p-5">
      <h2 className="eyebrow">Upload</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        PDF, TXT veya MD yükleyin. Doküman mevcut ingestion pipeline&apos;ından geçer:
        sayfalara ayrılır, chunk&apos;lanır, embedding üretilir ve hem vektör hem keyword
        index&apos;ine yazılır. Sonrasında yukarıdaki soru alanından aranabilir.
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
          aria-label="Yüklenecek dokümanlar"
          className="min-w-0 flex-1 border border-line-field bg-surface px-4 py-3 text-sm text-muted file:mr-4 file:border-0 file:bg-transparent file:font-mono file:text-xs file:text-fg disabled:border-line-bright"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || selected.length === 0}
          className="mono-label shrink-0 border border-line-bright px-5 py-3 text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:border-line disabled:hover:text-faint"
        >
          {busy ? "Ingesting…" : "Upload"}
        </button>
      </div>

      <div aria-live="polite" aria-busy={busy} className="mt-5">
        {phase.kind === "uploading" ? (
          <div className="border border-line bg-surface p-4">
            <p className="mono-label text-faint">
              <span className="pulse-dot mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              Ingestion çalışıyor
            </p>
            <p className="mt-2 truncate text-sm text-muted">{phase.names.join(", ")}</p>
            <p className="mt-2 text-xs leading-relaxed text-faint">
              Chunk&apos;lama ve embedding üretimi dosya boyutuna göre birkaç saniye
              sürebilir.
            </p>
          </div>
        ) : null}

        {phase.kind === "done" ? (
          <div className="border border-accent/40 bg-surface-2 p-4">
            <p className="mono-label text-accent">Ingested</p>
            <ul className="mt-3 space-y-1">
              {phase.files.map((file) => (
                <li
                  key={file.filename}
                  className="flex flex-wrap items-baseline gap-x-3 font-mono text-xs"
                >
                  <span className="text-fg">{file.filename}</span>
                  <span className="text-muted tabular-nums">
                    {file.chunks_created} chunk
                  </span>
                  <span className={file.status === "ingested" ? "text-accent" : "text-faint"}>
                    {file.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Doküman artık aranabilir: korpusta toplam{" "}
              <span className="font-mono tabular-nums text-fg">{phase.corpusChunks}</span> chunk
              var. Yukarıdan bir soru sorduğunuzda agent bu içeriği de arayabilir.
            </p>
          </div>
        ) : null}

        {phase.kind === "error" ? (
          <div className="border border-line bg-surface p-4">
            <p className="mono-label text-fg">Yükleme başarısız</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {ERROR_COPY[phase.code]}
            </p>
            <p className="mt-2 font-mono text-xs text-faint">{phase.code}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
