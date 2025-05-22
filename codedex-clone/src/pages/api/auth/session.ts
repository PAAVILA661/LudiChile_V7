import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import type { User as PrismaUser, Progress, UserBadge, UserXP, Exercise, Badge } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'codedex_session_token';

// Omitimos password_hash del tipo User que usamos en el frontend
export type AuthenticatedUser = Omit<PrismaUser, 'password_hash'> & {
  progress: (Progress & { exercise: Pick<Exercise, 'id' | 'slug'> })[];
  user_badges: (UserBadge & { badge: Pick<Badge, 'name' | 'image_url'> })[];
  user_xp: Pick<UserXP, 'total_xp'> | null; // UserXP could be null if no XP record yet
};

interface JwtPayload {
  userId: string;
  email: string;
  role: string; // O el enum UserRole si se importa correctamente
  name?: string;
  iat: number;
  exp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined for session check');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated', user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        progress: {
          include: {
            exercise: {
              select: { id: true, slug: true },
            },
          },
        },
        user_badges: {
          include: {
            badge: {
              select: { name: true, image_url: true },
            },
          },
        },
        user_xp: {
          select: { total_xp: true },
        },
      },
    });

    if (!user) {
      // This case should ideally not happen if JWT is valid and user existed at token creation
      // But good to handle as a safeguard
      return res.status(404).json({ message: 'User not found', user: null });
    }

    const { password_hash, ...userToReturn } = user;

    // Ensure the returned user matches the AuthenticatedUser type structure
    // Most fields are directly from the 'user' object after omitting password_hash.
    // Prisma's include will structure 'progress', 'user_badges', and 'user_xp' as needed.
    // We might need to adjust if Prisma's return type for includes doesn't perfectly match AuthenticatedUser
    const authenticatedUserData: AuthenticatedUser = {
      ...userToReturn,
      // Ensure role is correctly typed if it's an enum
      role: userToReturn.role as PrismaUser['role'],
      // progress, user_badges, and user_xp should be correctly typed by Prisma's include
      // and match the AuthenticatedUser definition.
      // If user_xp can be null from the DB query (e.g. no UserXP record),
      // ensure AuthenticatedUser or the handling accommodates this.
      // Prisma returns `null` for a to-one relation if it doesn't exist, which matches our type for user_xp.
    };

    return res.status(200).json({ user: authenticatedUserData });

  } catch (error) {
    console.error('Session check error:', error);
    // Si el token es inválido o expiró, jwt.verify lanzará un error
    return res.status(401).json({ message: 'Invalid or expired token', user: null });
  }
}
