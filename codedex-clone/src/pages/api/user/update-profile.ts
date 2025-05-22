import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import type { User as PrismaUser } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'codedex_session_token'; // Ensure this matches your session cookie name

// Type for the expected request body
interface UpdateProfileRequestBody {
  userId?: string; // Optional: client might send it for verification, but primary ID is from token
  name: string;
}

// Type for the user data returned in the response (excluding sensitive fields)
type ProfileUpdateResponseUser = Omit<PrismaUser, 'password_hash' | 'github_id'>;


interface JwtPayload {
  userId: string;
  // other fields from your JWT payload if any (e.g., email, role)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 2. Request Method Check
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined for profile update');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // 3. Authentication & Authorization
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated: No session token' });
  }

  let authenticatedUserId: string;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    authenticatedUserId = decoded.userId;
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Not authenticated: Invalid or expired token' });
  }

  const { userId: bodyUserId, name } = req.body as UpdateProfileRequestBody;

  // Crucially: Verify bodyUserId if provided, but always use authenticatedUserId for DB ops
  if (bodyUserId && bodyUserId !== authenticatedUserId) {
    return res.status(403).json({ message: 'Forbidden: User ID in request body does not match authenticated user.' });
  }
  
  // 4. Input Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required and cannot be empty.' });
  }
  if (name.length > 50) { // Example length limit
    return res.status(400).json({ message: 'Name cannot exceed 50 characters.' });
  }

  try {
    // 5. Database Update
    const updatedUser = await prisma.user.update({
      where: { id: authenticatedUserId },
      data: {
        name: name.trim(), // Use trimmed name
        updated_at: new Date(), // Explicitly set updated_at
      },
      // Select fields to return, excluding sensitive ones
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
        // Exclude password_hash, github_id by not selecting them
      }
    });

    // Ensure the returned user type matches ProfileUpdateResponseUser
    const responseUser: ProfileUpdateResponseUser = updatedUser;

    // 6. Response
    return res.status(200).json({ user: responseUser });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    if (error.code === 'P2025') { // Prisma error code for "Record to update not found"
      // This case should ideally be rare if JWT is valid and user existed.
      return res.status(404).json({ message: 'User not found for update.' });
    }
    return res.status(500).json({ message: 'Internal server error while updating profile.' });
  }
}
