"use client";

import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import NavigationLink from "../ui/navigation-link";
import { Separator } from "../ui/separator";

function getBreadcrumb(pathname: string) {
  if (pathname.includes("/subject")) {
    return "subject";
  }
  if (pathname.includes("/articles")) {
    return "articles";
  }
  return null;
}

export function HeaderBreadcrumb() {
  const t = useTranslations("Common");

  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <Separator
        orientation="vertical"
        className={cn("mx-2 data-[orientation=vertical]:h-4", {
          "hidden md:block": !breadcrumb,
        })}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <NavigationLink href="/">{t("home")}</NavigationLink>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumb && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate">
                  {t(breadcrumb)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
