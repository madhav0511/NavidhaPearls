import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Gem,
  Award,
  Globe,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  Product,
  CraftStory,
  CartItem,
  PRODUCTS,
  HERITAGE_CRAFTS,
  CATEGORIES,
  MATERIALS,
  HERO_PORTRAIT,
  PHILOSOPHY_PORTRAIT
} from './data';
import { BrandMark } from './components/BrandMark';
import { LaunchPopup } from './components/LaunchPopup';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CraftCard } from './components/CraftCard';
import { CraftDetailModal } from './components/CraftDetailModal';
import { CampaignGalleryModal } from './components/CampaignGalleryModal';
import { CartDrawer } from './components/CartDrawer';
import { NewsletterSubscription } from './components/NewsletterSubscription';
import { Footer } from './components/Footer';
import { FaqPage } from './FaqPage';
import { ShippingReturnsPage } from './ShippingReturnsPage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { CookieBanner } from './components/CookieBanner';
import { ShippingCountryModal, SUPPORTED_COUNTRIES, ShippingCountry } from './components/ShippingCountryModal';
import { ContactDrawer } from './components/ContactDrawer';
import { ConsultationPage } from './ConsultationPage';
import { FloatingWhatsAppChat } from './components/FloatingWhatsAppChat';
import { GulabiMeenakariHero } from './components/GulabiMeenakariHero';
import { GlobeGridIcon, ChatBubbleIcon, CustomDesignMenuIcon } from './components/TopBarIcons';
import { ToastProvider, useToast } from './components/Toast';
import { useScrollToTopOnMount } from './hooks/useScrollToTop';

