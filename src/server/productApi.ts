import type { IncomingMessage, ServerResponse } from 'http';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type { CatalogProduct, AuditLogEntry } from '../types/product';
import fs from 'fs';
import path from 'path';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100);
}

// In-memory fallback caches to ensure instant resilience
let memoryProducts: CatalogProduct[] = [];
let memoryAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-baseline-init',
    action: 'seed',
    admin_email: 'navidha.pearls@gmail.com',
    target_id: 'baseline-catalog',
    target_title: 'Navidha Heirloom Fine Jewelry Catalog',
    details: { system: 'Atelier Core Initialization' },
    timestamp: new Date().toISOString(),
  },
];

async function recordServerAuditLog(
  action: 'create' | 'update' | 'delete' | 'status_toggle' | 'seed',
  adminEmail: string,
  targetId: string,
  targetTitle: string,
  details: Record<string, any> = {}
) {
  const timestamp = new Date().toISOString();
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry: AuditLogEntry = {
    id,
    action,
    admin_email: adminEmail || 'navidha.pearls@gmail.com',
    target_id: targetId,
    target_title: targetTitle,
    details,
    timestamp,
  };

  memoryAuditLogs.unshift(entry);
  if (memoryAuditLogs.length > 200) memoryAuditLogs.pop();

  try {
    await setDoc(doc(db, 'audit_logs', id), entry);
    console.log(`[Server AuditLog] Saved ${action} for ${targetId} by ${adminEmail}`);
  } catch (err) {
    console.warn('[Server AuditLog] Firestore write warning:', err);
  }
}

const AUTHORIZED_ADMIN_EMAILS = ['navidha.pearls@gmail.com', 'madhav7@gmail.com'];

function isAuthorizedAdminRequest(req: IncomingMessage): boolean {
  const adminEmail = (req.headers['x-admin-email'] as string || '').toLowerCase().trim();
  const authHeader = (req.headers['authorization'] as string || '').trim();

  if (adminEmail && AUTHORIZED_ADMIN_EMAILS.includes(adminEmail)) {
    return true;
  }
  if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 15) {
    return true;
  }
  return false;
}

