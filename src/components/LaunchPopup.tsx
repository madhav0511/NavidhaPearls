import React from 'react';
import { X, Sparkles, ArrowUpRight } from 'lucide-react';

interface LaunchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
}

export const LaunchPopup: React.FC<LaunchPopupProps> = ({
  isOpen,
  onClose,
  onExplore
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="launch-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navidha launch announcement"
      data-testid="launch-popup"
      onClick={onClose}
    >
      <div
        className="launch-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="icon-button launch-popup-close"
          aria-label="Close launch announcement"
          data-testid="launch-popup-close-button"
        >
          <X size={18} />
        </button>

        <div className="launch-popup-decoration" aria-hidden="true">
          <Sparkles size={16} />
          <span>Navidha · 2026</span>
          <Sparkles size={16} />
        </div>

        <p className="eyebrow text-[#9a7a3e]" data-testid="launch-popup-eyebrow">
          Navidha Pearls & Jewelry
        </p>

        <h2
          className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#14202e] sm:text-6xl"
          data-testid="launch-popup-title"
        >
          We will be<br />
          <em className="text-[#9a7a3e]">Live Soon</em>
        </h2>

        <p
          className="mx-auto mt-5 max-w-xs text-sm leading-6 text-[#667383]"
          data-testid="launch-popup-description"
        >
          A new chapter in Indian jewelry is almost here. Explore the preview while we prepare the collection.
        </p>

        <button
          type="button"
          onClick={() => {
            onClose();
            onExplore();
          }}
          className="mt-7 inline-flex h-11 items-center justify-center gap-3 bg-[#14202e] px-7 text-[10px] uppercase tracking-[0.2em] text-[#f8f1e4] transition-colors hover:bg-[#c8a45d] hover:text-[#14202e] cursor-pointer"
          data-testid="launch-popup-explore-button"
        >
          Explore the preview <ArrowUpRight size={14} />
        </button>

        <p
          className="mt-5 text-[9px] uppercase tracking-[0.18em] text-[#9a7a3e]"
          data-testid="launch-popup-note"
        >
          The story begins soon
        </p>
      </div>
    </div>
  );
};
