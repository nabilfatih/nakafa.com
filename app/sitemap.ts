import fs from "node:fs";
import path from "node:path";
import { getPathname, routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";

// Adapt this as necessary
const host = "https://nakafa.com";

// Regex pattern for catch-all routes like [...rest]
const catchAllPattern = /^\[\.{3}.*\]$/;

// Function to recursively get all directories
function getAllRoutes(basePath = "", currentPath = ""): string[] {
  const fullPath = path.join(process.cwd(), "app", "[locale]", currentPath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  let routes = currentPath ? [`/${currentPath.replace(/\\/g, "/")}`] : ["/"];

  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !entry.name.startsWith("_") &&
      !catchAllPattern.test(entry.name)
    ) {
      const childPath = path.join(currentPath, entry.name);
      const childRoutes = getAllRoutes(basePath, childPath);
      routes = [...routes, ...childRoutes];
    }
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAllRoutes();

  return routes.flatMap((route) => getEntries(route));
}

type Href = Parameters<typeof getPathname>[number]["href"];

function getEntries(href: Href): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 1,
  }));
}

function getUrl(href: Href, locale: Locale): string {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}
