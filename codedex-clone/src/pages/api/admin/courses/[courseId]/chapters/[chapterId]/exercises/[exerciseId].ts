import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { courseId, chapterId, exerciseId } = req.query;

  if (
    typeof courseId !== "string" ||
    typeof chapterId !== "string" ||
    typeof exerciseId !== "string"
  ) {
    return res
      .status(400)
      .json({
        message: "Valid Course ID, Chapter ID, and Exercise ID are required",
      });
  }

  // GET: Obtener detalles de un ejercicio
  if (req.method === "GET") {
    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId, chapter_id: chapterId },
      });
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      return res.status(200).json(exercise);
    } catch (error) {
      console.error(`Failed to fetch exercise ${exerciseId}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // PUT: Actualizar un ejercicio
  if (req.method === "PUT") {
    const {
      title,
      slug,
      description,
      instructions,
      initial_code,
      expected_output,
      xp_value,
      order,
    } = req.body;
    if (!title || !slug || order === undefined || xp_value === undefined) {
      return res
        .status(400)
        .json({ message: "Title, Slug, Order, and XP Value are required" });
    }
    try {
      const existingExerciseBySlug = await prisma.exercise.findFirst({
        where: { slug, chapter_id: chapterId, id: { not: exerciseId } },
      });
      if (existingExerciseBySlug) {
        return res
          .status(409)
          .json({
            message:
              "Another exercise with this slug already exists in this chapter",
          });
      }

      const updatedExercise = await prisma.exercise.update({
        where: { id: exerciseId, chapter_id: chapterId },
        data: {
          title,
          slug,
          description,
          instructions,
          initial_code,
          expected_output,
          xp_value: Number.parseInt(xp_value as string, 10),
          order: Number.parseInt(order as string, 10),
        },
      });
      return res.status(200).json(updatedExercise);
    } catch (error) {
      console.error(`Failed to update exercise ${exerciseId}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // DELETE: Eliminar un ejercicio
  if (req.method === "DELETE") {
    try {
      await prisma.exercise.delete({
        where: { id: exerciseId, chapter_id: chapterId },
      });
      return res.status(204).end();
    } catch (error) {
      console.error(`Failed to delete exercise ${exerciseId}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
