import type { User } from './auth'; // Asumiendo que User ya está definido en auth.ts

export interface AdminPageProps {
  user: User; // El HOC pasará el objeto user a la página de admin
}
