import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { courseId, chapterId } = req.query;

  if (typeof courseId !== "string" || typeof chapterId !== "string") {
    return res
      .status(400)
      .json({ message: "Valid Course ID and Chapter ID are required" });
  }

  // GET: Listar ejercicios de un capítulo
  if (req.method === "GET") {
    try {
      const exercises = await prisma.exercise.findMany({
        where: { chapter_id: chapterId },
        orderBy: { order: "asc" },
      });
      return res.status(200).json(exercises);
    } catch (error) {
      console.error(
        `Failed to fetch exercises for chapter ${chapterId}:`,
        error,
      );
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // POST: Crear un nuevo ejercicio para un capítulo
  if (req.method === "POST") {
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
        .json({
          message:
            "Title, Slug, Order, and XP Value are required for an exercise",
        });
    }

    try {
      const existingExercise = await prisma.exercise.findFirst({
        where: { slug, chapter_id: chapterId },
      });
      if (existingExercise) {
        return res
          .status(409)
          .json({
            message: "Exercise with this slug already exists in this chapter",
          });
      }

      const newExercise = await prisma.exercise.create({
        data: {
          title,
          slug,
          description,
          instructions,
          initial_code,
          expected_output,
          xp_value: Number.parseInt(xp_value as string, 10),
          order: Number.parseInt(order as string, 10),
          chapter: { connect: { id: chapterId } },
        },
      });
      return res.status(201).json(newExercise);
    } catch (error) {
      console.error(
        `Failed to create exercise for chapter ${chapterId}:`,
        error,
      );
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
