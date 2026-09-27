import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ArrowUpRight, Plus } from 'lucide-react';
import { Product, formatINR } from '../data';

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onSelect,
  onAdd
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const images = product.images.length > 0 ? product.images : [product.image];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(idx);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className="product-card group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden bg-[#f0ebe3] rounded-[2px]">
        {/* Main Image Clickable */}
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="product-card-image block w-full text-left cursor-pointer"
          aria-label={`View ${product.name}`}
          data-testid={`product-view-${product.id}`}
        >
          <img
            key={`${product.id}-${currentImageIndex}`}
            src={images[currentImageIndex]}
            alt={`${product.alt}, view ${currentImageIndex + 1}`}
            loading={index < 4 ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            className="product-card-slide aspect-[4/5] w-full object-cover"
            data-testid={`product-image-${product.id}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14202e]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </button>

        {/* Carousel arrows */}
        {images.length > 1 && (
          <div onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handlePrevImage}
              onMouseDown={(e) => e.stopPropagation()}
              className="product-card-arrow product-card-arrow-left cursor-pointer"
              aria-label={`Previous ${product.name} image`}
              data-testid={`product-image-previous-${product.id}`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              onMouseDown={(e) => e.stopPropagation()}
              className="product-card-arrow product-card-arrow-right cursor-pointer"
              aria-label={`Next ${product.name} image`}
              data-testid={`product-image-next-${product.id}`}
            >
              <ChevronRight size={16} />
            </button>

            {/* Slide dots */}
            <div className="product-card-dots" data-testid={`product-image-dots-${product.id}`} onClick={(e) => e.stopPropagation()}>
              {images.map((_, idx) => (
                <button
                  key={`${product.id}-image-${idx}`}
                  type="button"
                  onClick={(e) => handleDotClick(e, idx)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`product-card-dot ${idx === currentImageIndex ? 'product-card-dot-active' : ''} cursor-pointer`}
                  aria-label={`Show ${product.name} image ${idx + 1}`}
                  aria-current={idx === currentImageIndex}
                  data-testid={`product-image-dot-${product.id}-${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tag Badge */}
        <span className="absolute left-4 top-4 rounded-none bg-[#fbf9f5]/90 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#14202e] shadow-xs pointer-events-none">
          {product.tag}
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-[#fbf9f5]/85 backdrop-blur-xs transition-all duration-300 hover:scale-110 cursor-pointer ${
            isWishlisted ? 'text-[#c8a45d]' : 'text-[#14202e]'
          }`}
          aria-label={`Save ${product.name} to wishlist`}
          data-testid={`product-wishlist-${product.id}`}
        >
          <Heart size={15} strokeWidth={1.6} fill={isWishlisted ? '#c8a45d' : 'none'} />
        </button>

        {/* Hover Quick Add */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="absolute bottom-4 left-4 right-4 translate-y-3 flex items-center justify-center gap-2 rounded-none border border-[#f8f1e4]/30 bg-[#14202e]/95 py-2.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f8f1e4] opacity-0 backdrop-blur-xs transition-all duration-300 hover:bg-[#c8a45d] hover:text-[#14202e] group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
          data-testid={`product-add-${product.id}`}
        >
          <Plus size={14} /> Add to bag
        </button>
      </div>

      {/* Product Details Header */}
      <button
        type="button"
        className="mt-4 block w-full text-left cursor-pointer group/title"
        onClick={() => onSelect(product)}
        data-testid={`product-details-${product.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e]" data-testid={`product-material-${product.id}`}>
              {product.material}
            </p>
            <h3 className="mt-1 font-serif text-lg text-[#14202e] group-hover/title:text-[#9a7a3e] transition-colors" data-testid={`product-name-${product.id}`}>
              {product.name}
            </h3>
          </div>
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 text-[#9a7a3e] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
        <p className="mt-2 text-sm font-light text-[#667383]" data-testid={`product-price-${product.id}`}>
          {formatINR(product.price)}
        </p>
      </button>
    </article>
  );
};
