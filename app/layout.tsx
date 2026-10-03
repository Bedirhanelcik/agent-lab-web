import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { I18nProvider } from "@/components/i18n-provider";
import { Navigation } from "@/components/navigation";
import { APP_MODE } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Sayfa başlığı ve açıklaması da seçilen dilde üretilir: bunlar kullanıcıya
 * sekme adında ve paylaşım önizlemesinde görünür, dolayısıyla arayüzün geri
 * kalanı gibi çevrilmeleri gerekir. Dil çerezden okunduğu için
 * `generateMetadata` kullanılıyor; statik bir `metadata` nesnesi çerezi göremez.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: { default: t.meta.siteTitle, template: t.meta.titleTemplate },
    description: t.meta.siteDescription,
    applicationName: "Agent Lab",
    openGraph: {
      title: t.meta.siteTitle,
      description: t.meta.ogDescription,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, dir, t } = await getI18n();

  return (
    // `dir` sunucuda yazılıyor: Arapça seçildiğinde sayfa ilk render'da RTL
    // geliyor, LTR'den RTL'ye atlayan bir kare görünmüyor.
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider locale={locale} messages={t}>
          <a
            href="#main"
            className="mono-label sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-60 focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:text-fg"
          >
            {t.nav.skipToContent}
          </a>

          <Navigation mode={APP_MODE} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
