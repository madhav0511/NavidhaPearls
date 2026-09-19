import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onAdd }: ProductDetailModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  if (!product) return null;
  const images = product.images.length ? product.images : [product.image];
  const showPrevious = () => setActiveImage((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveImage((current) => (current + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14202e]/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${product.name} details`} onClick={onClose} data-testid="product-detail-modal">
      <div className="product-modal" onClick={(event) => event.stopPropagation()} data-testid="product-detail-content">
        <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4 z-20 bg-[#fbf9f5]/90" aria-label="Close product details" data-testid="product-detail-close-button"><X size={18} /></button>
        <div className="grid md:grid-cols-2">
          <div className="product-detail-gallery" data-testid="product-detail-gallery">
            <div className="product-detail-main">
              <img key={`${product.id}-${activeImage}`} src={images[activeImage]} alt={`${product.alt}, detail view ${activeImage + 1}`} className="product-detail-main-image" data-testid="product-detail-image" />
              <button type="button" onClick={showPrevious} className="product-detail-arrow product-detail-arrow-left" aria-label={`Previous ${product.name} image`} data-testid="product-detail-previous-button"><ChevronLeft size={20} /></button>
              <button type="button" onClick={showNext} className="product-detail-arrow product-detail-arrow-right" aria-label={`Next ${product.name} image`} data-testid="product-detail-next-button"><ChevronRight size={20} /></button>
              <p className="product-detail-image-count" data-testid="product-detail-image-count">{activeImage + 1} / {images.length}</p>
            </div>
            <div className="product-detail-thumbnails" data-testid="product-detail-thumbnails">
              {images.map((image, imageIndex) => (
                <button type="button" key={`${product.id}-detail-${imageIndex}`} onClick={() => setActiveImage(imageIndex)} className={`product-detail-thumbnail ${imageIndex === activeImage ? "product-detail-thumbnail-active" : ""}`} aria-label={`View ${product.name} image ${imageIndex + 1}`} aria-current={imageIndex === activeImage} data-testid={`product-detail-thumbnail-${imageIndex + 1}`}><img src={image} alt="" aria-hidden="true" /></button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="eyebrow text-[#9a7a3e]" data-testid="product-detail-material">{product.material} · {product.category}</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight" data-testid="product-detail-name">{product.name}</h2>
            <p className="mt-4 text-2xl font-light" data-testid="product-detail-price">{formatPrice(product.price)}</p>
            <p className="mt-6 text-sm leading-7 text-[#667383]" data-testid="product-detail-description">{product.description}</p>
            <div className="mt-6 border-y border-[#14202e]/10 py-4 text-xs leading-6 text-[#667383]" data-testid="product-detail-specs">{product.details}</div>
            <Button type="button" onClick={() => onAdd(product)} className="mt-7 h-12 rounded-none bg-[#14202e] font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#c8a45d] hover:text-[#14202e]" data-testid="product-detail-add-button">Add to bag</Button>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e]" data-testid="product-detail-note">Wrapped with care · made to last</p>
          </div>
        </div>
      </div>
    </div>
  );
}