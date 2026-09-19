import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/catalog";
import { formatPrice } from "@/data/catalog";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartDrawer({ open, items, onClose, onQuantityChange, onRemove }: CartDrawerProps) {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid="cart-drawer-overlay">
      <button type="button" aria-label="Close shopping bag" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default bg-[#14202e]/60 backdrop-blur-sm" data-testid="cart-drawer-backdrop" />
      <aside className="cart-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fbf9f5] text-[#14202e] shadow-2xl" aria-label="Shopping bag" data-testid="cart-drawer">
        <header className="flex items-center justify-between border-b border-[#c8a45d]/25 px-6 py-5 sm:px-8">
          <div>
            <p className="eyebrow text-[#9a7a3e]">Your edit</p>
            <h2 className="mt-1 font-serif text-3xl" data-testid="cart-drawer-title">Shopping bag</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close shopping bag" className="icon-button" data-testid="cart-drawer-close-button"><X size={20} /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center" data-testid="cart-empty-state">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-[#c8a45d]/30 text-[#c8a45d]"><ShoppingBag size={25} strokeWidth={1.3} /></div>
              <h3 className="mt-5 font-serif text-2xl">Your bag is waiting</h3>
              <p className="mt-2 max-w-[240px] text-sm leading-6 text-[#667383]">Begin with a considered piece from the Navidha edit.</p>
              <Button type="button" onClick={onClose} className="mt-6 rounded-none bg-[#14202e] px-5 font-sans text-[10px] uppercase tracking-[0.18em] hover:bg-[#c8a45d] hover:text-[#14202e]" data-testid="cart-continue-shopping-button">Continue shopping</Button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-[#14202e]/10 pb-5" data-testid={`cart-item-${item.product.id}`}>
                  <img src={item.product.image} alt={item.product.alt} className="h-24 w-20 object-cover" data-testid={`cart-item-image-${item.product.id}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#9a7a3e]">{item.product.material}</p>
                        <h3 className="mt-1 font-serif text-lg" data-testid={`cart-item-name-${item.product.id}`}>{item.product.name}</h3>
                      </div>
                      <button type="button" onClick={() => onRemove(item.product.id)} aria-label={`Remove ${item.product.name}`} className="text-[#667383] transition-colors hover:text-[#a34b3f]" data-testid={`cart-item-remove-${item.product.id}`}><Trash2 size={15} /></button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-[#14202e]/15">
                        <button type="button" onClick={() => onQuantityChange(item.product.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center text-[#667383] hover:text-[#14202e]" aria-label={`Decrease ${item.product.name} quantity`} data-testid={`cart-item-decrease-${item.product.id}`}><Minus size={12} /></button>
                        <span className="w-7 text-center text-xs" data-testid={`cart-item-quantity-${item.product.id}`}>{item.quantity}</span>
                        <button type="button" onClick={() => onQuantityChange(item.product.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center text-[#667383] hover:text-[#14202e]" aria-label={`Increase ${item.product.name} quantity`} data-testid={`cart-item-increase-${item.product.id}`}><Plus size={12} /></button>
                      </div>
                      <p className="text-sm" data-testid={`cart-item-total-${item.product.id}`}>{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs leading-5 text-[#667383]" data-testid="cart-shipping-note">Complimentary delivery across India. Each piece arrives wrapped in a Navidha keepsake box.</p>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <footer className="border-t border-[#c8a45d]/25 px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between"><span className="text-sm text-[#667383]">Subtotal</span><strong className="font-serif text-2xl" data-testid="cart-subtotal">{formatPrice(subtotal)}</strong></div>
            <Button type="button" className="mt-5 h-12 w-full rounded-none bg-[#14202e] font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#c8a45d] hover:text-[#14202e]" onClick={() => window.alert("This is a preview — checkout will open when the collection launches.")} data-testid="cart-checkout-button">Preview checkout</Button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e]">Launching soon · made to last</p>
          </footer>
        )}
      </aside>
    </div>
  );
}