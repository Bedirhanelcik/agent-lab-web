import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { APP_MODE } from "@/lib/config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Agent Lab — an agent that knows when to search",
    template: "%s — Agent Lab",
  },
  description:
    "Hibrit retrieval, uyarlanabilir muhakeme ve kaynak gösteren cevaplar üzerine kurulu bağımsız bir agentic AI mühendislik denemesi.",
  applicationName: "Agent Lab",
  openGraph: {
    title: "Agent Lab — an agent that knows when to search",
    description:
      "Hybrid retrieval. Adaptive reasoning. Grounded answers. Bağımsız bir agentic AI mühendislik denemesi.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="mono-label sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:border focus:border-accent focus:bg-bg focus:px-3 focus:py-2 focus:text-fg"
        >
          İçeriğe geç
        </a>

        <Navigation mode={APP_MODE} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
