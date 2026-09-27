import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Sparkles,
  Search,
  Shield,
  Gem,
  Ruler,
  Gift,
  HelpCircle,
  MessageCircle,
  Mail,
  Check
} from 'lucide-react';

export type FaqCategory = 'all' | 'care' | 'materials' | 'sizing' | 'gifting';

interface FaqItem {
  id: string;
  category: 'care' | 'materials' | 'sizing' | 'gifting';
  question: string;
  answer: string;
  keyPoints?: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'pearl-care',
    category: 'care',
    question: 'How should I clean and preserve my freshwater pearls?',
    answer:
      'Pearls are organic gems with a delicate, luminous nacre that breathes. Always remember the golden rule of pearl care: "Last on, first off." Put your jewelry on after applying perfumes, hairsprays, and cosmetics to prevent chemical dulling. After wearing, gently wipe each pearl with the complimentary Navidha microfiber cloth to remove skin oils.',
    keyPoints: [
      'Store flat in the velvet-lined keepsake case away from sharp metal edges.',
      'Never soak pearls in water or expose them to ultrasonic cleaners.',
      'Wipe with a soft damp cloth only if needed; avoid detergents and harsh solvents.'
    ]
  },
  {
    id: 'silver-tarnish',
    category: 'care',
    question: 'Will 925 sterling silver tarnish over time, and how do I prevent it?',
    answer:
      'Sterling silver naturally interacts with ambient humidity and sulfur compounds over time. All Navidha silver creations are treated with an atelier-grade anti-tarnish protective micron barrier. Wearing your silver jewelry frequently actually helps prevent patina from forming due to natural friction.',
    keyPoints: [
      'Keep pieces sealed in the anti-tarnish zip pouch inside your keepsake case when not in use.',
      'Avoid storing in humid bathrooms or direct sunlight.',
      'Use the included jeweler polish cloth to effortlessly restore brilliant mirror luster.'
    ]
  },
  {
    id: 'water-exercise',
    category: 'care',
    question: 'Can I wear my Navidha jewelry in the shower, swimming pool, or while exercising?',
    answer:
      'We strongly recommend removing your jewelry prior to bathing, swimming, saunas, and intense workouts. Chlorinated pool water, sea salt, soaps, and perspiration can erode the natural luster of freshwater pearls, weaken knotting silks, and accelerate silver oxidation.',
    keyPoints: [
      'Chlorine and bromine in pools cause irreversible surface damage.',
      'Soaps create a cloudy film over precious stones and pearls.',
      'Dry thoroughly with a soft cloth if accidental contact occurs.'
    ]
  },
  {
    id: 'pearl-sourcing',
    category: 'materials',
    question: 'Where are your freshwater pearls sourced and how is their quality graded?',
    answer:
      'Our pearls are ethically cultivated in sustainable freshwater sanctuaries known for pure, nutrient-rich waters. Master gemologists hand-select each pearl according to strict criteria: deep nacre thickness, high spherical symmetry, and a rich, iridescent overtone. We reject industrial chemical bleaching, honoring the organic color and natural character of each harvest.',
    keyPoints: [
      'AAA-grade freshwater pearls with mirror-like orient and natural iridescence.',
      'Cruelty-free, sustainable aquaculture practices.',
      'No artificial dyeing or synthetic coating.'
    ]
  },
  {
    id: 'silver-hallmarking',
    category: 'materials',
    question: 'Are all metals certified, nickel-free, and hallmarked?',
    answer:
      'Yes. Every piece is cast from certified 92.5% pure sterling silver and stamped with the official 925 hallmark. Our alloys are strictly 100% hypoallergenic, nickel-free, and lead-free, ensuring comfort for sensitive skin. Each shipment includes an official Navidha Certificate of Authenticity certifying precious metal purity.',
    keyPoints: [
      '925 Bureau of Indian Standards (BIS) compliant hallmarking.',
      'Hypoallergenic and nickel-safe for sensitive skin.',
      'Accompanied by an individual Certificate of Authenticity.'
    ]
  },
  {
    id: 'thewa-heritage',
    category: 'materials',
    question: 'What is the heritage behind your Thewa and Meenakari craft techniques?',
    answer:
      'Thewa is a rare, 400-year-old Rajasthani art form originating in Pratapgarh, involving the intricate fusion of hand-engraved 24-karat pure gold leaf onto kiln-fired terracotta glass. Our collection bridges this heritage with modern sculptural silhouettes, supporting multigenerational artisan families with fair wages and verified master craftsmanship.',
    keyPoints: [
      'Real 24K gold filigree fused on hand-melted royal glass.',
      'Direct artisan patronage preserving royal guild traditions.',
      'Protected under Geographical Indication (GI) heritage parameters.'
    ]
  },
  {
    id: 'necklace-sizing',
    category: 'sizing',
    question: 'How do I choose the right necklace or collar length?',
    answer:
      'Our pieces are engineered for versatile styling across varied necklines. The Moonlit Pearl Collar and standard necklaces feature a 16-inch base with an integrated 2-inch silver extender chain (adjustable from 16 to 18 inches). Chokers sit comfortably above the clavicle, while collars rest gracefully along the collarbone.',
    keyPoints: [
      'Detailed inner circumference and drop dimensions listed on every product page.',
      'Adjustable 16"–18" extender clasps allow seamless layering.',
      'Atelier concierge available for personalized fit guidance.'
    ]
  },
  {
    id: 'ring-bracelet-sizing',
    category: 'sizing',
    question: 'Are rings and bracelets adjustable, and what sizes do you offer?',
    answer:
      'Selected rings are designed with an open architectural band that can be micro-adjusted by half a size for effortless comfort. Rigid cuffs and bangles are crafted to standard Indian sizing (2.4, 2.6, 2.8) with secure hinge closures. Flexible pearl bracelets include extension links to accommodate wrist sizes from 6 to 7.5 inches.',
    keyPoints: [
      'Downloadable or concierge-assisted size guide available on request.',
      'Complimentary size exchange within 15 days if the fit is not ideal.',
      'Custom sizing requests accommodated before atelier dispatch.'
    ]
  },
  {
    id: 'gift-packaging',
    category: 'gifting',
    question: 'How does the jewelry arrive? Is it ready for gifting?',
    answer:
      'Every order is packaged with couture-level attention to detail. Your piece arrives nestled inside our custom midnight-navy and ivory velvet-lined keepsake box, secured with an embossed grosgrain ribbon. The parcel includes a polishing cloth, product passport, and care booklet. Outbound courier parcels are discreetly boxed with no external branding for security and surprise.',
    keyPoints: [
      'Couture presentation box ready for gifting without extra wrapping.',
      'Tamper-evident, unbranded outer courier parcel.',
      'Complimentary handwritten gift card upon request.'
    ]
  },
  {
    id: 'custom-notes',
    category: 'gifting',
    question: 'Can I include a personalized gift message or request bespoke customization?',
    answer:
      'Yes. You can add a personalized gift note at checkout or by connecting with our concierge team immediately after ordering. Your message will be hand-inscribed with archival ink on our gilded ivory stationery. For bespoke chain adjustments or anniversary engravings, contact our atelier before dispatch.',
    keyPoints: [
      'Handwritten gift calligraphy included at zero additional charge.',
      'Prices and invoices withheld from gift recipient packaging.',
      'Dedicated atelier concierge to coordinate surprise deliveries.'
    ]
  },
  {
    id: 'payment-methods',
    category: 'gifting',
    question: 'What payment methods do you accept, and are transactions secure?',
    answer:
      'We accept all major domestic and international credit cards (Visa, MasterCard, American Express), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pin codes across India up to ₹15,000. All checkout data is encrypted using banking-grade 256-bit SSL protocols.',
    keyPoints: [
      'Encrypted 256-bit SSL payment processing.',
      'UPI, Credit/Debit cards, Net Banking & COD accepted.',
      'GST tax invoices automatically issued for all purchases.'
    ]
  },
  {
    id: 'certificate-authenticity',
    category: 'materials',
    question: 'Does each jewelry creation come with a Certificate of Authenticity?',
    answer:
      'Every Navidha jewel is accompanied by an individual physical Certificate of Authenticity specifying the exact 925 sterling silver purity, gemstone/pearl specifications, hallmark batch ID, and our atelier seal of excellence.',
    keyPoints: [
      'Physical Certificate of Authenticity included in every box.',
      'Individually serialized batch authentication numbers.',
      'Recognized hallmarking adhering to BIS standards.'
    ]
  }
];

