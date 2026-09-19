import { logoUrl } from "@/data/catalog";

interface NavidhaLogoProps {
  compact?: boolean;
}

export default function NavidhaLogo({ compact = false }: NavidhaLogoProps) {
  return (
    <div className="flex items-center" data-testid="navidha-brand-mark">
      <img
        src={logoUrl}
        alt="Navidha Pearls and Jewelry logo"
        className={compact ? "h-14 w-24 object-contain brightness-0" : "h-16 w-24 object-contain"}
        data-testid="navidha-logo-image"
      />
    </div>
  );
}