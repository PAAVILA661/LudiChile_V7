import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  // El HOC withAdminApiAuth ya ha verificado que el usuario es admin.
  // Podemos acceder a req.adminUser si es necesario.
  // console.log('Admin user accessing users:', req.adminUser.email);

  try {
    const users = await prisma.user.findMany({
      select: {
        // Seleccionar solo los campos necesarios, excluir password_hash
        id: true,
        name: true,
        email: true,
        role: true,
        github_id: true,
        created_at: true,
        updated_at: true,
        // No incluir user_xp, progress, user_badges a menos que sea necesario para la lista general
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error while fetching users" });
  }
}

export default withAdminApiAuth(handler);
