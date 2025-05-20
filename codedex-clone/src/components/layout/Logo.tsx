import type React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <Link href="/" className="flex items-center gap-1 hover:opacity-90 transition-opacity">
      {/* Imagen y div comentados temporalmente */}
      {/* <div className={`relative ${imageSizeClass[size]}`}>
        <img
          src="https://ext.same-assets.com/1748103887/1764963315.png"
          alt="Codedex Coin"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </div> */}
      <span className={`font-bold ${sizeClasses[size]} font-pixel`}>Codedex</span>
    </Link>
  );
};

export default Logo;