// Initial starter products mapped from Navidha heirloom jewelry
const INITIAL_SEED_PRODUCTS: Omit<CatalogProduct, 'created_at' | 'updated_at'>[] = [
  {
    id: 'moonlit-pearl-collar',
    title: 'Moonlit Pearl Collar',
    slug: 'moonlit-pearl-collar',
    description: 'A soft strand of organic freshwater pearls held in a sculptural 925 sterling silver embrace. Features an adjustable 16–18 inch extender chain.',
    sku: 'NVD-NECK-001',
    price: 14800,
    sale_price: 12900,
    stock: 12,
    category: 'Necklaces',
    tags: ['Freshwater Pearl', '925 Silver', 'Bestseller', 'Collar'],
    attributes: {
      Material: 'Certified 925 Sterling Silver',
      Pearl: 'Freshwater Basra Cultivation',
      Length: '16–18 in Adjustable',
      Finish: 'Anti-Tarnish Rhodium Polish',
    },
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    ],
    seo: {
      meta_title: 'Moonlit Pearl Collar Necklace | Navidha Pearls',
      meta_description: 'Acquire the Moonlit Pearl Collar: handcrafted freshwater pearls set in 925 hallmarked sterling silver. Complimentary insured shipping across India.',
      canonical_url: 'https://navidhapearls.com/products/moonlit-pearl-collar',
      og_image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      keywords: ['pearl collar necklace', '925 silver necklace', 'freshwater pearls', 'luxury bridal jewelry'],
    },
    status: 'published',
  },
  {
    id: 'kundan-gulabi-meenakari-jhumka',
    title: 'Gulabi Meenakari Royal Jhumka',
    slug: 'gulabi-meenakari-royal-jhumka',
    description: 'Authentic Varanasi GI-certified Gulabi Meenakari bell jhumkas hand-painted with squirrel-hair brushes and fired at 800°C. Accented with natural seed pearls.',
    sku: 'NVD-EAR-002',
    price: 18500,
    sale_price: null,
    stock: 8,
    category: 'Earrings',
    tags: ['Gulabi Meenakari', 'Varanasi Craft', 'GI Tagged', 'Jhumka', 'Heritage'],
    attributes: {
      Craft: 'Varanasi Gulabi Meenakari (GI Tagged)',
      Base: '925 Sterling Silver with 24K Gold Gilt',
      Stones: 'Basra Seed Pearls & Polki Glass',
      Weight: '22 grams per pair',
    },
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    ],
    seo: {
      meta_title: 'Gulabi Meenakari Royal Jhumkas | Navidha Heritage',
      meta_description: 'Varanasi GI-tagged Gulabi Meenakari jhumkas hand-painted in delicate rose pink enamel on pure silver. Heirloom Indian jewelry by Navidha.',
      canonical_url: 'https://navidhapearls.com/products/gulabi-meenakari-royal-jhumka',
      og_image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=80',
      keywords: ['Gulabi Meenakari jhumka', 'Varanasi enamel earrings', 'heritage Indian jewelry', 'GI craft silver'],
    },
    status: 'published',
  },
  {
    id: 'pratapgarh-thewa-statement-ring',
    title: 'Thewa Royal Peacock Signet Ring',
    slug: 'thewa-royal-peacock-signet-ring',
    description: 'Centuries-old Rajasthani Thewa technique featuring 24K pure gold leaf etched with royal peacock motifs and vitrified onto terracotta-red Belgian glass.',
    sku: 'NVD-RING-003',
    price: 9800,
    sale_price: 8900,
    stock: 15,
    category: 'Rings',
    tags: ['Thewa Art', 'Pratapgarh', '24K Gold Foil', 'Sculptural Ring'],
    attributes: {
      Craft: 'Pratapgarh Thewa (GI Certified)',
      Metal: '925 Sterling Silver Bezel & Band',
      Glass: 'Terracotta Red Vitrified Glass',
      Foil: '24 Karat Pure Gold Leaf',
    },
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    ],
    seo: {
      meta_title: 'Thewa Royal Peacock Signet Ring | Navidha',
      meta_description: 'Handcrafted 24K pure gold sheet fused on colored glass: Pratapgarh Thewa peacock signet ring in 925 sterling silver.',
      canonical_url: 'https://navidhapearls.com/products/thewa-royal-peacock-signet-ring',
      og_image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      keywords: ['Thewa ring', '24k gold glass ring', 'Pratapgarh jewelry', 'peacock signet ring'],
    },
    status: 'published',
  },
  {
    id: 'tarakasi-filigree-cuff',
    title: 'Tarakasi Silver Filigree Open Cuff',
    slug: 'tarakasi-silver-filigree-open-cuff',
    description: 'Featherlight lace spun from gossamer-thin 925 silver wire by master Tarakasi artisans in Karimnagar and Cuttack. Designed with open flexible cuff architecture.',
    sku: 'NVD-BRAC-004',
    price: 11200,
    sale_price: null,
    stock: 6,
    category: 'Bracelets',
    tags: ['Tarakasi', 'Filigree', 'Silver Wire Art', 'Cuff'],
    attributes: {
      Craft: 'Karimnagar & Cuttack Tarakasi Filigree',
      Metal: '925 Certified Sterling Silver',
      Band: 'Flexible Open Architectural Fit',
    },
    images: [
      'https://images.unsplash.com/photo-1611591475871-34449830507a?auto=format&fit=crop&w=1200&q=80',
    ],
    seo: {
      meta_title: 'Tarakasi Silver Filigree Open Cuff | Navidha',
      meta_description: 'Spun micro-gauge silver wire crafted into exquisite Tarakasi filigree cuff. Certified 925 sterling silver. Buy online with complimentary insured delivery.',
      canonical_url: 'https://navidhapearls.com/products/tarakasi-silver-filigree-open-cuff',
      og_image: 'https://images.unsplash.com/photo-1611591475871-34449830507a?auto=format&fit=crop&w=1200&q=80',
      keywords: ['silver filigree cuff', 'Tarakasi bracelet', 'Karimnagar silver wire', '925 silver cuff'],
    },
    status: 'published',
  },
];

