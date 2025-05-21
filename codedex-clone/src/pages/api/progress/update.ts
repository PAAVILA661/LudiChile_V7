import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
// import jwt from 'jsonwebtoken'; // For future JWT verification
// const JWT_SECRET = process.env.JWT_SECRET;

interface UpdateProgressRequestBody {
  userId: string;
  exerciseSlug: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // TODO: Authentication/Authorization: 
  // Verify that the userId matches the currently logged-in user's ID from JWT session.
  // For now, we trust the passed userId.
  // Example:
  // const token = req.cookies['codedex_session_token']; // or from Authorization header
  // if (!token || !JWT_SECRET) return res.status(401).json({ message: 'Not authenticated' });
  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  //   if (decoded.userId !== req.body.userId) {
  //     return res.status(403).json({ message: 'Forbidden: User ID does not match session' });
  //   }
  // } catch (error) {
  //   return res.status(401).json({ message: 'Invalid or expired token' });
  // }


  const { userId, exerciseSlug } = req.body as UpdateProgressRequestBody;

  // 2. Input Validation
  if (!userId || !exerciseSlug) {
    return res.status(400).json({ message: 'Missing userId or exerciseSlug in request body' });
  }

  try {
    // 3. Find Exercise
    const exercise = await prisma.exercise.findUnique({
      where: { slug: exerciseSlug },
      select: { id: true, xp_value: true }, // Select only necessary fields
    });

    if (!exercise) {
      return res.status(404).json({ message: `Exercise with slug '${exerciseSlug}' not found` });
    }

    if (exercise.xp_value === null) {
        console.warn(`Exercise with slug '${exerciseSlug}' has null xp_value. Using 0 XP.`);
    }
    const xpValue = exercise.xp_value ?? 0; // Default to 0 if xp_value is null

    // 4. Update UserProgress (or create if it doesn't exist)
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_exerciseId: {
          userId: userId,
          exerciseId: exercise.id,
        },
      },
      create: {
        userId: userId,
        exerciseId: exercise.id,
        status: 'COMPLETED',
        completed_at: new Date(),
      },
      update: {
        status: 'COMPLETED',
        completed_at: new Date(),
      },
    });

    // 5. Update UserXP (or create if it doesn't exist)
    const updatedUserXP = await prisma.userXP.upsert({
      where: { userId: userId },
      create: {
        userId: userId,
        total_xp: xpValue,
      },
      update: {
        total_xp: {
          increment: xpValue,
        },
      },
      select: { total_xp: true } // Select total_xp to return in response
    });

    // 6. Response
    return res.status(200).json({ 
      message: 'Progress updated successfully', 
      updatedUserProgress: {
        exerciseId: userProgress.exerciseId,
        status: userProgress.status,
        completed_at: userProgress.completed_at
      },
      total_xp: updatedUserXP.total_xp 
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    // Check for specific Prisma errors if needed, e.g., P2002 for unique constraint violation if upsert wasn't used
    // For now, a generic 500 error for database issues
    return res.status(500).json({ message: 'Internal server error while updating progress' });
  }
}
