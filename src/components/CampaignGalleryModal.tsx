import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CAMPAIGN_GALLERY } from '../data';

interface CampaignGalleryModalProps {
  open: boolean;
  onClose: () => void;
}

export const CampaignGalleryModal: React.FC<CampaignGalleryModalProps> = ({
  open,
  onClose
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = CAMPAIGN_GALLERY[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + CAMPAIGN_GALLERY.length) % CAMPAIGN_GALLERY.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % CAMPAIGN_GALLERY.length);
  };

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="campaign-gallery"
      role="dialog"
      aria-modal="true"
      aria-label="Navidha pearl campaign gallery"
      data-testid="campaign-gallery"
    >
      {/* Header */}
      <header className="campaign-gallery-header">
        <div>
          <p className="eyebrow text-[#c8a45d]" data-testid="campaign-gallery-eyebrow">
            Navidha · Pearl campaign
          </p>
          <p className="mt-1 font-serif text-xl text-[#f8f1e4]" data-testid="campaign-gallery-heading">
            The Luminous Edit
          </p>
        </div>

        <div className="flex items-center gap-5">
          <p className="text-[10px] tracking-[0.2em] text-[#b8c0c8]" data-testid="campaign-gallery-counter">
            {String(activeIdx + 1).padStart(2, '0')} / {String(CAMPAIGN_GALLERY.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="campaign-gallery-close"
            aria-label="Close campaign gallery"
            data-testid="campaign-gallery-close-button"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Stage */}
      <div className="campaign-gallery-stage" data-testid="campaign-gallery-stage">
        <div
          className="campaign-gallery-backdrop"
          style={{ backgroundImage: `url(${current.src})` }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={handlePrev}
          className="campaign-gallery-arrow campaign-gallery-arrow-left"
          aria-label="Previous campaign image"
          data-testid="campaign-gallery-previous-button"
        >
          <ChevronLeft size={28} strokeWidth={1.3} />
        </button>

        <img
          key={current.id}
          src={current.src}
          alt={current.alt}
          className="campaign-gallery-image"
          data-testid="campaign-gallery-active-image"
        />

        <button
          type="button"
          onClick={handleNext}
          className="campaign-gallery-arrow campaign-gallery-arrow-right"
          aria-label="Next campaign image"
          data-testid="campaign-gallery-next-button"
        >
          <ChevronRight size={28} strokeWidth={1.3} />
        </button>

        <div
          className="campaign-gallery-caption"
          aria-live="polite"
          data-testid="campaign-gallery-caption"
        >
          <p className="eyebrow text-[#c8a45d]" data-testid="campaign-gallery-image-number">
            Chapter {String(activeIdx + 1).padStart(2, '0')}
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#f8f1e4]" data-testid="campaign-gallery-image-title">
            {current.title}
          </h2>
          <p className="mt-2 max-w-md text-xs sm:text-sm leading-5 text-[#b8c0c8]" data-testid="campaign-gallery-image-caption">
            {current.caption}
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      <div
        className="campaign-gallery-thumbnails"
        role="tablist"
        aria-label="Campaign images"
        data-testid="campaign-gallery-thumbnails"
      >
        {CAMPAIGN_GALLERY.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={idx === activeIdx}
            aria-label={`View ${item.title}`}
            onClick={() => setActiveIdx(idx)}
            className={`campaign-gallery-thumbnail ${idx === activeIdx ? 'campaign-gallery-thumbnail-active' : ''}`}
            data-testid={`campaign-thumbnail-${item.id}`}
          >
            <img src={item.src} alt="" aria-hidden="true" />
            <span>{String(idx + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
