import type { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  withAdminApiAuth,
  type AuthenticatedAdminRequest,
} from "@/lib/adminApiAuth";

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== "string") {
    return res.status(400).json({ message: "Page slug is required" });
  }

  // GET: Obtener una página por slug
  if (req.method === "GET") {
    try {
      const page = await prisma.staticPage.findUnique({
        where: { slug },
      });
      if (!page) {
        // Si no existe, podríamos devolver un 404 o un objeto vacío para que el admin la cree
        return res
          .status(404)
          .json({
            message: "Page not found. You can create it by saving content.",
          });
      }
      return res.status(200).json(page);
    } catch (error) {
      console.error(`Failed to fetch page ${slug}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // PUT: Actualizar (o crear) una página por slug (Upsert)
  if (req.method === "PUT") {
    const { title, content } = req.body;
    if (typeof title !== "string" || typeof content !== "string") {
      return res
        .status(400)
        .json({ message: "Title and Content are required" });
    }

    try {
      const upsertedPage = await prisma.staticPage.upsert({
        where: { slug },
        update: { title, content },
        create: { slug, title, content },
      });
      return res.status(200).json(upsertedPage);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        // This case is less likely with upsert but included for robustness
        return res
          .status(404)
          .json({ message: "Page not found during upsert operation" });
      }
      console.error(`Failed to upsert page ${slug}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
