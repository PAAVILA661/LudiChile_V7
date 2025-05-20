"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-codedex-darkNavy flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Esto es más un fallback, el useEffect debería haber redirigido
    return null;
  }

  return (
    <div className="min-h-screen bg-codedex-darkNavy text-white p-8">
      <div className="codedex-container">
        <h1 className="text-3xl font-pixel text-codedex-gold mb-6">My Profile</h1>
        <div className="bg-codedex-navy p-6 rounded-lg shadow-lg">
          <p className="mb-2"><span className="font-semibold">Name:</span> {user.name || 'Not set'}</p>
          <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
          <p className="mb-2"><span className="font-semibold">Role:</span> {user.role}</p>
          <p className="mb-2"><span className="font-semibold">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          {/* Aquí se podrían añadir más detalles, progreso, badges, etc. */}
        </div>
      </div>
    </div>
  );
}
