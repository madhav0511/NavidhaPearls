import React, { useState } from 'react';
import { BrandMark } from './BrandMark';
import { Mail, Phone, MapPin, Instagram, Sparkles } from 'lucide-react';
import { CookiePreferencesModal, CookieConsentState } from './CookiePreferencesModal';
import { CraftDetailModal } from './CraftDetailModal';
import { HERITAGE_CRAFTS, CraftStory } from '../data';

interface FooterProps {
  onCategorySelect?: (category: string) => void;
  onSelectCraft?: (craft: CraftStory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect, onSelectCraft }) => {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [internalActiveCraft, setInternalActiveCraft] = useState<CraftStory | null>(null);

  const handleCraftClick = (craftId: string) => {
    const found = HERITAGE_CRAFTS.find((c) => c.id === craftId);
    if (found) {
      if (onSelectCraft) {
        onSelectCraft(found);
      } else {
        setInternalActiveCraft(found);
      }
    }
  };

  const handleSaveCookiePreferences = (prefs: CookieConsentState) => {
    try {
      localStorage.setItem('navidha_cookie_consent', JSON.stringify(prefs));
    } catch {}
    setIsCookieModalOpen(false);
  };
  return (
    <footer
      className="border-t border-[#14202e]/10 bg-[#fbf9f5] pt-16 pb-12 px-5 sm:px-8 lg:px-16"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Brand & Introduction Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12 border-b border-[#14202e]/10">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }}
            className="flex items-center gap-4 cursor-pointer hover:opacity-85 transition-opacity"
            aria-label="Navidha Home"
            data-testid="footer-brand-link"
          >
            <BrandMark compact />
            <div>
              <span className="font-serif text-2xl tracking-[0.2em] uppercase text-[#14202e] font-light block">
                Navidha
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#9a7a3e]">
                Pearls and Jewelry
              </span>
            </div>
          </a>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 py-14 border-b border-[#14202e]/10">
          {/* Column 1: The Collections */}
          <div className="space-y-4" data-testid="footer-col-collections">
            <h3 className="font-serif text-base text-[#14202e] uppercase tracking-[0.16em] font-normal pb-2 border-b border-[#14202e]/10">
              <a
                href="#curated"
                onClick={(e) => {
                  e.preventDefault();
                  if (onCategorySelect) onCategorySelect('All');
                  const el = document.getElementById('curated') || document.getElementById('collection');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#9a7a3e] hover:underline decoration-1 underline-offset-4 transition-all block text-inherit"
                title="Explore Curated Collections"
              >
                The Collections
              </a>
            </h3>
            <ul className="space-y-2.5 text-xs text-[#667383]">
              <li>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onCategorySelect) onCategorySelect('All');
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-all-collection"
                >
                  <span>Complete House Catalogue</span>
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onCategorySelect) onCategorySelect('Necklaces');
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-necklaces"
                >
                  <span>Necklaces & Collars</span>
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onCategorySelect) onCategorySelect('Earrings');
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-earrings"
                >
                  <span>Earrings & Drops</span>
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onCategorySelect) onCategorySelect('Rings');
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-rings"
                >
                  <span>Sculptural Rings</span>
                </a>
              </li>
              <li>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onCategorySelect) onCategorySelect('Bracelets');
                    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-bracelets"
                >
                  <span>Cuffs & Bracelets</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Craft Heritage */}
          <div className="space-y-4" data-testid="footer-col-craft">
            <h3 className="font-serif text-base text-[#14202e] uppercase tracking-[0.16em] font-normal pb-2 border-b border-[#14202e]/10">
              <a
                href="#heritage"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('heritage') || document.getElementById('craft');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#9a7a3e] hover:underline decoration-1 underline-offset-4 transition-all block text-inherit"
                title="Explore Craft Heritage"
              >
                Craft Heritage
              </a>
            </h3>
            <ul className="space-y-2.5 text-xs text-[#667383]">
              <li>
                <button
                  type="button"
                  onClick={() => handleCraftClick('thewa')}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left text-inherit"
                  data-testid="footer-craft-link-thewa"
                  aria-label="View Thewa Jewelry, Pratapgarh craft card"
                >
                  Thewa Jewelry, Pratapgarh (Rajasthan)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCraftClick('meenakari')}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left text-inherit"
                  data-testid="footer-craft-link-meenakari"
                  aria-label="View Gulabi Meenakari, Varanasi craft card"
                >
                  Gulabi Meenakari, Varanasi (Uttar Pradesh)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCraftClick('karimnagar')}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left text-inherit"
                  data-testid="footer-craft-link-karimnagar"
                  aria-label="View Silver Filigree, Karimnagar craft card"
                >
                  Silver Filigree, Karimnagar (Telangana)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCraftClick('cuttack')}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left text-inherit"
                  data-testid="footer-craft-link-cuttack"
                  aria-label="View Silver Filigree, Cuttack craft card"
                >
                  Silver Filigree, Cuttack (Odisha)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCraftClick('hupari')}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left text-inherit"
                  data-testid="footer-craft-link-hupari"
                  aria-label="View Hupari Silver, Kolhapur craft card"
                >
                  Hupari Silver, Kohlapur (Maharastra)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4" data-testid="footer-col-customer-care">
            <h3 className="font-serif text-base text-[#14202e] uppercase tracking-[0.16em] font-normal pb-2 border-b border-[#14202e]/10">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-[#667383]">
              <li>
                <a
                  href="/faq.html"
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-faq"
                >
                  <span>FAQ</span>
                </a>
              </li>
              <li>
                <a
                  href="/shipping-returns.html"
                  className="hover:text-[#9a7a3e] transition-colors"
                  data-testid="footer-link-shipping-returns"
                >
                  <span>Shipping & Returns</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy.html"
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-privacy-policy"
                >
                  <span>Privacy Policy & Cookies</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsCookieModalOpen(true)}
                  className="hover:text-[#9a7a3e] transition-colors cursor-pointer text-left inline-flex items-center gap-1.5 text-inherit"
                  data-testid="footer-link-cookie-preferences"
                >
                  <span>Cookie Preferences</span>
                </button>
              </li>
              <li>
                <a
                  href="/faq.html#pearl-care"
                  className="hover:text-[#9a7a3e] transition-colors"
                  data-testid="footer-link-care-guide"
                >
                  Jewelry Care Guide
                </a>
              </li>
              <li>
                <a
                  href="/faq.html#size-guide"
                  className="hover:text-[#9a7a3e] transition-colors"
                  data-testid="footer-link-size-guide"
                >
                  Sizing & Measurement Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: About Navidha */}
          <div className="space-y-4" data-testid="footer-col-about">
            <h3 className="font-serif text-base text-[#14202e] uppercase tracking-[0.16em] font-normal pb-2 border-b border-[#14202e]/10">
              About Navidha
            </h3>
            <ul className="space-y-2.5 text-xs text-[#667383]">
              <li>
                <a
                  href="#philosophy"
                  onClick={(e) => {
                    const el = document.getElementById('philosophy');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#9a7a3e] transition-colors"
                  data-testid="footer-link-our-story"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#philosophy"
                  onClick={(e) => {
                    const el = document.getElementById('philosophy');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#9a7a3e] transition-colors"
                  data-testid="footer-link-philosophy-values"
                >
                  Philosophy & Values
                </a>
              </li>
              <li>
                <a
                  href="mailto:navidha.pearls@gmail.com?subject=Contact%20Navidha"
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5"
                  data-testid="footer-link-contact-us"
                >
                  <Mail size={12} className="text-[#9a7a3e]" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919000022840?text=Hello%20Navidha%20Concierge%2C%20I%20would%20like%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9a7a3e] transition-colors inline-flex items-center gap-1.5 text-[#9a7a3e]"
                  data-testid="footer-link-whatsapp"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="currentColor"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <span className="block text-[11px] text-[#667383]/80 pt-2">
                  Atelier: G20, Village Pointe, Road No.1, Alkapoor Township, Manikonda, Hyderabad, Telangana 500089
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667383]">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#9a7a3e]" />
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#9a7a3e]">
              Certified 925 Hallmarked Sterling Silver · Ethical Freshwater Cultivation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-[#9a7a3e]">
            <a
              href="/privacy-policy.html"
              className="hover:underline hover:text-[#14202e] transition-colors"
              data-testid="footer-bottom-privacy-link"
            >
              Privacy Policy
            </a>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsCookieModalOpen(true)}
              className="hover:underline hover:text-[#14202e] transition-colors cursor-pointer"
              data-testid="footer-bottom-cookie-settings"
            >
              Cookie Settings
            </button>
            <span>·</span>
            <p data-testid="footer-copyright">
              © {new Date().getFullYear()} Navidha Pearls & Jewelry. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
        onSave={handleSaveCookiePreferences}
      />

      {/* Craft Detail Modal Fallback */}
      {internalActiveCraft && (
        <CraftDetailModal
          story={internalActiveCraft}
          onClose={() => setInternalActiveCraft(null)}
          onExploreCollection={() => {
            setInternalActiveCraft(null);
            document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}
    </footer>
  );
};
