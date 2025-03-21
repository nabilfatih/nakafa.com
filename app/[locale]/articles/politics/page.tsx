import { CardArticle } from "@/components/shared/card-article";
import { ContainerList } from "@/components/shared/container-list";
import { FooterContent } from "@/components/shared/footer-content";
import { HeaderContent } from "@/components/shared/header-content";
import { LayoutContent } from "@/components/shared/layout-content";
import { RefContent } from "@/components/shared/ref-content";
import { getArticles } from "@/lib/utils/markdown";
import { DramaIcon } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

const FILE_PATH = "/articles/politics";
const GITHUB_URL = `${process.env.GITHUB_URL}${FILE_PATH}`;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: {
  params: Props["params"];
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Articles");

  return {
    title: t("politics"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/articles/politics`,
    },
  };
}

async function ArticleList({ locale }: { locale: Locale }) {
  // Statically get all articles
  const articles = await getArticles(FILE_PATH, locale);

  return (
    <ContainerList>
      {articles.map((article) => (
        <CardArticle key={article.slug} category="politics" article={article} />
      ))}
    </ContainerList>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Articles");

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <HeaderContent
        title={t("politics")}
        description={t("description")}
        icon={DramaIcon}
      />
      <LayoutContent className="py-10">
        <ArticleList locale={locale} />
      </LayoutContent>
      <FooterContent className="mt-0">
        <RefContent githubUrl={GITHUB_URL} />
      </FooterContent>
    </>
  );
}
