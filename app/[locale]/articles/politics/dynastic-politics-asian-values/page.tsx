import { FooterContent } from "@/components/shared/footer-content";
import { HeaderContent } from "@/components/shared/header-content";
import { LayoutContent } from "@/components/shared/layout-content";
import { RefContent } from "@/components/shared/ref-content";
import type { Locale } from "@/i18n/routing";
import type { ArticleMetadata } from "@/types/articles";
import { DramaIcon } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { references } from "./ref";

const githubUrl =
  "https://github.com/nabilfatih/nakafa.com/tree/main/app/%5Blocale%5D/articles/politics/dynastic-politics-asian-values";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: { params: Props["params"] }): Promise<Metadata> {
  const { locale } = await params;
  const metadata: ArticleMetadata = await import(`./${locale}.mdx`).then(
    (m) => m.metadata
  );

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: metadata.alternates,
    authors: metadata.authors,
    category: metadata.category,
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
    const metadata: ArticleMetadata = file.metadata;
    return (
      <>
        <HeaderContent
          title={metadata.title}
          description={metadata.description}
          authors={metadata.authors}
          date={metadata.date}
          category={{
            icon: DramaIcon,
            name: metadata.category,
          }}
        />
        <LayoutContent>
          <Content />
        </LayoutContent>
        <FooterContent>
          <RefContent
            title={metadata.title}
            references={references}
            githubUrl={githubUrl}
          />
        </FooterContent>
      </>
    );
  } catch {
    notFound();
  }
}
