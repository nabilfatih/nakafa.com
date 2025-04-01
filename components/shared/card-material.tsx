"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { MaterialList } from "@/types/subjects";
import { ArrowDownIcon, ChevronDownIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

type Props = {
  material: MaterialList;
};

export function CardMaterial({ material }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const id = material.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card className="pb-0">
      <CardHeader className="gap-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="group flex items-center font-medium">
              <h2
                id={id}
                title={material.title}
                className="inline-block scroll-mt-24"
              >
                {material.title}
              </h2>
              <a
                href={`#${id}`}
                className="ml-2 hidden shrink-0 text-muted-foreground group-hover:inline-block"
                aria-label={`Link to ${material.title}`}
              >
                <LinkIcon className="size-4" />
              </a>
            </CardTitle>
            {material.description && (
              <CardDescription
                title={material.description}
                className="line-clamp-1"
              >
                {material.description}
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close content" : "Open content"}
            className="shrink-0"
          >
            <span className="sr-only">
              {isOpen ? "Close content" : "Open content"}
            </span>
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                isOpen ? "" : "rotate-180"
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="px-0">
            {material.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className="group flex w-full items-center gap-2 border-t px-6 py-3 transition-colors last:rounded-b-xl last:pb-6 hover:bg-accent/50"
              >
                <h3 title={item.title} className="truncate">
                  {item.title}
                </h3>
                <ArrowDownIcon className="-rotate-90 size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
