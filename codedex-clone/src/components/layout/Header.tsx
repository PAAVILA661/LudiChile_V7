"use client"; // Necesario porque usamos hooks como useAuth

import React from "react";
import Logo from "./Logo";
import NavigationMenu from "./NavigationMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Moon, LogOut, UserCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirigir a la home después del logout
    router.refresh(); // Para asegurar que el estado del servidor se actualice si es necesario
  };

  return (
    <header className="sticky top-0 z-50 bg-codedex-darkNavy border-b border-codedex-gold/10">
      <div className="codedex-container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Logo />
          <NavigationMenu />
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="text-codedex-gold h-9 w-9"
            title="Cambiar tema (no implementado)"
          >
            <Moon size={18} />
          </Button>

          {isLoading ? (
            <div className="h-9 w-32 animate-pulse bg-gray-700 rounded-md"></div>
          ) : isAuthenticated && user ? (
            <>
              <span className="text-sm text-gray-300 hidden md:inline">
                ¡Hola, {user.name || user.email}!
              </span>

              {user.role === "ADMIN" && (
                <Button
                  className="text-codedex-teal hover:text-codedex-teal/80 h-9 w-9"
                  title="Panel de Administrador"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <ShieldCheck size={18} />
                </Button>
              )}

              <Button
                className="border-gray-700 text-gray-300 hover:bg-codedex-navy/50 h-9 w-9"
                title="Mi Cuenta"
                onClick={() => router.push("/profile")}
              >
                <UserCircle size={18} />
              </Button>
              <Button
                className="text-codedex-teal hover:text-codedex-teal/80 h-9 w-9"
                onClick={handleLogout}
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Button
                className="border-gray-700 text-gray-300 hover:bg-codedex-navy/50"
                asChild
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button
                className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel"
                asChild
              >
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
