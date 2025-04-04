"use client";

import { type Locale, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useMediaQuery } from "usehooks-ts";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

export function LangMenuSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const isMobile = useMediaQuery("(max-width: 640px)");

  function handleChangeLocale(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale }
      );
    });
  }

  return (
    <DropdownMenuContent
      side={isMobile ? "top" : "right"}
      align={isMobile ? "end" : "center"}
    >
      <DropdownMenuItem
        onClick={() => handleChangeLocale("id")}
        disabled={isPending}
      >
        <span className="truncate">Indonesia</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => handleChangeLocale("en")}
        disabled={isPending}
      >
        <span className="truncate">English</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
