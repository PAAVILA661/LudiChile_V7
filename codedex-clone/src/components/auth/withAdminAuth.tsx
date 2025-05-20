"use client";

import React, { ComponentType, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client'; // Asegúrate de que UserRole se importa correctamente
import type { User } from '@/types/auth';

interface WithAdminAuthProps {
  // Puedes añadir props adicionales que el HOC podría necesitar o pasar
}

const withAdminAuth = <P extends object>(
  WrappedComponent: ComponentType<P & { user: User }> // La página envuelta recibirá el user
) => {
  const AdminRouteComponent: React.FC<P & WithAdminAuthProps> = (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.replace('/login?redirect=' + window.location.pathname); // Redirigir a login si no está autenticado
        } else if (user?.role !== UserRole.ADMIN) {
          router.replace('/unauthorized'); // Redirigir a una página de no autorizado si no es ADMIN
        }
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || user?.role !== UserRole.ADMIN) {
      // Muestra un loader o null mientras se verifica o si no es admin
      // Podrías tener un componente de "Cargando Acceso..." o "Verificando..."
      return (
        <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center">
          <p className="text-white text-xl">Verifying admin access...</p>
        </div>
      );
    }
    // Si es admin, renderiza el componente envuelto pasándole el usuario
    return <WrappedComponent {...props as P} user={user} />;
  };

  return AdminRouteComponent;
};

export default withAdminAuth;
