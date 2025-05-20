import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  imageSrc: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  href: string;
  index?: number;
}

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const colors = {
    BEGINNER: 'bg-codedex-teal',
    INTERMEDIATE: 'bg-codedex-blue',
    ADVANCED: 'bg-codedex-purple',
  };

  const bgColor = colors[difficulty as keyof typeof colors] || 'bg-gray-600';

  // Traducción de etiquetas de dificultad solo para mostrar
  const translateDifficulty = (diff: string) => {
    switch(diff) {
      case 'BEGINNER': return 'PRINCIPIANTE';
      case 'INTERMEDIATE': return 'INTERMEDIO';
      case 'ADVANCED': return 'AVANZADO';
      default: return diff;
    }
  };

  return (
    <div className={`${bgColor} text-white px-2 py-1 text-xs rounded-sm font-pixel`}>
      {translateDifficulty(difficulty)}
    </div>
  );
};

const CourseCard: React.FC<CourseCardProps> = ({
  imageSrc,
  title,
  description,
  difficulty,
  href,
  index = 1,
}) => {
  return (
    <Card className="bg-codedex-navy border border-codedex-gold/20 overflow-hidden transition-transform hover:translate-y-[-4px] duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-gray-400 uppercase text-xs">Curso {index}</div>
          <h3 className="text-codedex-gold font-pixel text-xl">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <DifficultyBadge difficulty={difficulty} />
          <Button className="border border-codedex-gold/30 text-codedex-gold hover:bg-codedex-gold/10 hover:text-white" asChild>
            <Link href={href}>COMENZAR</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
