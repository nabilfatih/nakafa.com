"use client";

import { searchParsers } from "@/lib/nuqs/search";
import { useSearchStore } from "@/lib/store/search";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { type ChangeEvent, useCallback, useId } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function SearchInput() {
  const t = useTranslations("Utils");
  const id = useId();

  const setQuery = useSearchStore((state) => state.setQuery);

  const [{ q }, setSearch] = useQueryStates(searchParsers);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch({ q: e.target.value });
      setQuery(e.target.value);
    },
    [setSearch, setQuery]
  );

  const handleClear = useCallback(() => {
    setSearch({ q: "" });
    setQuery("");
  }, [setSearch, setQuery]);

  return (
    <div className="relative">
      <Label htmlFor={id} className="sr-only">
        {t("search")}
      </Label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
        <SearchIcon className="size-4 text-muted-foreground" />
      </div>
      <Input
        id={id}
        className="h-12 border-border px-9 sm:w-full"
        placeholder={t("search-bar-placeholder")}
        type="text"
        value={q}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClear}
        className="group absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center pr-3"
      >
        <XIcon
          className={cn(
            "size-4 text-muted-foreground opacity-0 transition-opacity",
            q && "opacity-50 group-hover:opacity-100"
          )}
        />
      </button>
    </div>
  );
}
