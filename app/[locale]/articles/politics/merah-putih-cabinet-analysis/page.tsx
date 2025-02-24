import { HeaderContent } from "@/components/shared/header-content";
import { LayoutContent } from "@/components/shared/layout-content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: { params: Props["params"] }): Promise<Metadata> {
  const { locale } = await params;
  const metadata = await import(`./${locale}.mdx`).then((m) => m.metadata);

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: metadata.alternates,
  };
}

export default async function Page({ params }: Props) {
  const locale = (await params).locale as Locale;

  // Enable static rendering
  setRequestLocale(locale);

  try {
    const file = await import(`./${locale}.mdx`);
    const Content = file.default;

    // import metadata from the mdx file based on the locale
    const metadata = file.metadata;
    return (
      <>
        <HeaderContent
          title={metadata.title}
          description={metadata.description}
          author={metadata.author}
          date={metadata.date}
        />
        <LayoutContent>
          <Content />
        </LayoutContent>
      </>
    );
  } catch {
    notFound();
  }
}
