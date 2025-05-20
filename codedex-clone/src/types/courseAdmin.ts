import type { Course as PrismaCourse } from "@prisma/client";

// Para la lista de cursos en el admin, podríamos querer solo algunos campos
export interface CourseForAdminList
  extends Pick<
    PrismaCourse,
    "id" | "title" | "slug" | "created_at" | "updated_at"
  > {
  // Añadir conteos si se incluyen desde la API, ej. _count?: { chapters: number }
}

// Para el formulario de creación/edición
export interface CourseFormData
  extends Omit<PrismaCourse, "id" | "created_at" | "updated_at"> {
  // id es opcional porque al crear no existe
  id?: string;
}
