import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { CraftStory } from '../data';

interface CraftDetailModalProps {
  story: CraftStory | null;
  onClose: () => void;
  onExploreCollection?: () => void;
}

export const CraftDetailModal: React.FC<CraftDetailModalProps> = ({
  story,
  onClose,
  onExploreCollection
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [story]);

  useEffect(() => {
    if (!story) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [story, onClose]);

  if (!story) return null;

  const images = story.images && story.images.length > 0 ? story.images : [story.image];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14202e]/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${story.name} craft story details`}
      onClick={onClose}
      data-testid="craft-detail-modal"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-[#fbf9f5] border border-[#14202e]/10 shadow-2xl text-[#14202e]"
        onClick={(e) => e.stopPropagation()}
        data-testid="craft-detail-content"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center bg-[#fbf9f5]/90 border border-[#14202e]/10 text-[#14202e] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
          aria-label="Close craft details"
          data-testid="craft-detail-close-button"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image & Carousel Column */}
          <div className="relative bg-[#14202e] flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-[500px]">
            <img
              key={`${story.id}-${activeImageIndex}`}
              src={images[activeImageIndex]}
              alt={`${story.name} craft visual, view ${activeImageIndex + 1}`}
              className="h-full w-full object-cover max-h-[540px]"
              data-testid="craft-detail-active-image"
            />

            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center bg-[#14202e]/80 border border-white/30 text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
                  aria-label="Previous craft image"
                  data-testid="craft-detail-prev-image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center bg-[#14202e]/80 border border-white/30 text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
                  aria-label="Next craft image"
                  data-testid="craft-detail-next-image"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Dots / Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-[#14202e]/70 px-3 py-1.5 backdrop-blur-xs">
                  {images.map((_, idx) => (
                    <button
                      key={`modal-dot-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setActiveImageIndex(idx);
                      }}
                      className={`h-2 transition-all rounded-full ${
                        idx === activeImageIndex ? 'w-5 bg-[#c8a45d]' : 'w-2 bg-white/40 hover:bg-white/80'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Story Narrative Column */}
          <div className="p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#9a7a3e] text-[10px] uppercase tracking-[0.2em] font-semibold">
                <MapPin size={13} />
                <span>{story.location}</span>
              </div>

              <h2
                className="mt-3 font-serif text-2xl sm:text-3xl text-[#14202e] leading-snug"
                data-testid="craft-detail-title"
              >
                {story.name}
              </h2>

              <div className="mt-4 h-px w-16 bg-[#c8a45d]" />

              <p
                className="mt-5 text-sm sm:text-base leading-relaxed text-[#667383]"
                data-testid="craft-detail-description"
              >
                {story.description}
              </p>

              <div className="mt-6 rounded-none bg-[#f0ebe3] p-4 text-xs text-[#14202e] border border-[#14202e]/5">
                <div className="flex items-center gap-2 text-[#9a7a3e] font-serif text-sm">
                  <Sparkles size={15} />
                  <span>Artisanal Heritage & Integrity</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#667383]">
                  Each creation is hand-formed by multigenerational craftspeople utilizing time-honored techniques passed down through centuries. No two pieces are ever identical.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#14202e]/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#667383]">
                Navidha Heritage Craft Edit
              </span>

              {onExploreCollection && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreCollection();
                  }}
                  className="inline-flex items-center gap-2 bg-[#14202e] px-5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
                  data-testid="craft-detail-explore-button"
                >
                  <span>Explore House Collection</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
