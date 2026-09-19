import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAdd: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onSelect, onAdd, index }: ProductCardProps) {
  return (
    <article className="product-card group" data-testid={`product-card-${product.id}`}>
      <div className="relative overflow-hidden bg-[#f0ebe3]">
        <button
          type="button"
          onClick={() => onSelect(product)}
          className="product-card-image block w-full text-left"
          aria-label={`View ${product.name}`}
          data-testid={`product-view-${product.id}`}
        >
          <img
            src={product.image}
            alt={product.alt}
            loading={index < 4 ? "eager" : "lazy"}
            className="aspect-[4/5] w-full object-cover"
            data-testid={`product-image-${product.id}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14202e]/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </button>
        <Badge className="absolute left-4 top-4 rounded-none border-0 bg-[#fbf9f5]/90 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#14202e] shadow-none">
          {product.tag}
        </Badge>
        <button
          type="button"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-[#fbf9f5]/80 text-[#14202e] backdrop-blur-sm transition-transform duration-300 hover:scale-110"
          aria-label={`Save ${product.name} to wishlist`}
          data-testid={`product-wishlist-${product.id}`}
        >
          <Heart size={15} strokeWidth={1.6} />
        </button>
        <Button
          type="button"
          onClick={() => onAdd(product)}
          size="sm"
          className="absolute bottom-4 left-4 right-4 translate-y-3 rounded-none border border-[#f8f1e4]/30 bg-[#14202e]/95 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f8f1e4] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#c8a45d] hover:text-[#14202e] group-hover:translate-y-0 group-hover:opacity-100"
          data-testid={`product-add-${product.id}`}
        >
          <ShoppingBag size={14} /> Add to bag
        </Button>
      </div>
      <button
        type="button"
        className="mt-4 block w-full text-left"
        onClick={() => onSelect(product)}
        data-testid={`product-details-${product.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e]" data-testid={`product-material-${product.id}`}>
              {product.material}
            </p>
            <h3 className="mt-2 font-serif text-xl text-[#14202e]" data-testid={`product-name-${product.id}`}>
              {product.name}
            </h3>
          </div>
          <ArrowUpRight size={16} className="mt-1 shrink-0 text-[#9a7a3e] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
        <p className="mt-2 text-sm text-[#667383]" data-testid={`product-price-${product.id}`}>
          {formatPrice(product.price)}
        </p>
      </button>
    </article>
  );
}