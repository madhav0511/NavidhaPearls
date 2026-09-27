import React from 'react';
import { BRAND_LOGO } from '../data';

interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div 
        className="grid h-28 w-28 place-items-center rounded-full bg-[#14202e] shadow-[0_12px_30px_rgba(20,32,46,0.18)]"
        data-testid="navidha-brand-mark"
      >
        <img
          src={BRAND_LOGO}
          alt="Navidha Pearls and Jewelry logo"
          className="h-20 w-20 object-contain contrast-125"
          data-testid="navidha-logo-image"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3" data-testid="navidha-brand-mark">
      <img
        src={BRAND_LOGO}
        alt="Navidha Pearls and Jewelry logo"
        className="h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] object-contain contrast-125 drop-shadow-[0_1px_6px_rgba(255,255,255,0.15)]"
        data-testid="navidha-logo-image"
      />
      <div className="hidden sm:flex flex-col">
        <span className="font-serif tracking-[0.2em] text-lg sm:text-xl text-[#f8f1e4] font-medium uppercase">
          Navidha
        </span>
        <span className="text-[8px] uppercase tracking-[0.25em] text-[#c8a45d]">
          Pearls & Jewelry
        </span>
      </div>
    </div>
  );
};
