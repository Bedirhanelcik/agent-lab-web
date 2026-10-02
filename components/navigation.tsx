"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeBadge } from "@/components/mode-badge";
import { NAV_ITEMS, type AppMode } from "@/lib/ui-config";

export function Navigation({ mode }: { mode: AppMode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav
        aria-label="Ana gezinme"
        className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:px-8"
      >
        <Link
          href="/"
          className="mono-label shrink-0 text-fg transition-opacity hover:opacity-70"
        >
          Agent<span className="text-accent">·</span>Lab
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`mono-label px-2 py-1 transition-colors ${
                    active ? "text-fg" : "text-faint hover:text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto">
          <ModeBadge mode={mode} />
        </div>
      </nav>
    </header>
  );
}
