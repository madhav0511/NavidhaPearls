export interface ProductSEO {
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  og_image?: string;
  keywords?: string[];
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  sale_price?: number | null;
  stock: number;
  low_stock_threshold?: number;
  is_low_stock?: boolean;
  category: string;
  tags: string[];
  attributes: Record<string, string>;
  images: string[];
  seo: ProductSEO;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ProductFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'all' | 'draft' | 'published';
  tag?: string;
  sortBy?: 'created_at' | 'price' | 'stock' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'status_toggle' | 'seed';
  admin_email: string;
  admin_uid?: string;
  target_id: string;
  target_title: string;
  details?: Record<string, any>;
  timestamp: string;
}
