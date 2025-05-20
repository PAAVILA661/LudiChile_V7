import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAdminApiAuth, AuthenticatedAdminRequest } from '@/lib/adminApiAuth';

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { courseId } = req.query;

  if (typeof courseId !== 'string') {
    return res.status(400).json({ message: 'Valid Course ID is required' });
  }

  // GET: Listar capítulos de un curso
  if (req.method === 'GET') {
    try {
      const chapters = await prisma.chapter.findMany({
        where: { course_id: courseId },
        orderBy: { order: 'asc' },
      });
      return res.status(200).json(chapters);
    } catch (error) {
      console.error(`Failed to fetch chapters for course ${courseId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // POST: Crear un nuevo capítulo para un curso
  if (req.method === 'POST') {
    const { title, slug, description, order } = req.body;
    if (!title || !slug || order === undefined) {
      return res.status(400).json({ message: 'Title, Slug, and Order are required for a chapter' });
    }

    try {
      // Verificar si ya existe un capítulo con el mismo slug DENTRO DEL MISMO CURSO
      const existingChapter = await prisma.chapter.findFirst({
        where: { slug, course_id: courseId },
      });
      if (existingChapter) {
        return res.status(409).json({ message: 'Chapter with this slug already exists in this course' });
      }

      const newChapter = await prisma.chapter.create({
        data: {
          title,
          slug,
          description,
          order: parseInt(order as string, 10), // Asegurarse que order es un número
          course: { connect: { id: courseId } },
        },
      });
      return res.status(201).json(newChapter);
    } catch (error) {
      console.error(`Failed to create chapter for course ${courseId}:`, error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
