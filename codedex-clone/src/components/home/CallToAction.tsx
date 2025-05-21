import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-codedex-purple to-codedex-blue">
      <div className="codedex-container flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="font-pixel text-3xl text-white mb-4">
            Comienza tu aventura de programación hoy.
          </h2>
          <p className="text-white/80 mb-6">
            Comprométete con tus metas con el Club Codedex—por tan solo
            $7.99/mes.
          </p>
          <Button
            className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel"
            asChild
          >
            <Link href="/signup">Unirse al Club</Link>
          </Button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72">
            <Image
              src="https://ext.same-assets.com/1748103887/38587989.gif"
              alt="Unirse a Codedex"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
