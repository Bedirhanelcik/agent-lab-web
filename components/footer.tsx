import Link from "next/link";

import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";

export function Footer() {
  const links = [
    GITHUB_URL ? { href: GITHUB_URL, label: "GitHub" } : null,
    LINKEDIN_URL ? { href: LINKEDIN_URL, label: "LinkedIn" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="mono-label text-faint">
          Agent Lab — bağımsız bir agentic AI mühendislik denemesi
        </p>

        <ul className="flex items-center gap-5">
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
              About
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
