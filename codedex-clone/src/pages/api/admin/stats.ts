import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'codedex_session_token'; // Ensure this matches your session cookie name

interface JwtPayload {
  userId: string;
  role: string; // Or your UserRole enum/type
  // other fields from your JWT payload if any
}

interface PlatformStats {
  totalUsers: number;
  totalCompletedExercises: number;
  totalSystemXP: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlatformStats | { message: string }>
) {
  // 2. Request Method Check
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined for admin stats');
    return res.status(500).json({ message: 'Server configuration error: JWT secret missing' });
  }

  // 3. Authentication & Authorization
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated: No session token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: User does not have ADMIN privileges' });
    }

    // 4. Database Operations
    const totalUsers = await prisma.user.count();
    
    const totalCompletedExercises = await prisma.userProgress.count({
      where: { status: 'COMPLETED' },
    });
    
    const aggregatedXP = await prisma.userXP.aggregate({
      _sum: { total_xp: true },
    });
    const totalSystemXP = aggregatedXP._sum.total_xp || 0;

    // 5. Response
    return res.status(200).json({
      totalUsers,
      totalCompletedExercises,
      totalSystemXP,
    });

  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT verification error for admin stats:', error.message);
      return res.status(401).json({ message: 'Not authenticated: Invalid or expired token' });
    }
    console.error('Error fetching platform stats:', error);
    return res.status(500).json({ message: 'Internal server error while fetching platform stats' });
  }
}
