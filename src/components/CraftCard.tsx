import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { CraftStory } from '../data';

interface CraftCardProps {
  story: CraftStory;
  index: number;
  featured?: boolean;
  onSelect?: (story: CraftStory) => void;
}

export const CraftCard: React.FC<CraftCardProps> = ({
  story,
  index,
  featured = false,
  onSelect
}) => {
  const images = story.images && story.images.length > 0 ? story.images : [story.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const hasMultiple = images.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(idx);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(story);
    }
  };

  return (
    <article
      className={`craft-card group cursor-pointer ${featured ? 'craft-card-featured' : ''}`}
      onClick={handleCardClick}
      data-testid={`craft-card-${story.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View craft story for ${story.name}`}
    >
      <img
        key={`${story.id}-${currentIdx}`}
        src={images[currentIdx]}
        alt={`${story.name} jewelry craft, view ${currentIdx + 1}`}
        loading="lazy"
        className="craft-card-slide cursor-pointer"
        data-testid={`craft-image-${story.id}`}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      />

      {hasMultiple && (
        <>
          <div className="craft-card-dots" data-testid={`craft-slider-dots-${story.id}`} onClick={(e) => e.stopPropagation()}>
            {images.map((_, idx) => (
              <button
                key={`${story.id}-dot-${idx}`}
                type="button"
                onClick={(e) => handleDotClick(e, idx)}
                onMouseDown={(e) => e.stopPropagation()}
                className={`craft-card-dot ${idx === currentIdx ? 'craft-card-dot-active' : ''} cursor-pointer`}
                aria-label={`Show ${story.name} image ${idx + 1}`}
                aria-current={idx === currentIdx}
                data-testid={`craft-slider-dot-${story.id}-${idx + 1}`}
              />
            ))}
          </div>

          <div className="craft-card-arrows" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handlePrev}
              onMouseDown={(e) => e.stopPropagation()}
              className="craft-card-arrow craft-card-arrow-left cursor-pointer"
              aria-label={`Previous ${story.name} image`}
              data-testid={`craft-slider-previous-${story.id}`}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              onMouseDown={(e) => e.stopPropagation()}
              className="craft-card-arrow craft-card-arrow-right cursor-pointer"
              aria-label={`Next ${story.name} image`}
              data-testid={`craft-slider-next-${story.id}`}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </>
      )}

      <div className="craft-card-overlay">
        <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          <p
            className="text-[10px] uppercase tracking-[0.18em] text-[#f1dfb8] hover:text-[#f8f1e4] hover:underline underline-offset-2 transition-colors inline-block"
            data-testid={`craft-location-${story.id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            0{index + 1} · {story.location}
          </p>
          <h3
            className="mt-2 font-serif text-2xl sm:text-3xl text-[#f8f1e4] leading-snug group-hover:text-[#c8a45d] hover:underline decoration-1 underline-offset-4 transition-colors"
            data-testid={`craft-name-${story.id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {story.name}
          </h3>
          <p
            className="mt-2 max-w-sm text-xs sm:text-sm leading-6 text-[#f8f1e4]/80 hover:text-[#f8f1e4] transition-colors"
            data-testid={`craft-description-${story.id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {story.description}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-[#c8a45d] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform cursor-pointer"
          data-testid={`craft-link-${story.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          role="button"
          tabIndex={0}
          aria-label={`Open ${story.name} details`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleCardClick();
            }
          }}
        >
          <span className="text-[10px] uppercase tracking-widest font-sans opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            Read story
          </span>
          <ArrowUpRight size={20} className="shrink-0" />
        </div>
      </div>
    </article>
  );
};

