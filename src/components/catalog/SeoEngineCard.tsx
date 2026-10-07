import React, { useState } from 'react';
import { Sparkles, Globe, Search, Check, AlertCircle, Share2, Copy } from 'lucide-react';
import type { ProductSEO } from '../../types/product';

interface SeoEngineCardProps {
  seo: ProductSEO;
  onChange: (seo: ProductSEO) => void;
  productTitle: string;
  productDescription: string;
  category: string;
  images: string[];
  attributes: Record<string, string>;
  slug: string;
  onSlugChange: (newSlug: string) => void;
}

export const SeoEngineCard: React.FC<SeoEngineCardProps> = ({
  seo,
  onChange,
  productTitle,
  productDescription,
  category,
  images,
  attributes,
  slug,
  onSlugChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const metaTitleLength = seo.meta_title?.length || 0;
  const metaDescLength = seo.meta_description?.length || 0;

  const handleAiAutoFill = async () => {
    if (!productTitle.trim()) {
      alert('Please enter a product title before generating SEO metadata.');
      return;
    }

    setIsGenerating(true);
    setGenerateSuccess(false);

    try {
      const response = await fetch('/api/seo/auto-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productTitle,
          description: productDescription,
          category,
          images,
          attributes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate SEO metadata.');
      }

      const data = await response.json();

      onChange({
        meta_title: data.meta_title || `${productTitle} | Navidha`,
        meta_description: data.meta_description || productDescription.slice(0, 160),
        canonical_url: data.canonical_url || `https://navidhapearls.com/products/${data.slug || slug}`,
        og_image: data.og_image || images[0] || '',
        keywords: data.keywords || [],
      });

      if (data.slug) {
        onSlugChange(data.slug);
      }

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err: any) {
      console.error('[SEO Engine] Auto-fill failed:', err);
      // Client-side fallback
      const cleanSlug = productTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      onChange({
        meta_title: `${productTitle.slice(0, 48)} | Navidha`.slice(0, 60),
        meta_description: (productDescription || `Handcrafted ${category} in 925 sterling silver.`).slice(0, 160),
        canonical_url: `https://navidhapearls.com/products/${cleanSlug}`,
        og_image: images[0] || '',
        keywords: [category, '925 Silver', 'Fine Jewelry', 'Navidha'],
      });
      onSlugChange(cleanSlug);
      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !(seo.keywords || []).includes(trimmed)) {
        onChange({
          ...seo,
          keywords: [...(seo.keywords || []), trimmed],
        });
        setTagInput('');
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onChange({
      ...seo,
      keywords: (seo.keywords || []).filter((k) => k !== keyword),
    });
  };

  return (
    <div className="bg-[#ffffff] border border-[#14202e]/10 rounded-[2px] p-6 shadow-xs space-y-6">
      {/* Header & AI Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#14202e]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe size={16} className="text-[#9a7a3e]" />
            <h3 className="font-serif text-lg text-[#14202e] font-medium">Automated SEO Engine</h3>
          </div>
          <p className="text-xs text-[#667383]">
            Fine-tune search engine visibility, Google SERP snippets, and social media preview metadata.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAiAutoFill}
          disabled={isGenerating}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer ${
            generateSuccess
              ? 'bg-emerald-700 text-white'
              : 'bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e]'
          }`}
          data-testid="ai-autofill-seo-btn"
        >
          {isGenerating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing &amp; Optimizing...</span>
            </>
          ) : generateSuccess ? (
            <>
              <Check size={14} />
              <span>SEO Optimized!</span>
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-[#c8a45d]" />
              <span>AI Auto-Fill SEO (Gemini)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta Title Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#14202e] uppercase tracking-wider">
              SEO Meta Title <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                metaTitleLength > 60
                  ? 'text-red-600 font-bold'
                  : metaTitleLength >= 45
                  ? 'text-emerald-600 font-semibold'
                  : 'text-[#888888]'
              }`}
            >
              {metaTitleLength} / 60 chars
            </span>
          </div>
          <input
            type="text"
            value={seo.meta_title || ''}
            onChange={(e) => onChange({ ...seo, meta_title: e.target.value })}
            placeholder="e.g. Royal Gulabi Meenakari Basra Pearl Choker | Navidha"
            className={`w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border rounded-[2px] text-[#14202e] focus:outline-none transition-colors ${
              metaTitleLength > 60 ? 'border-red-400 focus:border-red-600' : 'border-[#14202e]/15 focus:border-[#9a7a3e]'
            }`}
          />
          <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                metaTitleLength > 60 ? 'bg-red-500' : metaTitleLength >= 45 ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (metaTitleLength / 60) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#77808a] mt-1">
            Displayed on Google Search results tabs. Optimal length: 45–60 characters.
          </p>
        </div>

        {/* Canonical URL */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#14202e] uppercase tracking-wider">
              Canonical URL
            </label>
            <span className="text-[10px] text-[#888888]">Auto-synced</span>
          </div>
          <input
            type="text"
            value={seo.canonical_url || `https://navidhapearls.com/products/${slug}`}
            onChange={(e) => onChange({ ...seo, canonical_url: e.target.value })}
            placeholder="https://navidhapearls.com/products/slug"
            className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
          />
          <p className="text-[10px] text-[#77808a] mt-1">
            Instructs search engines to index this master product URL, preventing duplicate content.
          </p>
        </div>
      </div>

      {/* Meta Description Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#14202e] uppercase tracking-wider">
            SEO Meta Description <span className="text-red-500">*</span>
          </label>
          <span
            className={`text-[11px] font-mono ${
              metaDescLength > 160
                ? 'text-red-600 font-bold'
                : metaDescLength >= 120
                ? 'text-emerald-600 font-semibold'
                : 'text-[#888888]'
            }`}
          >
            {metaDescLength} / 160 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={seo.meta_description || ''}
          onChange={(e) => onChange({ ...seo, meta_description: e.target.value })}
          placeholder="Crafted in pure 925 hallmarked sterling silver and natural pearls. Discover timeless Indian craftsmanship by Navidha. Complimentary insured shipping."
          className={`w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border rounded-[2px] text-[#14202e] focus:outline-none transition-colors ${
            metaDescLength > 160 ? 'border-red-400 focus:border-red-600' : 'border-[#14202e]/15 focus:border-[#9a7a3e]'
          }`}
        />
        <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              metaDescLength > 160 ? 'bg-red-500' : metaDescLength >= 120 ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
            style={{ width: `${Math.min(100, (metaDescLength / 160) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#77808a] mt-1">
          Appears beneath the title in search results. Optimal length: 120–160 characters.
        </p>
      </div>

      {/* Open Graph Image & Target Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Open Graph Social Card Image */}
        <div>
          <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
            Social Share Image (Open Graph)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={seo.og_image || ''}
              onChange={(e) => onChange({ ...seo, og_image: e.target.value })}
              placeholder="https://... (1200x630 recommended)"
              className="flex-1 px-3.5 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...seo, og_image: images[0] })}
                className="px-3 py-2 text-[10px] font-semibold bg-[#f0ebe3] hover:bg-[#e4ddcf] text-[#14202e] rounded-[2px] whitespace-nowrap cursor-pointer uppercase tracking-wider"
              >
                Use Primary
              </button>
            )}
          </div>
          {seo.og_image && (
            <div className="mt-2.5 relative w-24 h-16 border border-[#14202e]/10 rounded-[2px] overflow-hidden bg-gray-100">
              <img src={seo.og_image} alt="OG Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Target Keywords / Search Tags */}
        <div>
          <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
            Target Search Keywords &amp; Query Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Type keyword and press Enter..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
            <button
              type="button"
              onClick={() => {
                if (tagInput.trim()) {
                  onChange({
                    ...seo,
                    keywords: [...(seo.keywords || []), tagInput.trim()],
                  });
                  setTagInput('');
                }
              }}
              className="px-4 py-2 text-[10px] font-semibold bg-[#14202e] text-white hover:bg-[#9a7a3e] rounded-[2px] cursor-pointer uppercase tracking-wider"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {(seo.keywords || []).map((keyword, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0ebe3] text-[#14202e] text-[11px] rounded-xs font-medium"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-red-600 cursor-pointer ml-0.5 text-xs font-bold leading-none"
                  aria-label={`Remove keyword ${keyword}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
