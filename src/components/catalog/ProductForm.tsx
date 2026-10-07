import React, { useState } from 'react';
import {
  Upload,
  X,
  Plus,
  Trash2,
  Sparkles,
  Save,
  ArrowLeft,
  Check,
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  Tag as TagIcon,
  Layers,
  FileText,
  AlertTriangle
} from 'lucide-react';
import type { CatalogProduct, ProductSEO } from '../../types/product';
import { SeoEngineCard } from './SeoEngineCard';

interface ProductFormProps {
  initialProduct?: CatalogProduct | null;
  onSave: (productData: Partial<CatalogProduct>) => Promise<void>;
  onCancel: () => void;
  onUpdatePreview: (productData: Partial<CatalogProduct>) => void;
}

const CATEGORY_OPTIONS = [
  'Necklaces',
  'Earrings',
  'Rings',
  'Bracelets',
  'Brooches',
  'Bespoke & Bridal',
  'Fine Jewelry',
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSave,
  onCancel,
  onUpdatePreview,
}) => {
  const isEditing = !!initialProduct?.id;

  const [title, setTitle] = useState(initialProduct?.title || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Necklaces');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [price, setPrice] = useState<number | ''>(initialProduct?.price ?? 14800);
  const [salePrice, setSalePrice] = useState<number | ''>(initialProduct?.sale_price ?? '');
  const [stock, setStock] = useState<number | ''>(initialProduct?.stock ?? 10);
  const [status, setStatus] = useState<'draft' | 'published'>(initialProduct?.status || 'published');
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80']
  );
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || ['Certified 925 Silver', 'Freshwater Pearls']);
  const [tagInput, setTagInput] = useState('');

  // Attributes list state
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(() => {
    if (initialProduct?.attributes) {
      return Object.entries(initialProduct.attributes).map(([name, value]) => ({ name, value }));
    }
    return [
      { name: 'Material', value: 'Certified 925 Sterling Silver' },
      { name: 'Gemstone', value: 'Freshwater Basra Cultivated Pearls' },
      { name: 'Craft', value: 'Gulabi Meenakari Enamel' },
    ];
  });

  const [seo, setSeo] = useState<ProductSEO>(() => ({
    meta_title: initialProduct?.seo?.meta_title || `${initialProduct?.title || ''} | Navidha Pearls`,
    meta_description: initialProduct?.seo?.meta_description || initialProduct?.description || '',
    canonical_url: initialProduct?.seo?.canonical_url || `https://navidhapearls.com/products/${initialProduct?.slug || ''}`,
    og_image: initialProduct?.seo?.og_image || initialProduct?.images?.[0] || '',
    keywords: initialProduct?.seo?.keywords || [],
  }));

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Derive slug automatically when title changes if slug was empty or matched previous title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const derived = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(derived);
      triggerPreviewUpdate({ title: val, slug: derived });
    } else {
      triggerPreviewUpdate({ title: val });
    }
  };

  const triggerPreviewUpdate = (override: Partial<CatalogProduct> = {}) => {
    const attrMap: Record<string, string> = {};
    attributes.forEach((a) => {
      if (a.name.trim()) attrMap[a.name.trim()] = a.value.trim();
    });

    onUpdatePreview({
      id: initialProduct?.id || 'preview-temp',
      title,
      slug,
      sku,
      category,
      description,
      price: typeof price === 'number' ? price : 0,
      sale_price: typeof salePrice === 'number' ? salePrice : null,
      stock: typeof stock === 'number' ? stock : 0,
      status,
      images,
      tags,
      attributes: attrMap,
      seo,
      ...override,
    });
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const res = await fetch('/api/upload/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, fileName: file.name }),
          });

          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          const newImages = [...images, data.url];
          setImages(newImages);
          triggerPreviewUpdate({ images: newImages });
        } catch {
          // If server upload fails, use local data URL preview
          const newImages = [...images, base64];
          setImages(newImages);
          triggerPreviewUpdate({ images: newImages });
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload failed');
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      const newImages = [...images, imageUrlInput.trim()];
      setImages(newImages);
      setImageUrlInput('');
      triggerPreviewUpdate({ images: newImages });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    triggerPreviewUpdate({ images: newImages });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    const newImages = [selected, ...rest];
    setImages(newImages);
    triggerPreviewUpdate({ images: newImages });
  };

  // Tag Handling
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,+|,+$/g, '');
      if (val && !tags.includes(val)) {
        const newTags = [...tags, val];
        setTags(newTags);
        setTagInput('');
        triggerPreviewUpdate({ tags: newTags });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    triggerPreviewUpdate({ tags: newTags });
  };

  // Attribute Handling
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
    triggerPreviewUpdate();
  };

  const handleRemoveAttribute = (index: number) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
    triggerPreviewUpdate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Product Title is required.');
      return;
    }
    if (!sku.trim()) {
      setErrorMessage('SKU code is required.');
      return;
    }
    if (price === '' || Number(price) <= 0) {
      setErrorMessage('A valid Regular Price in INR is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const attrMap: Record<string, string> = {};
      attributes.forEach((a) => {
        if (a.name.trim()) attrMap[a.name.trim()] = a.value.trim();
      });

      const payload: Partial<CatalogProduct> = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
        sku: sku.trim().toUpperCase(),
        category,
        description: description.trim(),
        price: Number(price),
        sale_price: salePrice !== '' ? Number(salePrice) : null,
        stock: Number(stock || 0),
        status,
        images,
        tags,
        attributes: attrMap,
        seo,
      };

      await onSave(payload);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="catalog-product-form">
      {/* Top Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#14202e]/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 border border-[#14202e]/15 hover:bg-[#fbf9f5] rounded-xs cursor-pointer transition-colors"
            title="Return to Table"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="eyebrow text-[#9a7a3e]">
              {isEditing ? `Editing Product: ${initialProduct?.sku}` : 'Atelier Catalog Addition'}
            </span>
            <h2 className="font-serif text-2xl text-[#14202e] font-normal">
              {isEditing ? `Edit: ${initialProduct?.title}` : 'Add New Fine Jewelry Piece'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-[#14202e]/20 hover:border-[#14202e] text-xs uppercase tracking-[0.16em] rounded-xs transition-colors cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.18em] font-bold rounded-xs transition-colors cursor-pointer"
            data-testid="save-product-btn"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Firestore...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{isEditing ? 'Update Product' : 'Publish Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. BASIC INFORMATION CARD */}
      <div className="bg-white border border-[#14202e]/10 rounded-[2px] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#14202e]/10">
          <FileText size={16} className="text-[#9a7a3e]" />
          <h3 className="font-serif text-lg text-[#14202e] font-medium">Core Product Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Royal Gulabi Meenakari Basra Pearl Choker"
              className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
              data-testid="input-product-title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] overflow-hidden text-xs">
              <span className="px-3 text-[#77808a] bg-gray-100 py-2.5 border-r border-[#14202e]/10 shrink-0">
                /products/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  triggerPreviewUpdate({ slug: e.target.value });
                }}
                className="w-full px-3 py-2.5 bg-transparent text-[#14202e] focus:outline-none"
              />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => {
                setSku(e.target.value);
                triggerPreviewUpdate({ sku: e.target.value });
              }}
              placeholder="e.g. NVD-NECK-001"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] font-mono uppercase text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                triggerPreviewUpdate({ category: e.target.value });
              }}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Catalog Status
            </label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => {
                    setStatus('published');
                    triggerPreviewUpdate({ status: 'published' });
                  }}
                  className="accent-[#14202e]"
                />
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-xs font-semibold">
                  Published
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => {
                    setStatus('draft');
                    triggerPreviewUpdate({ status: 'draft' });
                  }}
                  className="accent-[#14202e]"
                />
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-xs font-semibold">
                  Draft
                </span>
              </label>
            </div>
          </div>

          {/* Raw Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Product Story &amp; Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                triggerPreviewUpdate({ description: e.target.value });
              }}
              placeholder="Detail the craft lineage, metal weight, pearl luster, and styling notes..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e] leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 2. HIGH-RESOLUTION MEDIA & ASSET MANAGEMENT */}
      <div className="bg-white border border-[#14202e]/10 rounded-[2px] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#14202e]/10">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-[#9a7a3e]" />
            <h3 className="font-serif text-lg text-[#14202e] font-medium">Product Photography &amp; Assets</h3>
          </div>
          <span className="text-xs text-[#888888]">{images.length} images uploaded</span>
        </div>

        {/* Upload Drop Zone & URL Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-[#14202e]/20 hover:border-[#9a7a3e] rounded-[2px] p-6 text-center bg-[#fbf9f5]/50 flex flex-col items-center justify-center transition-colors">
            <Upload size={24} className="text-[#9a7a3e] mb-2" />
            <p className="text-xs font-semibold text-[#14202e]">Upload High-Resolution Photo</p>
            <p className="text-[11px] text-[#77808a] mt-0.5 mb-3">PNG, JPG, WEBP up to 10MB</p>
            <label className="px-4 py-2 bg-[#14202e] text-white hover:bg-[#c8a45d] hover:text-[#14202e] text-[10px] uppercase tracking-wider font-semibold rounded-xs cursor-pointer transition-colors">
              {isUploading ? 'Uploading...' : 'Browse Device Files'}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex flex-col justify-center p-6 bg-[#fbf9f5] border border-[#14202e]/10 rounded-[2px] space-y-3">
            <p className="text-xs font-semibold text-[#14202e]">Or Add Public Image URL</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#14202e]/15 rounded-xs text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#14202e] text-white hover:bg-[#9a7a3e] text-[10px] uppercase font-semibold rounded-xs cursor-pointer"
              >
                Add URL
              </button>
            </div>
            <p className="text-[10px] text-[#77808a]">
              Supports CDN assets, Unsplash, Cloudinary, or Firebase Storage URLs.
            </p>
          </div>
        </div>

        {/* Image Grid with Hero Badge */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-[2px] overflow-hidden border border-[#14202e]/15 bg-gray-100"
              >
                <img src={imgUrl} alt={`Asset ${idx}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-[#c8a45d] text-[#14202e] text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
                    Primary
                  </span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="px-2 py-1 bg-white text-[#14202e] text-[9px] uppercase font-semibold rounded-xs hover:bg-[#c8a45d] cursor-pointer"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PRICING & INVENTORY */}
      <div className="bg-white border border-[#14202e]/10 rounded-[2px] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#14202e]/10">
          <DollarSign size={16} className="text-[#9a7a3e]" />
          <h3 className="font-serif text-lg text-[#14202e] font-medium">Pricing &amp; Inventory Management</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Regular Price */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Regular Price (INR ₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                setPrice(val);
                triggerPreviewUpdate({ price: typeof val === 'number' ? val : 0 });
              }}
              placeholder="14800"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] font-mono text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Special Sale Price (INR ₹)
            </label>
            <input
              type="number"
              min="0"
              value={salePrice}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                setSalePrice(val);
                triggerPreviewUpdate({ sale_price: typeof val === 'number' ? val : null });
              }}
              placeholder="Optional discount price"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] font-mono text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
          </div>

          {/* Inventory Count */}
          <div>
            <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
              Stock Units Available
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value);
                setStock(val);
                triggerPreviewUpdate({ stock: typeof val === 'number' ? val : 0 });
              }}
              placeholder="10"
              className="w-full px-3.5 py-2.5 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] font-mono text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
            {typeof stock === 'number' && stock < 5 && (
              <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1 mt-1.5 bg-amber-50 px-2 py-1 rounded-xs border border-amber-200">
                <AlertTriangle size={12} className="text-amber-700 shrink-0" />
                <span>Low stock alert threshold active (&lt; 5 units)</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. TAGS & CUSTOM ATTRIBUTES */}
      <div className="bg-white border border-[#14202e]/10 rounded-[2px] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#14202e]/10">
          <TagIcon size={16} className="text-[#9a7a3e]" />
          <h3 className="font-serif text-lg text-[#14202e] font-medium">Categorization &amp; Custom Attributes</h3>
        </div>

        {/* Tag Manager */}
        <div>
          <label className="block text-xs font-semibold text-[#14202e] uppercase tracking-wider mb-1.5">
            Catalog Search Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag (e.g. Freshwater Pearls) and press Enter..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
            />
            <button
              type="button"
              onClick={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  const newTags = [...tags, tagInput.trim()];
                  setTags(newTags);
                  setTagInput('');
                  triggerPreviewUpdate({ tags: newTags });
                }
              }}
              className="px-4 py-2 bg-[#14202e] text-white hover:bg-[#9a7a3e] text-[10px] uppercase font-semibold rounded-xs cursor-pointer"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f0ebe3] text-[#14202e] text-xs rounded-xs"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-red-600 font-bold cursor-pointer text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Key-Value Attributes */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-[#14202e] uppercase tracking-wider">
              Custom Craft &amp; Material Specifications
            </label>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="inline-flex items-center gap-1 text-[11px] text-[#9a7a3e] hover:text-[#14202e] font-semibold cursor-pointer uppercase tracking-wider"
            >
              <Plus size={13} />
              <span>Add Specification</span>
            </button>
          </div>

          <div className="space-y-2">
            {attributes.map((attr, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => handleAttributeChange(idx, 'name', e.target.value)}
                  placeholder="Attribute (e.g. Material)"
                  className="w-1/3 px-3 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-xs text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
                />
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 925 Sterling Silver)"
                  className="flex-1 px-3 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-xs text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(idx)}
                  className="p-2 text-gray-400 hover:text-red-600 cursor-pointer"
                  title="Delete Attribute"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. AUTOMATED SEO ENGINE */}
      <SeoEngineCard
        seo={seo}
        onChange={(updatedSeo) => {
          setSeo(updatedSeo);
          triggerPreviewUpdate({ seo: updatedSeo });
        }}
        productTitle={title}
        productDescription={description}
        category={category}
        images={images}
        attributes={
          attributes.reduce((acc, curr) => {
            if (curr.name.trim()) acc[curr.name.trim()] = curr.value.trim();
            return acc;
          }, {} as Record<string, string>)
        }
        slug={slug}
        onSlugChange={(newSlug) => {
          setSlug(newSlug);
          triggerPreviewUpdate({ slug: newSlug });
        }}
      />

      {/* Form Submission Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#14202e]/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-[#14202e]/20 hover:border-[#14202e] text-xs uppercase tracking-[0.18em] rounded-xs transition-colors cursor-pointer font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.2em] font-bold rounded-xs transition-colors cursor-pointer"
          data-testid="bottom-save-product-btn"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>{isEditing ? 'Save Product Changes' : 'Publish Product to Catalog'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
