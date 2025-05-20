import type { Chapter as PrismaChapter } from "@prisma/client";

export interface ChapterForAdminList
  extends Pick<
    PrismaChapter,
    "id" | "title" | "slug" | "order" | "created_at"
  > {
  // _count?: { exercises: number }
}

export interface ChapterFormData
  extends Omit<
    PrismaChapter,
    "id" | "course_id" | "created_at" | "updated_at"
  > {
  id?: string;
  course_id?: string; // Se necesitará para crear/asociar
}