function Storefront() {
  const { showToast } = useToast();

  // Guarantee viewport strictly anchors to Hero section (top 0, 0) on load/reload/navigation
  useScrollToTopOnMount();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All materials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeCraft, setActiveCraft] = useState<CraftStory | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showLaunchPopup, setShowLaunchPopup] = useState<boolean>(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState<boolean>(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<ShippingCountry>(() => {
    try {
      const savedCode = localStorage.getItem('navidha_shipping_country');
      if (savedCode) {
        const found = SUPPORTED_COUNTRIES.find((c) => c.code === savedCode);
        if (found) return found;
      }
    } catch {}
    return SUPPORTED_COUNTRIES[0];
  });

  useEffect(() => {
    try {
      const seen = localStorage.getItem('navidha_country_prompt_seen');
      if (!seen) {
        const timer = setTimeout(() => {
          setIsCountryModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchMaterial = selectedMaterial === 'All materials' || product.material === selectedMaterial;
      const matchQuery = !q || `${product.name} ${product.category} ${product.material} ${product.description}`.toLowerCase().includes(q);
      return matchCategory && matchMaterial && matchQuery;
    })].sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
    });
  }, [selectedCategory, selectedMaterial, searchQuery, sortOption]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    showToast(
      `${product.name} added to your bag`,
      'A considered piece, reserved for your edit.'
    );
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems((prev) => {
      if (newQuantity < 1) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const scrollToCollection = () => {
    const el = document.getElementById('curated') || document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    }, 400);
  };

  const scrollToHeritage = () => {
    const el = document.getElementById('heritage') || document.getElementById('craft');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCurated = scrollToCollection;
  const scrollToCraft = scrollToHeritage;

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e]" data-testid="navidha-storefront">
      {/* Launch announcement popup (accessible anytime via announcement bar) */}
      <LaunchPopup
        isOpen={showLaunchPopup}
        onClose={() => setShowLaunchPopup(false)}
        onExplore={() => {
          setShowLaunchPopup(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
      />

      {/* Top Announcement Bar */}
      <div
        className="announcement-bar flex items-center justify-between px-3 sm:px-6 lg:px-8 text-[9px] sm:text-[9.5px] tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#14202e]"
        data-testid="announcement-bar"
      >
        {/* Left: Globe Logo and Country Name as "INDIA" (static, no popup window link) */}
        <div className="flex items-center gap-1.5 shrink-0 select-none text-[#14202e]" data-testid="announcement-country-india">
          <GlobeGridIcon size={14} color="#14202e" className="shrink-0" />
          <span className="text-[#14202e] font-bold tracking-[0.18em]">INDIA</span>
        </div>

        {/* Middle: "Complementary Insured Shipping Across India" (no popup link, solid dark navy blue) */}
        <div
          className="text-center font-bold tracking-[0.12em] sm:tracking-[0.16em] px-2 truncate select-none text-[#14202e]"
          data-testid="announcement-middle-shipping"
        >
          <span className="text-[#14202e] font-bold">Complementary Insured Shipping Across India</span>
        </div>

        {/* Right Side: "Custom Design Consultation" & "Contact Us" */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 text-[#14202e]" data-testid="announcement-right-links">
          <a
            href="/consultation.html#/services"
            className="hidden md:inline-flex items-center gap-1.5 text-[#14202e] hover:opacity-75 transition-opacity cursor-pointer tracking-[0.12em] sm:tracking-[0.14em] font-bold"
            data-testid="announcement-consultation-link"
            title="Book Custom Design Consultation"
          >
            <CustomDesignMenuIcon size={18} color="#14202e" className="shrink-0 w-[18px] h-[18px]" />
            <span>Custom Design Consultation</span>
          </a>
          <span className="hidden md:inline text-[#14202e]/30 text-[10px]">|</span>
          <button
            type="button"
            onClick={() => setIsContactDrawerOpen(true)}
            className="text-[#14202e] hover:opacity-75 transition-opacity cursor-pointer font-bold tracking-[0.14em] sm:tracking-[0.16em] inline-flex items-center gap-1.5 uppercase"
            data-testid="announcement-contact-btn"
            aria-label="Open Contact Us sidebar"
          >
            <ChatBubbleIcon size={12} color="#14202e" className="shrink-0" />
            <span className="text-[#14202e] font-bold uppercase">CONTACT US</span>
          </button>
        </div>
      </div>

      {/* Sticky Header / Navbar */}
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#14202e]/95 text-[#f8f1e4] backdrop-blur-md"
        data-testid="navbar"
      >
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
            }}
            aria-label="Navidha home"
            data-testid="navbar-home-link"
          >
            <BrandMark />
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
            data-testid="desktop-navigation"
          >
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="nav-link"
              data-testid="navbar-collection-link"
            >
              The collection
            </a>
            <a
              href="#craft"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="nav-link"
              data-testid="navbar-craft-link"
            >
              Craft heritage
            </a>
            <a
              href="#philosophy"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="nav-link"
              data-testid="navbar-philosophy-link"
            >
              Our philosophy
            </a>
            <button
              type="button"
              onClick={() => setIsCampaignOpen(true)}
              className="nav-link cursor-pointer"
              data-testid="navbar-campaign-button"
            >
              Campaign
            </button>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="hidden text-[#c8a45d] transition-colors hover:text-[#f8f1e4] sm:block cursor-pointer"
              aria-label="Search the collection"
              onClick={scrollToCollection}
              data-testid="navbar-search-button"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-[#c8a45d] cursor-pointer"
              aria-label={`Open shopping bag with ${totalCartCount} items`}
              data-testid="navbar-cart-button"
            >
              <span className="hidden sm:inline">Bag</span>
              <span
                className="grid h-7 min-w-7 place-items-center rounded-full border border-[#c8a45d]/50 px-1 text-[10px] text-[#c8a45d]"
                data-testid="navbar-cart-count"
              >
                {totalCartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center lg:hidden cursor-pointer"
              aria-label="Toggle navigation"
              data-testid="navbar-mobile-menu-button"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav
            className="border-t border-white/10 bg-[#14202e] px-5 py-5 lg:hidden"
            aria-label="Mobile navigation"
            data-testid="mobile-navigation"
          >
            <div className="flex flex-col items-start gap-4">
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="nav-link"
                data-testid="mobile-collection-link"
              >
                The collection
              </a>
              <a
                href="#craft"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="nav-link"
                data-testid="mobile-craft-link"
              >
                Craft heritage
              </a>
              <a
                href="#philosophy"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="nav-link"
                data-testid="mobile-philosophy-link"
              >
                Our philosophy
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCampaignOpen(true);
                }}
                className="nav-link text-left"
                data-testid="mobile-campaign-button"
              >
                Campaign
              </button>
              <div className="w-full pt-3 mt-2 border-t border-white/10 flex flex-col gap-3">
                <a
                  href="/consultation.html"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="nav-link text-[#c8a45d] text-left"
                  data-testid="mobile-consultation-link"
                >
                  Custom Design Consultation
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsContactDrawerOpen(true);
                  }}
                  className="nav-link text-left uppercase text-xs tracking-wider"
                  data-testid="mobile-contact-btn"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main id="top">
        {/* Gulabi Meenakari 7-Stage Interactive Luxury Hero Section */}
        <GulabiMeenakariHero
          onExploreCollection={scrollToCollection}
          onExploreHeritage={scrollToHeritage}
        />

        {/* Manifesto Section */}
        <section
          className="border-b border-[#14202e]/10 bg-[#fbf9f5] px-5 py-14 sm:px-8 lg:px-16"
          data-testid="manifesto-section"
        >
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.1fr_1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-[#9a7a3e]" data-testid="manifesto-eyebrow">
                A quieter kind of luxury
              </p>
              <h2
                className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl"
                data-testid="manifesto-title"
              >
                Made for the moments that become <em className="text-[#9a7a3e]">yours.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#667383]" data-testid="manifesto-copy">
              Navidha brings together India's extraordinary jewelry traditions and contemporary design — pieces chosen for their character, made to gather meaning with you.
            </p>
            <div className="flex items-center gap-4 lg:justify-end" data-testid="manifesto-materials">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[#c8a45d]/40 text-[#c8a45d]">
                <Gem size={20} strokeWidth={1.2} />
              </div>
              <div>
                <p className="font-serif text-xl">Gold. Silver. Pearl.</p>
                <p className="text-xs text-[#667383]">Every piece has a story.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Craft Section */}
        <section id="craft" className="section-shell bg-[#f0ebe3] scroll-mt-20 relative" data-testid="heritage-craft-section">
          <div id="heritage" className="absolute -top-24 pointer-events-none" />
          <div className="section-heading">
            <div>
              <p className="eyebrow text-[#9a7a3e]" data-testid="craft-eyebrow">
                <a
                  href="#heritage"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeritage();
                  }}
                  className="hover:underline hover:opacity-80 transition-all cursor-pointer underline-offset-4"
                  data-testid="link-heritage-header"
                >
                  Heritage
                </a>
                <span className="text-[#9a7a3e]/60">, </span>
                <a
                  href="#curated"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCurated();
                  }}
                  className="hover:underline hover:opacity-80 transition-all cursor-pointer underline-offset-4"
                  data-testid="link-curated-header"
                >
                  curated
                </a>
              </p>
              <h2 className="section-title" data-testid="craft-title">
                <a
                  href="#heritage"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeritage();
                  }}
                  className="group inline-block transition-opacity hover:opacity-85 cursor-pointer text-inherit"
                >
                  The hands behind<br />
                  <em className="group-hover:underline decoration-1 underline-offset-4">the beauty.</em>
                </a>
              </h2>
            </div>
            <p className="section-intro" data-testid="craft-intro">
              From the fused gold and glass art of Pratapgarh to the spun silver lace of Karimnagar and Cuttack, we honor the living heritage of Indian craftsmanship. Every piece celebrates centuries of regional artistry—vibrant, soul-stirring, and unmistakably alive.
            </p>
          </div>

          <div className="craft-grid">
            {HERITAGE_CRAFTS.map((craft, idx) => (
              <CraftCard
                key={craft.id}
                story={craft}
                index={idx}
                featured={idx === 0}
                onSelect={setActiveCraft}
              />
            ))}
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="collection" className="section-shell scroll-mt-20 relative" data-testid="product-catalog-section">
          <div id="curated" className="absolute -top-24 pointer-events-none" />
          <div className="section-heading">
            <div>
              <p className="eyebrow text-[#9a7a3e]" data-testid="collection-eyebrow">
                <a
                  href="#curated"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCurated();
                  }}
                  className="hover:underline hover:opacity-80 transition-all cursor-pointer underline-offset-4"
                  data-testid="link-collection-curated-header"
                >
                  Curated collection
                </a>
                <span className="text-[#9a7a3e]/60"> · </span>
                <a
                  href="#heritage"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeritage();
                  }}
                  className="hover:underline hover:opacity-80 transition-all cursor-pointer underline-offset-4"
                  data-testid="link-collection-heritage-header"
                >
                  Heritage craft
                </a>
              </p>
              <h2 className="section-title" data-testid="collection-title">
                <a
                  href="#curated"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToCurated();
                  }}
                  className="group inline-block transition-opacity hover:opacity-85 cursor-pointer text-inherit"
                >
                  Navidha <em className="group-hover:underline decoration-1 underline-offset-4">Silver</em>
                </a>
              </h2>
            </div>
            <p className="section-intro" data-testid="collection-intro">
              Contemporary pieces with an Indian point of view. Tarnish-resistant, hand-finished, and made for everyday elegance.
            </p>
          </div>

          {/* Catalog Toolbar */}
          <div className="catalog-toolbar" data-testid="catalog-toolbar">
            <div
              className="category-tabs"
              role="tablist"
              aria-label="Filter by category"
              data-testid="category-filter-list"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-tab ${selectedCategory === cat ? 'category-tab-active' : ''}`}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  data-testid={`category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="toolbar-controls">
              {/* Search */}
              <label className="search-field">
                <Search size={15} className="text-[#667383]" />
                <span className="sr-only">Search collection</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search the edit"
                  aria-label="Search the collection"
                  data-testid="catalog-search-input"
                />
              </label>

              {/* Material Dropdown */}
              <label className="select-field">
                <span className="sr-only">Filter by material</span>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  aria-label="Filter by material"
                  data-testid="catalog-material-filter"
                >
                  {MATERIALS.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-[#667383]" />
              </label>

              {/* Sort Dropdown */}
              <label className="select-field hidden sm:flex">
                <span className="sr-only">Sort collection</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  aria-label="Sort collection"
                  data-testid="catalog-sort-filter"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
                <ChevronDown size={14} className="text-[#667383]" />
              </label>
            </div>
          </div>

          {/* Results Summary & Clear Action */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-[#667383]" data-testid="catalog-result-count">
              {filteredProducts.length} pieces in this edit
            </p>
            {(selectedCategory !== 'All' || selectedMaterial !== 'All materials' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedMaterial('All materials');
                  setSearchQuery('');
                }}
                className="text-[10px] uppercase tracking-[0.18em] text-[#9a7a3e] hover:text-[#14202e] cursor-pointer"
                data-testid="catalog-clear-filters-button"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid" data-testid="product-catalog-grid">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  onSelect={setActiveProduct}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="catalog-empty-state">
              <Search size={28} className="text-[#9a7a3e]/60" />
              <h3 className="mt-4 font-serif text-2xl">Nothing quite matches.</h3>
              <p className="mt-2 text-sm text-[#667383]">
                Try another material, category or search phrase.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedMaterial('All materials');
                  setSearchQuery('');
                }}
                className="mt-5 border border-[#14202e]/20 px-5 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#14202e] hover:text-[#f8f1e4] transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Material Language Section */}
        <section className="material-banner" data-testid="material-language-section">
          <div>
            <p className="eyebrow text-[#c8a45d]" data-testid="material-eyebrow">
              Material language
            </p>
            <h2
              className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#f8f1e4] sm:text-6xl"
              data-testid="material-title"
            >
              The beauty is in what <em className="text-[#c8a45d]">lasts.</em>
            </h2>
          </div>

          <div className="material-points">
            <div data-testid="material-point-silver">
              <ShieldCheck size={20} className="text-[#c8a45d] shrink-0 mt-0.5" />
              <div>
                <strong>925 Sterling Silver</strong>
                <span>Tarnish & firescale resistant</span>
              </div>
            </div>
            <div data-testid="material-point-craft">
              <Sparkles size={20} className="text-[#c8a45d] shrink-0 mt-0.5" />
              <div>
                <strong>Rooted in Heritage</strong>
                <span>Crafted by a Human hand</span>
              </div>
            </div>
            <div data-testid="material-point-pearl">
              <Gem size={20} className="text-[#c8a45d] shrink-0 mt-0.5" />
              <div>
                <strong>Natural pearls</strong>
                <span>Each one, beautifully unique</span>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="section-shell philosophy-section" data-testid="philosophy-section">
          <button
            type="button"
            onClick={() => setIsCampaignOpen(true)}
            className="philosophy-image group relative cursor-zoom-in text-left block"
            aria-label="Open Navidha pearl campaign gallery"
            data-testid="philosophy-campaign-image-button"
          >
            <img
              src={PHILOSOPHY_PORTRAIT}
              alt="Indian woman wearing an elaborate pearl collar and silver floral brooch"
              loading="lazy"
              data-testid="philosophy-image"
            />
            <span
              className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-[#14202e]/90 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-[#f8f1e4] backdrop-blur-xs transition-colors duration-300 group-hover:bg-[#c8a45d] group-hover:text-[#14202e]"
              data-testid="philosophy-image-campaign-label"
            >
              View campaign <ArrowUpRight size={13} />
            </span>
          </button>

          <div className="philosophy-copy">
            <p className="eyebrow text-[#9a7a3e]" data-testid="philosophy-eyebrow">
              Our philosophy
            </p>
            <h2 className="section-title" data-testid="philosophy-title">
              <a
                href="#heritage"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeritage();
                }}
                className="hover:opacity-80 transition-opacity cursor-pointer hover:underline decoration-1 underline-offset-4 inline-block text-inherit"
                title="Explore Heritage Crafts"
              >
                Crafted in India.
              </a>
              <br />
              <a
                href="#curated"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToCurated();
                }}
                className="hover:opacity-80 transition-opacity cursor-pointer inline-block text-inherit"
                title="Explore Curated Collections"
              >
                <em className="hover:underline decoration-1 underline-offset-4">Curated by Navidha.</em>
              </a>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#667383]" data-testid="philosophy-copy">
              We believe jewelry should feel like a discovery — a small, luminous reminder of where you have been and who you are becoming. Every Navidha edit begins with an Indian craft story and ends with a piece that belongs entirely to you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => setIsCampaignOpen(true)}
                className="inline-flex h-11 items-center gap-3 bg-[#14202e] px-6 text-[10px] uppercase tracking-[0.2em] text-[#f8f1e4] transition-colors hover:bg-[#c8a45d] hover:text-[#14202e] cursor-pointer"
                data-testid="philosophy-campaign-button"
              >
                View campaign <ArrowUpRight size={15} />
              </button>
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#14202e] transition-colors hover:text-[#9a7a3e]"
                data-testid="philosophy-collection-link"
              >
                House collection <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* Modern Luxury-Tier Newsletter Subscription Section */}
        <NewsletterSubscription />
      </main>

      {/* Reorganized 4-Column Footer */}
      <Footer
        onCategorySelect={(cat) => setSelectedCategory(cat)}
        onSelectCraft={(craft) => setActiveCraft(craft)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      {/* Campaign Gallery Lookbook Modal */}
      <CampaignGalleryModal
        open={isCampaignOpen}
        onClose={() => setIsCampaignOpen(false)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAdd={(product) => {
          handleAddToCart(product);
          setActiveProduct(null);
          setIsCartOpen(true);
        }}
      />

      {/* Craft Detail Modal */}
      <CraftDetailModal
        story={activeCraft}
        onClose={() => setActiveCraft(null)}
        onExploreCollection={scrollToCurated}
      />

      {/* Shipping Country Prompt Modal */}
      <ShippingCountryModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        onCountryChange={(c) => setSelectedCountry(c)}
      />

      {/* Contact Us Slide-Over Sidebar Drawer */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
        onOpenConsultation={() => {
          setIsContactDrawerOpen(false);
          window.location.href = '/consultation.html';
        }}
      />

      {/* Luxury Cookie Settings Banner */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const renderContent = () => {
    const isConsultationPath =
      pathname === '/consultation' ||
      pathname.endsWith('/consultation.html') ||
      pathname.endsWith('/consultation');

    if (isConsultationPath) {
      return <ConsultationPage />;
    }

    const isFaqPath =
      pathname === '/faq' ||
      pathname.endsWith('/faq.html') ||
      pathname.endsWith('/faq');

    if (isFaqPath) {
      return <FaqPage />;
    }

    const isShippingPath =
      pathname === '/shipping-returns' ||
      pathname.endsWith('/shipping-returns.html') ||
      pathname.endsWith('/shipping-returns') ||
      pathname === '/shipping';

    if (isShippingPath) {
      return <ShippingReturnsPage />;
    }

    const isPrivacyPath =
      pathname === '/privacy-policy' ||
      pathname.endsWith('/privacy-policy.html') ||
      pathname.endsWith('/privacy-policy') ||
      pathname === '/privacy' ||
      pathname === '/cookies';

    if (isPrivacyPath) {
      return <PrivacyPolicyPage />;
    }

    return (
      <ToastProvider>
        <Storefront />
      </ToastProvider>
    );
  };

  return (
    <>
      {renderContent()}
      {/* Global Floating WhatsApp Concierge Chat Widget */}
      <FloatingWhatsAppChat />
    </>
  );
}
