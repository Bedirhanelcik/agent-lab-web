import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { I18nProvider } from "@/components/i18n-provider";
import { Navigation } from "@/components/navigation";
import { APP_MODE } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";
import { resolveTheme } from "@/lib/theme-server";

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
  const [{ locale, dir, t }, theme] = await Promise.all([getI18n(), resolveTheme()]);

  return (
    // Üç nitelik de SUNUCUDA yazılıyor ve üçü de çerezden okunuyor: dil, yön
    // ve tema. Bu yüzden sunucunun ürettiği HTML ile istemcinin ilk render'ı
    // birebir aynı -- boyamadan önce çalışan bir betiğe, `data-theme`'i
    // sonradan değiştiren bir efekte veya `suppressHydrationWarning`'e gerek
    // yok. Arapça seçildiğinde sayfa ilk render'da RTL geliyor; tema seçimi
    // yoksa ilk kare zaten koyu.
    <html
      lang={locale}
      dir={dir}
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider locale={locale} messages={t}>
          <a
            href="#main"
            className="sr-only rounded-md text-sm focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-60 focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:text-fg"
          >
            {t.nav.skipToContent}
          </a>

          <Navigation mode={APP_MODE} theme={theme} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
