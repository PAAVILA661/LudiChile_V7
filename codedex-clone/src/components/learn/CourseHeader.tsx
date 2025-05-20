import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  title: string;
  description: string;
  image: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  description,
  image,
  level,
}) => {
  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={`${title} Background`}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-codedex-darkNavy/0 to-codedex-darkNavy" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 codedex-container py-8">
        <div className="flex flex-col">
          <div className="inline-flex mb-4">
            <span className="bg-codedex-navy text-codedex-gold border border-codedex-gold/30 text-xs px-3 py-1 rounded-sm font-pixel">
              {level}
            </span>
            <span className="bg-codedex-navy text-gray-300 border border-codedex-gold/30 text-xs px-3 py-1 rounded-sm font-pixel ml-2">
              COURSE
            </span>
          </div>

          <h1 className="text-6xl font-pixel text-codedex-gold mb-6 tracking-wider">
            {title}
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mb-8">{description}</p>

          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-codedex-gold text-codedex-darkNavy hover:bg-codedex-gold/90 font-pixel"
              asChild
            >
              <Link href="/python/01-setting-up">Start Learning for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
