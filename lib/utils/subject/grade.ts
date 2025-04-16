import type { SubjectCategory } from "@/types/subject/category";
import type { Grade } from "@/types/subject/grade";
import type { MaterialGrade } from "@/types/subject/material";
import type { LucideIcon } from "lucide-react";
import { getCategoryPath } from "./category";

/**
 * Gets the path to the grade of the subject.
 * @param category - The category to get the path for.
 * @param grade - The grade to get the path for.
 * @returns The path to the grade.
 */
export function getGradePath(category: SubjectCategory, grade: Grade) {
  return `/subject/${category}/${grade}` as const;
}

/**
 * Gets the subjects for a grade.
 * @param category - The category to get the subjects for.
 * @param grade - The grade to get the subjects for.
 * @returns The subjects for the grade.
 */
export async function getGradeSubjects(
  category: SubjectCategory,
  grade: Grade
): Promise<
  {
    icon: LucideIcon;
    label: MaterialGrade;
    href: string;
  }[]
> {
  try {
    const gradePath = getCategoryPath(category);

    const cleanPath = gradePath.startsWith("/")
      ? gradePath.substring(1)
      : gradePath;

    const gradeModule = await import(
      `@/contents/${cleanPath}/_data/subject.ts`
    );

    return gradeModule.getSubjects(grade);
  } catch {
    return [];
  }
}
