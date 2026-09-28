import React, { useState, useEffect } from 'react';
import { BRAND_LOGO } from '../data';
import { CookieConsentState, CookiePreferencesModal } from './CookiePreferencesModal';

interface CookieBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

const STORAGE_KEY = 'navidha_cookie_consent';

export const CookieBanner: React.FC<CookieBannerProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Show after a brief delay for graceful luxury presentation
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsentState = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {}
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent: CookieConsentState = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {}
    setIsVisible(false);
  };

  const handleSavePreferences = (preferences: CookieConsentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
    setIsPreferencesOpen(false);
    setIsVisible(false);
  };

  if (!isVisible && !isPreferencesOpen) return null;

  return (
    <>
      {isVisible && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#fbf9f5] border-t border-[#14202e]/15 shadow-[0_-12px_40px_rgba(20,32,46,0.14)] p-4 sm:p-5 lg:px-8 transition-transform duration-300 ease-out"
          data-testid="navidha-cookie-banner"
        >
          <div className="mx-auto max-w-[1440px] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Column: Monogram & Copy */}
            <div className="flex items-start sm:items-center gap-4 flex-1">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-none bg-[#14202e] p-2">
                <img
                  src={BRAND_LOGO}
                  alt="Navidha Monogram"
                  className="w-full h-full object-contain contrast-125 brightness-110"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#14202e]" data-testid="cookie-banner-headline">
                  YOUR COOKIE SETTINGS
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#14202e]/85 max-w-4xl font-sans">
                  We and our partners use cookies and other technologies on this site to collect data about your device and activities on this site for enabling and optimizing site functionality and tools, analyzing site usage, personalizing your experience, and targeting ads, as detailed in our{' '}
                  <a
                    href="/privacy-policy.html"
                    className="underline underline-offset-2 font-medium text-[#14202e] hover:text-[#9a7a3e] transition-colors"
                    data-testid="cookie-privacy-policy-link"
                  >
                    Privacy Policy
                  </a>
                  . Click &ldquo;Accept All&rdquo; to consent to all of this, &ldquo;Reject All&rdquo; to get only essential cookies, or &ldquo;Cookie Preferences&rdquo; for more options.
                </p>
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 self-end lg:self-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(true)}
                className="flex-1 sm:flex-none border border-[#14202e]/30 bg-transparent text-[#14202e] hover:border-[#14202e] hover:bg-[#14202e]/5 py-2.5 px-4 font-sans text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer text-center whitespace-nowrap"
                data-testid="cookie-preferences-button"
              >
                Cookie Preferences
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 sm:flex-none border border-[#14202e]/30 bg-transparent text-[#14202e] hover:border-[#14202e] hover:bg-[#14202e]/5 py-2.5 px-4 font-sans text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer text-center whitespace-nowrap"
                data-testid="cookie-reject-all-button"
              >
                Reject All
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto border border-[#14202e] bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:border-[#c8a45d] hover:text-[#14202e] py-2.5 px-6 font-sans text-[10px] uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer text-center whitespace-nowrap shadow-xs"
                data-testid="cookie-accept-all-button"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Granular Preferences Center Modal */}
      <CookiePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
};
