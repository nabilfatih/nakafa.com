import { ThemeProvider } from "@/components/theme/provider";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import "@/styles/globals.css";
import "katex/dist/katex.min.css";

import { AppProviders } from "@/components/providers";
import { SearchCommand } from "@/components/shared/search-command";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: { params: Props["params"] }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      template: "%s - Nakafa",
      default: t("title"),
    },
    description: t("description"),
    applicationName: "Nakafa",
    authors: [
      {
        name: "Nabil Akbarazzima Fatih",
      },
    ],
    creator: "Nabil Akbarazzima Fatih",
    publisher: "PT. Nakafa Tekno Kreatif",
    referrer: "origin-when-cross-origin",
    metadataBase: new URL("https://nakafa.com"),
    alternates: {
      canonical: "https://nakafa.com",
      languages: {
        id: "https://nakafa.com/id",
        en: "https://nakafa.com/en",
      },
    },
    icons: {
      icon: [{ url: "/logo.svg" }, new URL("/logo.svg", "https://nakafa.com")],
      shortcut: [
        { url: "/logo.svg" },
        new URL("/logo.svg", "https://nakafa.com"),
      ],
      apple: [{ url: "/logo.svg" }, new URL("/logo.svg", "https://nakafa.com")],
      other: [
        { rel: "manifest", url: "/manifest.json" },
        { rel: "apple-touch-icon", url: "/logo.svg" },
      ],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "education",
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={cn(
        "font-sans antialiased",
        GeistSans.variable,
        GeistMono.variable
      )}
      suppressHydrationWarning
    >
      <body>
        <AppProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <SearchCommand />
                  <div data-pagefind-body>{children}</div>
                </SidebarInset>
              </SidebarProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
