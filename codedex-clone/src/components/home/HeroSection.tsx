import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        {/* Usando <img> estándar para la imagen de fondo */}
        <img
          src="https://ext.same-assets.com/1748103887/447480214.webp"
          alt="Fondo del Banner"
          style={{ objectFit: "cover", width: "100%", height: "100%" }} // Replicar fill y object-cover
        />
      </div>

      {/* Superposición de contenido */}
      <div className="relative z-10 codedex-container">
        <div className="flex flex-col items-center justify-center text-center pt-12 pb-8">
          <div className="mb-4">
            <img
              src="https://ext.same-assets.com/1748103887/2517388686.svg"
              alt="Aventura de Programación"
              width={550}
              height={130}
              className="mx-auto"
              style={{ color: "transparent" }} // Replicando estilo de next/image
            />
          </div>

          <p className="text-xl md:text-2xl text-codedex-gold max-w-2xl mx-auto mb-8 font-medium">
            La forma más divertida y amigable para principiantes de aprender a
            programar.
          </p>

          <Button
            className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel py-6 px-8 text-lg"
            asChild
          >
            <Link href="/signup">¡Comenzar!</Link>
          </Button>

          <div className="mt-12 text-sm text-gray-400">CON EL APOYO DE</div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-4">
            <img
              src="https://ext.same-assets.com/1748103887/1367661487.svg"
              alt="GitHub"
              width={120}
              height={40}
              className="opacity-80"
              style={{ color: "transparent" }}
            />
            <img
              src="https://ext.same-assets.com/1748103887/2553164950.png"
              alt="CSTA"
              width={100}
              height={40}
              className="opacity-80"
              style={{ color: "transparent" }}
            />
            <img
              src="https://ext.same-assets.com/1748103887/2838098675.svg"
              alt="Patrocinador"
              width={100}
              height={40}
              className="opacity-80"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
