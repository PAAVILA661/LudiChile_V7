import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { UserRole, type User as PrismaUser } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "codedex_session_token";

export type AuthenticatedUser = Omit<PrismaUser, "password_hash">;

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name?: string | null;
  iat: number;
  exp: number;
}

export interface AuthenticatedAdminRequest extends NextApiRequest {
  adminUser: JwtPayload; // Añadimos el usuario admin decodificado a la request
}

// HOF (Higher-Order Function) para proteger rutas de API de administrador
export const withAdminApiAuth = (
  handler: (
    req: AuthenticatedAdminRequest,
    res: NextApiResponse,
  ) => Promise<void> | void,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined for API auth check");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      if (decoded.role !== UserRole.ADMIN) {
        return res
          .status(403)
          .json({ message: "Forbidden: Admin access required" });
      }

      // Opcional: Verificar si el usuario aún existe en la BD y sigue siendo admin
      const userFromDb = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!userFromDb || userFromDb.role !== UserRole.ADMIN) {
        return res
          .status(403)
          .json({
            message: "Forbidden: Admin status revoked or user not found",
          });
      }

      // Añadir el usuario decodificado (con rol verificado) a la request para uso en el handler
      (req as AuthenticatedAdminRequest).adminUser = decoded;

      return handler(req as AuthenticatedAdminRequest, res);
    } catch (error) {
      console.error("API Auth error:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid or expired token" });
      } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(500).json({ message: "Internal authentication error" });
    }
  };
};
