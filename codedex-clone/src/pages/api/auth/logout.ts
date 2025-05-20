import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const COOKIE_NAME = 'codedex_session_token';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Eliminar la cookie estableciendo maxAge a -1 o 0 y un valor vacío.
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1, // o 0
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ message: 'Logout successful' });
}
