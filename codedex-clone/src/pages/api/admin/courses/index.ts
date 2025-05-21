import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, slug, description, image_url } = req.body;

    if (!title || !slug) {
      return res
        .status(400)
        .json({ message: "Title and Slug are required for a course" });
    }

    try {
      // Verificar si ya existe un curso con el mismo slug o título
      const existingCourseBySlug = await prisma.course.findUnique({
        where: { slug },
      });
      if (existingCourseBySlug) {
        return res
          .status(409)
          .json({ message: "Course with this slug already exists" });
      }
      const existingCourseByTitle = await prisma.course.findUnique({
        where: { title },
      });
      if (existingCourseByTitle) {
        return res
          .status(409)
          .json({ message: "Course with this title already exists" });
      }

      const newCourse = await prisma.course.create({
        data: {
          title,
          slug,
          description,
          image_url,
        },
      });
      return res.status(201).json(newCourse);
    } catch (error) {
      console.error("Failed to create course:", error);
      // Considerar errores específicos de Prisma, ej. Prisma.PrismaClientKnownRequestError
      return res
        .status(500)
        .json({ message: "Internal Server Error while creating course" });
    }
  } else if (req.method === "GET") {
    const skip = Number.parseInt(req.query.skip as string) || 0;
    const take = Number.parseInt(req.query.take as string) || 10;

    try {
      const courses = await prisma.course.findMany({
        skip: Math.max(0, skip), // Asegurar que skip no sea negativo
        take: Math.max(1, Math.min(100, take)), // Asegurar que take esté entre 1 y 100
        orderBy: { created_at: "desc" }, // Opcional: ordenar por fecha de creación
      });
      const totalCourses = await prisma.course.count();
      return res.status(200).json({
        data: courses,
        pagination: {
          total: totalCourses,
          skip,
          take,
          totalPages: Math.ceil(totalCourses / take),
          currentPage: Math.floor(skip / take) + 1,
        },
      });
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error while fetching courses" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}

export default withAdminApiAuth(handler);
