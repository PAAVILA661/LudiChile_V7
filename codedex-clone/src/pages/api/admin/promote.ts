import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client'; // Importar el enum UserRole

// Este debería ser un secreto MUY seguro y no estar hardcodeado así en producción.
// Idealmente, se pasaría como variable de entorno y solo se usaría para la configuración inicial.
const PROMOTE_SECRET = process.env.ADMIN_PROMOTE_SECRET || "super-secret-key-for-promotion";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { email, secret } = req.body;

  if (secret !== PROMOTE_SECRET) {
    return res.status(403).json({ message: 'Forbidden: Invalid secret' });
  }

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === UserRole.ADMIN) {
      return res.status(200).json({ message: 'User is already an admin', user });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: UserRole.ADMIN },
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({ message: 'User promoted to admin successfully', user: userWithoutPassword });

  } catch (error) {
    console.error('Promotion error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
