import type { User as PrismaUser } from '@prisma/client';

// Omitimos password_hash del tipo User que usamos en el frontend
export type User = Omit<PrismaUser, 'password_hash'>;

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void; // Podríamos pasar los datos del usuario directamente tras el login
  logout: () => void; // Para llamar a la API de logout y limpiar estado
  // setUser: React.Dispatch<React.SetStateAction<User | null>>; // Opcional, si se necesita actualizar el usuario desde fuera
}
