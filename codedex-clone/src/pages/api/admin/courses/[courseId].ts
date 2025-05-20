import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAdminApiAuth, AuthenticatedAdminRequest } from '@/lib/adminApiAuth';

async function handler(
  req: AuthenticatedAdminRequest,
  res: NextApiResponse
) {
  const { courseId } = req.query;

  if (!courseId || typeof courseId !== 'string') {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  // GET: Obtener detalles de un curso
  if (req.method === 'GET') {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        // include: { chapters: { orderBy: { order: 'asc' } } } // Opcional: incluir capítulos
      });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      return res.status(200).json(course);
    } catch (error) {
      console.error(`Failed to fetch course ${courseId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // PUT: Actualizar un curso
  if (req.method === 'PUT') {
    const { title, slug, description, image_url } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and Slug are required' });
    }

    try {
      // Verificar si el nuevo slug o título ya existe en OTRO curso
      const existingCourseBySlug = await prisma.course.findFirst({
        where: { slug, id: { not: courseId } },
      });
      if (existingCourseBySlug) {
        return res.status(409).json({ message: 'Another course with this slug already exists' });
      }
      const existingCourseByTitle = await prisma.course.findFirst({
        where: { title, id: { not: courseId } },
      });
      if (existingCourseByTitle) {
        return res.status(409).json({ message: 'Another course with this title already exists' });
      }

      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: { title, slug, description, image_url },
      });
      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(`Failed to update course ${courseId}:`, error);
      // Considerar errores de Prisma, ej. si el courseId no existe (P2025)
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // DELETE: Eliminar un curso
  if (req.method === 'DELETE') {
    try {
      // Considerar la lógica de eliminación en cascada o cómo manejar capítulos/ejercicios huérfanos.
      // Prisma puede manejar esto con onDelete: Cascade en el schema, o puedes hacerlo manualmente.
      // Por simplicidad, aquí solo eliminamos el curso.
      // Asegúrate de que el schema defina onDelete: Cascade para Chapter si quieres que se eliminen en cascada.
      await prisma.course.delete({
        where: { id: courseId },
      });
      return res.status(204).end(); // No content
    } catch (error) {
      console.error(`Failed to delete course ${courseId}:`, error);
      // Considerar errores de Prisma, ej. si el courseId no existe (P2025)
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
