import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAdminApiAuth, AuthenticatedAdminRequest } from '@/lib/adminApiAuth';

async function handler(
  req: AuthenticatedAdminRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { title, slug, description, image_url } = req.body;

  if (!title || !slug) {
    return res.status(400).json({ message: 'Title and Slug are required for a course' });
  }

  try {
    // Verificar si ya existe un curso con el mismo slug o título
    const existingCourseBySlug = await prisma.course.findUnique({
      where: { slug },
    });
    if (existingCourseBySlug) {
      return res.status(409).json({ message: 'Course with this slug already exists' });
    }
    const existingCourseByTitle = await prisma.course.findUnique({
        where: { title },
    });
    if (existingCourseByTitle) {
        return res.status(409).json({ message: 'Course with this title already exists' });
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
    console.error('Failed to create course:', error);
    // Considerar errores específicos de Prisma, ej. Prisma.PrismaClientKnownRequestError
    return res.status(500).json({ message: 'Internal Server Error while creating course' });
  }
}

export default withAdminApiAuth(handler);