export const FaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'pearl-care': true,
    'pearl-sourcing': true
  });

  // Filter items based on active category and search input
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.keyPoints &&
          item.keyPoints.some((pt) => pt.toLowerCase().includes(query)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    filteredFaqs.forEach((faq) => {
      allExpanded[faq.id] = true;
    });
    setExpandedIds(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedIds({});
  };

  const categories: { key: FaqCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Questions', icon: <HelpCircle size={14} /> },
    { key: 'care', label: 'Jewelry Care', icon: <Shield size={14} /> },
    { key: 'materials', label: 'Materials & Craft', icon: <Gem size={14} /> },
    { key: 'sizing', label: 'Sizing & Fit', icon: <Ruler size={14} /> },
    { key: 'gifting', label: 'Gifting & Packaging', icon: <Gift size={14} /> }
  ];

  return (
    <section
      id="faq"
      className="border-t border-[#14202e]/10 bg-[#fbf9f5] py-20 px-5 sm:px-8 lg:px-16"
      data-testid="faq-section"
      aria-labelledby="faq-main-heading"
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <Sparkles size={13} className="text-[#9a7a3e]" />
            <p className="eyebrow text-[#9a7a3e]" data-testid="faq-eyebrow">
              Transparency & Knowledge
            </p>
            <Sparkles size={13} className="text-[#9a7a3e]" />
          </div>

          <h2
            id="faq-main-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#14202e] font-normal tracking-[-0.02em]"
            data-testid="faq-title"
          >
            Client Guide & <em className="text-[#9a7a3e] italic">Questions</em>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[#667383] leading-relaxed">
            Everything you need to know about caring for organic freshwater pearls, hallmarked precious metals, heritage techniques, and bespoke sizing.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667383]/60"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search care, silver tarnish, pearl origin, ring sizing..."
              aria-label="Search questions"
              className="h-11 w-full bg-[#f4efe8] border border-[#14202e]/15 pl-11 pr-4 text-xs sm:text-sm text-[#14202e] placeholder:text-[#667383]/60 outline-none transition-colors focus:border-[#9a7a3e] focus:bg-[#fbf9f5] rounded-[2px]"
              data-testid="faq-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#667383] hover:text-[#14202e] px-1"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#14202e] bg-[#f0ebe3] hover:bg-[#e4ddcf] transition-colors rounded-[2px] cursor-pointer"
              data-testid="faq-expand-all-btn"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#667383] hover:text-[#14202e] bg-[#f0ebe3] hover:bg-[#e4ddcf] transition-colors rounded-[2px] cursor-pointer"
              data-testid="faq-collapse-all-btn"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div
          className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#14202e]/10 mb-8"
          role="tablist"
          aria-label="FAQ categories"
          data-testid="faq-category-filters"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs tracking-wide transition-all rounded-[2px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#14202e] text-[#f8f1e4] shadow-xs'
                    : 'bg-[#f4efe8] text-[#667383] hover:bg-[#eae3d8] hover:text-[#14202e]'
                }`}
                data-testid={`faq-category-tab-${cat.key}`}
              >
                <span className={isSelected ? 'text-[#c8a45d]' : 'text-[#667383]'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-4" data-testid="faq-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-[#f4efe8] border border-[#14202e]/10 p-8 rounded-[2px]">
              <HelpCircle size={28} className="mx-auto text-[#9a7a3e] mb-3" />
              <p className="font-serif text-lg text-[#14202e]">No questions found</p>
              <p className="text-xs text-[#667383] mt-1 max-w-sm mx-auto">
                We couldn't find matches for "{searchQuery}". Our concierge is always available to answer any inquiry directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = Boolean(expandedIds[faq.id]);
              const contentId = `faq-content-${faq.id}`;
              const headingId = `faq-header-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className={`border transition-all duration-200 bg-[#fbf9f5] rounded-[2px] overflow-hidden ${
                    isOpen
                      ? 'border-[#c8a45d]/60 shadow-xs'
                      : 'border-[#14202e]/10 hover:border-[#14202e]/30'
                  }`}
                  data-testid={`faq-item-${faq.id}`}
                >
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors hover:bg-[#f8f4ed]"
                    data-testid={`faq-toggle-${faq.id}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-sans text-[11px] text-[#9a7a3e] font-semibold w-5 shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-base sm:text-lg text-[#14202e] font-normal leading-snug">
                        {faq.question}
                      </span>
                    </span>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 border-[#c8a45d] bg-[#c8a45d] text-[#14202e]'
                          : 'border-[#14202e]/20 text-[#667383]'
                      }`}
                    >
                      <ChevronDown size={15} />
                    </span>
                  </button>

                  {/* Collapsible Content */}
                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-5 pb-6 pt-1 sm:px-6 sm:pb-7 text-[#667383] text-xs sm:text-sm leading-relaxed border-t border-[#14202e]/5 animate-in fade-in duration-200"
                      data-testid={`faq-answer-${faq.id}`}
                    >
                      <p className="max-w-3xl text-[#14202e]/85">{faq.answer}</p>

                      {faq.keyPoints && faq.keyPoints.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#14202e]/5">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] font-semibold mb-2">
                            Key Recommendations & Assurance
                          </p>
                          <ul className="space-y-1.5">
                            {faq.keyPoints.map((point, ptIdx) => (
                              <li key={ptIdx} className="flex items-start gap-2 text-xs text-[#667383]">
                                <Check size={14} className="text-[#9a7a3e] mt-0.5 shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Concierge Assistance Card */}
        <div className="mt-14 p-6 sm:p-8 bg-[#101a26] text-[#f8f1e4] rounded-[2px] border border-[#c8a45d]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-[#c8a45d]" />
              <span className="eyebrow text-[#c8a45d] text-[10px] tracking-[0.2em]">
                Private Atelier Consultation
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#f8f1e4]">
              Have a question about a specific piece?
            </h3>
            <p className="text-xs text-[#b8c0c8] mt-2 max-w-lg leading-relaxed">
              Our jewelry specialists are pleased to share bespoke size recommendations, styling pairings, and custom gift arrangements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href="mailto:concierge@navidha.com?subject=Navidha%20Jewelry%20Inquiry"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-xs tracking-wider uppercase text-[#f8f1e4] transition-colors rounded-[2px]"
              data-testid="faq-email-concierge-link"
            >
              <Mail size={14} className="text-[#c8a45d]" />
              <span>Email Atelier</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hello%20Navidha%2C%20I%20would%20like%20guidance%20on%20a%20jewelry%20piece."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c8a45d] hover:bg-[#e4c47d] text-[#14202e] text-xs font-semibold tracking-wider uppercase transition-colors rounded-[2px]"
              data-testid="faq-whatsapp-concierge-link"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
