import nakafaLogo from "@/public/logo.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ComponentProps } from "react";
import NavigationLink from "../ui/navigation-link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { AboutMenu } from "./about-menu";
import { LangMenu } from "./lang-menu";
import { NavArticles } from "./nav-articles";
import { NavSubject } from "./nav-subject";
import { ThemeMenu } from "./theme-menu";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Metadata");

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <NavigationLink href="/">
                <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg border">
                  <Image
                    src={nakafaLogo}
                    alt="Nakafa"
                    fill
                    priority
                    className="rounded-lg object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nakafa</span>
                  <span className="truncate text-xs">
                    {t("short-description")}
                  </span>
                </div>
              </NavigationLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSubject />
        <NavArticles />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <LangMenu />
          <ThemeMenu />
          <AboutMenu />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
