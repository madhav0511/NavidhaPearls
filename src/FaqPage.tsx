import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Shield,
  Gem,
  Ruler,
  Truck,
  RotateCcw,
  Mail,
  MessageCircle,
  Menu,
  X,
  ExternalLink,
  Info,
  ChevronRight
} from 'lucide-react';
import { FaqSection } from './components/FaqSection';
import { BrandMark } from './components/BrandMark';
import { useScrollToTopOnMount } from './hooks/useScrollToTop';

export const FaqPage: React.FC = () => {
  useScrollToTopOnMount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSizeTab, setActiveSizeTab] = useState<'necklaces' | 'rings' | 'bracelets'>('necklaces');

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Top Banner */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block">Navidha Client Care</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Complimentary Insured Delivery Across India</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>15-Day Doorstep Returns</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          {/* Back to Boutique */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group"
              data-testid="back-to-boutique-link"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </a>
          </div>

          {/* Centered Brand Mark */}
          <div className="text-center">
            <a href="/" className="inline-flex items-center" aria-label="Navidha Home">
              <BrandMark theme="light" />
            </a>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.16em] text-[#667383]">
            <a href="#faq" className="hover:text-[#9a7a3e] transition-colors">
              Care & FAQ
            </a>
            <a href="#size-guide" className="hover:text-[#9a7a3e] transition-colors">
              Size Guide
            </a>
            <a href="/shipping-returns.html" className="hover:text-[#9a7a3e] transition-colors">
              Shipping & Returns
            </a>
            <a
              href="https://wa.me/919000022840?text=Hello%20Navidha%20Concierge%2C%20I%20have%20an%20inquiry%20regarding%20jewelry%20care."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors rounded-[2px]"
            >
              <MessageCircle size={13} />
              <span>Concierge</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#14202e]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#fbf9f5] border-b border-[#14202e]/10 px-6 py-4 space-y-3 text-xs uppercase tracking-[0.16em]">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#14202e] font-semibold"
            >
              ← Back to Shop / Collection
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#667383] hover:text-[#14202e]"
            >
              Client Care & FAQ
            </a>
            <a
              href="#size-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#667383] hover:text-[#14202e]"
            >
              Sizing & Measurement Guide
            </a>
            <a
              href="/shipping-returns.html"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#667383] hover:text-[#14202e]"
            >
              Shipping & Returns
            </a>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pt-6">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#667383]">
            <a href="/" className="hover:text-[#14202e]">Boutique</a>
            <span>/</span>
            <span className="text-[#9a7a3e]">Client Care & FAQ</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-14 sm:py-20 px-5 sm:px-8 lg:px-16 border-b border-[#14202e]/10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#9a7a3e]" />
              <p className="eyebrow text-[#9a7a3e]">
                Dedicated Client Knowledge Center
              </p>
              <Sparkles size={14} className="text-[#9a7a3e]" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14202e] font-normal tracking-[-0.02em] leading-[1.15]">
              Jewelry Care, Craftsmanship & <em className="text-[#9a7a3e] italic">Client FAQ</em>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#667383] leading-relaxed max-w-2xl mx-auto">
              Welcome to our client knowledge center. Explore complete guidance on organic freshwater pearl preservation, 925 sterling silver hallmarking, fit dimensions, bespoke sizing, and general order inquiries.
            </p>

            {/* Quick Feature Strip */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <Gem size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">Natural Pearls</h2>
                <p className="text-[11px] text-[#667383] mt-1">Sustainably harvested AAA freshwater pearls.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <Shield size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">925 Silver Hallmark</h2>
                <p className="text-[11px] text-[#667383] mt-1">Anti-tarnish coated & hypoallergenic certified.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <Truck size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">Insured Courier</h2>
                <p className="text-[11px] text-[#667383] mt-1">Delivered pan-India in 2–4 business days.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <RotateCcw size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">15-Day Returns</h2>
                <p className="text-[11px] text-[#667383] mt-1">Complimentary doorstep reverse collection.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Interactive FAQ Accordion Component */}
        <FaqSection />

        {/* Dedicated Sizing & Measurement Guide Section */}
        <section id="size-guide" className="py-20 px-5 sm:px-8 lg:px-16 border-t border-[#14202e]/10 bg-[#f4efe8]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 mb-2">
                <Ruler size={14} className="text-[#9a7a3e]" />
                <p className="eyebrow text-[#9a7a3e]">Fit & Measurement</p>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14202e]">
                Navidha <em className="text-[#9a7a3e] italic">Sizing Guide</em>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#667383] leading-relaxed">
                Ensure each piece drapes impeccably. Use our measurement references below or consult our atelier for personalized guidance.
              </p>
            </div>

            {/* Sizing Tabs */}
            <div className="flex justify-center gap-3 mb-8">
              <button
                type="button"
                onClick={() => setActiveSizeTab('necklaces')}
                className={`px-5 py-2 text-xs uppercase tracking-[0.16em] transition-colors rounded-[2px] cursor-pointer ${
                  activeSizeTab === 'necklaces'
                    ? 'bg-[#14202e] text-[#f8f1e4]'
                    : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e] border border-[#14202e]/10'
                }`}
              >
                Necklaces & Collars
              </button>
              <button
                type="button"
                onClick={() => setActiveSizeTab('rings')}
                className={`px-5 py-2 text-xs uppercase tracking-[0.16em] transition-colors rounded-[2px] cursor-pointer ${
                  activeSizeTab === 'rings'
                    ? 'bg-[#14202e] text-[#f8f1e4]'
                    : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e] border border-[#14202e]/10'
                }`}
              >
                Rings
              </button>
              <button
                type="button"
                onClick={() => setActiveSizeTab('bracelets')}
                className={`px-5 py-2 text-xs uppercase tracking-[0.16em] transition-colors rounded-[2px] cursor-pointer ${
                  activeSizeTab === 'bracelets'
                    ? 'bg-[#14202e] text-[#f8f1e4]'
                    : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e] border border-[#14202e]/10'
                }`}
              >
                Bracelets & Cuffs
              </button>
            </div>

            {/* Tab 1: Necklaces */}
            {activeSizeTab === 'necklaces' && (
              <div className="bg-[#fbf9f5] p-6 sm:p-10 border border-[#14202e]/10 rounded-[2px]">
                <h3 className="font-serif text-2xl text-[#14202e] mb-4">Necklace & Collar Lengths</h3>
                <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                  Most Navidha collars, including the <strong>Moonlit Pearl Collar</strong>, come with an integrated 2-inch extender chain allowing an adjustable fit between <strong>16 and 18 inches</strong>.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#14202e]/15 text-[#14202e] uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 font-semibold">Length (Inches)</th>
                        <th className="py-3 px-4 font-semibold">Length (cm)</th>
                        <th className="py-3 px-4 font-semibold">Placement</th>
                        <th className="py-3 px-4 font-semibold">Best Necklines</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14202e]/10 text-[#667383]">
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#14202e]">14–15 in</td>
                        <td className="py-3 px-4">35–38 cm</td>
                        <td className="py-3 px-4">Choker: Sits snug against the base of the throat</td>
                        <td className="py-3 px-4">Open collared shirts, boat necks, off-shoulder</td>
                      </tr>
                      <tr className="bg-[#f4efe8]/50">
                        <td className="py-3 px-4 font-medium text-[#14202e]">16–18 in (Standard)</td>
                        <td className="py-3 px-4">40–45 cm</td>
                        <td className="py-3 px-4">Collar/Princess: Rests elegantly across the collarbone</td>
                        <td className="py-3 px-4">Cowl necks, V-necks, scoop necks, bridal blouses</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#14202e]">20–22 in</td>
                        <td className="py-3 px-4">50–55 cm</td>
                        <td className="py-3 px-4">Matinee: Sits gracefully between collarbone & bust</td>
                        <td className="py-3 px-4">Turtlenecks, high-neck dresses, layered sets</td>
                      </tr>
                      <tr className="bg-[#f4efe8]/50">
                        <td className="py-3 px-4 font-medium text-[#14202e]">24–30 in</td>
                        <td className="py-3 px-4">60–76 cm</td>
                        <td className="py-3 px-4">Opera: Drapes mid-torso for dramatic evening presence</td>
                        <td className="py-3 px-4">Formal sarees, kaftans, plunging necklines</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Rings */}
            {activeSizeTab === 'rings' && (
              <div className="bg-[#fbf9f5] p-6 sm:p-10 border border-[#14202e]/10 rounded-[2px]">
                <h3 className="font-serif text-2xl text-[#14202e] mb-4">Ring Size Chart</h3>
                <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                  Our sculptural open-band rings feature a comfort-contour band that can be micro-adjusted by half a size. For closed-band cocktail rings, refer to standard Indian / US sizing below.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#14202e]/15 text-[#14202e] uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 font-semibold">Indian Size</th>
                        <th className="py-3 px-4 font-semibold">US Size</th>
                        <th className="py-3 px-4 font-semibold">Inner Diameter (mm)</th>
                        <th className="py-3 px-4 font-semibold">Inner Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14202e]/10 text-[#667383]">
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#14202e]">10</td>
                        <td className="py-3 px-4">5.25</td>
                        <td className="py-3 px-4">15.9 mm</td>
                        <td className="py-3 px-4">50.0 mm</td>
                      </tr>
                      <tr className="bg-[#f4efe8]/50">
                        <td className="py-3 px-4 font-medium text-[#14202e]">12</td>
                        <td className="py-3 px-4">6.0</td>
                        <td className="py-3 px-4">16.5 mm</td>
                        <td className="py-3 px-4">51.8 mm</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-[#14202e]">14</td>
                        <td className="py-3 px-4">7.0</td>
                        <td className="py-3 px-4">17.2 mm</td>
                        <td className="py-3 px-4">54.0 mm</td>
                      </tr>
                      <tr className="bg-[#f4efe8]/50">
                        <td className="py-3 px-4 font-medium text-[#14202e]">16</td>
                        <td className="py-3 px-4">7.75</td>
                        <td className="py-3 px-4">17.8 mm</td>
                        <td className="py-3 px-4">56.0 mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 p-4 bg-[#f4efe8] flex items-start gap-3 text-xs text-[#667383] rounded-[2px]">
                  <Info size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                  <p>
                    <strong>Tip:</strong> Measure finger circumference at the end of the day when fingers are at their normal temperature. If you fall between two sizes, we suggest ordering the larger size.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Bracelets */}
            {activeSizeTab === 'bracelets' && (
              <div className="bg-[#fbf9f5] p-6 sm:p-10 border border-[#14202e]/10 rounded-[2px]">
                <h3 className="font-serif text-2xl text-[#14202e] mb-4">Bracelets & Cuffs</h3>
                <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                  Navidha chain and pearl bracelets measure 6.5 inches with a 1-inch extender (fits wrists from 6.0" to 7.5"). Rigid silver cuffs are malleable to contour smoothly to your wrist.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                    <p className="text-xs font-bold text-[#14202e] uppercase tracking-wide">Small (Bangle 2.4)</p>
                    <p className="text-xs text-[#667383] mt-1">Inner Diameter: 57.2 mm / 2.25 inches. Fits wrists 5.5" to 6.2".</p>
                  </div>
                  <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                    <p className="text-xs font-bold text-[#14202e] uppercase tracking-wide">Medium (Bangle 2.6)</p>
                    <p className="text-xs text-[#667383] mt-1">Inner Diameter: 60.3 mm / 2.37 inches. Fits wrists 6.2" to 7.0".</p>
                  </div>
                  <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                    <p className="text-xs font-bold text-[#14202e] uppercase tracking-wide">Large (Bangle 2.8)</p>
                    <p className="text-xs text-[#667383] mt-1">Inner Diameter: 63.5 mm / 2.50 inches. Fits wrists 7.0" to 7.8".</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dedicated Shipping & Returns Page Callout */}
        <section className="py-14 px-5 sm:px-8 lg:px-16 border-t border-[#14202e]/10 bg-[#fbf9f5]">
          <div className="mx-auto max-w-5xl">
            <div className="p-8 sm:p-10 bg-[#f4efe8] border border-[#c8a45d]/25 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={16} className="text-[#9a7a3e]" />
                  <span className="eyebrow text-[#9a7a3e]">Order Fulfillment & Logistics</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#14202e]">
                  Looking for Shipping Timelines or Return Policies?
                </h3>
                <p className="text-xs sm:text-sm text-[#667383] mt-2 max-w-xl leading-relaxed">
                  We have moved all transit options, express courier schedules, order tracking procedures, and our 15-day return instructions to our dedicated Shipping & Returns guide.
                </p>
              </div>

              <a
                href="/shipping-returns.html"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.18em] transition-colors rounded-[2px] font-semibold"
                data-testid="go-to-shipping-page-btn"
              >
                <span>View Shipping & Returns</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#14202e]/10 bg-[#14202e] py-14 text-[#f8f1e4] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <a href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#f8f1e4]">
              Navidha
            </a>
            <p className="mt-2 text-xs text-[#b8c0c8]">
              Contemporary jewelry rooted in India's extraordinary craft traditions.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.18em] text-[#b8c0c8]">
            <a href="/" className="hover:text-[#c8a45d]">
              Collection
            </a>
            <a href="/#craft" className="hover:text-[#c8a45d]">
              Craft Traditions
            </a>
            <a href="/#philosophy" className="hover:text-[#c8a45d]">
              Our Story
            </a>
            <a href="/shipping-returns.html" className="hover:text-[#c8a45d]">
              Shipping & Returns
            </a>
            <a href="/faq.html" className="text-[#c8a45d] underline underline-offset-4">
              Client FAQ
            </a>
            <a href="/sitemap.html" className="hover:text-[#c8a45d]" data-testid="faq-footer-sitemap-link">
              Sitemap
            </a>
          </div>

          <p className="text-[10px] uppercase tracking-[0.14em] text-[#c8a45d]">
            © {new Date().getFullYear()} Navidha Atelier. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
