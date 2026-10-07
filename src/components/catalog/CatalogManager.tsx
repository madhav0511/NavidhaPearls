import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Layers,
  Plus,
  Eye,
  LogOut,
  User,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  Globe,
  Lock,
  ShieldAlert,
  KeyRound,
  Home,
  History
} from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db, validateFirestoreConnection } from '../../services/firebase';
import { recordAuditLog } from '../../services/auditLogger';
import type { CatalogProduct } from '../../types/product';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { ProductPreview } from './ProductPreview';
import { AuditLogTable } from './AuditLogTable';
import { BrandMark } from '../BrandMark';
import { Footer } from '../Footer';

// Verified authorized administrator allowlist
const AUTHORIZED_ADMIN_EMAILS = ['navidha.pearls@gmail.com', 'madhav7@gmail.com'];

export const CatalogManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'form' | 'preview' | 'audit'>('table');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Partial<CatalogProduct>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Authentication & Authorization state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      setCurrentUser(user);

      if (!user) {
        setIsAuthorized(false);
        setAuthError(null);
        setIsAuthLoading(false);
        return;
      }

      // 1. Verify against static authorized administrator email
      const email = (user.email || '').toLowerCase().trim();
      let authorized = AUTHORIZED_ADMIN_EMAILS.includes(email);

      // 2. Fallback check: query Firestore /admins/{uid} or /admins/{email}
      if (!authorized) {
        try {
          if (user.uid) {
            const adminDocByUid = await getDoc(doc(db, 'admins', user.uid));
            if (adminDocByUid.exists()) {
              authorized = true;
            }
          }
          if (!authorized && email) {
            const adminDocByEmail = await getDoc(doc(db, 'admins', email));
            if (adminDocByEmail.exists()) {
              authorized = true;
            }
          }
        } catch (err) {
          console.warn('[Catalog Manager] Firestore admin document check skipped:', err);
        }
      }

      setIsAuthorized(authorized);

      if (!authorized) {
        setAuthError(`Account "${user.email}" is not authorized for catalog administration.`);
        // Start 6-second auto-redirect countdown back to home
        setRedirectCountdown(6);
      } else {
        setAuthError(null);
        setRedirectCountdown(null);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      }

      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Countdown timer for automatic redirect of unauthorized users
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown <= 0) {
      window.location.href = '/';
      return;
    }

    countdownTimerRef.current = setInterval(() => {
      setRedirectCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [redirectCountdown]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRedirectHome = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    window.location.href = '/';
  };

  // Helper to build authenticated headers for write requests
  const getAuthHeaders = async () => {
    const token = await currentUser?.getIdToken().catch(() => '');
    return {
      'Content-Type': 'application/json',
      'x-admin-email': currentUser?.email || '',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch products from server REST API
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      if (!res.ok) throw new Error('Failed to fetch product catalog');
      const data = await res.json();
      setProducts(data.products || []);
      if (data.products && data.products.length > 0 && !previewProduct.id) {
        setPreviewProduct(data.products[0]);
      }
    } catch (err: any) {
      console.error('[Catalog Manager] Fetch error:', err);
      showToast(err.message || 'Error fetching products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
      validateFirestoreConnection();
    }
  }, [isAuthorized]);

  // Handlers
  const handleAddNew = () => {
    setSelectedProduct(null);
    setPreviewProduct({
      title: 'New Fine Jewelry Piece',
      category: 'Necklaces',
      price: 14800,
      stock: 10,
      status: 'published',
      tags: ['Certified 925 Silver', 'Freshwater Pearls'],
      images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80'],
    });
    setActiveTab('form');
  };

  const handleEdit = (prod: CatalogProduct) => {
    setSelectedProduct(prod);
    setPreviewProduct(prod);
    setActiveTab('form');
  };

  const handlePreview = (prod: CatalogProduct) => {
    setPreviewProduct(prod);
    setActiveTab('preview');
  };

  const handleSaveProduct = async (productData: Partial<CatalogProduct>) => {
    try {
      const isEdit = !!selectedProduct?.id;
      const url = isEdit ? `/api/products/${selectedProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';
      const headers = await getAuthHeaders();

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save product');
      }

      // Record administrative audit log
      await recordAuditLog({
        action: isEdit ? 'update' : 'create',
        admin_email: currentUser?.email || 'navidha.pearls@gmail.com',
        admin_uid: currentUser?.uid,
        target_id: (productData.id || selectedProduct?.id || 'new-product'),
        target_title: (productData.title || selectedProduct?.title || 'Fine Jewelry Piece'),
        details: {
          sku: productData.sku,
          price: productData.price,
          sale_price: productData.sale_price,
          stock: productData.stock,
          status: productData.status,
          category: productData.category,
        },
      });

      showToast(isEdit ? 'Product updated successfully in Firestore!' : 'Product published to catalog!');
      await fetchProducts();
      setActiveTab('table');
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const headers = await getAuthHeaders();
      const targetProd = products.find((p) => p.id === productId);
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete product');

      // Record administrative audit log
      await recordAuditLog({
        action: 'delete',
        admin_email: currentUser?.email || 'navidha.pearls@gmail.com',
        admin_uid: currentUser?.uid,
        target_id: productId,
        target_title: targetProd?.title || productId,
        details: { deleted_at: new Date().toISOString() },
      });

      showToast('Product removed from catalog.');
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleToggleStatus = async (prod: CatalogProduct) => {
    const nextStatus = prod.status === 'published' ? 'draft' : 'published';
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');

      // Record administrative audit log
      await recordAuditLog({
        action: 'status_toggle',
        admin_email: currentUser?.email || 'navidha.pearls@gmail.com',
        admin_uid: currentUser?.uid,
        target_id: prod.id,
        target_title: prod.title,
        details: { previous_status: prod.status, new_status: nextStatus },
      });

      showToast(`Status toggled to ${nextStatus}.`);
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSeedCatalog = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/products/seed', { method: 'POST', headers });
      if (!res.ok) throw new Error('Seed failed');

      // Record administrative audit log
      await recordAuditLog({
        action: 'seed',
        admin_email: currentUser?.email || 'navidha.pearls@gmail.com',
        admin_uid: currentUser?.uid,
        target_id: 'baseline-catalog',
        target_title: 'Seeded Baseline Fine Jewelry Catalog',
        details: { timestamp: new Date().toISOString() },
      });

      showToast('Baseline catalog seeded successfully.');
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to seed baseline', 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Authenticating with atelier credentials...');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast(err.message || 'Authentication failed', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setRedirectCountdown(null);
      await signOut(auth);
      showToast('Signed out of admin session.');
    } catch (err: any) {
      showToast('Sign out error', 'error');
    }
  };

  // 1. LOADING STATE — CHECKING FIREBASE AUTH CREDENTIALS
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-6 text-[#14202e] font-sans">
        <div className="text-center space-y-4">
          <BrandMark compact />
          <div className="w-6 h-6 border-2 border-[#14202e]/30 border-t-[#9a7a3e] rounded-full animate-spin mx-auto mt-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
            Verifying Atelier Authentication...
          </p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED USERS — DIRECT TO LOGIN SCREEN OR BACK TO HOME
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col justify-between font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
        {/* Navigation Bar */}
        <header className="border-b border-[#14202e]/10 py-5 px-6 bg-white/60 backdrop-blur-xs">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleRedirectHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors group font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </button>
            <BrandMark variant="catalog" />
            <button
              type="button"
              onClick={handleRedirectHome}
              className="text-xs text-[#667383] hover:text-[#14202e] uppercase tracking-wider font-medium cursor-pointer"
            >
              Home
            </button>
          </div>
        </header>

        {/* Dedicated Login Screen */}
        <main className="flex-1 flex items-center justify-center px-5 py-16">
          <div className="max-w-md w-full bg-white border border-[#14202e]/10 rounded-[2px] p-8 sm:p-10 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#fbf9f5] border border-[#14202e]/10 flex items-center justify-center mx-auto text-[#9a7a3e]">
              <Lock size={26} />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9a7a3e] font-semibold block mb-2">
                Restricted Atelier Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal leading-tight">
                Catalog &amp; Inventory Console
              </h1>
              <p className="text-xs text-[#667383] leading-relaxed mt-3">
                Authentication required. This workspace is strictly restricted to authorized Navidha atelier managers. Sign in with your Google account or return to the main storefront.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              {/* Google Sign-In Action */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-6 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.18em] font-bold rounded-xs transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-xs"
                data-testid="admin-google-signin-btn"
              >
                <KeyRound size={16} />
                <span>Sign In with Google</span>
              </button>

              {/* Redirect to Home Action */}
              <button
                type="button"
                onClick={handleRedirectHome}
                className="w-full py-3 px-6 border border-[#14202e]/20 hover:border-[#14202e] text-[#14202e] text-xs uppercase tracking-[0.16em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                data-testid="return-home-btn"
              >
                <Home size={15} />
                <span>Back to Home</span>
              </button>
            </div>

            <p className="text-[10px] text-[#888888] leading-tight pt-1">
              Secured by Firebase Authentication &amp; Firestore Zero-Trust Security Rules
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 3. AUTHENTICATED BUT UNAUTHORIZED USERS — REDIRECT BACK TO HOME OR SWITCH ACCOUNT
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col justify-between font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
        <header className="border-b border-[#14202e]/10 py-5 px-6 bg-white/60 backdrop-blur-xs">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleRedirectHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors group font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </button>
            <BrandMark variant="catalog" />
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-[#667383] hover:text-[#14202e] uppercase tracking-wider font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-5 py-16">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-[2px] p-8 sm:p-10 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-700">
              <ShieldAlert size={28} />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-700 font-bold block mb-2">
                Access Denied · Authorization Required
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal leading-tight">
                Unauthorized Account
              </h1>
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xs text-xs text-gray-700 font-mono break-all">
                Signed in as: <strong>{currentUser.email}</strong>
              </div>
              <p className="text-xs text-[#667383] leading-relaxed mt-4">
                This account does not have administrator privileges to manage the Navidha catalog.
              </p>
            </div>

            {/* Auto-redirect countdown notice */}
            {redirectCountdown !== null && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900 font-medium">
                Redirecting back to home in <strong>{redirectCountdown}</strong> seconds...
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleRedirectHome}
                className="w-full py-3.5 px-6 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] text-xs uppercase tracking-[0.18em] font-bold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Home size={15} />
                <span>Return to Home Now</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 px-6 border border-[#14202e]/20 hover:border-[#14202e] text-[#14202e] text-xs uppercase tracking-[0.16em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Switch Google Account</span>
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 4. VERIFIED AUTHORIZED ADMINISTRATOR CONSOLE
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xs shadow-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-all ${
            toastMessage.type === 'success'
              ? 'bg-[#14202e] text-[#f8f1e4] border-[#c8a45d]'
              : 'bg-red-900 text-white border-red-500'
          }`}
        >
          <CheckCircle2 size={16} className={toastMessage.type === 'success' ? 'text-[#c8a45d]' : 'text-white'} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Security Strip */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-5 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#c8a45d]" />
          <span className="text-[10px] uppercase tracking-[0.18em]">
            Navidha Atelier Management Console · Authorized Session
          </span>
        </div>

        {/* Authorized User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Admin" className="w-5 h-5 rounded-full" />
            ) : (
              <User size={13} className="text-[#c8a45d]" />
            )}
            <span className="text-[11px] text-[#b8c0c8] font-mono font-medium">
              {currentUser.email}
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-900 text-emerald-300 text-[9px] uppercase font-bold rounded-xs tracking-wider">
              Verified Administrator
            </span>
            {products.filter((p) => (p.stock || 0) < 5).length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className="px-1.5 py-0.5 bg-amber-900/90 text-amber-200 text-[9px] uppercase font-bold rounded-xs tracking-wider flex items-center gap-1 border border-amber-600/60 cursor-pointer hover:bg-amber-800"
                title="View products needing restock (< 5 units)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                <span>{products.filter((p) => (p.stock || 0) < 5).length} Low Stock (&lt; 5)</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-white uppercase tracking-wider cursor-pointer ml-2 transition-colors"
              title="Sign Out of Admin Console"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-16 sm:h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRedirectHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group font-semibold cursor-pointer"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </button>
          </div>

          <a href="/" className="flex items-center gap-3" aria-label="Navidha Home">
            <BrandMark variant="catalog" />
            <div className="text-left hidden sm:block">
              <span className="font-serif text-xl tracking-[0.2em] uppercase text-[#14202e] font-light block leading-none">
                Navidha
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-[#9a7a3e] mt-0.5 block">
                Catalog &amp; SEO Engine
              </span>
            </div>
          </a>

          {/* Tab Switcher in Header */}
          <div className="flex items-center bg-white border border-[#14202e]/15 p-1 rounded-xs gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'table' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
              }`}
              data-testid="tab-catalog-table"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Catalog Table</span>
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'form' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
              }`}
              data-testid="tab-add-product"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">{selectedProduct ? 'Edit Piece' : 'Add Piece'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'preview' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
              }`}
              data-testid="tab-preview"
            >
              <Eye size={13} />
              <span className="hidden sm:inline">Storefront Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-[#14202e] text-white font-semibold' : 'text-[#667383] hover:text-[#14202e]'
              }`}
              data-testid="tab-audit-logs"
            >
              <History size={13} />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Work Area */}
      <main className="flex-1 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 py-8 sm:py-12 w-full">
        {activeTab === 'table' && (
          <ProductTable
            products={products}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
            onPreview={handlePreview}
            onSeedCatalog={handleSeedCatalog}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogTable adminEmail={currentUser.email || 'navidha.pearls@gmail.com'} />
        )}

        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ProductForm
                initialProduct={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={() => setActiveTab('table')}
                onUpdatePreview={(updatedData) => setPreviewProduct((prev) => ({ ...prev, ...updatedData }))}
              />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-28">
                <span className="eyebrow text-[#9a7a3e] block mb-2">Real-Time Visualizer</span>
                <ProductPreview product={previewProduct} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#14202e]/10">
              <div>
                <span className="eyebrow text-[#9a7a3e]">Storefront Simulator</span>
                <h2 className="font-serif text-2xl text-[#14202e]">
                  Previewing: {previewProduct.title || 'Selected Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className="px-4 py-2 border border-[#14202e]/20 text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#14202e] hover:text-white transition-colors cursor-pointer"
              >
                Back to Table
              </button>
            </div>
            <ProductPreview product={previewProduct} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
