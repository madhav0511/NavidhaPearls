import { logoUrl } from "@/data/catalog";

interface NavidhaLogoProps {
  compact?: boolean;
}

export default function NavidhaLogo({ compact = false }: NavidhaLogoProps) {
  return (
    <div
      className={compact ? "grid h-28 w-28 place-items-center rounded-full bg-[#14202e] shadow-[0_12px_30px_rgba(20,32,46,0.18)]" : "flex items-center"}
      data-testid="navidha-brand-mark"
    >
      <img
        src={logoUrl}
        alt="Navidha Pearls and Jewelry logo"
        className={compact ? "h-20 w-20 object-contain contrast-125" : "h-[72px] w-[72px] object-contain contrast-125 drop-shadow-[0_1px_6px_rgba(255,255,255,0.12)]"}
        data-testid="navidha-logo-image"
      />
    </div>
  );
}