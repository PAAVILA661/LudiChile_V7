import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAdminApiAuth, AuthenticatedAdminRequest } from '@/lib/adminApiAuth';
import type { Setting } from '@prisma/client';

async function handler(req: AuthenticatedAdminRequest, res: NextApiResponse) {
  // GET: Obtener todas las configuraciones
  if (req.method === 'GET') {
    try {
      const settings = await prisma.setting.findMany({
        orderBy: { group: 'asc' }, // Opcional: agruparlas y ordenarlas
      });
      // Convertir a un objeto para fácil acceso en el frontend, si se prefiere
      // const settingsObject = settings.reduce((obj, item) => {
      //   obj[item.key] = item.value;
      //   return obj;
      // }, {} as Record<string, string>);
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // PUT: Actualizar (o crear) múltiples configuraciones
  if (req.method === 'PUT') {
    const settingsToUpdate: Array<{ key: string; value: string; label?: string; type?: string; group?: string }> = req.body;

    if (!Array.isArray(settingsToUpdate) || settingsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Invalid payload: Expected an array of settings.' });
    }

    try {
      const transactionPromises = settingsToUpdate.map(setting => {
        // Validar cada setting si es necesario
        if (!setting.key || typeof setting.value === 'undefined') {
          throw new Error(`Invalid setting object: ${JSON.stringify(setting)}. Key and value are required.`);
        }
        return prisma.setting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            label: setting.label, // Solo actualiza si se provee
            type: setting.type,   // Solo actualiza si se provee
            group: setting.group  // Solo actualiza si se provee
          },
          create: {
            key: setting.key,
            value: setting.value,
            label: setting.label || setting.key, // Usar key como label si no se provee
            type: setting.type || 'text',
            group: setting.group
          },
        });
      });

      await prisma.$transaction(transactionPromises);

      // Devolver todas las configuraciones actualizadas
      const updatedSettings = await prisma.setting.findMany({ orderBy: { group: 'asc' } });
      return res.status(200).json(updatedSettings);

    } catch (error: any) {
      console.error('Failed to update settings:', error);
      return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default withAdminApiAuth(handler);
