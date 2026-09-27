import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Gem,
  Award
} from 'lucide-react';
import {
  Product,
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
import { CampaignGalleryModal } from './components/CampaignGalleryModal';
import { CartDrawer } from './components/CartDrawer';
import { NewsletterSubscription } from './components/NewsletterSubscription';
import { Footer } from './components/Footer';
import { FaqPage } from './FaqPage';
import { ShippingReturnsPage } from './ShippingReturnsPage';
import { ToastProvider, useToast } from './components/Toast';

function Storefront() {
  const { showToast } = useToast();

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All materials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showLaunchPopup, setShowLaunchPopup] = useState<boolean>(true);
  const [isCampaignOpen, setIsCampaignOpen] = useState<boolean>(false);

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
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 400);
  };

  const scrollToCraft = () => {
    document.getElementById('craft')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e]" data-testid="navidha-storefront">
      {/* Launch announcement popup on initial visit */}
      <LaunchPopup
        isOpen={showLaunchPopup}
        onClose={() => setShowLaunchPopup(false)}
        onExplore={scrollToCollection}
      />

      {/* Top Announcement Bar */}
      <div className="announcement-bar" data-testid="announcement-bar">
        Complimentary delivery across India <span>·</span> The Navidha collection launches soon
      </div>

      {/* Sticky Header / Navbar */}
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#14202e]/95 text-[#f8f1e4] backdrop-blur-md"
        data-testid="navbar"
      >
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <a href="#top" aria-label="Navidha home" data-testid="navbar-home-link">
            <BrandMark />
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Main navigation"
            data-testid="desktop-navigation"
          >
            <a href="#collection" className="nav-link" data-testid="navbar-collection-link">
              The collection
            </a>
            <a href="#craft" className="nav-link" data-testid="navbar-craft-link">
              Craft heritage
            </a>
            <a href="#philosophy" className="nav-link" data-testid="navbar-philosophy-link">
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
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link"
                data-testid="mobile-collection-link"
              >
                The collection
              </a>
              <a
                href="#craft"
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link"
                data-testid="mobile-craft-link"
              >
                Craft heritage
              </a>
              <a
                href="#philosophy"
                onClick={() => setIsMobileMenuOpen(false)}
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
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main id="top">
        {/* Hero Section */}
        <section className="hero-section" data-testid="hero-section">
          <div className="hero-copy">
            <p className="eyebrow text-[#c8a45d]" data-testid="hero-eyebrow">
              Navidha Pearls & Jewelry · Est. India
            </p>
            <h1
              className="mt-3 max-w-[680px] font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-[#f8f1e4] sm:text-6xl lg:text-[5.4rem]"
              data-testid="hero-title"
            >
              Jewelry,<br />
              <em className="text-[#c8a45d]">reimagined.</em>
            </h1>
            <p
              className="mt-4 max-w-[450px] text-sm leading-6 text-[#b8c0c8] sm:text-base"
              data-testid="hero-description"
            >
              Where India's timeless craftsmanship meets contemporary form. A considered edit of silver, pearls, gold and the hands that make them.
            </p>
          </div>

          {/* Right Hero Image Column */}
          <div className="hero-image-wrap" data-testid="hero-image-panel">
            <img
              src={HERO_PORTRAIT}
              alt=""
              aria-hidden="true"
              className="hero-image-backdrop"
              data-testid="hero-image-backdrop"
            />
            <img
              src={HERO_PORTRAIT}
              alt="Indian woman wearing layered silver and pearl Navidha jewelry"
              className="hero-image"
              data-testid="hero-image"
            />
          </div>
        </section>

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
        <section id="craft" className="section-shell bg-[#f0ebe3]" data-testid="heritage-craft-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow text-[#9a7a3e]" data-testid="craft-eyebrow">
                Heritage, curated
              </p>
              <h2 className="section-title" data-testid="craft-title">
                The hands behind<br />
                <em>the beauty.</em>
              </h2>
            </div>
            <p className="section-intro" data-testid="craft-intro">
              From colored glass gold and silver jewelry to delicate silver filigree, we honour the traditions that make Indian jewelry unmistakably alive.
            </p>
          </div>

          <div className="craft-grid">
            {HERITAGE_CRAFTS.map((craft, idx) => (
              <CraftCard
                key={craft.id}
                story={craft}
                index={idx}
                featured={idx === 0}
              />
            ))}
          </div>
        </section>

        {/* Product Catalog Section */}
        <section id="collection" className="section-shell" data-testid="product-catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow text-[#9a7a3e]" data-testid="collection-eyebrow">
                The house collection
              </p>
              <h2 className="section-title" data-testid="collection-title">
                Navidha <em>Silver</em>
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
                <strong>925 silver</strong>
                <span>Tarnish & firescale resistant</span>
              </div>
            </div>
            <div data-testid="material-point-craft">
              <Sparkles size={20} className="text-[#c8a45d] shrink-0 mt-0.5" />
              <div>
                <strong>Hand finished</strong>
                <span>Made by a human hand</span>
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
              Crafted in India.<br />
              <em>Curated by Navidha.</em>
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
      <Footer onCategorySelect={(cat) => setSelectedCategory(cat)} />

      {/* Cart Drawer */}
      <CartDrawer
        open={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemoveFromCart}
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
    </div>
  );
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

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

  return (
    <ToastProvider>
      <Storefront />
    </ToastProvider>
  );
}
