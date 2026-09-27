import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CraftStory } from '../data';

interface CraftCardProps {
  story: CraftStory;
  index: number;
  featured?: boolean;
}

export const CraftCard: React.FC<CraftCardProps> = ({
  story,
  index,
  featured = false
}) => {
  const images = story.images && story.images.length > 0 ? story.images : [story.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const hasMultiple = images.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    if (!hasMultiple) return;
    const interval = window.setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [hasMultiple, images.length]);

  return (
    <article
      className={`craft-card ${featured ? 'craft-card-featured' : ''}`}
      data-testid={`craft-card-${story.id}`}
    >
      <img
        key={`${story.id}-${currentIdx}`}
        src={images[currentIdx]}
        alt={`${story.name} jewelry craft, view ${currentIdx + 1}`}
        loading="lazy"
        className="craft-card-slide"
        data-testid={`craft-image-${story.id}`}
      />

      {hasMultiple && (
        <>
          <div className="craft-card-dots" data-testid={`craft-slider-dots-${story.id}`}>
            {images.map((_, idx) => (
              <button
                key={`${story.id}-dot-${idx}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(idx);
                }}
                className={`craft-card-dot ${idx === currentIdx ? 'craft-card-dot-active' : ''}`}
                aria-label={`Show ${story.name} image ${idx + 1}`}
                aria-current={idx === currentIdx}
                data-testid={`craft-slider-dot-${story.id}-${idx + 1}`}
              />
            ))}
          </div>

          <div className="craft-card-arrows">
            <button
              type="button"
              onClick={handlePrev}
              className="craft-card-arrow"
              aria-label={`Previous ${story.name} image`}
              data-testid={`craft-slider-previous-${story.id}`}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="craft-card-arrow"
              aria-label={`Next ${story.name} image`}
              data-testid={`craft-slider-next-${story.id}`}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </>
      )}

      <div className="craft-card-overlay">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#f1dfb8]" data-testid={`craft-location-${story.id}`}>
            0{index + 1} · {story.location}
          </p>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-[#f8f1e4] leading-snug" data-testid={`craft-name-${story.id}`}>
            {story.name}
          </h3>
          <p className="mt-2 max-w-sm text-xs sm:text-sm leading-6 text-[#f8f1e4]/80" data-testid={`craft-description-${story.id}`}>
            {story.description}
          </p>
        </div>
        <ArrowUpRight size={20} className="shrink-0 text-[#c8a45d]" />
      </div>
    </article>
  );
};
