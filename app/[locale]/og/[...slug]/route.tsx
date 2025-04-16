import {
  getFolderChildNames,
  getMetadataFromSlug,
  getNestedSlugs,
} from "@/lib/utils/system";
import type { Locale } from "next-intl";
import { generateOGImage } from "./og";

export function generateStaticParams() {
  // Top level directories in contents
  const topDirs = getFolderChildNames("contents");
  const result: { locale: string; slug: string[] }[] = [];
  const locales: Locale[] = ["en", "id"];

  // For each locale
  for (const locale of locales) {
    // For each top directory (articles, subject, etc)
    for (const topDir of topDirs) {
      // Get all nested paths starting from this folder
      const nestedPaths = getNestedSlugs(`contents/${topDir}`);

      // Add the top-level folder itself
      result.push({
        locale,
        slug: [topDir, "image.png"],
      });

      // Add each nested path
      for (const path of nestedPaths) {
        result.push({
          locale,
          slug: [topDir, ...path, "image.png"],
        });
      }
    }
  }

  return result;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; slug: string[] }> }
) {
  const { locale, slug } = await params;

  // The last element is always "image.png", remove it
  // The rest of the path is the content path
  const contentSlug = slug.slice(0, -1);

  // Get metadata from the content path
  const { title, description } = await getMetadataFromSlug(locale, contentSlug);

  // Fetch fonts from public directory
  const fontData = await fetch(
    new URL("/fonts/GeistMono-Regular.ttf", _req.url)
  ).then((res) => res.arrayBuffer());
  const fontBoldData = await fetch(
    new URL("/fonts/GeistMono-Bold.ttf", _req.url)
  ).then((res) => res.arrayBuffer());

  return generateOGImage({
    primaryTextColor: "rgb(240,240,240)",
    title,
    description,
    fonts: [
      {
        name: "GeistMono",
        data: fontData,
        weight: 400,
      },
      {
        name: "GeistMono",
        data: fontBoldData,
        weight: 600,
      },
    ],
  });
}
