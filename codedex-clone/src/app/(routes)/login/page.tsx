"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState<string | null>(null); // Para errores de la API

  useEffect(() => {
    const registeredParam = searchParams.get("registered");
    if (registeredParam === "true") {
      // Opcional: mostrar un mensaje de "Registro exitoso, por favor inicia sesión"
      // Podrías usar un estado para esto y mostrarlo en el JSX.
      // Por ahora, solo lo logueamos.
      console.log("Usuario recién registrado, por favor inicie sesión.");
      // Idealmente, aquí se podría mostrar un toast/notificación.
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is being edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null); // Limpiar errores de API anteriores

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(
            data.message || "Failed to login. Please check your credentials.",
          );
          setIsLoading(false);
          return;
        }

        // Login exitoso
        console.log("Login successful", data);
        // La cookie JWT ya se estableció por el backend.
        // Aquí podrías guardar el usuario en un contexto global/estado.
        // Por ahora, redirigimos a la página principal.
        router.push("/");
        // Podrías querer hacer un router.refresh() si necesitas que el layout recargue y detecte la sesión
      } catch (error) {
        console.error("Login request failed:", error);
        setApiError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-codedex-darkNavy flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <div className="relative w-12 h-12 mx-auto mb-2">
              <Image
                src="https://ext.same-assets.com/1748103887/1764963315.png"
                alt="Codedex Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-pixel text-codedex-gold">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2">
            Sign in to continue your coding journey
          </p>
        </div>

        {searchParams.get("registered") === "true" && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-md text-sm">
            Registration successful! Please sign in.
          </div>
        )}

        {apiError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-md text-sm">
            {apiError}
          </div>
        )}

        <Card className="bg-codedex-navy border-codedex-gold/10">
          <CardHeader className="pb-2">
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-codedex-navy/50"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </CardHeader>

          <div className="relative my-4 px-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-codedex-navy px-2 text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-codedex-darkNavy border-gray-700 text-white"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-codedex-teal hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-codedex-darkNavy border-gray-700 text-white"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-codedex-teal hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
