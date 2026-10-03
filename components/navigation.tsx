"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { LanguageSelector } from "@/components/language-selector";
import { ModeBadge } from "@/components/mode-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Theme } from "@/lib/theme";
import type { AppMode } from "@/lib/ui-config";

/**
 * Üst gezinme.
 *
 * Görsel hiyerarşi bilinçli olarak dört kademeli: marka, ana sayfa
 * bağlantıları, "API Kurulumu" çağrısı ve yardımcı kontroller (tema, dil,
 * durum). Önceki sürümde her öğe aynı ağırlıktaydı -- hepsi kutulu, hepsi
 * büyük harf, hepsi monospace -- ve bu göze bir öncelik sırası vermiyordu.
 * Şimdi bağlantılar düz metin, çerçeveler yalnızca gerçekten bir eylem olan
 * yerde ve kontroller daha küçük bir grup halinde.
 *
 * Mobilde bağlantılar bir menü panelinde toplanıyor. Dil ve tema panelin
 * içinde değil çubuğun kendisinde kalıyor: ikisi de menüyü açmadan
 * erişilebilmesi gereken kontroller.
 */
export function Navigation({ mode, theme }: { mode: AppMode; theme: Theme }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const primary = [
    { href: "/", label: t.nav.home },
    { href: "/system", label: t.nav.system },
    { href: "/playground", label: t.nav.playground },
    { href: "/evaluation", label: t.nav.evaluation },
    { href: "/about", label: t.nav.about },
  ];

  const apiSetup = { href: "/api-setup", label: t.nav.apiSetup };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav aria-label={t.nav.ariaLabel} className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="shrink-0 font-mono text-[0.9375rem] font-medium tracking-tight text-fg transition-opacity hover:opacity-70"
          >
            Agent<span className="text-accent">·</span>Lab
          </Link>

          {/* Markayı gezinmeden ayıran ince çizgi: kutu kullanmadan bölüm
              sınırı vermenin en sessiz yolu. */}
          <span aria-hidden="true" className="hidden h-5 w-px bg-line lg:block" />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {primary.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex px-3 py-2 text-sm whitespace-nowrap transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px ${
                      active
                        ? "text-fg after:bg-accent"
                        : "text-muted after:bg-transparent hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
            {/* Kurulum çağrısı: bağıran bir düğme değil, ince çerçeveli ve
                aksan renkli sessiz bir vurgu. */}
            <Link
              href={apiSetup.href}
              aria-current={isActive(apiSetup.href) ? "page" : undefined}
              className={`hidden items-center gap-2 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap transition-colors sm:inline-flex ${
                isActive(apiSetup.href)
                  ? "border-accent/60 bg-accent-soft text-accent"
                  : "border-line-bright/70 text-accent hover:border-accent/60 hover:bg-accent-soft"
              }`}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              {apiSetup.label}
            </Link>

            <span aria-hidden="true" className="hidden h-5 w-px bg-line lg:block" />

            <ThemeToggle initialTheme={theme} />
            <LanguageSelector />
            <ModeBadge mode={mode} className="hidden md:inline-flex" />

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              aria-expanded={open}
              aria-controls="primary-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-[1.15rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobil menü. Bağlantıya dokunulduğunda kapanıyor; bunun için bir
            efekt yerine doğrudan tıklama işleyicisi kullanılıyor. */}
        {open ? (
          <div id="primary-menu" className="border-t border-line py-2 lg:hidden">
            <ul className="flex flex-col">
              {[...primary, apiSetup].map((item) => {
                const active = isActive(item.href);
                const highlighted = item.href === apiSetup.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-md px-3 py-3 text-sm transition-colors ${
                        active
                          ? "bg-surface-2 text-fg"
                          : highlighted
                            ? "text-accent hover:bg-surface-2"
                            : "text-muted hover:bg-surface-2 hover:text-fg"
                      }`}
                    >
                      {highlighted ? (
                        <span
                          aria-hidden="true"
                          className="size-1.5 shrink-0 rounded-full bg-accent"
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="px-3 pt-2 md:hidden">
              <ModeBadge mode={mode} />
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
