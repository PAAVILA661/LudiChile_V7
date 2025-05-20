import type { Setting as PrismaSetting } from '@prisma/client';

export type SettingKey = 'siteName' | 'siteLogoUrl' | 'maintenanceMode' | 'contactEmail' | 'defaultCourseSlug';

// Para mostrar en la UI y para el formulario
export interface SiteSetting extends PrismaSetting {}

export interface SiteSettingsFormData {
    [key: string]: string; // Clave: valor
}
