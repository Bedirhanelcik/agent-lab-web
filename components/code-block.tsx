"use client";

import { useState } from "react";

/**
 * Kod paneli.
 *
 * Kopyalama düğmesi için istemci bileşeni: kurulum rehberindeki değerlerin
 * elle yazılması gereksiz bir hata kaynağı. Kodun kendisi her dilde aynı kalır
 * ve `.code-block` sınıfı sayesinde Arapça arayüzde de soldan sağa okunur.
 */
export function CodeBlock({
  label,
  code,
  copyLabel,
  copiedLabel,
}: {
  label?: string;
  code: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Pano erişimi yoksa metin zaten seçilebilir durumda. */
    }
  }

  return (
    <figure className="min-w-0">
      <div className="flex items-center justify-between gap-3 border border-line border-b-0 bg-surface px-4 py-2">
        <figcaption className="mono-label truncate text-faint">{label ?? "shell"}</figcaption>
        <button
          type="button"
          onClick={copy}
          className="mono-label shrink-0 text-faint transition-colors hover:text-fg"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="code-block px-4 py-3 text-fg">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
