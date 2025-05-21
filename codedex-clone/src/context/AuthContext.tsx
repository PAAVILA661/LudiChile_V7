"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia como true para cargar la sesión inicial

  // Efecto para cargar la sesión del usuario al montar el provider
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null); // No hay sesión o error
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Aquí no necesitamos llamar a la API de login porque ya se hizo en la página de login
    // La cookie ya está establecida. Solo actualizamos el estado del cliente.
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Podrías querer manejar el error de logout de alguna forma
    } finally {
      setIsLoading(false);
      // Redirigir a la home o login después del logout si es necesario, ej. router.push('/')
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
