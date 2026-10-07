import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Sliders,
  FileText,
  ArrowLeft,
  Mail,
  MessageCircle,
  Sparkles,
  HelpCircle,
  Truck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useScrollToTopOnMount } from './hooks/useScrollToTop';
import { CookiePreferencesModal, CookieConsentState } from './components/CookiePreferencesModal';
import { BrandMark } from './components/BrandMark';

export const PrivacyPolicyPage: React.FC = () => {
  useScrollToTopOnMount();
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveCookiePreferences = (prefs: CookieConsentState) => {
    try {
      localStorage.setItem('navidha_cookie_consent', JSON.stringify(prefs));
    } catch {}
    setIsCookieModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Top Banner */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block">Navidha Client Assurance</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Ethical Guardianship & Data Privacy</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Complimentary Insured Delivery Across India</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          {/* Back to Boutique */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group"
              data-testid="privacy-back-to-boutique-link"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </a>
          </div>

          {/* Centered Brand Mark */}
          <div className="text-center">
            <a href="/" className="inline-flex items-center" aria-label="Navidha Home">
              <BrandMark theme="light" />
            </a>
          </div>

          {/* Quick Client Care Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans tracking-[0.12em] uppercase">
            <a
              href="/faq.html"
              className="hidden sm:inline-block text-[#667383] hover:text-[#14202e] transition-colors"
            >
              FAQ
            </a>
            <a
              href="/shipping-returns.html"
              className="hidden md:inline-block text-[#667383] hover:text-[#14202e] transition-colors"
            >
              Shipping & Returns
            </a>
            <button
              type="button"
              onClick={() => setIsCookieModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#9a7a3e] hover:text-[#14202e] transition-colors font-medium cursor-pointer"
            >
              <Sliders size={13} />
              <span>Cookie Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[#14202e]/10 bg-[#f0ebe3]/50 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14202e]/5 border border-[#14202e]/10 text-[10px] uppercase tracking-[0.22em] text-[#9a7a3e] mb-4">
            <ShieldCheck size={12} />
            <span>Legal Trust & Transparency</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl text-[#14202e] font-normal tracking-[-0.01em] leading-tight">
            Client Privacy Policy & Cookie Governance
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#667383] font-light leading-relaxed">
            At Navidha, we value the discretion of our patrons as profoundly as the heritage craft behind our silver and pearls. This charter outlines our uncompromising standards for personal data protection, transparency, and consent.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#667383] uppercase tracking-[0.16em]">
            <span>Effective Date: September 2026</span>
            <span className="hidden sm:inline">·</span>
            <span>Version 2.4</span>
            <span className="hidden sm:inline">·</span>
            <button
              type="button"
              onClick={() => setIsCookieModalOpen(true)}
              className="text-[#9a7a3e] hover:underline cursor-pointer font-medium"
            >
              Manage Your Cookies
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sticky Table of Contents */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-2 bg-[#ffffff] p-6 border border-[#14202e]/10 shadow-xs">
                <p className="font-serif text-sm uppercase tracking-[0.16em] text-[#14202e] font-medium pb-2 border-b border-[#14202e]/10">
                  Contents
                </p>
                <nav className="flex flex-col space-y-1.5 text-xs text-[#667383] pt-2">
                  {[
                    { id: 'commitment', title: '1. Our Artisanal Commitment' },
                    { id: 'collection', title: '2. Information We Collect' },
                    { id: 'usage', title: '3. How We Use Client Information' },
                    { id: 'cookies', title: '4. Cookie Policy & Tracking' },
                    { id: 'security', title: '5. Data Security & Hallmarking' },
                    { id: 'transfers', title: '6. International Shipping & Customs' },
                    { id: 'rights', title: '7. Your Statutory Rights' },
                    { id: 'contact', title: '8. Data Protection Concierge' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left py-1.5 px-2 transition-colors cursor-pointer rounded-xs flex items-center justify-between ${
                        activeNav === item.id
                          ? 'bg-[#14202e] text-[#f8f1e4] font-medium'
                          : 'hover:text-[#14202e] hover:bg-[#14202e]/5'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronRight size={12} className={activeNav === item.id ? 'text-[#c8a45d]' : 'opacity-30'} />
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-[#14202e]/10">
                  <button
                    type="button"
                    onClick={() => setIsCookieModalOpen(true)}
                    className="w-full bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] py-2.5 px-4 text-[10px] uppercase tracking-[0.18em] font-medium transition-colors text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sliders size={13} />
                    <span>Open Cookie Preferences</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Article Body */}
            <article className="lg:col-span-8 space-y-12 text-[#14202e]">
              {/* Section 1 */}
              <section id="commitment" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Sparkles size={13} />
                  <span>Section 01</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Our Artisanal Commitment to Privacy
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  Navidha Pearls & Fine Silver operates on the enduring principle that personal discretion is the cornerstone of true luxury. When you entrust us with your details—whether acquiring an heirloom collar or requesting a bespoke ring sizing—we handle your information with the same meticulous guardianship applied to our silver casting and natural pearl stringing.
                </p>
                <p className="text-sm leading-relaxed text-[#667383]">
                  We never sell, monetize, or lease patron registries, email subscriber databases, or purchasing histories to third-party data brokers.
                </p>
              </section>

              {/* Section 2 */}
              <section id="collection" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <FileText size={13} />
                  <span>Section 02</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Information We Collect
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  Depending on your interaction with our digital boutique and atelier services, we may collect the following classes of data:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div className="bg-[#ffffff] p-4 border border-[#14202e]/10">
                    <h3 className="font-serif text-base text-[#14202e] font-medium">Patron Contact & Delivery</h3>
                    <p className="mt-1.5 text-xs text-[#667383] leading-relaxed">
                      Legal name, postal shipping address, billing address, telephone contact for insured courier dispatch, and email address for order certificates.
                    </p>
                  </div>
                  <div className="bg-[#ffffff] p-4 border border-[#14202e]/10">
                    <h3 className="font-serif text-base text-[#14202e] font-medium">Bespoke Jewelry Preferences</h3>
                    <p className="mt-1.5 text-xs text-[#667383] leading-relaxed">
                      Ring sizing specifications, chain extension requests, preferred heritage metal finishes, and client notes recorded during atelier consultations.
                    </p>
                  </div>
                  <div className="bg-[#ffffff] p-4 border border-[#14202e]/10">
                    <h3 className="font-serif text-base text-[#14202e] font-medium">Financial & Payment Data</h3>
                    <p className="mt-1.5 text-xs text-[#667383] leading-relaxed">
                      Processed securely via RBI & PCI-DSS Tier 1 encrypted payment gateways. Navidha servers never store raw credit card numbers or banking passwords.
                    </p>
                  </div>
                  <div className="bg-[#ffffff] p-4 border border-[#14202e]/10">
                    <h3 className="font-serif text-base text-[#14202e] font-medium">Device & Browsing Telemetry</h3>
                    <p className="mt-1.5 text-xs text-[#667383] leading-relaxed">
                      IP address, regional geolocation (to display regional currency and shipping estimates), device operating system, and page load telemetry.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="usage" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Eye size={13} />
                  <span>Section 03</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  How We Use Client Information
                </h2>
                <ul className="space-y-3 text-sm text-[#667383] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Order Fulfillment & Safe Transit:</strong> Coordinating with insured courier partners (Blue Dart, Delhivery Express, DHL Express) to deliver your hallmarked jewelry safely to your doorstep.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Authenticity Certificates & Hallmarking Records:</strong> Generating lifetime authenticity records for 925 Sterling Silver and cultured freshwater pearls.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Client Concierge Service:</strong> Responding to WhatsApp, email, or telephone sizing and styling inquiries through our Hyderabad atelier team.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#9a7a3e] shrink-0 mt-0.5" />
                    <span><strong>Private Launches & Invitations:</strong> With your prior consent, notifying you of limited edition craft drops and seasonal previews. You may unsubscribe anytime with one click.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4: Comprehensive Cookie Policy */}
              <section id="cookies" className="scroll-mt-28 space-y-5 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Sliders size={13} />
                  <span>Section 04</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Comprehensive Cookie Policy & Tracking Technologies
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  A cookie is a small data file stored on your browser or device when visiting Navidha. We employ cookies, local storage, and similar technologies to ensure seamless navigation, preserve shopping bag items, remember currency selections, and understand how clients explore our heritage craft stories.
                </p>

                {/* Direct Action Banner */}
                <div className="bg-[#f0ebe3] p-5 border border-[#c8a45d]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-base text-[#14202e] font-medium">Control Your Cookie Settings</h3>
                    <p className="text-xs text-[#667383] mt-1">
                      You can modify or withdraw your consent for non-essential cookies at any moment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCookieModalOpen(true)}
                    className="bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] py-2.5 px-5 text-[10px] uppercase tracking-[0.18em] font-medium transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                    data-testid="privacy-manage-cookies-button"
                  >
                    Adjust Cookie Preferences
                  </button>
                </div>

                {/* Cookie Categories Table */}
                <div className="overflow-x-auto border border-[#14202e]/10 bg-[#ffffff]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#14202e] text-[#f8f1e4] font-serif text-[11px] uppercase tracking-[0.14em]">
                      <tr>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Purpose & Function</th>
                        <th className="p-3.5">Duration</th>
                        <th className="p-3.5">Default Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14202e]/10 text-[#667383]">
                      <tr>
                        <td className="p-3.5 font-medium text-[#14202e]">Strictly Necessary</td>
                        <td className="p-3.5 leading-relaxed">
                          Maintains shopping bag contents, CSRF token security, session authorization, and checkout routing.
                        </td>
                        <td className="p-3.5">Session / 30 Days</td>
                        <td className="p-3.5 text-[#9a7a3e] font-semibold">Always Active</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-[#14202e]">Performance & Analytics</td>
                        <td className="p-3.5 leading-relaxed">
                          Aggregated telemetry that reveals which craft stories, lookbook edits, and pages are most engaging.
                        </td>
                        <td className="p-3.5">Up to 12 Months</td>
                        <td className="p-3.5">User Consent Required</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-[#14202e]">Functional & Localization</td>
                        <td className="p-3.5 leading-relaxed">
                          Remembers your preferred destination country (e.g. India vs United States), currency formatting, and wishlist items.
                        </td>
                        <td className="p-3.5">6 Months</td>
                        <td className="p-3.5">User Consent Required</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-medium text-[#14202e]">Targeting & Announcements</td>
                        <td className="p-3.5 leading-relaxed">
                          Delivers tailored editorial invitations and launches on partner platforms.
                        </td>
                        <td className="p-3.5">90 Days</td>
                        <td className="p-3.5">User Consent Required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 5 */}
              <section id="security" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Lock size={13} />
                  <span>Section 05</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Data Security & Hallmarking Assurance
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  All communication between your browser and Navidha servers is safeguarded by 256-bit Transport Layer Security (TLS/SSL) encryption. Payment authorizations take place in an isolated sandbox certified under Payment Card Industry Data Security Standards (PCI-DSS Level 1).
                </p>
                <p className="text-sm leading-relaxed text-[#667383]">
                  Atelier access to patron records is strictly governed by role-based access controls, ensuring only authorized fulfillment officers and certified silver craftsmen access sizing and dispatch coordinates.
                </p>
              </section>

              {/* Section 6 */}
              <section id="transfers" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Globe size={13} />
                  <span>Section 06</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  International Shipping & Customs Clearance
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  Navidha ships to discerning clients across India, North America, the United Kingdom, the UAE, and Singapore. When shipping internationally, custom declarations mandated by international aviation and customs authorities (including item descriptions, precious metal purity, and commercial invoice values) are transmitted securely to courier partners.
                </p>
                <p className="text-sm leading-relaxed text-[#667383]">
                  We comply with the Indian Information Technology Act (2000), Digital Personal Data Protection Act (DPDPA), the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA/CPRA).
                </p>
              </section>

              {/* Section 7 */}
              <section id="rights" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <ShieldCheck size={13} />
                  <span>Section 07</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Your Statutory Rights
                </h2>
                <div className="space-y-3 text-sm text-[#667383]">
                  <p>As a Navidha patron, you possess the unalienable right to:</p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>Right to Access:</strong> Request a complete copy of the personal information stored in your client record.</li>
                    <li><strong>Right to Rectification:</strong> Promptly update or rectify inaccurate shipping coordinates, contact phone numbers, or ring sizes.</li>
                    <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request full deletion of your marketing and promotional profile, subject to statutory tax and hallmarking retention laws.</li>
                    <li><strong>Right to Withdraw Consent:</strong> Opt out of marketing correspondence or toggle non-essential cookies off at any time without penalty.</li>
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section id="contact" className="scroll-mt-28 space-y-4 pt-6 border-t border-[#14202e]/10">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-semibold">
                  <Mail size={13} />
                  <span>Section 08</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#14202e] font-normal">
                  Contact Our Data Protection Concierge
                </h2>
                <p className="text-sm leading-relaxed text-[#667383]">
                  If you have inquiries regarding this policy, wish to exercise statutory privacy rights, or require assistance with your cookie preferences, our concierge is at your service:
                </p>
                <div className="mt-4 bg-[#ffffff] p-6 border border-[#14202e]/10 space-y-3 text-xs text-[#667383]">
                  <p className="font-serif text-sm text-[#14202e] font-medium">Navidha Data Privacy Officer</p>
                  <p>Email: <a href="mailto:privacy@navidhapearls.com" className="text-[#9a7a3e] underline font-medium">privacy@navidhapearls.com</a> · <a href="mailto:navidha.pearls@gmail.com" className="text-[#9a7a3e] underline">navidha.pearls@gmail.com</a></p>
                  <p>Direct Concierge Line: +91 90000 22840</p>
                  <p>Atelier Coordinates: G20, Village Pointe, Road No.1, Alkapoor Township, Manikonda, Hyderabad, Telangana 500089, India</p>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#14202e]/10 bg-[#f0ebe3]/60 py-8 text-xs text-[#667383]">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Navidha Pearls & Jewelry. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-[#14202e] transition-colors">Boutique</a>
            <span>·</span>
            <a href="/faq.html" className="hover:text-[#14202e] transition-colors">FAQ</a>
            <span>·</span>
            <a href="/shipping-returns.html" className="hover:text-[#14202e] transition-colors">Shipping & Returns</a>
            <span>·</span>
            <a href="/sitemap.html" className="hover:text-[#14202e] transition-colors" data-testid="privacy-footer-sitemap-link">Sitemap</a>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsCookieModalOpen(true)}
              className="hover:text-[#14202e] text-[#9a7a3e] transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
        onSave={handleSaveCookiePreferences}
      />
    </div>
  );
};
