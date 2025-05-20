import type { StaticPage as PrismaStaticPage } from "@prisma/client";

export interface StaticPageAdminInfo
  extends Pick<PrismaStaticPage, "id" | "slug" | "title" | "updated_at"> {}

export interface StaticPageFormData
  extends Pick<PrismaStaticPage, "title" | "content"> {}
