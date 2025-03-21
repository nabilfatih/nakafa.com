import fs from "node:fs/promises";
import type { ParsedHeading } from "@/components/shared/sidebar-tree";
import type { Article } from "@/types/articles";
import { compareDesc, parse } from "date-fns";
import glob from "fast-glob";
import type { Locale } from "next-intl";
import { teams } from "../data/team";

/**
 * Reads the raw content of a file, use app/[locale] as the base path.
 * @param path - The path to the file.
 * @returns The raw content of the file.
 */
export async function getRawContent(path: string): Promise<string> {
  return fs.readFile(`app/[locale]${path}`, "utf8").catch(() => {
    return "";
  });
}

/**
 * Parses the headings from the content.
 * @param content - Markdown content to parse.
 * @returns The parsed headings.
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: No way to avoid this
export function getHeadings(content: string): ParsedHeading[] {
  try {
    // Handle markdown style headings (# Heading)
    const markdownHeadingRegex = /^(#{1,6})\s+(.*)$/gm;
    const markdownMatches = Array.from(content.matchAll(markdownHeadingRegex));

    if (markdownMatches && markdownMatches.length > 0) {
      const headings: ParsedHeading[] = [];
      const headingsByLevel: { [level: number]: ParsedHeading[] } = {};

      for (const match of markdownMatches) {
        const level = match[1].length; // Number of # symbols
        const text = match[2].trim();
        const slug = text.toLowerCase().replace(/\s+/g, "-");

        const heading: ParsedHeading = {
          label: text,
          href: `#${slug}`,
          children: [],
        };

        // Store the heading at its level
        if (!headingsByLevel[level]) {
          headingsByLevel[level] = [];
        }
        headingsByLevel[level].push(heading);

        if (level === 1) {
          // Top level headings
          headings.push(heading);
        } else {
          // Find the parent heading
          let parentLevel = level - 1;
          while (parentLevel > 0) {
            const potentialParents = headingsByLevel[parentLevel];
            if (potentialParents && potentialParents.length > 0) {
              const parent = potentialParents.at(-1);
              if (parent) {
                if (!parent.children) {
                  parent.children = [];
                }
                parent.children.push(heading);
              }
              break;
            }
            parentLevel--;
          }

          // If no parent found, add to top level
          if (parentLevel === 0) {
            headings.push(heading);
          }
        }
      }

      // Clean up empty children arrays
      const cleanupChildren = (items: ParsedHeading[]): void => {
        for (const item of items) {
          if (item.children && item.children.length === 0) {
            // Set to undefined instead of using delete
            item.children = undefined;
          } else if (item.children) {
            cleanupChildren(item.children);
          }
        }
      };

      cleanupChildren(headings);
      return headings;
    }

    // If we reach here, no headings found with markdown regex
    return [];
  } catch {
    return [];
  }
}

export async function getArticles(
  basePath: string,
  locale: Locale
): Promise<Article[]> {
  // Get all article directories that have a page.tsx file - use a simpler, more reliable pattern
  const articleDirs = await glob("*/page.tsx", {
    // default is app/[locale]
    cwd: `app/[locale]/${basePath}`,
    absolute: true, // Get absolute paths
  });

  // Extract unique slugs from the paths
  const articleSlugs = articleDirs
    .map((dir) => {
      // Get the parent directory name (slug)
      const parts = dir.split("/");
      return parts.at(-2); // Get the directory name before page.tsx
    })
    .filter((slug, index, self) => self.indexOf(slug) === index); // Remove duplicates

  // Get all the articles, sort by date and extract the title, description, and date
  const articles = await Promise.all(
    articleSlugs.map(async (slug) => {
      try {
        // Use template literals with the correct syntax for Next.js dynamic imports
        // This pattern is more reliable for Next.js production builds
        const { metadata } = await import(
          `@/app/[locale]/articles/${basePath.split("/").at(-1)}/${slug}/${locale}.mdx`
        );

        const authors: string[] = metadata.authors.map(
          (author: { name: string }) => author.name
        );

        return {
          title: metadata.title,
          description: metadata.description,
          date: metadata.date,
          slug,
          official: authors.some((author) => teams.has(author)),
        };
      } catch {
        // TODO: Add monitoring for missing articles
        return null;
      }
    })
  );

  // Filter out any null values and sort by date (newest first)
  const sortedArticles = articles
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      const dateA = parse(a.date, "MM/dd/yyyy", new Date());
      const dateB = parse(b.date, "MM/dd/yyyy", new Date());
      return compareDesc(dateA, dateB);
    });

  return sortedArticles;
}
