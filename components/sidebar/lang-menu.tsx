import { ChevronRightIcon, LanguagesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { LangMenuSwitcher } from "./lang-menu-switcher";

export function LangMenu() {
  const t = useTranslations("Common");

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={t("language")}>
            <LanguagesIcon className="size-4" />
            <span className="truncate">{t("language")}</span>

            <ChevronRightIcon className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <LangMenuSwitcher />
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
