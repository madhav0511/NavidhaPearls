import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface CampaignImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export const campaignImages: CampaignImage[] = [
  {
    id: "luminous-layers",
    src: "https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/sj9panj4_image.png",
    alt: "Indian woman wearing layered silver and pearl jewelry",
    title: "Luminous Layers",
    caption: "Freshwater pearls and silver, composed with quiet confidence.",
  },
  {
    id: "pearls-of-permanence",
    src: "https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/9blwded6_image.png",
    alt: "Indian woman wearing an elaborate pearl collar and silver floral brooch",
    title: "Pearls of Permanence",
    caption: "A sculptural pearl collar anchored by an intricate silver bloom.",
  },
  {
    id: "midnight-edit",
    src: "https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/572101d51f69a3817f33977e910d8b6c39673c0db2c3ee661bc5e125815a32ad.jpeg",
    alt: "Indian woman in a dark drape wearing silver and pearl jewelry",
    title: "The Midnight Edit",
    caption: "Pearl light against midnight silk — an expression of modern India.",
  },
  {
    id: "quiet-brilliance",
    src: "https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/82b55458ca83e407bc3cb0c6538522b9e4922f11d53cb8f60eea96fe7284c82b.jpeg",
    alt: "Close portrait with pearl chandelier earrings and pearl collar",
    title: "Quiet Brilliance",
    caption: "Silver, pearl, and presence — nothing more is needed.",
  },
  {
    id: "objects-of-desire",
    src: "https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/a095091718efdc74f5dc9f654126ee162eadc5c19f4556acdf8ba01da636a633.jpeg",
    alt: "Pearl strands, earrings, and a silver floral brooch on dark silk",
    title: "Objects of Desire",
    caption: "Hand-finished silver and luminous pearls, waiting to gather a story.",
  },
];

interface CampaignGalleryProps {
  open: boolean;
  onClose: () => void;
}

export default function CampaignGallery({ open, onClose }: CampaignGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const image = campaignImages[activeIndex];

  const showPrevious = () => setActiveIndex((index) => (index - 1 + campaignImages.length) % campaignImages.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % campaignImages.length);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="campaign-gallery" role="dialog" aria-modal="true" aria-label="Navidha pearl campaign gallery" data-testid="campaign-gallery">
      <header className="campaign-gallery-header">
        <div>
          <p className="eyebrow text-[#c8a45d]" data-testid="campaign-gallery-eyebrow">Navidha · Pearl campaign</p>
          <p className="mt-1 font-serif text-xl text-[#f8f1e4]" data-testid="campaign-gallery-heading">The Luminous Edit</p>
        </div>
        <div className="flex items-center gap-5">
          <p className="text-[10px] tracking-[.2em] text-[#b8c0c8]" data-testid="campaign-gallery-counter">{String(activeIndex + 1).padStart(2, "0")} / {String(campaignImages.length).padStart(2, "0")}</p>
          <button type="button" onClick={onClose} className="campaign-gallery-close" aria-label="Close campaign gallery" data-testid="campaign-gallery-close-button"><X size={20} /></button>
        </div>
      </header>

      <div className="campaign-gallery-stage" data-testid="campaign-gallery-stage">
        <div className="campaign-gallery-backdrop" style={{ backgroundImage: `url(${image.src})` }} aria-hidden="true" />
        <button type="button" onClick={showPrevious} className="campaign-gallery-arrow campaign-gallery-arrow-left" aria-label="Previous campaign image" data-testid="campaign-gallery-previous-button"><ChevronLeft size={27} strokeWidth={1.3} /></button>
        <img key={image.id} src={image.src} alt={image.alt} className="campaign-gallery-image" data-testid="campaign-gallery-active-image" />
        <button type="button" onClick={showNext} className="campaign-gallery-arrow campaign-gallery-arrow-right" aria-label="Next campaign image" data-testid="campaign-gallery-next-button"><ChevronRight size={27} strokeWidth={1.3} /></button>
        <div className="campaign-gallery-caption" aria-live="polite" data-testid="campaign-gallery-caption">
          <p className="eyebrow text-[#c8a45d]" data-testid="campaign-gallery-image-number">Chapter {String(activeIndex + 1).padStart(2, "0")}</p>
          <h2 className="mt-2 font-serif text-3xl text-[#f8f1e4] sm:text-4xl" data-testid="campaign-gallery-image-title">{image.title}</h2>
          <p className="mt-2 max-w-md text-xs leading-5 text-[#b8c0c8] sm:text-sm" data-testid="campaign-gallery-image-caption">{image.caption}</p>
        </div>
      </div>

      <div className="campaign-gallery-thumbnails" role="tablist" aria-label="Campaign images" data-testid="campaign-gallery-thumbnails">
        {campaignImages.map((item, index) => (
          <button
            type="button"
            key={item.id}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View ${item.title}`}
            onClick={() => setActiveIndex(index)}
            className={`campaign-gallery-thumbnail ${index === activeIndex ? "campaign-gallery-thumbnail-active" : ""}`}
            data-testid={`campaign-thumbnail-${item.id}`}
          >
            <img src={item.src} alt="" aria-hidden="true" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}