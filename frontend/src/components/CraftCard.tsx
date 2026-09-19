import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CraftStory } from "@/data/catalog";

interface CraftCardProps {
  story: CraftStory;
  index: number;
  featured: boolean;
}

export default function CraftCard({ story, index, featured }: CraftCardProps) {
  const images = story.images?.length ? story.images : [story.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSlideshow = images.length > 1;

  const showPrevious = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % images.length);

  useEffect(() => {
    if (!hasSlideshow) return;
    const timer = window.setInterval(showNext, 4000);
    return () => window.clearInterval(timer);
  }, [hasSlideshow, images.length]);

  return (
    <article className={`craft-card ${featured ? "craft-card-featured" : ""}`} data-testid={`craft-card-${story.id}`}>
      <img
        key={`${story.id}-${activeIndex}`}
        src={images[activeIndex]}
        alt={`${story.name} jewelry craft, view ${activeIndex + 1}`}
        loading="lazy"
        className="craft-card-slide"
        data-testid={`craft-image-${story.id}`}
      />
      {hasSlideshow && (
        <>
          <div className="craft-card-dots" data-testid={`craft-slider-dots-${story.id}`}>
            {images.map((_, imageIndex) => (
              <button
                type="button"
                key={`${story.id}-dot-${imageIndex}`}
                onClick={() => setActiveIndex(imageIndex)}
                className={`craft-card-dot ${imageIndex === activeIndex ? "craft-card-dot-active" : ""}`}
                aria-label={`Show ${story.name} image ${imageIndex + 1}`}
                aria-current={imageIndex === activeIndex}
                data-testid={`craft-slider-dot-${story.id}-${imageIndex + 1}`}
              />
            ))}
          </div>
          <div className="craft-card-arrows">
            <button type="button" onClick={showPrevious} className="craft-card-arrow" aria-label={`Previous ${story.name} image`} data-testid={`craft-slider-previous-${story.id}`}><ChevronLeft size={17} /></button>
            <button type="button" onClick={showNext} className="craft-card-arrow" aria-label={`Next ${story.name} image`} data-testid={`craft-slider-next-${story.id}`}><ChevronRight size={17} /></button>
          </div>
        </>
      )}
      <div className="craft-card-overlay">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#f1dfb8]" data-testid={`craft-location-${story.id}`}>0{index + 1} · {story.location}</p>
          <h3 className="mt-2 font-serif text-3xl text-[#f8f1e4]" data-testid={`craft-name-${story.id}`}>{story.name}</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#f8f1e4]/75" data-testid={`craft-description-${story.id}`}>{story.description}</p>
        </div>
        <ArrowUpRight size={19} className="shrink-0 text-[#c8a45d]" />
      </div>
    </article>
  );
}