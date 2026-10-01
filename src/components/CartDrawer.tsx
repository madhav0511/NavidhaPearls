import React, { useState } from 'react';
import { X, Trash2, Minus, Plus, ShoppingBag, Lock, ShieldCheck } from 'lucide-react';
import { CartItem, formatINR } from '../data';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClearCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  onClose,
  onQuantityChange,
  onRemove,
  onClearCart,
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid="cart-drawer-overlay">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#14202e]/60 backdrop-blur-xs"
        data-testid="cart-drawer-backdrop"
      />

      {/* Drawer */}
      <aside
        className="cart-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fbf9f5] text-[#14202e] shadow-2xl z-10"
        aria-label="Shopping bag"
        data-testid="cart-drawer"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#c8a45d]/25 px-6 py-5 sm:px-8">
          <div>
            <p className="eyebrow text-[#9a7a3e]">Your Edit</p>
            <h2 className="mt-1 font-serif text-2xl">Shopping Bag</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-button"
            aria-label="Close shopping bag"
            data-testid="cart-drawer-close"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="cart-empty-state">
              <ShoppingBag size={36} className="text-[#9a7a3e]/50 stroke-[1.2]" />
              <p className="mt-5 font-serif text-xl">Your bag is empty</p>
              <p className="mt-2 text-xs leading-5 text-[#667383] max-w-[240px]">
                Explore our house collection of fine pearls and crafted silver.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex h-10 items-center justify-center bg-[#14202e] px-6 text-[9px] uppercase tracking-[0.2em] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors"
              >
                Explore pieces
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 border-b border-[#14202e]/10 pb-5"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 object-cover bg-[#f0ebe3] rounded-[2px]"
                    data-testid={`cart-item-image-${item.product.id}`}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#9a7a3e]">
                          {item.product.material}
                        </p>
                        <h3 className="mt-1 font-serif text-base" data-testid={`cart-item-name-${item.product.id}`}>
                          {item.product.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-[#667383] transition-colors hover:text-[#a34b3f] cursor-pointer"
                        data-testid={`cart-item-remove-${item.product.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-[#14202e]/15">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center text-[#667383] hover:text-[#14202e] cursor-pointer"
                          aria-label={`Decrease ${item.product.name} quantity`}
                          data-testid={`cart-item-decrease-${item.product.id}`}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs" data-testid={`cart-item-quantity-${item.product.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center text-[#667383] hover:text-[#14202e] cursor-pointer"
                          aria-label={`Increase ${item.product.name} quantity`}
                          data-testid={`cart-item-increase-${item.product.id}`}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-light" data-testid={`cart-item-total-${item.product.id}`}>
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-xs leading-5 text-[#667383]" data-testid="cart-shipping-note">
                <p>Complimentary insured delivery across India · 15-day easy doorstep returns.</p>
                <a
                  href="/shipping-returns.html"
                  onClick={onClose}
                  className="inline-block mt-1 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] hover:text-[#14202e] underline underline-offset-2"
                >
                  View shipping & return details
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-[#c8a45d]/25 px-6 py-6 sm:px-8 bg-[#fbf9f5]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#667383]">Subtotal</span>
              <strong className="font-serif text-2xl font-normal" data-testid="cart-subtotal">
                {formatINR(subtotal)}
              </strong>
            </div>

            <button
              type="button"
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-none bg-[#14202e] font-sans text-[10px] uppercase tracking-[0.2em] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer shadow-md"
              onClick={() => setShowCheckoutModal(true)}
              data-testid="cart-checkout-button"
            >
              <Lock size={13} />
              <span>Proceed to Checkout</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#9a7a3e]">
              <ShieldCheck size={13} />
              <span>Armored Delivery & Transit Insurance Included</span>
            </div>
          </footer>
        )}
      </aside>

      {/* Luxury In-Website Checkout & Payment Gateway Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        items={items}
        subtotal={subtotal}
        onClose={() => setShowCheckoutModal(false)}
        onOrderSuccess={() => {
          onClearCart?.();
        }}
      />
    </div>
  );
};
