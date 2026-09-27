import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product, formatINR } from '../data';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAdd
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [product.image];

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14202e]/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
      onClick={onClose}
      data-testid="product-detail-modal"
    >
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
        data-testid="product-detail-content"
      >
        <button
          type="button"
          onClick={onClose}
          className="icon-button absolute right-4 top-4 z-20 bg-[#fbf9f5]/90 rounded-none cursor-pointer"
          aria-label="Close product details"
          data-testid="product-detail-close-button"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Gallery Column */}
          <div className="product-detail-gallery" data-testid="product-detail-gallery">
            <div className="product-detail-main">
              <img
                key={`${product.id}-${activeImageIndex}`}
                src={images[activeImageIndex]}
                alt={`${product.alt}, detail view ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="product-detail-main-image"
                data-testid="product-detail-image"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="product-detail-arrow product-detail-arrow-left"
                    aria-label={`Previous ${product.name} image`}
                    data-testid="product-detail-previous-button"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="product-detail-arrow product-detail-arrow-right"
                    aria-label={`Next ${product.name} image`}
                    data-testid="product-detail-next-button"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <p className="product-detail-image-count" data-testid="product-detail-image-count">
                {activeImageIndex + 1} / {images.length}
              </p>
            </div>

            {images.length > 1 && (
              <div className="product-detail-thumbnails" data-testid="product-detail-thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={`${product.id}-detail-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`product-detail-thumbnail ${idx === activeImageIndex ? 'product-detail-thumbnail-active' : ''}`}
                    aria-label={`View ${product.name} image ${idx + 1}`}
                    aria-current={idx === activeImageIndex}
                    data-testid={`product-detail-thumbnail-${idx + 1}`}
                  >
                    <img src={img} alt="" aria-hidden="true" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="eyebrow text-[#9a7a3e]" data-testid="product-detail-material">
              {product.material} · {product.category}
            </p>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl leading-tight text-[#14202e]" data-testid="product-detail-name">
              {product.name}
            </h2>

            <p className="mt-4 text-2xl font-light text-[#14202e]" data-testid="product-detail-price">
              {formatINR(product.price)}
            </p>

            <p className="mt-6 text-sm leading-7 text-[#667383]" data-testid="product-detail-description">
              {product.description}
            </p>

            <div className="mt-6 border-y border-[#14202e]/10 py-4 text-xs leading-6 text-[#667383]" data-testid="product-detail-specs">
              <p>{product.details}</p>
              <a
                href="/faq.html"
                className="mt-2 inline-flex items-center text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] hover:text-[#14202e] underline cursor-pointer"
                data-testid="product-detail-faq-link"
              >
                Questions on care, sourcing or sizing? Read client guide →
              </a>
            </div>

            <button
              type="button"
              onClick={() => onAdd(product)}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-none bg-[#14202e] font-sans text-[10px] uppercase tracking-[0.2em] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
              data-testid="product-detail-add-button"
            >
              <ShoppingBag size={14} /> Add to bag
            </button>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e]" data-testid="product-detail-note">
              Wrapped with care · made to last
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
