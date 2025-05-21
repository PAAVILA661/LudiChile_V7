import type { Exercise as PrismaExercise } from "@prisma/client";

export interface ExerciseForAdminList
  extends Pick<
    PrismaExercise,
    "id" | "title" | "slug" | "order" | "xp_value" | "created_at"
  > {
  // Add other fields if needed for the list
}

export interface ExerciseFormData
  extends Omit<
    PrismaExercise,
    "id" | "chapter_id" | "created_at" | "updated_at"
  > {
  id?: string;
  chapter_id?: string; // Will be available from URL params for creation
}
