import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Copy,
  Check,
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Hash,
  X,
} from 'lucide-react';
import type { CatalogProduct } from '../../types/product';

interface ProductTableProps {
  products: CatalogProduct[];
  onAddNew: () => void;
  onEdit: (product: CatalogProduct) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (product: CatalogProduct) => void;
  onPreview: (product: CatalogProduct) => void;
  onSeedCatalog: () => void;
  isLoading: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onAddNew,
  onEdit,
  onDelete,
  onToggleStatus,
  onPreview,
  onSeedCatalog,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skuFilter, setSkuFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Critical Low Stock Threshold set to 5
  const LOW_STOCK_THRESHOLD = 5;

  // Real-Time Inventory Statistics
  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;
  const totalInventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) < LOW_STOCK_THRESHOLD).length;

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const availableSkus = Array.from(new Set(products.map((p) => p.sku).filter(Boolean))).sort();

  // Multi-attribute filtering with dedicated SKU filter
  const filtered = products.filter((p) => {
    if (showLowStockOnly && (p.stock || 0) >= LOW_STOCK_THRESHOLD) {
      return false;
    }

    // Specific SKU filter: checks if product's SKU contains the searched SKU identifier (case-insensitive)
    const matchesSku =
      !skuFilter.trim() ||
      (p.sku || '').toLowerCase().includes(skuFilter.trim().toLowerCase());

    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSku && matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCopyLink = (slug: string, id: string) => {
    const url = `https://navidhapearls.com/products/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export Product Catalog to CSV
  const handleExportCSV = () => {
    const headers = [
      'Product ID',
      'Title',
      'SKU',
      'Category',
      'Price (INR)',
      'Sale Price (INR)',
      'Current Stock',
      'Low Stock Alert (< 5)',
      'Status',
      'Tags',
      'SEO Meta Title',
      'Canonical URL',
      'Created At',
      'Updated At',
    ];

    const rows = filtered.map((p) => [
      `"${p.id}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      `"${p.category || ''}"`,
      p.price || 0,
      p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : '',
      p.stock || 0,
      (p.stock || 0) < LOW_STOCK_THRESHOLD ? 'YES - LOW STOCK ALERT' : 'IN STOCK',
      `"${p.status}"`,
      `"${(p.tags || []).join(', ').replace(/"/g, '""')}"`,
      `"${(p.seo?.meta_title || '').replace(/"/g, '""')}"`,
      `"${(p.seo?.canonical_url || '').replace(/"/g, '""')}"`,
      `"${p.created_at || ''}"`,
      `"${p.updated_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `navidha-catalog-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-testid="catalog-product-table">
      {/* 1. METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-[#14202e]/10 p-4 rounded-[2px] shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#77808a] block mb-1">
            Total Catalog
          </span>
          <span className="font-serif text-2xl text-[#14202e] font-normal">{totalCount}</span>
          <span className="text-[10px] text-[#77808a] block mt-1">Master items</span>
        </div>

        <div className="bg-white border border-[#14202e]/10 p-4 rounded-[2px] shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold block mb-1">
            Published Live
          </span>
          <span className="font-serif text-2xl text-emerald-800 font-normal">{publishedCount}</span>
          <span className="text-[10px] text-[#77808a] block mt-1">Accessible in salon</span>
        </div>

        <div className="bg-white border border-[#14202e]/10 p-4 rounded-[2px] shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block mb-1">
            Atelier Drafts
          </span>
          <span className="font-serif text-2xl text-amber-800 font-normal">{draftCount}</span>
          <span className="text-[10px] text-[#77808a] block mt-1">Unpublished</span>
        </div>

        <div className="bg-white border border-[#14202e]/10 p-4 rounded-[2px] shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#77808a] block mb-1">
            Total Inventory
          </span>
          <span className="font-serif text-2xl text-[#14202e] font-normal">{totalInventory}</span>
          <span className="text-[10px] text-[#77808a] block mt-1">Physical units</span>
        </div>

        {/* Low Stock Metric Tile with Interactive Filter */}
        <button
          type="button"
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`text-left border p-4 rounded-[2px] shadow-xs col-span-2 sm:col-span-1 cursor-pointer transition-all ${
            showLowStockOnly
              ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-400/50'
              : 'bg-white border-[#14202e]/10 hover:border-amber-400'
          }`}
          title="Click to toggle low stock filter (< 5)"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
              Low Stock (&lt; 5)
            </span>
            {lowStockCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
          </div>
          <span className="font-serif text-2xl text-amber-900 font-normal">{lowStockCount}</span>
          <span className="text-[10px] text-amber-700 block mt-1 font-medium">
            {showLowStockOnly ? 'Filtered view (active)' : 'Click to filter'}
          </span>
        </button>
      </div>

      {/* Real-Time Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-amber-800 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
                  Real-Time Low Stock Warning
                </span>
                <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[9px] font-bold rounded-xs uppercase">
                  Threshold: &lt; 5 Units
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 mt-0.5">
                {lowStockCount} jewelry piece{lowStockCount === 1 ? '' : 's'} critically low on vault inventory. Immediate atelier replenishment advised.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-xs cursor-pointer transition-colors ${
                showLowStockOnly
                  ? 'bg-[#14202e] text-white hover:bg-black'
                  : 'bg-amber-800 text-white hover:bg-amber-900'
              }`}
            >
              {showLowStockOnly ? 'Show All Products' : `Filter ${lowStockCount} Low Stock Item${lowStockCount === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      )}

      {/* 2. FILTER & ACTION BAR */}
      <div className="p-4 bg-white border border-[#14202e]/10 rounded-[2px] shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search & SKU Filter Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
            {/* General Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a7a3e]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, tag, or keyword..."
                className="w-full pl-9 pr-7 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] placeholder-gray-400 focus:outline-none focus:border-[#9a7a3e] focus:bg-white"
                data-testid="catalog-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Dedicated Specific SKU Filter */}
            <div className="relative w-full sm:w-60" data-testid="sku-filter-container">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-[#9a7a3e]">
                <Hash size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a7a3e]">SKU:</span>
              </div>
              <input
                type="text"
                value={skuFilter}
                onChange={(e) => setSkuFilter(e.target.value)}
                list="sku-filter-datalist"
                placeholder="Filter by SKU..."
                className="w-full pl-14 pr-7 py-2 text-xs font-mono bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] placeholder-gray-400 focus:outline-none focus:border-[#9a7a3e] focus:bg-white"
                data-testid="sku-filter-input"
              />
              <datalist id="sku-filter-datalist">
                {availableSkus.map((sku) => (
                  <option key={sku} value={sku} />
                ))}
              </datalist>
              {skuFilter && (
                <button
                  type="button"
                  onClick={() => setSkuFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  title="Clear SKU filter"
                  data-testid="clear-sku-filter-btn"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills & Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[#fbf9f5] border border-[#14202e]/15 rounded-[2px] text-[#14202e] focus:outline-none focus:border-[#9a7a3e] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex items-center bg-[#fbf9f5] border border-[#14202e]/15 p-0.5 rounded-[2px] text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                  statusFilter === 'all' && !showLowStockOnly ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                  statusFilter === 'published' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
                }`}
              >
                Live ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                  statusFilter === 'draft' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#14202e]/20 hover:border-[#14202e] text-[#14202e] hover:bg-[#14202e] hover:text-[#f8f1e4] text-xs uppercase tracking-[0.14em] font-semibold rounded-[2px] transition-colors cursor-pointer shadow-2xs"
              title="Export catalog inventory to CSV spreadsheet"
              data-testid="export-catalog-csv-btn"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            {/* Seed Baseline */}
            <button
              type="button"
              onClick={onSeedCatalog}
              className="px-3.5 py-2 border border-[#14202e]/20 hover:border-[#14202e] text-[10px] uppercase tracking-wider font-semibold rounded-[2px] transition-colors cursor-pointer text-[#14202e]"
              title="Seed baseline catalog pieces"
            >
              Seed Baseline
            </button>

            {/* Add Piece */}
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.16em] font-bold rounded-[2px] transition-colors cursor-pointer shadow-xs"
              data-testid="add-new-product-btn"
            >
              <Plus size={14} />
              <span>Add Piece</span>
            </button>
          </div>
        </div>

        {/* Active Filters Row (shows when any filter is active) */}
        {(skuFilter || searchTerm || categoryFilter !== 'All' || statusFilter !== 'all' || showLowStockOnly) && (
          <div className="pt-2.5 border-t border-[#14202e]/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#77808a]">
              Active Filters ({filtered.length} of {totalCount} piece{filtered.length === 1 ? '' : 's'}):
            </span>

            {skuFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#f8f1e4] border border-[#c8a45d] text-[#14202e] font-mono text-[11px] font-bold">
                <Hash size={11} className="text-[#9a7a3e]" />
                <span>SKU: {skuFilter}</span>
                <button
                  type="button"
                  onClick={() => setSkuFilter('')}
                  className="ml-1 text-gray-500 hover:text-black cursor-pointer"
                  title="Remove SKU filter"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-gray-100 border border-gray-200 text-gray-800 text-[11px]">
                <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="ml-0.5 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-gray-100 border border-gray-200 text-gray-800 text-[11px]">
                <span>Category: {categoryFilter}</span>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('All')}
                  className="ml-0.5 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-gray-100 border border-gray-200 text-gray-800 text-[11px] capitalize">
                <span>Status: {statusFilter}</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="ml-0.5 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {showLowStockOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold">
                <AlertTriangle size={11} className="text-amber-700" />
                <span>Low Stock Only (&lt; 5)</span>
                <button
                  type="button"
                  onClick={() => setShowLowStockOnly(false)}
                  className="ml-0.5 text-amber-700 hover:text-black cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                setSkuFilter('');
                setSearchTerm('');
                setCategoryFilter('All');
                setStatusFilter('all');
                setShowLowStockOnly(false);
              }}
              className="text-[10px] uppercase tracking-wider font-bold text-red-600 hover:text-red-800 underline ml-auto cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* 3. PRODUCT TABLE DATA GRID */}
      <div className="bg-white border border-[#14202e]/10 rounded-[2px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#fbf9f5] border-b border-[#14202e]/10 text-[10px] uppercase tracking-[0.16em] text-[#77808a]">
                <th className="py-3.5 px-4 font-semibold">Product &amp; Image</th>
                <th className="py-3.5 px-4 font-semibold">SKU / Slug</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (INR)</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">SEO Status</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14202e]/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#14202e]/30 border-t-[#14202e] rounded-full animate-spin" />
                      <span>Loading Firestore Catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <p className="font-serif text-base text-[#14202e] mb-1">
                      {skuFilter
                        ? `No products match SKU "${skuFilter}"`
                        : searchTerm
                        ? 'No products match your search'
                        : 'No products found'}
                    </p>
                    <p className="text-xs text-[#888888] mb-4">
                      {skuFilter || searchTerm || categoryFilter !== 'All' || statusFilter !== 'all' || showLowStockOnly
                        ? 'Try clearing active filters to view your complete jewelry vault.'
                        : 'Get started by creating your first fine jewelry piece.'}
                    </p>
                    {skuFilter || searchTerm || categoryFilter !== 'All' || statusFilter !== 'all' || showLowStockOnly ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSkuFilter('');
                          setSearchTerm('');
                          setCategoryFilter('All');
                          setStatusFilter('all');
                          setShowLowStockOnly(false);
                        }}
                        className="px-4 py-2 bg-[#14202e] text-white text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer hover:bg-[#c8a45d]"
                      >
                        Reset All Filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onAddNew}
                        className="px-4 py-2 bg-[#14202e] text-white text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer hover:bg-[#c8a45d]"
                      >
                        Create First Product
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const isLowStock = (prod.stock || 0) < LOW_STOCK_THRESHOLD;
                  return (
                    <tr
                      key={prod.id}
                      className={`transition-colors ${
                        isLowStock
                          ? 'bg-amber-50/70 hover:bg-amber-100/70 border-l-4 border-l-amber-500'
                          : 'hover:bg-[#fbf9f5]/50'
                      }`}
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-[2px] overflow-hidden bg-gray-100 border border-[#14202e]/10 shrink-0">
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80'}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                            {(prod.images?.length || 0) > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/70 text-[8px] text-white px-1 font-mono">
                                +{prod.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-medium text-[#14202e] block leading-snug line-clamp-1">
                                {prod.title}
                              </span>
                              {isLowStock && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300 shrink-0">
                                  <AlertTriangle size={9} className="text-amber-800" />
                                  <span>&lt; 5 Low Stock</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#77808a] block mt-0.5">
                              {prod.tags?.slice(0, 2).join(' · ') || 'Uncategorized'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Slug */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSkuFilter(skuFilter.trim().toLowerCase() === prod.sku.toLowerCase() ? '' : prod.sku)}
                            className={`font-bold transition-all cursor-pointer rounded-xs px-1.5 py-0.5 inline-flex items-center gap-1 text-left ${
                              skuFilter && prod.sku.toLowerCase().includes(skuFilter.trim().toLowerCase())
                                ? 'bg-amber-100 text-amber-950 ring-1 ring-amber-400 font-semibold'
                                : 'text-[#14202e] hover:bg-[#14202e]/5 hover:text-[#9a7a3e]'
                            }`}
                            title={
                              skuFilter.trim().toLowerCase() === prod.sku.toLowerCase()
                                ? 'Click to clear SKU filter'
                                : `Click to filter table by SKU: ${prod.sku}`
                            }
                            data-testid={`sku-filter-trigger-${prod.sku}`}
                          >
                            <Hash size={11} className="text-[#9a7a3e] shrink-0" />
                            <span>{prod.sku}</span>
                          </button>
                          {skuFilter && prod.sku.toLowerCase().includes(skuFilter.trim().toLowerCase()) && (
                            <span className="text-[8px] uppercase tracking-wider bg-amber-200 text-amber-900 px-1 py-0.2 rounded-xs font-sans font-bold">
                              Filtered
                            </span>
                          )}
                        </div>
                        <span className="text-[#888888] text-[10px] truncate max-w-[120px] block mt-0.5 font-sans">
                          /{prod.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-[#f0ebe3] text-[#14202e] rounded-xs text-[10px] uppercase font-semibold">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-serif">
                        {prod.sale_price ? (
                          <div>
                            <span className="font-semibold text-[#14202e] block">
                              ₹{prod.sale_price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-[#888888] line-through block">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-[#14202e]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        {isLowStock ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
                              <AlertTriangle size={12} className="text-amber-700 animate-pulse shrink-0" />
                              <span>{prod.stock || 0} in vault</span>
                            </span>
                            <span className="text-[9px] text-amber-800 font-semibold tracking-wide flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                              Critical (&lt; 5 threshold)
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <span>{prod.stock || 0} units</span>
                          </span>
                        )}
                      </td>

                    {/* SEO Status */}
                    <td className="py-3.5 px-4">
                      {prod.seo?.meta_title ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs font-semibold">
                          <CheckCircle2 size={11} />
                          <span>Optimized</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-xs">
                          <span>Standard</span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(prod)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
                          prod.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {prod.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreview(prod)}
                          className="p-1.5 text-gray-600 hover:text-[#9a7a3e] hover:bg-[#fbf9f5] rounded-xs cursor-pointer"
                          title="Preview Product"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyLink(prod.slug, prod.id)}
                          className="p-1.5 text-gray-600 hover:text-[#9a7a3e] hover:bg-[#fbf9f5] rounded-xs cursor-pointer"
                          title="Copy Public Link"
                        >
                          {copiedId === prod.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(prod)}
                          className="p-1.5 text-gray-600 hover:text-[#14202e] hover:bg-[#fbf9f5] rounded-xs cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.title}" from Firestore catalog?`)) {
                              onDelete(prod.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
