import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ShippingReturns: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="shipping-returns"
      className="border-t border-[#14202e]/10 bg-[#f4efe8] py-16 px-5 sm:px-8 lg:px-16"
      data-testid="shipping-returns-section"
      aria-labelledby="shipping-returns-heading"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#14202e]/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-[#9a7a3e]" />
              <p className="eyebrow text-[#9a7a3e]" data-testid="shipping-returns-eyebrow">
                Client Care & Commitments
              </p>
            </div>
            <h2
              id="shipping-returns-heading"
              className="font-serif text-3xl sm:text-4xl text-[#14202e] font-normal tracking-[-0.02em]"
              data-testid="shipping-returns-title"
            >
              Insured Delivery & <em className="text-[#9a7a3e] italic">Easy Returns</em>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#667383] max-w-md leading-relaxed" data-testid="shipping-returns-intro">
            Every Navidha creation is handled with reverence. From temperature-controlled jeweler packaging to doorstep returns, our promise is total peace of mind.
          </p>
        </div>

        {/* 4 Trust Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
          {/* Pillar 1: Delivery Timelines */}
          <div
            className="flex flex-col justify-between bg-[#fbf9f5] p-7 border border-[#c8a45d]/25 shadow-xs transition-transform duration-300 hover:-translate-y-1"
            data-testid="shipping-pillar-delivery"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14202e] text-[#c8a45d] mb-6">
                <Truck size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-[#14202e]">Complimentary Delivery</h3>
              <p className="mt-3 text-xs leading-6 text-[#667383]">
                Dispatched within <strong>24–48 hours</strong>. Delivered in <strong>2–4 business days</strong> across metro cities, and 4–6 days pan-India with live insured tracking.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] font-semibold">
              <Clock size={12} />
              <span>Express Insured Courier</span>
            </div>
          </div>

          {/* Pillar 2: 15-Day Returns */}
          <div
            className="flex flex-col justify-between bg-[#fbf9f5] p-7 border border-[#c8a45d]/25 shadow-xs transition-transform duration-300 hover:-translate-y-1"
            data-testid="shipping-pillar-returns"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14202e] text-[#c8a45d] mb-6">
                <RotateCcw size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-[#14202e]">15-Day Easy Returns</h3>
              <p className="mt-3 text-xs leading-6 text-[#667383]">
                Try your jewelry at home with complete confidence. If a piece does not suit you, request an effortless doorstep pickup within <strong>15 days of arrival</strong>.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] font-semibold">
              <CheckCircle2 size={12} />
              <span>Doorstep Reverse Pickup</span>
            </div>
          </div>

          {/* Pillar 3: Keepsake Presentation */}
          <div
            className="flex flex-col justify-between bg-[#fbf9f5] p-7 border border-[#c8a45d]/25 shadow-xs transition-transform duration-300 hover:-translate-y-1"
            data-testid="shipping-pillar-packaging"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14202e] text-[#c8a45d] mb-6">
                <Package size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-[#14202e]">Signature Keepsake Box</h3>
              <p className="mt-3 text-xs leading-6 text-[#667383]">
                Each piece arrives nestled in our custom ivory & navy velvet-lined keepsake case, accompanied by a microfiber polish cloth and care handbook.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] font-semibold">
              <Sparkles size={12} />
              <span>Ready for Gifting</span>
            </div>
          </div>

          {/* Pillar 4: Authenticity & Purity */}
          <div
            className="flex flex-col justify-between bg-[#fbf9f5] p-7 border border-[#c8a45d]/25 shadow-xs transition-transform duration-300 hover:-translate-y-1"
            data-testid="shipping-pillar-authenticity"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14202e] text-[#c8a45d] mb-6">
                <ShieldCheck size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-[#14202e]">Hallmark & Purity</h3>
              <p className="mt-3 text-xs leading-6 text-[#667383]">
                Guaranteed genuine natural freshwater pearls and hallmarked 925 sterling silver with anti-tarnish finish. Certificate of authenticity included.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] font-semibold">
              <CheckCircle2 size={12} />
              <span>Certified 925 Silver</span>
            </div>
          </div>
        </div>

        {/* Detailed Policy Trigger Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#14202e] text-[#f8f1e4] rounded-[2px]">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#c8a45d] animate-pulse" />
            <p className="text-xs sm:text-sm text-[#b8c0c8]">
              Need tailored delivery coordination, ring sizing, or personalized guidance?
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c8a45d] hover:text-[#f8f1e4] transition-colors cursor-pointer py-1"
            data-testid="view-full-policy-button"
          >
            Read Full Shipping & Returns Policy <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Comprehensive Policy Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14202e]/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
          onClick={() => setIsModalOpen(false)}
          data-testid="shipping-policy-modal"
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#fbf9f5] p-6 sm:p-10 shadow-2xl relative border border-[#c8a45d]/40 text-[#14202e] rounded-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-[#14202e]/10">
              <div>
                <p className="eyebrow text-[#9a7a3e]">Navidha Policy Guide</p>
                <h3 id="policy-modal-title" className="font-serif text-3xl mt-1 text-[#14202e]">
                  Shipping, Delivery & Returns
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="icon-button"
                aria-label="Close policy guide"
                data-testid="close-policy-modal-button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with Detailed FAQs */}
            <div className="mt-6 space-y-7 text-xs sm:text-sm leading-relaxed text-[#667383]">
              {/* Delivery Timelines */}
              <div>
                <h4 className="font-serif text-lg text-[#14202e] mb-2 flex items-center gap-2">
                  <Truck size={17} className="text-[#9a7a3e]" />
                  Delivery Timelines & Order Tracking
                </h4>
                <p>
                  Every Navidha jewelry piece is thoroughly hand-inspected before dispatch. Orders are prepared and dispatched from our atelier within <strong>24 to 48 business hours</strong>.
                </p>
                <ul className="mt-2.5 list-disc pl-5 space-y-1.5 text-xs text-[#14202e]/80">
                  <li><strong>Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata:</strong> 2 to 4 business days.</li>
                  <li><strong>Tier 2 & Other Indian Cities:</strong> 3 to 6 business days.</li>
                  <li><strong>Special Craft Editions & Pre-orders:</strong> Ships on scheduled launch date with priority notification.</li>
                </ul>
                <p className="mt-2 text-xs">
                  Once your parcel is en route, you will receive an automated tracking link via SMS and email with live delivery checkpoints.
                </p>
              </div>

              {/* Transit Insurance & Discreet Packaging */}
              <div className="pt-4 border-t border-[#14202e]/10">
                <h4 className="font-serif text-lg text-[#14202e] mb-2 flex items-center gap-2">
                  <ShieldCheck size={17} className="text-[#9a7a3e]" />
                  Full Transit Insurance & Discretion
                </h4>
                <p>
                  All shipments are <strong>100% insured</strong> against loss or damage until verified delivery into your hands. For client security, outer packages are strictly unbranded and sealed with tamper-evident security tape.
                </p>
              </div>

              {/* Easy 15-Day Return Process */}
              <div className="pt-4 border-t border-[#14202e]/10">
                <h4 className="font-serif text-lg text-[#14202e] mb-2 flex items-center gap-2">
                  <RotateCcw size={17} className="text-[#9a7a3e]" />
                  Our 15-Day Hassle-Free Return Policy
                </h4>
                <p>
                  We want you to love your Navidha jewelry. If you are not completely enchanted with your purchase, you may initiate a return within <strong>15 days of receiving your package</strong>:
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#f0ebe3] p-3.5 rounded-[2px]">
                    <span className="font-bold text-[#14202e] block mb-1">1. Initiate Request</span>
                    Notify our concierge team with your order number via email or WhatsApp.
                  </div>
                  <div className="bg-[#f0ebe3] p-3.5 rounded-[2px]">
                    <span className="font-bold text-[#14202e] block mb-1">2. Doorstep Pickup</span>
                    Our courier partner collects the boxed jewelry in its original condition.
                  </div>
                  <div className="bg-[#f0ebe3] p-3.5 rounded-[2px]">
                    <span className="font-bold text-[#14202e] block mb-1">3. Prompt Refund</span>
                    Full refund processed to your original payment method within 3–5 working days.
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="pt-4 border-t border-[#14202e]/10">
                <h4 className="font-serif text-lg text-[#14202e] mb-2 flex items-center gap-2">
                  <Package size={17} className="text-[#9a7a3e]" />
                  Return Conditions
                </h4>
                <p className="text-xs">
                  Items must be unworn, undamaged, and returned with the original presentation case, certificate card, and tags intact. Custom-engraved or personalized pieces are non-returnable unless defective.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-5 border-t border-[#14202e]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-[#14202e] text-[#f8f1e4] px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors cursor-pointer"
              >
                Close Policy Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
