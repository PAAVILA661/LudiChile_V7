import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const CallToActionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-codedex-purple to-codedex-blue">
      <div className="codedex-container flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-pixel text-white mb-4">
            Start your coding<br />adventure today.
          </h2>
          <p className="text-white/80 mb-6">
            Commit to your goals with Codedex Club—for as low as $7.99/month.
          </p>
          <Button
            className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel px-8 py-6"
            asChild
          >
            <Link href="/signup">Join Club Now</Link>
          </Button>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative w-64 h-64">
            <Image
              src="https://ext.same-assets.com/1771893057/3255358730.gif"
              alt="Join Codedex"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
