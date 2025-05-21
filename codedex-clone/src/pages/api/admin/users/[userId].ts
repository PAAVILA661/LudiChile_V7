import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { userId } = req.query; // El ID del usuario a actualizar vendrá de la URL
  const { role } = req.body; // El nuevo rol vendrá del cuerpo de la solicitud

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!role || !Object.values(UserRole).includes(role as UserRole)) {
    return res
      .status(400)
      .json({
        message: `Invalid role specified. Valid roles are: ${Object.values(UserRole).join(", ")}`,
      });
  }

  // Prevenir que un admin se quite su propio rol de admin si es el único
  // O si intenta modificar su propio rol a través de esta ruta (podría tener una ruta de perfil para eso)
  if (userId === req.adminUser.userId && role !== UserRole.ADMIN) {
    // Podríamos verificar si es el único admin antes de denegar
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN },
    });
    if (adminCount <= 1) {
      return res
        .status(403)
        .json({ message: "Cannot remove the last admin role." });
    }
  }

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
      select: {
        // Seleccionar campos para devolver, excluyendo password_hash
        id: true,
        name: true,
        email: true,
        role: true,
        github_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "User not found" });
    }
    console.error(`Failed to update role for user ${userId}:`, error);
    return res
      .status(500)
      .json({ message: "Internal Server Error while updating user role" });
  }
}

export default withAdminApiAuth(handler);
