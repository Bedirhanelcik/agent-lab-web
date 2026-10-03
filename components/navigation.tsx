"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n-provider";
import { LanguageSelector } from "@/components/language-selector";
import { ModeBadge } from "@/components/mode-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_ITEMS, type AppMode } from "@/lib/ui-config";

/**
 * Üst gezinme.
 *
 * Mobilde iki satır olarak dizilir: ilk satırda marka, dil seçici ve durum
 * etiketi; ikinci satırda bağlantı listesi. Beş bağlantı tek satıra sığmıyor
 * (375px'lik bir ekranda yaklaşık 675px genişlik isterler) ve tek satırda
 * bırakıldığında sayfanın tamamı yatay olarak kayıyor. Liste ayrıca kendi
 * içinde kaydırılabilir: bağlantı adları dile göre uzayıp kısaldığı için
 * (Hintçe ve Arapça etiketler İngilizce karşılıklarından belirgin şekilde
 * uzun) taşan kısım sayfayı değil yalnızca şeridi kaydırır.
 *
 * Yön bağımlı sınıflar yerine mantıksal olanlar kullanılıyor (`ms-auto`,
 * `ps-`): Arapça seçildiğinde `dir="rtl"` ile birlikte düzen kendiliğinden
 * yansıyor.
 */
export function Navigation({ mode }: { mode: AppMode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const labels: Record<string, string> = {
    "/": t.nav.home,
    "/system": t.nav.system,
    "/playground": t.nav.playground,
    "/evaluation": t.nav.evaluation,
    "/api-setup": t.nav.apiSetup,
    "/about": t.nav.about,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav
        aria-label={t.nav.ariaLabel}
        className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 px-5 pb-2 pt-3 sm:px-8 lg:h-14 lg:flex-nowrap lg:py-0"
      >
        <Link
          href="/"
          className="mono-label shrink-0 text-fg transition-opacity hover:opacity-70"
        >
          Agent<span className="text-accent">·</span>Lab
        </Link>

        <div className="order-2 ms-auto flex shrink-0 items-center gap-2 lg:order-3 lg:gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <ModeBadge mode={mode} />
        </div>

        <ul className="no-scrollbar order-3 flex w-full min-w-0 items-center gap-1 overflow-x-auto pt-2 lg:order-2 lg:ms-0 lg:w-auto lg:gap-2 lg:pt-0">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            const highlighted = item.href === "/api-setup";

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`mono-label inline-flex items-center gap-1.5 px-1.5 py-1 text-[0.6875rem] transition-colors sm:px-2 sm:text-xs ${
                    active
                      ? "text-fg"
                      : highlighted
                        ? "text-accent hover:text-accent"
                        : "text-faint hover:text-muted"
                  }`}
                >
                  {highlighted ? (
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-accent"
                    />
                  ) : null}
                  {labels[item.href]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
