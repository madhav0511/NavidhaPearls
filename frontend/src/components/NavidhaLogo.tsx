import { logoUrl } from "@/data/catalog";

interface NavidhaLogoProps {
  compact?: boolean;
}

export default function NavidhaLogo({ compact = false }: NavidhaLogoProps) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`} data-testid="navidha-brand-mark">
      <img
        src={logoUrl}
        alt="Navidha Pearls and Jewelry logo"
        className={compact ? "h-11 w-11 object-contain" : "h-14 w-14 object-contain"}
        data-testid="navidha-logo-image"
      />
      <div className="leading-none">
        <span className={`block font-serif tracking-[0.14em] text-[#f8f1e4] ${compact ? "text-base" : "text-lg"}`}>
          NAVIDHA
        </span>
        {!compact && <span className="mt-1 block text-[8px] uppercase tracking-[0.3em] text-[#c8a45d]">Pearls & Jewelry</span>}
      </div>
    </div>
  );
}