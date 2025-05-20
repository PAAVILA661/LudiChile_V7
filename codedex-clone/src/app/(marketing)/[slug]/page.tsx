import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

interface StaticPageProps {
  params: {
    slug: string;
  };
}

// Función para generar metadatos dinámicos
export async function generateMetadata(
  { params }: StaticPageProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const page = await prisma.staticPage.findUnique({
      where: { slug: params.slug },
    });

    if (!page) {
      return {
        title: "Page Not Found",
        description: "The page you are looking for does not exist.",
      };
    }

    return {
      title: `${page.title} | Codedex`,
      description: `${page.content.substring(0, 150)}...`, // Breve descripción del contenido
      // openGraph: { images: ['some_image_url'] }, // Opcional
    };
  } catch (error) {
    console.error("Error generating metadata for static page:", error);
    return {
      title: "Error",
      description: "Could not load page information.",
    };
  }
}

// Función para generar rutas estáticas si es necesario (para `output: 'export'`)
// Esto es importante si quieres que estas páginas se generen en el build.
export async function generateStaticParams() {
  try {
    const pages = await prisma.staticPage.findMany({
      select: { slug: true },
    });
    // También incluir slugs predefinidos que podrían no estar en la BD aún
    const predefinedSlugs = ["about", "terms", "privacy", "faq"];
    const allSlugs = Array.from(
      new Set([...pages.map((p) => p.slug), ...predefinedSlugs]),
    );

    return allSlugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error fetching slugs for generateStaticParams:", error);
    return []; // Devolver vacío en caso de error para no romper el build
  }
}

async function getPageContent(slug: string) {
  try {
    const page = await prisma.staticPage.findUnique({
      where: { slug },
    });
    return page;
  } catch (error) {
    // En producción, no querrías loguear errores de esta forma directamente a la consola del cliente o servidor de forma masiva.
    // Pero para desarrollo o para entender problemas de conexión a BD durante el build, es útil.
    console.error(
      `Failed to fetch page content for slug [${slug}] from DB:`,
      error,
    );
    return null; // Retornar null para que se maneje como notFound o con contenido por defecto
  }
}

export default async function StaticContentPage({ params }: StaticPageProps) {
  const page = await getPageContent(params.slug);

  if (!page) {
    // Si la página no se encuentra en la BD, podrías mostrar un mensaje específico
    // o incluso permitir que se cree si el slug es uno de los predefinidos.
    // Por ahora, para slugs que no están en la BD, mostramos notFound().
    // Esto es importante porque generateStaticParams puede generar slugs que aún no tienen contenido.
    const predefinedSlugs = ["about", "terms", "privacy", "faq"];
    if (predefinedSlugs.includes(params.slug)) {
      // Para slugs predefinidos sin contenido en BD, se podría mostrar un placeholder
      // o un mensaje invitando al admin a añadir contenido.
      // O simplemente notFound() si se espera que siempre haya contenido.
      return (
        <div className="codedex-container text-white py-12 px-4">
          <h1 className="text-3xl font-pixel text-codedex-gold mb-6 capitalize">
            {params.slug.replace("-", " ")}
          </h1>
          <div className="prose prose-invert prose-lg max-w-none bg-codedex-navy p-6 rounded-md">
            <p>
              This page (<code>{params.slug}</code>) has not been configured
              yet.
            </p>
            <p>An administrator can add content via the admin panel.</p>
          </div>
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="codedex-container text-white py-12 px-4">
      <h1 className="text-3xl font-pixel text-codedex-gold mb-6">
        {page.title}
      </h1>
      {/* Aplicar estilos para Markdown */}
      <article className="prose prose-invert prose-lg max-w-none bg-codedex-navy p-6 rounded-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {page.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
