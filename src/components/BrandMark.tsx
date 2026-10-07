import React from 'react';
import { BRAND_LOGO } from '../data';

interface BrandMarkProps {
  compact?: boolean;
  variant?: 'navbar' | 'catalog' | 'compact' | 'footer';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  imgClassName?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  compact = false,
  variant,
  theme = 'auto',
  className = '',
  imgClassName = '',
}) => {
  // Catalog Manager variant: reduced and balanced to cleanly fit the catalog manager menu bar
  if (variant === 'catalog') {
    return (
      <div 
        className={`grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#14202e] shadow-xs shrink-0 ${className}`}
        data-testid="navidha-brand-mark"
      >
        <img
          src={BRAND_LOGO}
          alt="Navidha Pearls and Jewelry logo"
          className={`h-6 w-6 sm:h-7 sm:w-7 object-contain contrast-125 ${imgClassName}`}
          data-testid="navidha-logo-image"
        />
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        className={`grid h-10 w-10 place-items-center rounded-full bg-[#14202e] shadow-xs shrink-0 ${className}`}
        data-testid="navidha-brand-mark"
      >
        <img
          src={BRAND_LOGO}
          alt="Navidha Pearls and Jewelry logo"
          className={`h-7 w-7 object-contain contrast-125 ${imgClassName}`}
          data-testid="navidha-logo-image"
        />
      </div>
    );
  }

  // Standard Navbar Brand Mark: exactly 75% of menu bar height
  // On standard 76px storefront menu bar, 75% = 57px (h-[57px] w-[57px])
  const isLight = theme === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} data-testid="navidha-brand-mark">
      <img
        src={BRAND_LOGO}
        alt="Navidha Pearls and Jewelry logo"
        className={`h-[57px] w-[57px] object-contain contrast-125 shrink-0 ${
          isLight
            ? 'drop-shadow-[0_2px_8px_rgba(20,32,46,0.12)]'
            : 'drop-shadow-[0_1px_6px_rgba(255,255,255,0.18)]'
        } ${imgClassName}`}
        data-testid="navidha-logo-image"
      />
      <div className="hidden sm:flex flex-col justify-center">
        <span
          className={`font-serif tracking-[0.2em] text-lg sm:text-xl font-medium uppercase leading-tight ${
            isLight ? 'text-[#14202e]' : 'text-[#f8f1e4]'
          }`}
        >
          Navidha
        </span>
        <span
          className={`text-[8px] uppercase tracking-[0.25em] leading-tight mt-0.5 ${
            isLight ? 'text-[#9a7a3e]' : 'text-[#c8a45d]'
          }`}
        >
          Pearls &amp; Jewelry
        </span>
      </div>
    </div>
  );
};
