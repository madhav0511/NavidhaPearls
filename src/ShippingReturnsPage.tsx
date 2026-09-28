import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Mail,
  MessageCircle,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  FileText,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useScrollToTopOnMount } from './hooks/useScrollToTop';

export const ShippingReturnsPage: React.FC = () => {
  useScrollToTopOnMount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shipping' | 'tracking' | 'returns' | 'contact'>('shipping');

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Top Banner */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block">Navidha Fulfillment & Client Assurance</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>100% Insured Delivery</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>15-Day Easy Doorstep Returns</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          {/* Back to Boutique */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group"
              data-testid="back-to-boutique-link"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </a>
          </div>

          {/* Centered Brand Mark */}
          <div className="text-center">
            <a href="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase text-[#14202e] font-light">
                Navidha
              </span>
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#9a7a3e] mt-0.5">
                HYDERABAD - INDIA
              </span>
            </a>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.16em] text-[#667383]">
            <a href="/faq.html" className="hover:text-[#9a7a3e] transition-colors">
              Care & FAQ
            </a>
            <a href="/faq.html#size-guide" className="hover:text-[#9a7a3e] transition-colors">
              Size Guide
            </a>
            <a href="/shipping-returns.html" className="text-[#9a7a3e] font-semibold transition-colors">
              Shipping & Returns
            </a>
            <a
              href="mailto:navidha.pearls@gmail.com?subject=Fulfillment%20Inquiry"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] transition-colors rounded-[2px]"
            >
              <Mail size={13} />
              <span>Concierge</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#14202e]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#fbf9f5] border-b border-[#14202e]/10 px-6 py-4 space-y-3 text-xs uppercase tracking-[0.16em]">
            <a
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#14202e] font-semibold"
            >
              ← Back to Shop / Collection
            </a>
            <a
              href="/shipping-returns.html"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#9a7a3e] font-semibold"
            >
              Shipping & Returns
            </a>
            <a
              href="/faq.html"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#667383] hover:text-[#14202e]"
            >
              Client Care & FAQ
            </a>
            <a
              href="/faq.html#size-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-[#667383] hover:text-[#14202e]"
            >
              Sizing & Measurement Guide
            </a>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pt-6">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#667383]">
            <a href="/" className="hover:text-[#14202e]">Boutique</a>
            <span>/</span>
            <span className="text-[#9a7a3e]">Shipping & Returns</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="py-14 sm:py-20 px-5 sm:px-8 lg:px-16 border-b border-[#14202e]/10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Sparkles size={14} className="text-[#9a7a3e]" />
              <p className="eyebrow text-[#9a7a3e]">
                Fulfillment & Post-Purchase Confidence
              </p>
              <Sparkles size={14} className="text-[#9a7a3e]" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#14202e] font-normal tracking-[-0.02em] leading-[1.15]">
              Insured Shipping & <em className="text-[#9a7a3e] italic">Doorstep Returns</em>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#667383] leading-relaxed max-w-2xl mx-auto">
              Every Navidha creation is handled with utmost reverence. From atelier inspection to express insured transit and complimentary doorstep reverse pickups, discover our full fulfillment standards.
            </p>

            {/* Quick 4 Trust Pillars */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <Truck size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">Complimentary Delivery</h2>
                <p className="text-[11px] text-[#667383] mt-1">2–4 business days across major Indian metros.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <ShieldCheck size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">100% Insured</h2>
                <p className="text-[11px] text-[#667383] mt-1">Fully protected transit until in your hands.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <RotateCcw size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">15-Day Returns</h2>
                <p className="text-[11px] text-[#667383] mt-1">Complimentary home reverse collection.</p>
              </div>

              <div className="p-4 bg-[#f4efe8] border border-[#14202e]/10 rounded-[2px]">
                <Package size={18} className="text-[#9a7a3e] mb-2" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#14202e]">Discreet Packaging</h2>
                <p className="text-[11px] text-[#667383] mt-1">Unbranded outer carton for security & surprise.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <section className="bg-[#f4efe8] border-b border-[#14202e]/10 sticky top-20 z-30">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 flex overflow-x-auto gap-2 py-3 justify-start sm:justify-center">
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] whitespace-nowrap rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'shipping'
                  ? 'bg-[#14202e] text-[#f8f1e4]'
                  : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e]'
              }`}
            >
              1. Shipping Methods & Timelines
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] whitespace-nowrap rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-[#14202e] text-[#f8f1e4]'
                  : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e]'
              }`}
            >
              2. Order Tracking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('returns')}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] whitespace-nowrap rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'returns'
                  ? 'bg-[#14202e] text-[#f8f1e4]'
                  : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e]'
              }`}
            >
              3. Returns & Exchange Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] whitespace-nowrap rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#14202e] text-[#f8f1e4]'
                  : 'bg-[#fbf9f5] text-[#667383] hover:text-[#14202e]'
              }`}
            >
              4. Fulfillment Inquiries
            </button>
          </div>
        </section>

        {/* Tab 1: Shipping Methods & Timelines */}
        {(activeTab === 'shipping' || activeTab === 'tracking' || activeTab === 'returns' || activeTab === 'contact') && (
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-16 py-16 space-y-16">
            {/* Section 1: Methods & Timelines */}
            <div id="shipping-methods" className="scroll-mt-36">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-[#9a7a3e]" />
                <span className="eyebrow text-[#9a7a3e]">Delivery Service</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14202e] mb-4">
                Shipping Methods, Timelines & Express Delivery
              </h2>
              <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                All orders are prepared, calibrated, and packed inside our specialized atelier in Jaipur. We partner exclusively with premium secure logistics couriers (Blue Dart Apex, Delhivery Express, and Sequel Secure Logistics) to ensure rapid, fully insured transit.
              </p>

              <div className="overflow-x-auto bg-[#fbf9f5] border border-[#14202e]/10 rounded-[2px]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#14202e]/15 text-[#14202e] uppercase tracking-wider text-[11px] bg-[#f4efe8]">
                      <th className="py-3.5 px-5 font-semibold">Tier</th>
                      <th className="py-3.5 px-5 font-semibold">Destination</th>
                      <th className="py-3.5 px-5 font-semibold">Estimated Time</th>
                      <th className="py-3.5 px-5 font-semibold">Pricing</th>
                      <th className="py-3.5 px-5 font-semibold">Courier Partner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#14202e]/10 text-[#667383]">
                    <tr>
                      <td className="py-4 px-5 font-medium text-[#14202e]">Standard Insured</td>
                      <td className="py-4 px-5">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune</td>
                      <td className="py-4 px-5">2 to 4 business days</td>
                      <td className="py-4 px-5 font-semibold text-[#14202e]">Complimentary</td>
                      <td className="py-4 px-5">Blue Dart Air / Sequel</td>
                    </tr>
                    <tr className="bg-[#f4efe8]/40">
                      <td className="py-4 px-5 font-medium text-[#14202e]">Standard Insured</td>
                      <td className="py-4 px-5">Tier 2 cities & rest of India</td>
                      <td className="py-4 px-5">3 to 6 business days</td>
                      <td className="py-4 px-5 font-semibold text-[#14202e]">Complimentary</td>
                      <td className="py-4 px-5">Delhivery Express Air</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-5 font-medium text-[#14202e]">Same-Day / Next-Day Express</td>
                      <td className="py-4 px-5">Jaipur & Delhi NCR Metro (on select catalogue items)</td>
                      <td className="py-4 px-5">24 hours from atelier confirmation</td>
                      <td className="py-4 px-5 font-semibold text-[#14202e]">₹500 (Waived above ₹25,000)</td>
                      <td className="py-4 px-5">Priority Courier Concierge</td>
                    </tr>
                    <tr className="bg-[#f4efe8]/40">
                      <td className="py-4 px-5 font-medium text-[#14202e]">International Courier</td>
                      <td className="py-4 px-5">UK, UAE, Singapore, US, Canada, Europe</td>
                      <td className="py-4 px-5">5 to 9 business days</td>
                      <td className="py-4 px-5 font-semibold text-[#14202e]">Calculated at checkout</td>
                      <td className="py-4 px-5">DHL Express Worldwide</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                  <h3 className="text-xs font-bold text-[#14202e] uppercase tracking-wider mb-1">Dispatch Window</h3>
                  <p className="text-xs text-[#667383]">
                    Orders placed before 2:00 PM IST on business days are scheduled for atelier inspection and dispatch within 24 hours.
                  </p>
                </div>
                <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                  <h3 className="text-xs font-bold text-[#14202e] uppercase tracking-wider mb-1">100% In-Transit Cover</h3>
                  <p className="text-xs text-[#667383]">
                    Every parcel is fully underwritten by comprehensive marine transit insurance against theft, loss, or transit damage.
                  </p>
                </div>
                <div className="p-4 bg-[#f4efe8] rounded-[2px] border border-[#14202e]/10">
                  <h3 className="text-xs font-bold text-[#14202e] uppercase tracking-wider mb-1">Discreet Outer Cartons</h3>
                  <p className="text-xs text-[#667383]">
                    Shipped in anonymous, tamper-evident security cartons without external product markings to ensure surprise and security.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Order Tracking */}
            <div id="order-tracking" className="scroll-mt-36 pt-10 border-t border-[#14202e]/10">
              <div className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-[#9a7a3e]" />
                <span className="eyebrow text-[#9a7a3e]">Transparency</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14202e] mb-4">
                Live Order Tracking Information
              </h2>
              <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                From the moment your piece departs our atelier, you have complete visibility over its route.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#fbf9f5] border border-[#14202e]/10 rounded-[2px] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#9a7a3e]">STEP 01</span>
                    <h3 className="font-serif text-lg text-[#14202e] mt-1 mb-2">Order Confirmation</h3>
                    <p className="text-xs text-[#667383] leading-relaxed">
                      You receive an instant email and SMS receipt containing your unique 8-digit Navidha Order ID immediately after order placement.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#14202e]/10 text-[11px] text-[#14202e] font-medium">
                    Atelier Quality Check & Polish
                  </div>
                </div>

                <div className="p-6 bg-[#fbf9f5] border border-[#14202e]/10 rounded-[2px] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#9a7a3e]">STEP 02</span>
                    <h3 className="font-serif text-lg text-[#14202e] mt-1 mb-2">Live Tracking Dispatch Link</h3>
                    <p className="text-xs text-[#667383] leading-relaxed">
                      Upon carrier handoff, an automated tracking link is sent with real-time waypoint milestones and estimated hour of arrival.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#14202e]/10 text-[11px] text-[#14202e] font-medium">
                    Air Transit & Security Seals Active
                  </div>
                </div>

                <div className="p-6 bg-[#fbf9f5] border border-[#14202e]/10 rounded-[2px] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#9a7a3e]">STEP 03</span>
                    <h3 className="font-serif text-lg text-[#14202e] mt-1 mb-2">Secure OTP Delivery</h3>
                    <p className="text-xs text-[#667383] leading-relaxed">
                      For high-value parcels, delivery is released strictly upon one-time password (OTP) verification on the recipient's mobile number.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#14202e]/10 text-[11px] text-[#14202e] font-medium">
                    Hand-Delivered Signature Receipt
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Return & Exchange Policy */}
            <div id="returns-policy" className="scroll-mt-36 pt-10 border-t border-[#14202e]/10">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw size={16} className="text-[#9a7a3e]" />
                <span className="eyebrow text-[#9a7a3e]">15-Day Policy</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#14202e] mb-4">
                Return & Exchange Policy, Conditions & Step-by-Step Process
              </h2>
              <p className="text-xs sm:text-sm text-[#667383] leading-relaxed mb-6">
                We believe acquiring fine jewelry should be joyous and effortless. If you wish to exchange for an alternative size or return for a full refund, our 15-day return window ensures zero stress.
              </p>

              {/* 3 Step Process Cards */}
              <div className="p-6 sm:p-8 bg-[#101a26] text-[#f8f1e4] rounded-[2px] mb-8">
                <h3 className="font-serif text-2xl mb-6 text-[#f8f1e4]">
                  How to Initiate a Doorstep Return or Exchange
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-[2px]">
                    <div className="flex items-center gap-2 text-[#c8a45d] text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="h-5 w-5 rounded-full bg-[#c8a45d] text-[#14202e] inline-flex items-center justify-center text-[10px] font-bold">1</span>
                      Notify Concierge
                    </div>
                    <p className="text-xs text-[#b8c0c8] leading-relaxed">
                      Share your Order ID and reason for return or requested exchange size via WhatsApp (+91 98765 43210) or email (navidha.pearls@gmail.com).
                    </p>
                  </div>

                  <div className="p-5 bg-white/5 border border-white/10 rounded-[2px]">
                    <div className="flex items-center gap-2 text-[#c8a45d] text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="h-5 w-5 rounded-full bg-[#c8a45d] text-[#14202e] inline-flex items-center justify-center text-[10px] font-bold">2</span>
                      Complimentary Pickup
                    </div>
                    <p className="text-xs text-[#b8c0c8] leading-relaxed">
                      Our secure courier partner visits your address at your scheduled convenience to collect the safely boxed jewelry. No label printing needed.
                    </p>
                  </div>

                  <div className="p-5 bg-white/5 border border-white/10 rounded-[2px]">
                    <div className="flex items-center gap-2 text-[#c8a45d] text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="h-5 w-5 rounded-full bg-[#c8a45d] text-[#14202e] inline-flex items-center justify-center text-[10px] font-bold">3</span>
                      Instant Inspection & Refund
                    </div>
                    <p className="text-xs text-[#b8c0c8] leading-relaxed">
                      Upon physical intake at our atelier, the piece is verified and a 100% full refund is credited back to your original payment mode within 3–5 working days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions Table */}
              <div className="bg-[#fbf9f5] border border-[#14202e]/10 p-6 sm:p-8 rounded-[2px]">
                <h3 className="font-serif text-xl text-[#14202e] mb-4">
                  Return & Exchange Conditions
                </h3>

                <ul className="space-y-3 text-xs text-[#667383]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Original Condition:</strong> The jewelry must be unworn, free from scratches or perfume residue, and undamaged.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Complete Packaging:</strong> Must be enclosed with the original velvet-lined keepsake case, microfiber cloth, and Certificate of Authenticity.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>15-Day Timeframe:</strong> Request must be submitted within 15 calendar days from the date tracking marked your shipment as delivered.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Custom Engravings & Bespoke Pieces:</strong> Custom-made commissions or pieces engraved with personalized inscriptions cannot be returned unless an atelier defect is identified.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4: Contact Link for Fulfillment Inquiries */}
            <div id="fulfillment-contact" className="scroll-mt-36 pt-10 border-t border-[#14202e]/10">
              <div className="p-8 sm:p-10 bg-[#f4efe8] border border-[#c8a45d]/30 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-[#9a7a3e]" />
                    <span className="eyebrow text-[#9a7a3e]">Dedicated Support</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#14202e]">
                    Questions About An In-Transit Order or Return?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667383] mt-2 max-w-lg leading-relaxed">
                    Our fulfillment desk coordinates directly with air hubs and door couriers. Contact us for priority dispatch scheduling, address corrections, or return pickups.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                  <a
                    href="mailto:navidha.pearls@gmail.com?subject=Navidha%20Fulfillment%20Inquiry"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#14202e]/20 bg-[#fbf9f5] hover:bg-[#14202e] hover:text-[#f8f1e4] text-xs tracking-wider uppercase text-[#14202e] transition-colors rounded-[2px]"
                    data-testid="fulfillment-email-link"
                  >
                    <Mail size={14} className="text-[#9a7a3e]" />
                    <span>Email Fulfillment</span>
                  </a>

                  <a
                    href="https://wa.me/919000022840?text=Hello%20Navidha%2C%20I%20have%20an%20inquiry%20regarding%20my%20order%20shipment%20or%20return."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c8a45d] hover:bg-[#e4c47d] text-[#14202e] text-xs font-semibold tracking-wider uppercase transition-colors rounded-[2px]"
                    data-testid="fulfillment-whatsapp-link"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#14202e]/10 bg-[#14202e] py-14 text-[#f8f1e4] px-5 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <a href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#f8f1e4]">
              Navidha
            </a>
            <p className="mt-2 text-xs text-[#b8c0c8]">
              Contemporary jewelry rooted in India's extraordinary craft traditions.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.18em] text-[#b8c0c8]">
            <a href="/" className="hover:text-[#c8a45d]">
              Collection
            </a>
            <a href="/#craft" className="hover:text-[#c8a45d]">
              Craft Traditions
            </a>
            <a href="/#philosophy" className="hover:text-[#c8a45d]">
              Our Story
            </a>
            <a href="/shipping-returns.html" className="text-[#c8a45d] underline underline-offset-4">
              Shipping & Returns
            </a>
            <a href="/faq.html" className="hover:text-[#c8a45d]">
              Client FAQ
            </a>
          </div>

          <p className="text-[10px] uppercase tracking-[0.14em] text-[#c8a45d]">
            © {new Date().getFullYear()} Navidha Atelier. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
