import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  // GET: Listar todas las páginas estáticas
  if (req.method === "GET") {
    try {
      const pages = await prisma.staticPage.findMany({
        orderBy: { title: "asc" },
      });
      return res.status(200).json(pages);
    } catch (error) {
      console.error("Failed to fetch static pages:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