// Helper to seed Firestore if empty
async function ensureSeeded() {
  if (memoryProducts.length === 0) {
    const now = new Date().toISOString();
    memoryProducts = INITIAL_SEED_PRODUCTS.map((p) => ({
      ...p,
      created_at: now,
      updated_at: now,
    }));
  }

  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.empty) {
      console.log('[Product API] Firestore collection empty. Seeding initial catalog...');
      const now = new Date().toISOString();
      for (const item of INITIAL_SEED_PRODUCTS) {
        const prodData: CatalogProduct = {
          ...item,
          created_at: now,
          updated_at: now,
        };
        await setDoc(doc(db, 'products', item.id), prodData);
      }
      console.log('[Product API] Firestore seeded with', INITIAL_SEED_PRODUCTS.length, 'products.');
    }
  } catch (err) {
    console.warn('[Product API] Note: Using memory catalog alongside Firestore:', err);
  }
}

export async function handleProductApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const parsedUrl = new URL(req.url || '', 'http://localhost:3000');
  const pathname = parsedUrl.pathname;

  // 1. Image Upload Handler: POST /api/upload/image
  if (pathname === '/api/upload/image' && req.method === 'POST') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to upload assets.' }));
      return true;
    }

    let bodyText = '';
    req.on('data', (chunk) => {
      bodyText += chunk;
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(bodyText || '{}');
        const base64Data = data.base64 || '';
        const fileName = (data.fileName || `product-img-${Date.now()}.jpg`).replace(/[^a-zA-Z0-9._-]/g, '_');

        if (!base64Data) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No image data provided.' }));
          return;
        }

        const uploadsDir = path.resolve('public/uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/${fileName}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: publicUrl, fileName }));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Image upload failed.' }));
      }
    });
    return true;
  }

  // 2. Seed Catalog Route: POST /api/products/seed
  if (pathname === '/api/products/seed' && req.method === 'POST') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to seed catalog.' }));
      return true;
    }

    try {
      const now = new Date().toISOString();
      const adminEmail = (req.headers['x-admin-email'] as string) || 'navidha.pearls@gmail.com';
      for (const item of INITIAL_SEED_PRODUCTS) {
        const prodData: CatalogProduct = {
          ...item,
          created_at: now,
          updated_at: now,
        };
        await setDoc(doc(db, 'products', item.id), prodData);
      }
      await recordServerAuditLog('seed', adminEmail, 'baseline-catalog', 'Seeded Baseline Fine Jewelry Catalog', {
        count: INITIAL_SEED_PRODUCTS.length,
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Catalog seeded successfully.', count: INITIAL_SEED_PRODUCTS.length }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Failed to seed database.' }));
    }
    return true;
  }

  // 3. GET /api/products (Paginated list with search, tag, category, and status filters)
  if (pathname === '/api/products' && req.method === 'GET') {
    await ensureSeeded();

    const page = Math.max(1, parseInt(parsedUrl.searchParams.get('page') || '1', 10));
    const limitParam = Math.max(1, parseInt(parsedUrl.searchParams.get('limit') || '20', 10));
    const search = (parsedUrl.searchParams.get('search') || '').toLowerCase().trim();
    const category = parsedUrl.searchParams.get('category') || '';
    const status = parsedUrl.searchParams.get('status') || '';
    const tag = (parsedUrl.searchParams.get('tag') || '').toLowerCase().trim();

    try {
      let allProducts: CatalogProduct[] = [];

      try {
        const snapshot = await getDocs(collection(db, 'products'));
        snapshot.forEach((d) => {
          allProducts.push(d.data() as CatalogProduct);
        });
      } catch (fsErr) {
        console.warn('[Product API] Firestore read fallback to memory:', fsErr);
      }

      // Merge with memoryProducts ensuring uniqueness by ID
      const map = new Map<string, CatalogProduct>();
      for (const p of memoryProducts) map.set(p.id, p);
      for (const p of allProducts) map.set(p.id, p);
      let list = Array.from(map.values()).map((p) => {
        const threshold = p.low_stock_threshold !== undefined ? p.low_stock_threshold : 10;
        const stock = p.stock ?? 0;
        return {
          ...p,
          low_stock_threshold: threshold,
          is_low_stock: stock <= threshold,
        };
      });

      const lowStockOnly = parsedUrl.searchParams.get('low_stock') === 'true';
      if (lowStockOnly) {
        list = list.filter((p) => p.is_low_stock);
      }

      // Apply Filters
      if (status && status !== 'all') {
        list = list.filter((p) => p.status === status);
      }

      if (category && category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (tag) {
        list = list.filter((p) => (p.tags || []).some((t) => t.toLowerCase().includes(tag)));
      }

      if (search) {
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.sku.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(search))
        );
      }

      // Sort by updated_at descending
      list.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

      const total = list.length;
      const totalPages = Math.ceil(total / limitParam);
      const startIndex = (page - 1) * limitParam;
      const paginatedProducts = list.slice(startIndex, startIndex + limitParam);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          products: paginatedProducts,
          total,
          page,
          limit: limitParam,
          totalPages,
        })
      );
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Error listing products.' }));
    }
    return true;
  }

  // 4. GET /api/products/:slug (Public-facing SEO endpoint fetching single product data)
  if (pathname.startsWith('/api/products/') && req.method === 'GET') {
    await ensureSeeded();
    const identifier = pathname.replace('/api/products/', '').trim();

    try {
      let found: CatalogProduct | null = null;

      // 1. Try directly by doc ID in Firestore
      try {
        const docSnap = await getDoc(doc(db, 'products', identifier));
        if (docSnap.exists()) {
          found = docSnap.data() as CatalogProduct;
        }
      } catch {}

      // 2. Try by slug query in Firestore
      if (!found) {
        try {
          const q = query(collection(db, 'products'), where('slug', '==', identifier), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            found = snap.docs[0].data() as CatalogProduct;
          }
        } catch {}
      }

      // 3. Fallback search in memory cache
      if (!found) {
        found = memoryProducts.find((p) => p.slug === identifier || p.id === identifier) || null;
      }

      if (!found) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Product not found for slug or id: ${identifier}` }));
        return true;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ product: found }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Error fetching product.' }));
    }
    return true;
  }

  // 5. POST /api/products (Admin product creation)
  if (pathname === '/api/products' && req.method === 'POST') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to create products.' }));
      return true;
    }

    let bodyText = '';
    req.on('data', (chunk) => {
      bodyText += chunk;
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(bodyText || '{}');
        const now = new Date().toISOString();

        if (!data.title || !data.sku || data.price === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Title, SKU, and Price are required.' }));
          return;
        }

        const id = data.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const slug = slugify(data.slug || data.title);

        const stock = Number(data.stock ?? 0);
        const low_stock_threshold = Number(data.low_stock_threshold ?? 10);
        const is_low_stock = stock <= low_stock_threshold;

        const newProduct: CatalogProduct = {
          id,
          title: data.title.trim(),
          slug,
          description: data.description || '',
          sku: data.sku.trim().toUpperCase(),
          price: Number(data.price),
          sale_price: data.sale_price ? Number(data.sale_price) : null,
          stock,
          low_stock_threshold,
          is_low_stock,
          category: data.category || 'Fine Jewelry',
          tags: Array.isArray(data.tags) ? data.tags : [],
          attributes: typeof data.attributes === 'object' ? data.attributes : {},
          images: Array.isArray(data.images) ? data.images : [],
          seo: {
            meta_title: (data.seo?.meta_title || `${data.title} | Navidha`).slice(0, 60),
            meta_description: (data.seo?.meta_description || data.description || '').slice(0, 160),
            canonical_url: data.seo?.canonical_url || `https://navidhapearls.com/products/${slug}`,
            og_image: data.seo?.og_image || data.images?.[0] || '',
            keywords: Array.isArray(data.seo?.keywords) ? data.seo.keywords : [],
          },
          status: data.status === 'draft' ? 'draft' : 'published',
          created_at: now,
          updated_at: now,
        };

        // Write to Firestore
        try {
          await setDoc(doc(db, 'products', id), newProduct);
        } catch (fsErr) {
          console.warn('[Product API] Firestore write warning, caching in memory:', fsErr);
        }

        // Cache in memory
        memoryProducts.unshift(newProduct);

        const adminEmail = (req.headers['x-admin-email'] as string) || 'navidha.pearls@gmail.com';
        await recordServerAuditLog('create', adminEmail, id, newProduct.title, {
          sku: newProduct.sku,
          price: newProduct.price,
          category: newProduct.category,
          status: newProduct.status,
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ product: newProduct, message: 'Product created successfully.' }));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Failed to create product.' }));
      }
    });
    return true;
  }

  // 6. PUT /api/products/:id (Admin update)
  if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to update products.' }));
      return true;
    }

    const id = pathname.replace('/api/products/', '').trim();
    let bodyText = '';
    req.on('data', (chunk) => {
      bodyText += chunk;
    });

    req.on('end', async () => {
      try {
        const updates = JSON.parse(bodyText || '{}');
        const now = new Date().toISOString();

        if (updates.slug) updates.slug = slugify(updates.slug);
        updates.updated_at = now;

        // Fetch existing to ensure complete document validation
        let existingDoc: any = memoryProducts.find((p) => p.id === id);
        try {
          const snap = await getDoc(doc(db, 'products', id));
          if (snap.exists()) {
            existingDoc = snap.data();
          }
        } catch {}

        const finalStock = updates.stock !== undefined ? Number(updates.stock) : Number(existingDoc?.stock ?? 0);
        const finalThreshold = updates.low_stock_threshold !== undefined ? Number(updates.low_stock_threshold) : Number(existingDoc?.low_stock_threshold ?? 10);
        updates.stock = finalStock;
        updates.low_stock_threshold = finalThreshold;
        updates.is_low_stock = finalStock <= finalThreshold;

        const mergedProduct: CatalogProduct = {
          ...(existingDoc || {}),
          ...updates,
          id,
          updated_at: now,
        };

        // Update in Firestore
        try {
          await setDoc(doc(db, 'products', id), mergedProduct);
        } catch (fsErr) {
          console.warn('[Product API] Firestore write warning, fallback to memory:', fsErr);
        }

        // Update in memory
        const memIdx = memoryProducts.findIndex((p) => p.id === id);
        if (memIdx >= 0) {
          memoryProducts[memIdx] = mergedProduct;
        } else {
          memoryProducts.unshift(mergedProduct);
        }

        const adminEmail = (req.headers['x-admin-email'] as string) || 'navidha.pearls@gmail.com';
        await recordServerAuditLog('update', adminEmail, id, mergedProduct.title, updates);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product updated successfully.', product: mergedProduct }));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Failed to update product.' }));
      }
    });
    return true;
  }

  // 7. DELETE /api/products/:id (Admin deletion)
  if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to delete products.' }));
      return true;
    }

    const id = pathname.replace('/api/products/', '').trim();
    try {
      const existingProd = memoryProducts.find((p) => p.id === id);
      const title = existingProd?.title || id;

      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (fsErr) {
        console.warn('[Product API] Firestore delete warning:', fsErr);
      }

      memoryProducts = memoryProducts.filter((p) => p.id !== id);

      const adminEmail = (req.headers['x-admin-email'] as string) || 'navidha.pearls@gmail.com';
      await recordServerAuditLog('delete', adminEmail, id, title, { deleted_at: new Date().toISOString() });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product deleted successfully.', id }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Failed to delete product.' }));
    }
    return true;
  }

  // 8. GET /api/audit-logs (Admin Audit Logs Trail)
  if (pathname === '/api/audit-logs' && req.method === 'GET') {
    if (!isAuthorizedAdminRequest(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access Denied: Admin authorization required to view audit logs.' }));
      return true;
    }

    try {
      const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));
      const snap = await getDocs(q);
      const logs: AuditLogEntry[] = [];
      snap.forEach((d) => logs.push(d.data() as AuditLogEntry));
      if (logs.length > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ logs }));
        return true;
      }
    } catch (err: any) {
      console.warn('[Server AuditLog] Firestore query fallback to memory:', err.message);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ logs: memoryAuditLogs }));
    return true;
  }

  return false;
}
