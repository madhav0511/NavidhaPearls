import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Search,
  ExternalLink,
  MapPin,
  Gem,
  Award,
  ShieldCheck,
  Compass,
  Layers,
  FileText,
  Calendar,
  HelpCircle,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Share2,
  FolderTree
} from 'lucide-react';
import { BrandMark } from './components/BrandMark';
import { Footer } from './components/Footer';
import { PRODUCTS, HERITAGE_CRAFTS } from './data';
import { useScrollToTopOnMount } from './hooks/useScrollToTop';

interface SitemapSection {
  title: string;
  category: string;
  icon: React.ElementType;
  description: string;
  links: {
    label: string;
    url: string;
    description?: string;
    badge?: string;
    isExternal?: boolean;
  }[];
}

export const SitemapPage: React.FC = () => {
  useScrollToTopOnMount();
  const [searchQuery, setSearchQuery] = useState('');

  const sections: SitemapSection[] = useMemo(() => [
    {
      title: 'Boutique & Catalog Discovery',
      category: 'Shop',
      icon: Gem,
      description: 'Explore the complete house archive of fine handcrafted jewelry and curated collections.',
      links: [
        { label: 'Navidha Boutique Home', url: '/', description: 'Flagship digital storefront and hero craft showcase', badge: 'Flagship' },
        { label: 'Complete House Catalogue', url: '/#collection', description: 'All handcrafted 925 sterling silver and pearl pieces' },
        { label: 'Necklaces & Collars', url: '/#collection', description: 'Chokers, Basra pearl strands, collar necklaces, and pendants' },
        { label: 'Earrings & Drops', url: '/#collection', description: 'Jhumkas, ear cuffs, drop studs, and chandelier pendants' },
        { label: 'Sculptural Rings', url: '/#collection', description: 'Mughal signet rings, navratna clusters, and band rings' },
        { label: 'Cuffs & Bracelets', url: '/#collection', description: 'Open filigree cuffs, articulated bangles, and pearl bracelets' },
        { label: 'Heritage Brooches & Sets', url: '/#collection', description: 'Statement saree pins, sherwani brooches, and bridal sets' },
        { label: 'Curated Edit / Featured Suites', url: '/#curated', description: 'Editorially highlighted bridal suites and artisan limited runs' },
      ],
    },
    {
      title: 'Heritage Craft Traditions',
      category: 'Artisan Ateliers',
      icon: Award,
      description: 'Geographical Indication (GI) tagged and centuries-old royal Indian crafts revitalized for today.',
      links: [
        { label: 'Craft Heritage Overview', url: '/#heritage', description: 'Master craftsmen, historical provenance, and regional clusters' },
        { label: 'Gulabi Meenakari, Varanasi (UP)', url: '/#heritage', description: '7-stage porcelain-pink enamel symphony and kiln vitrification', badge: 'GI Tagged' },
        { label: 'Thewa Miniature Art, Pratapgarh (RJ)', url: '/#heritage', description: '24K pure gold sheet fused onto terracotta-red Belgian glass', badge: 'GI Tagged' },
        { label: 'Silver Filigree (Tarakasi), Karimnagar (TG)', url: '/#heritage', description: 'Micro-gauge silver wire spun into feather-light lace', badge: 'GI Tagged' },
        { label: 'Silver Filigree (Tarakasi), Cuttack (OD)', url: '/#heritage', description: 'Millennia-old maritime trade technique with 999 fine silver', badge: 'GI Tagged' },
        { label: 'Hupari Silver Artistry, Kolhapur (MH)', url: '/#heritage', description: 'Seamless silver meshwork and soundless ghungroo beads', badge: 'GI Tagged' },
      ],
    },
    {
      title: 'Private Atelier & Bespoke Services',
      category: 'Concierge',
      icon: Calendar,
      description: 'Personalized jewelry curation, bridal trousseau design, and custom commissions.',
      links: [
        { label: 'Private Atelier Consultation Booking', url: '/consultation.html', description: 'Schedule an in-person or virtual design consultation', badge: 'Interactive' },
        { label: 'Custom Design Commissioning', url: '/consultation.html', description: 'Commission bespoke one-of-a-kind heirlooms from raw sketch' },
        { label: 'Bridal & Trousseau Advisory', url: '/consultation.html', description: 'Dedicated bridal jewelry styling for multi-day weddings' },
        { label: 'Restringing & Heritage Restoration', url: '/consultation.html', description: 'Silk re-knotting for vintage pearls and enameling restoration' },
      ],
    },
    {
      title: 'Client Care & Assistance',
      category: 'Help',
      icon: HelpCircle,
      description: 'Guidance on sizing, care, authentication, and client concierge access.',
      links: [
        { label: 'Client FAQ & Knowledge Base', url: '/faq.html', description: 'Frequently asked questions on orders, materials, and authenticity' },
        { label: 'Jewelry & Pearl Care Guide', url: '/faq.html#pearl-care', description: 'Maintaining freshwater pearl luster and anti-tarnish storage' },
        { label: 'Sizing & Measurement Guide', url: '/faq.html#size-guide', description: 'Ring size charts, collar lengths, and wrist measurement instructions' },
        { label: 'Hallmarking & Certification', url: '/faq.html#materials', description: 'BIS 925 hallmarked silver and gemological certifications' },
      ],
    },
    {
      title: 'Orders, Shipping & Returns',
      category: 'Fulfillment',
      icon: Truck,
      description: 'Policies on worldwide insured delivery, doorstep exchanges, and fulfillment timelines.',
      links: [
        { label: 'Shipping & Delivery Policy', url: '/shipping-returns.html', description: 'Domestic express delivery and international FedEx transit times' },
        { label: '15-Day Doorstep Returns & Exchanges', url: '/shipping-returns.html#returns-policy', description: 'Complimentary return pickups and refund conditions' },
        { label: 'Consignment & Parcel Tracking', url: '/shipping-returns.html#track-shipment', description: 'Track your live order dispatch status and airway bills' },
        { label: 'Worldwide Shipping Destinations', url: '/shipping-returns.html', description: 'Customs clearance, duties, and global client coverage' },
      ],
    },
    {
      title: 'Legal, Privacy & Standards',
      category: 'Policies',
      icon: ShieldCheck,
      description: 'Regulatory compliance, customer data privacy, and ethical jewelry sourcing commitments.',
      links: [
        { label: 'Privacy Policy & Data Rights', url: '/privacy-policy.html', description: 'Collection, protection, and statutory rights under DPDP & GDPR' },
        { label: 'Cookie Policy & Consent Settings', url: '/privacy-policy.html#cookies', description: 'Manage analytics, personalization, and essential cookies' },
        { label: 'Machine-Readable XML Sitemap', url: '/sitemap.xml', description: 'Structured XML sitemap for search engine crawlers', isExternal: true },
        { label: 'Atelier Ethical Charter', url: '/#philosophy', description: 'Fair artisan compensation and conflict-free metal sourcing' },
      ],
    },
  ], []);

  // Filter sections and links based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase().trim();

    return sections
      .map((sec) => {
        const matchesSection =
          sec.title.toLowerCase().includes(q) ||
          sec.category.toLowerCase().includes(q) ||
          sec.description.toLowerCase().includes(q);

        const matchedLinks = sec.links.filter(
          (l) =>
            l.label.toLowerCase().includes(q) ||
            (l.description && l.description.toLowerCase().includes(q))
        );

        if (matchesSection) return sec;
        if (matchedLinks.length > 0) {
          return { ...sec, links: matchedLinks };
        }
        return null;
      })
      .filter(Boolean) as SitemapSection[];
  }, [sections, searchQuery]);

  // Product links list
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS;
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalLinkCount = sections.reduce((acc, s) => acc + s.links.length, 0) + PRODUCTS.length;

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Top Notice Banner */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block">Navidha Directory</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Comprehensive House Directory & Architectural Index</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Certified Indian GI Craft Portals</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group font-semibold"
              data-testid="sitemap-return-link"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </a>
          </div>

          <a href="/" className="flex items-center cursor-pointer" aria-label="Navidha Home">
            <BrandMark theme="light" />
          </a>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="/consultation.html"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-[10px] uppercase tracking-[0.18em] transition-colors rounded-[2px] font-semibold"
            >
              <Calendar size={12} />
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#f0ebe3]/50 border-b border-[#14202e]/5 py-3 px-5 sm:px-8 lg:px-16 text-xs text-[#667383]">
        <div className="mx-auto max-w-[1440px] flex items-center gap-2">
          <a href="/" className="hover:text-[#14202e] transition-colors">Home</a>
          <ChevronRight size={12} className="text-[#9a7a3e]" />
          <span className="text-[#14202e] font-medium">Sitemap</span>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 py-12 sm:py-16 w-full">
        {/* Hero Title Section */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <FolderTree size={16} className="text-[#9a7a3e]" />
            <span className="eyebrow text-[#9a7a3e]">Architectural Index</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#14202e] leading-tight mb-4">
            House Sitemap &amp; Navigation Index
          </h1>
          <p className="text-sm sm:text-base text-[#667383] leading-relaxed">
            Welcome to the comprehensive directory of Navidha Pearls &amp; Jewelry. Access all digital boutique salons, GI-certified craft documentation, bespoke consultation services, client care manuals, and legal policies.
          </p>
        </div>

        {/* Search & Statistics Bar */}
        <div className="mb-12 p-6 bg-white border border-[#14202e]/10 rounded-[2px] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a7a3e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index by page, craft, category, or policy..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] placeholder-[#999999] focus:outline-none focus:border-[#9a7a3e] transition-colors"
                aria-label="Search sitemap directory"
                data-testid="sitemap-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#667383] hover:text-[#14202e] uppercase font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#667383]">
              <div className="flex items-center gap-1.5">
                <Compass size={14} className="text-[#9a7a3e]" />
                <span><strong>6</strong> Core Portals</span>
              </div>
              <span className="text-[#14202e]/20">·</span>
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-[#9a7a3e]" />
                <span><strong>5</strong> GI Craft Ateliers</span>
              </div>
              <span className="text-[#14202e]/20">·</span>
              <div className="flex items-center gap-1.5">
                <Gem size={14} className="text-[#9a7a3e]" />
                <span><strong>{PRODUCTS.length}</strong> Fine Catalog Pieces</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Portal Jump Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
          <a
            href="/"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <Gem size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Boutique</span>
            <span className="text-[9px] text-[#888888]">Main Salon</span>
          </a>

          <a
            href="/#heritage"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <Award size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Crafts</span>
            <span className="text-[9px] text-[#888888]">5 GI Ateliers</span>
          </a>

          <a
            href="/consultation.html"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <Calendar size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Bespoke</span>
            <span className="text-[9px] text-[#888888]">Appointments</span>
          </a>

          <a
            href="/faq.html"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <HelpCircle size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Client Care</span>
            <span className="text-[9px] text-[#888888]">FAQ &amp; Sizing</span>
          </a>

          <a
            href="/shipping-returns.html"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <Truck size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Delivery</span>
            <span className="text-[9px] text-[#888888]">15-Day Returns</span>
          </a>

          <a
            href="/privacy-policy.html"
            className="p-4 bg-white border border-[#14202e]/10 hover:border-[#9a7a3e] hover:shadow-xs transition-all text-center rounded-[2px] group"
          >
            <ShieldCheck size={18} className="mx-auto text-[#9a7a3e] mb-2 group-hover:scale-110 transition-transform" />
            <span className="block text-[11px] font-semibold text-[#14202e] uppercase tracking-wider">Privacy</span>
            <span className="text-[9px] text-[#888888]">Compliance</span>
          </a>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#14202e]/10 p-6 sm:p-7 rounded-[2px] flex flex-col justify-between hover:border-[#9a7a3e]/50 transition-colors shadow-xs"
                data-testid={`sitemap-section-${idx}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#14202e]/10">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#fbf9f5] border border-[#14202e]/10 rounded-xs text-[#9a7a3e]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg text-[#14202e] font-medium leading-snug">
                          {section.title}
                        </h2>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#9a7a3e]">
                          {section.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#667383] mb-5 leading-relaxed">
                    {section.description}
                  </p>

                  <ul className="space-y-3">
                    {section.links.map((link, lIdx) => (
                      <li key={lIdx} className="group">
                        <a
                          href={link.url}
                          target={link.isExternal ? '_blank' : undefined}
                          rel={link.isExternal ? 'noopener noreferrer' : undefined}
                          className="flex items-start justify-between gap-2 text-xs text-[#14202e] hover:text-[#9a7a3e] transition-colors"
                        >
                          <div className="flex-1">
                            <span className="font-medium underline decoration-transparent group-hover:decoration-[#9a7a3e] underline-offset-4 transition-all inline-flex items-center gap-1.5">
                              {link.label}
                              {link.isExternal && <ExternalLink size={10} className="text-[#9a7a3e]" />}
                            </span>
                            {link.description && (
                              <p className="text-[11px] text-[#77808a] mt-0.5 leading-normal">
                                {link.description}
                              </p>
                            )}
                          </div>
                          {link.badge && (
                            <span className="shrink-0 text-[8.5px] uppercase tracking-wider px-1.5 py-0.5 bg-[#fbf9f5] border border-[#14202e]/15 text-[#9a7a3e] font-semibold rounded-xs">
                              {link.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catalog Deep-Link Directory */}
        <section className="mb-16 bg-white border border-[#14202e]/10 p-6 sm:p-10 rounded-[2px] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#14202e]/10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Gem size={14} className="text-[#9a7a3e]" />
                <span className="eyebrow text-[#9a7a3e]">Catalog Index</span>
              </div>
              <h2 className="font-serif text-2xl text-[#14202e]">
                Individual Fine Jewelry Pieces ({filteredProducts.length})
              </h2>
            </div>
            <p className="text-xs text-[#667383] max-w-md">
              Every creation is hallmarked 925 sterling silver, set with ethically cultivated pearls and hand-enameled by traditional Indian guilds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {filteredProducts.map((product) => (
              <a
                key={product.id}
                href="/#collection"
                className="flex items-start justify-between gap-3 py-2.5 border-b border-[#14202e]/5 hover:border-[#9a7a3e] hover:bg-[#fbf9f5]/50 px-2 rounded-xs transition-all group"
              >
                <div>
                  <span className="text-xs font-medium text-[#14202e] group-hover:text-[#9a7a3e] transition-colors block">
                    {product.name}
                  </span>
                  <span className="text-[10px] text-[#77808a]">
                    {product.category} · {product.material}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#14202e] shrink-0 font-serif">
                  {product.price}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Machine-Readable & Webmaster Resources */}
        <section className="bg-[#14202e] text-[#f8f1e4] p-8 sm:p-10 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c8a45d] block mb-2 font-semibold">
              Search Engines &amp; Crawler Index
            </span>
            <h3 className="font-serif text-2xl text-[#f8f1e4] mb-2">
              XML Protocol &amp; Machine-Readable Sitemap
            </h3>
            <p className="text-xs text-[#b8c0c8] leading-relaxed">
              For search bots, web crawlers, and automated indexers, an XML-compliant protocol sitemap is published at the server root following the official Sitemaps.org schema.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8a45d] hover:bg-[#d8b56f] text-[#14202e] text-xs uppercase tracking-[0.18em] font-bold rounded-[2px] transition-colors"
            >
              <span>View sitemap.xml</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white text-[#f8f1e4] text-xs uppercase tracking-[0.18em] rounded-[2px] transition-colors"
            >
              <span>Return to Boutique</span>
            </a>
          </div>
        </section>
      </main>

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
};
