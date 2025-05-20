import { PrismaClient } from '@prisma/client';

// Declara una variable global para almacenar la instancia de PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // Opcional: puedes configurar logs para ver las consultas en desarrollo
    // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
  });

// En desarrollo, asigna la instancia de PrismaClient a la variable global
// para que se reutilice entre recargas en caliente (hot-reloads).
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
