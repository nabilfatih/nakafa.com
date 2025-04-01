import { cn } from "@/lib/utils";
import type { ContentMetadata } from "@/types/content";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { FooterContent } from "./footer-content";
import { HeaderContent } from "./header-content";
import { LayoutContent } from "./layout-content";
import { RefContent } from "./ref-content";
import { SidebarRight } from "./sidebar-right";
import { type ParsedHeading, SidebarTree } from "./sidebar-tree";

type Props = {
  header: {
    title: string;
    icon?: LucideIcon;
    link?: {
      href: string;
      label: string;
    };
  };
  content: ReactNode;
  chapters: {
    label?: string;
    data: ParsedHeading[];
  };
  githubUrl: string;
  footerClassName?: string;
  contentClassName?: string;
  metadata?: ContentMetadata;
};

export function LayoutMaterial({
  header,
  content,
  chapters,
  githubUrl,
  metadata,
  contentClassName,
  footerClassName,
}: Props) {
  const t = useTranslations("Subject");

  return (
    <div className="lg:flex">
      <div className="flex-1">
        <HeaderContent
          title={header.title}
          icon={header.icon}
          link={header.link}
          description={metadata?.description}
          date={metadata?.date}
          authors={metadata?.authors}
        />
        <LayoutContent className={cn(contentClassName)}>
          {content}
        </LayoutContent>
        <FooterContent className={cn("mt-0", footerClassName)}>
          <RefContent githubUrl={githubUrl} />
        </FooterContent>
      </div>
      <SidebarRight>
        <SidebarTree
          title={chapters.label ?? t("chapter")}
          data={chapters.data}
        />
      </SidebarRight>
    </div>
  );
}
