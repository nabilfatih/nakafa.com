import type { SubjectCategory } from "@/types/subject/category";
import type { Grade } from "@/types/subject/grade";
import type { MaterialGrade, MaterialList } from "@/types/subject/material";
import { MaterialListSchema } from "@/types/subject/material";
import {
  BrainCircuitIcon,
  ChartPieIcon,
  CodeIcon,
  DraftingCompassIcon,
  EarthIcon,
  FlaskConicalIcon,
  Gamepad2Icon,
  HourglassIcon,
  LightbulbIcon,
  MapPinIcon,
  PawPrintIcon,
  PiIcon,
} from "lucide-react";
import type { Locale } from "next-intl";

/**
 * Gets the path to a material.
 * @param category - The category to get the material for.
 * @param grade - The grade to get the material for.
 * @param material - The material to get the path for.
 * @returns The path to the material.
 */
export function getMaterialPath(
  category: SubjectCategory,
  grade: Grade,
  material: MaterialGrade
) {
  return `/subject/${category}/${grade}/${material}` as const;
}

/**
 * Gets the materials for a subject.
 * @param path - The path to the subject.
 * @param locale - The locale to get the materials for.
 * @returns The materials for the subject.
 */
export async function getMaterials(
  path: string,
  locale: Locale
): Promise<MaterialList> {
  try {
    // Strip leading slash if present for consistency
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    const content = await import(
      `@/contents/${cleanPath}/_data/${locale}-material.ts`
    );

    const parsedContent = MaterialListSchema.parse(content.default);

    return parsedContent;
  } catch {
    return [];
  }
}

/**
 * Gets the icon for a material.
 * @param material - The material to get the icon for.
 * @returns The icon for the material.
 */
export function getMaterialIcon(material: MaterialGrade) {
  switch (material) {
    case "mathematics":
      return PiIcon;
    case "physics":
      return DraftingCompassIcon;
    case "chemistry":
      return FlaskConicalIcon;
    case "biology":
      return PawPrintIcon;
    case "geography":
      return EarthIcon;
    case "economy":
      return ChartPieIcon;
    case "history":
      return HourglassIcon;
    case "informatics":
      return CodeIcon;
    case "geospatial":
      return MapPinIcon;
    case "ai-ds":
      return BrainCircuitIcon;
    case "game-engineering":
      return Gamepad2Icon;
    default:
      return LightbulbIcon;
  }
}
