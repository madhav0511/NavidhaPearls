import { logoUrl } from "@/data/catalog";

interface NavidhaLogoProps {
  compact?: boolean;
}

export default function NavidhaLogo({ compact = false }: NavidhaLogoProps) {
  return (
    <div
      className={compact ? "inline-flex items-center bg-[#14202e] px-3 py-1.5" : "flex items-center"}
      data-testid="navidha-brand-mark"
    >
      <img
        src={logoUrl}
        alt="Navidha Pearls and Jewelry logo"
        className={compact ? "h-14 w-24 object-contain" : "h-16 w-24 object-contain drop-shadow-[0_1px_6px_rgba(200,164,93,0.18)]"}
        data-testid="navidha-logo-image"
      />
    </div>
  );
}