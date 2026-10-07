import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Tag
} from 'lucide-react';
import type { CatalogProduct } from '../../types/product';

interface ProductPreviewProps {
  product: Partial<CatalogProduct>;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'detail' | 'serp' | 'social'>('serp');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const title = product.title || 'Untitled Royal Jewelry Piece';
  const price = product.price || 0;
  const salePrice = product.sale_price;
  const category = product.category || 'Fine Jewelry';
  const sku = product.sku || 'NVD-000';
  const stock = product.stock ?? 10;
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
  ];
  const tags = product.tags || [];
  const attributes = product.attributes || {};
  const slug = product.slug || 'untitled-piece';
  const metaTitle = product.seo?.meta_title || `${title} | Navidha Pearls & Jewelry`;
  const metaDesc = product.seo?.meta_description || product.description || 'Contemporary jewelry rooted in India extraordinary craft traditions.';
  const canonicalUrl = product.seo?.canonical_url || `https://navidhapearls.com/products/${slug}`;
  const ogImage = product.seo?.og_image || images[0];

  const hasDiscount = salePrice && salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - salePrice!) / price) * 100) : 0;

  return (
    <div className="bg-[#ffffff] border border-[#14202e]/10 rounded-[2px] shadow-xs overflow-hidden">
      {/* Top Header & View Mode Switcher */}
      <div className="p-4 sm:p-5 bg-[#fbf9f5] border-b border-[#14202e]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-[#9a7a3e]">Omnichannel Visualization</span>
          <h3 className="font-serif text-lg text-[#14202e] font-medium">Live Customer &amp; Search Preview</h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center bg-white border border-[#14202e]/15 p-1 rounded-xs gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('serp')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'serp' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
            }`}
          >
            <Globe size={13} />
            <span>Google SERP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'card' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
            }`}
          >
            <Eye size={13} />
            <span>Storefront Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'detail' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
            }`}
          >
            <ShoppingBag size={13} />
            <span>Product Detail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
              activeTab === 'social' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
            }`}
          >
            <Share2 size={13} />
            <span>Social Share (OG)</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-6">
        {/* 1. GOOGLE SEARCH SERP SNIPPET PREVIEW */}
        {activeTab === 'serp' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs text-[#667383] font-medium">
                Simulated appearance on Google organic search results
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer ${
                    serpDevice === 'desktop' ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-500'
                  }`}
                >
                  <Monitor size={12} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`px-2.5 py-1 rounded-xs flex items-center gap-1 cursor-pointer ${
                    serpDevice === 'mobile' ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-500'
                  }`}
                >
                  <Smartphone size={12} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google SERP Box */}
            <div
              className={`p-5 bg-white border border-gray-200 rounded-lg font-sans shadow-sm ${
                serpDevice === 'mobile' ? 'max-w-md mx-auto' : 'max-w-2xl'
              }`}
            >
              {/* Breadcrumb row */}
              <div className="flex items-center gap-2 mb-1 text-[13px]">
                <div className="w-5 h-5 rounded-full bg-[#14202e] flex items-center justify-center text-[10px] text-[#c8a45d] font-serif font-bold">
                  N
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-gray-800 text-[13px] font-medium">Navidha Pearls &amp; Jewelry</span>
                  <span className="text-gray-500 text-[11px] truncate">{canonicalUrl}</span>
                </div>
              </div>

              {/* Title Tag */}
              <h4 className="text-[#1a0dab] hover:underline cursor-pointer text-lg font-normal leading-snug line-clamp-2 mt-1">
                {metaTitle}
              </h4>

              {/* Meta Description */}
              <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed mt-1 line-clamp-3">
                <span className="text-gray-400 font-normal">₹{price.toLocaleString('en-IN')} · In stock · </span>
                {metaDesc}
              </p>

              {/* Sitelinks / Rich Snippets */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-[#1a0dab]">
                <span className="hover:underline cursor-pointer">Complimentary Insured Shipping</span>
                <span className="hover:underline cursor-pointer">15-Day Doorstep Returns</span>
                <span className="hover:underline cursor-pointer">BIS 925 Hallmarked</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <Sparkles size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>SEO Pro-Tip:</strong> The automated Gemini SEO Engine ensures both your title (
                <strong>{metaTitle.length}/60 chars</strong>) and description (
                <strong>{metaDesc.length}/160 chars</strong>) remain within Google's pixel truncation thresholds.
              </span>
            </div>
          </div>
        )}

        {/* 2. STOREFRONT CARD PREVIEW */}
        {activeTab === 'card' && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            <div className="w-full max-w-[320px] bg-white border border-[#14202e]/10 rounded-[2px] overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              {/* Product Card Image Container */}
              <div className="relative aspect-4/5 overflow-hidden bg-[#f0ebe3]">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {hasDiscount && (
                    <span className="px-2 py-0.5 bg-[#c8a45d] text-[#14202e] text-[9px] font-bold uppercase tracking-widest rounded-xs shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {tags[0] && (
                    <span className="px-2 py-0.5 bg-[#14202e]/80 backdrop-blur-xs text-[#f8f1e4] text-[9px] uppercase tracking-wider rounded-xs">
                      {tags[0]}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black/60 text-white backdrop-blur-xs rounded-xs">
                    {sku}
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 text-center space-y-2">
                <span className="eyebrow text-[#9a7a3e] block">{category}</span>
                <h4 className="font-serif text-base text-[#14202e] font-normal leading-snug line-clamp-1">
                  {title}
                </h4>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {hasDiscount ? (
                    <>
                      <span className="text-xs text-[#888888] line-through font-serif">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-semibold text-[#14202e] font-serif">
                        ₹{salePrice!.toLocaleString('en-IN')}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-[#14202e] font-serif">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full mt-3 py-2 border border-[#14202e] text-[#14202e] hover:bg-[#14202e] hover:text-[#f8f1e4] text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors rounded-xs cursor-pointer"
                >
                  Explore Details
                </button>
              </div>
            </div>

            <div className="max-w-sm space-y-3 text-xs text-[#667383]">
              <h5 className="font-serif text-base text-[#14202e] font-medium">Boutique Grid Appearance</h5>
              <p>
                This preview renders the product card with the primary hero photograph, dynamic discount badge, category classification, and INR currency formatting.
              </p>
              <div className="p-3 bg-[#fbf9f5] border border-[#14202e]/10 rounded-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Stock Status:</span>
                  <span className={stock > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                    {stock > 0 ? `${stock} in atelier stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-[#14202e] font-medium">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-mono text-[#14202e]">{sku}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRODUCT DETAIL SALON VIEW */}
        {activeTab === 'detail' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
            {/* Gallery Column */}
            <div>
              <div className="aspect-square bg-[#f0ebe3] rounded-[2px] overflow-hidden border border-[#14202e]/10">
                <img src={images[activeImgIdx] || images[0]} alt={title} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImgIdx(i)}
                      className={`w-16 h-16 rounded-[2px] overflow-hidden border-2 cursor-pointer shrink-0 ${
                        activeImgIdx === i ? 'border-[#9a7a3e]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="space-y-5">
              <div>
                <span className="eyebrow text-[#9a7a3e]">{category} · {sku}</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] mt-1 font-normal leading-tight">
                  {title}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-xl font-serif text-[#14202e] font-medium">
                        ₹{salePrice!.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm line-through text-[#888888] font-serif">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xs">
                        SAVE {discountPercent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-serif text-[#14202e] font-medium">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#667383] leading-relaxed">
                {product.description || 'Handcrafted fine jewelry heirloom.'}
              </p>

              {/* Custom Attributes Table */}
              {Object.keys(attributes).length > 0 && (
                <div className="border border-[#14202e]/10 rounded-[2px] p-3.5 bg-[#fbf9f5] space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#9a7a3e] font-semibold block">
                    Atelier Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(attributes).map(([k, v]) => (
                      <div key={k} className="border-b border-[#14202e]/5 pb-1">
                        <span className="text-[#888888] block text-[10px]">{k}</span>
                        <span className="text-[#14202e] font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  className="w-full py-3.5 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.2em] font-bold transition-colors rounded-[2px] cursor-pointer"
                >
                  Acquire Piece — Complimentary Insured Delivery
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] text-[#77808a] uppercase tracking-wider pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#9a7a3e]" />
                    BIS 925 Hallmarked
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <RotateCcw size={13} className="text-[#9a7a3e]" />
                    15-Day Doorstep Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SOCIAL SHARE (OPEN GRAPH) PREVIEW */}
        {activeTab === 'social' && (
          <div className="max-w-lg mx-auto py-4 space-y-4">
            <span className="text-xs text-[#667383] block text-center">
              Preview when shared on WhatsApp, Facebook, iMessage, and X/Twitter
            </span>

            <div className="bg-[#ffffff] border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-16/9 bg-gray-100 relative">
                <img src={ogImage} alt="OG Card" className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs backdrop-blur-xs">
                  navidhapearls.com
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium block mb-0.5">
                  NAVIDHAPEARLS.COM
                </span>
                <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">
                  {metaTitle}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {metaDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
