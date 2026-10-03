import Link from "next/link";

import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";

/** Sunucu bileşeni kalıyor: etkileşimi yok, bu yüzden istemci paketine girmesi
 *  için bir sebep de yok. Metinleri doğrudan sunucudaki sözlükten okur. */
export async function Footer() {
  const { t } = await getI18n();

  const links = [
    GITHUB_URL ? { href: GITHUB_URL, label: "GitHub" } : null,
    LINKEDIN_URL ? { href: LINKEDIN_URL, label: "LinkedIn" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="mono-label text-faint">{t.footer.tagline}</p>

        <ul className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mono-label text-faint transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/about"
              className="mono-label text-faint transition-colors hover:text-fg"
            >
              {t.footer.about}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
