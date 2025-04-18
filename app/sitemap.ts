import fs from "node:fs";
import path from "node:path";
import { routing } from "@/i18n";
import { getPathname } from "@/i18n/routing";
import type { MetadataRoute } from "next";
import type { Locale } from "next-intl";

// Adapt this as necessary
const host = "https://nakafa.com";

// Regex pattern for catch-all routes like [...rest]
const catchAllPattern = /^\[\.{3}.*\]$/;

// Function to recursively get all directories
export function getAllRoutes(basePath = "", currentPath = ""): string[] {
  const fullPath = path.join(process.cwd(), "contents", currentPath);

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

type Href = Parameters<typeof getPathname>[number]["href"];

export function getEntries(href: Href): MetadataRoute.Sitemap {
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

export function getUrl(href: Href, locale: Locale): string {
  const pathname = getPathname({ locale, href });
  return host + pathname;
}

// Return OG routes based on regular routes
export function getOgRoutes(routes: string[]): string[] {
  return routes.map((route) => {
    if (route === "/") {
      return "/og/image.png";
    }
    return `/og${route}/image.png`;
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAllRoutes();
  const ogRoutes = getOgRoutes(routes);

  // Combine regular routes and OG routes
  const allRoutes = [...routes, ...ogRoutes];

  return allRoutes.flatMap((route) => getEntries(route));
}
