import React from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon, EnquiryMailIcon } from './TopBarIcons';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="contact-drawer-title">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          className="w-screen max-w-[460px] bg-white text-[#14202e] shadow-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto animate-in slide-in-from-right duration-300"
          data-testid="contact-us-drawer"
        >
          {/* Top Bar / Close Button */}
          <div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#14202e] hover:opacity-60 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14202e]"
                aria-label="Close contact sidebar"
                data-testid="contact-drawer-close-btn"
              >
                <X size={26} strokeWidth={1.5} />
              </button>
            </div>

            {/* Main Header & Subtext */}
            <div className="mt-4 sm:mt-6 text-center">
              <h2
                id="contact-drawer-title"
                className="font-serif text-2xl sm:text-[28px] font-bold tracking-[0.08em] text-[#14202e] uppercase leading-tight"
                data-testid="contact-drawer-heading"
              >
                WE’RE HERE TO HELP
              </h2>
              <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-[#333333] max-w-[340px] mx-auto font-sans">
                From finding the perfect gift to jewelry styling or size advice, our Customer Care Specialists are always here to help.
              </p>
            </div>

            {/* Action Buttons Stack (Styled exactly like David Yurman reference image) */}
            <div className="mt-8 sm:mt-10 space-y-3.5">
              {/* 1. CHAT WITH US (Launches WhatsApp +919000022840) */}
              <div>
                <a
                  href="https://wa.me/919000022840?text=Hello%20Navidha%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20jewelry%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full border border-black bg-white hover:bg-black hover:text-white transition-all py-3.5 sm:py-4 px-4 text-center cursor-pointer group no-underline text-[#14202e]"
                  data-testid="contact-btn-chat"
                  aria-label="Chat with Us on WhatsApp at +91 90000 22840"
                >
                  <WhatsAppIcon size={18} className="shrink-0 text-inherit transition-colors" />
                  <span className="block text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-inherit">
                    CHAT WITH US
                  </span>
                </a>
              </div>

              {/* 2. EMAIL US (Prefixed with attached email logo) */}
              <div>
                <a
                  href="mailto:navidha.pearls@gmail.com?subject=Navidha%20Jewelry%20Inquiry"
                  className="flex items-center justify-center gap-2.5 w-full border border-black bg-white hover:bg-black hover:text-white transition-all py-3.5 sm:py-4 px-4 text-center cursor-pointer group no-underline text-[#14202e]"
                  data-testid="contact-btn-email"
                  title="navidha.pearls@gmail.com"
                  aria-label="Email us at navidha.pearls@gmail.com"
                >
                  <EnquiryMailIcon size={18} className="shrink-0 text-inherit transition-colors" />
                  <span className="block text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase group-hover:text-white">
                    EMAIL US
                  </span>
                </a>
              </div>

              {/* 3. BOOK AN APPOINTMENT */}
              <div>
                <a
                  href="/consultation.html"
                  onClick={() => {
                    if (onOpenConsultation) {
                      onOpenConsultation();
                    }
                  }}
                  className="block w-full border border-black bg-white hover:bg-black hover:text-white transition-all py-3.5 sm:py-4 px-4 text-center cursor-pointer group no-underline text-[#14202e]"
                  data-testid="contact-btn-appointment"
                >
                  <span className="block text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase group-hover:text-white">
                    BOOK AN APPOINTMENT
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section: HOURS OF OPERATION */}
          <div className="mt-12 sm:mt-16 pt-6 border-t border-black/10 text-left">
            <h3
              className="text-xs sm:text-[13px] font-bold tracking-[0.1em] uppercase text-[#14202e] mb-2"
              data-testid="contact-drawer-hours-title"
            >
              HOURS OF OPERATION
            </h3>
            <p className="text-xs text-[#333333] leading-relaxed font-sans">
              Monday-Friday: 8:30AM - 7:30PM IST
            </p>
            <p className="text-xs text-[#333333] leading-relaxed font-sans mt-0.5">
              Saturday and Sunday: 9:00AM - 5:00PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
