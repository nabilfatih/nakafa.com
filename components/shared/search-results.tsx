import { searchAtom } from "@/lib/jotai/search";
import { cn } from "@/lib/utils";
import type { PagefindResult } from "@/types/pagefind";
import { useSetAtom } from "jotai";
import { FileTextIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  data: PagefindResult;
};

export function SearchResults({ data }: Props) {
  const setOpen = useSetAtom(searchAtom);

  return (
    <div className="space-y-2 border-b px-2 py-4 last:border-b-0">
      <div className="px-2">
        <h1 className="font-medium text-muted-foreground leading-tight tracking-tight">
          {data.meta.title}
        </h1>
      </div>

      {data.sub_results.map((subResult) => {
        return (
          <Link
            key={subResult.url}
            href={subResult.url}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <div className="group rounded-md p-2 transition-colors hover:bg-primary/5">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="flex shrink-0 items-center justify-center rounded-sm bg-primary/10 p-1">
                  <FileTextIcon className="size-4 shrink-0 opacity-80" />
                </div>
                <h2 className="line-clamp-1 font-medium leading-tight">
                  {subResult.title}
                </h2>
              </div>

              <p
                className={cn(
                  "text-muted-foreground text-sm leading-snug",
                  "[&_mark]:bg-primary/80 [&_mark]:text-primary-foreground"
                )}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: we are using a markdown parser
                dangerouslySetInnerHTML={{ __html: subResult.excerpt }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
