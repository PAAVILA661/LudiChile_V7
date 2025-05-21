import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import type { User as PrismaUser } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "codedex_session_token";

// Omitimos password_hash del tipo User que usamos en el frontend
export type AuthenticatedUser = Omit<PrismaUser, "password_hash">;

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
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined for session check");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated", user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Opcional: Podrías volver a buscar al usuario en la BD para asegurar que aún existe y está activo
    // Por ahora, confiamos en los datos del token si el token es válido.
    // const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    // if (!user) return res.status(401).json({ message: 'User not found', user: null });
    // const { password_hash, ...userToReturn } = user;

    const userFromToken: AuthenticatedUser = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as PrismaUser["role"], // Asegurar que el tipo coincida con el enum de Prisma
      name: decoded.name || null, // name es opcional
      // Los siguientes campos no están en el token, pero son parte del tipo User de Prisma
      // Se pueden dejar como null/undefined o no incluirlos si el tipo User en el frontend los maneja como opcionales
      github_id: null, // No está en el payload del token, necesitaría consulta a BD si se requiere
      created_at: new Date(decoded.iat * 1000), // Aproximación, iat es issued at
      updated_at: new Date(), // No se puede obtener del token directamente
    };

    return res.status(200).json({ user: userFromToken });
  } catch (error) {
    console.error("Session check error:", error);
    // Si el token es inválido o expiró, jwt.verify lanzará un error
    return res
      .status(401)
      .json({ message: "Invalid or expired token", user: null });
  }
}
