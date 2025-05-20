import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAdminApiAuth, AuthenticatedAdminRequest } from '@/lib/adminApiAuth';

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { courseId, chapterId } = req.query;

  if (typeof courseId !== 'string' || typeof chapterId !== 'string') {
    return res.status(400).json({ message: 'Valid Course ID and Chapter ID are required' });
  }

  // GET: Obtener detalles de un capítulo
  if (req.method === 'GET') {
    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId, course_id: courseId },
        // include: { exercises: { orderBy: { order: 'asc' } } } // Opcional
      });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      return res.status(200).json(chapter);
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // PUT: Actualizar un capítulo
  if (req.method === 'PUT') {
    const { title, slug, description, order } = req.body;
    if (!title || !slug || order === undefined) {
      return res.status(400).json({ message: 'Title, Slug, and Order are required' });
    }
    try {
      const existingChapterBySlug = await prisma.chapter.findFirst({
        where: { slug, course_id: courseId, id: { not: chapterId } },
      });
      if (existingChapterBySlug) {
        return res.status(409).json({ message: 'Another chapter with this slug already exists in this course' });
      }

      const updatedChapter = await prisma.chapter.update({
        where: { id: chapterId, course_id: courseId },
        data: { title, slug, description, order: parseInt(order as string, 10) },
      });
      return res.status(200).json(updatedChapter);
    } catch (error) {
      console.error(`Failed to update chapter ${chapterId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // DELETE: Eliminar un capítulo
  if (req.method === 'DELETE') {
    try {
      // Asegúrate de que el schema defina onDelete: Cascade para Exercise si quieres que se eliminen en cascada.
      await prisma.chapter.delete({
        where: { id: chapterId, course_id: courseId },
      });
      return res.status(204).end();
    } catch (error) {
      console.error(`Failed to delete chapter ${chapterId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
