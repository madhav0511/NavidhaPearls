import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Info } from 'lucide-react';
import { BRAND_LOGO } from '../data';

export interface CookieConsentState {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookieConsentState) => void;
}

const DEFAULT_CONSENT: CookieConsentState = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
  timestamp: new Date().toISOString()
};

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [preferences, setPreferences] = useState<CookieConsentState>(DEFAULT_CONSENT);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('navidha_cookie_consent');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof Omit<CookieConsentState, 'essential' | 'timestamp'>) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    const updated: CookieConsentState = {
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString()
    };
    onSave(updated);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookieConsentState = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    onSave(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected: CookieConsentState = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    onSave(allRejected);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#14202e]/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#fbf9f5] border border-[#14202e]/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#14202e]/10 bg-[#fbf9f5]">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_LOGO}
              alt="Navidha Monogram"
              className="h-7 w-7 object-contain contrast-125"
            />
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9a7a3e] font-sans font-semibold block">
                Navidha Privacy Preference Center
              </span>
              <h2
                id="cookie-preferences-title"
                className="font-serif text-xl sm:text-2xl text-[#14202e] font-normal"
              >
                Cookie Preferences
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#14202e]/60 hover:text-[#14202e] hover:bg-[#14202e]/5 transition-colors cursor-pointer"
            aria-label="Close cookie preferences"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-xs text-[#667383] leading-relaxed">
          <p>
            When you visit the Navidha boutique, we store and retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences, or your device and is used to give you a personalized, luxurious experience.
          </p>
          <p>
            You can choose not to allow certain types of cookies below. Read our full{' '}
            <a
              href="/privacy-policy.html"
              className="underline underline-offset-2 text-[#14202e] font-medium hover:text-[#9a7a3e] transition-colors"
            >
              Privacy Policy
            </a>{' '}
            for detailed information regarding our data practices.
          </p>

          <div className="divide-y divide-[#14202e]/10 border-t border-b border-[#14202e]/10">
            {/* Strictly Necessary */}
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm text-[#14202e] font-medium">
                    Strictly Necessary Cookies
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#9a7a3e] font-semibold">
                    Always Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#14202e] font-medium bg-[#14202e]/5 px-2.5 py-1">
                  <ShieldCheck size={14} className="text-[#9a7a3e]" />
                  <span>Required</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-[#667383]">
                These cookies are necessary for the website to function securely, preserve your shopping bag across pages, maintain currency selections, and ensure seamless checkout navigation. They cannot be switched off in our systems.
              </p>
            </div>

            {/* Performance & Analytics */}
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm text-[#14202e] font-medium">
                    Performance & Analytics Cookies
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#667383]">
                    Site Optimization
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('analytics')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    preferences.analytics ? 'bg-[#14202e]' : 'bg-[#e2dcce]'
                  }`}
                  role="switch"
                  aria-checked={preferences.analytics}
                  aria-label="Toggle Performance & Analytics Cookies"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#fbf9f5] shadow-xs transition-transform absolute top-1 ${
                      preferences.analytics ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#667383]">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our boutique. They help us understand which heritage craft stories and jewelry pieces are most admired.
              </p>
            </div>

            {/* Functional & Experience */}
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm text-[#14202e] font-medium">
                    Functional & Experience Cookies
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#667383]">
                    Enhanced Personalization
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('functional')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    preferences.functional ? 'bg-[#14202e]' : 'bg-[#e2dcce]'
                  }`}
                  role="switch"
                  aria-checked={preferences.functional}
                  aria-label="Toggle Functional Cookies"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#fbf9f5] shadow-xs transition-transform absolute top-1 ${
                      preferences.functional ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#667383]">
                These cookies enable the boutique to remember choices you make (such as your saved wishlist, concierge chat history, and preferred ring sizing units) to deliver a bespoke luxury experience.
              </p>
            </div>

            {/* Advertising & Marketing */}
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm text-[#14202e] font-medium">
                    Targeting & Marketing Cookies
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#667383]">
                    Curated Announcements
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('marketing')}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    preferences.marketing ? 'bg-[#14202e]' : 'bg-[#e2dcce]'
                  }`}
                  role="switch"
                  aria-checked={preferences.marketing}
                  aria-label="Toggle Marketing Cookies"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#fbf9f5] shadow-xs transition-transform absolute top-1 ${
                      preferences.marketing ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[#667383]">
                These cookies may be set through our site by our advertising partners to build a profile of your luxury interests and present you with relevant Navidha editorial campaigns and seasonal launches on other sites.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#f0ebe3]/70 border-t border-[#14202e]/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRejectAll}
              className="flex-1 sm:flex-none border border-[#14202e]/30 bg-transparent text-[#14202e] hover:bg-[#14202e]/5 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] font-sans transition-colors cursor-pointer"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none border border-[#14202e]/30 bg-transparent text-[#14202e] hover:bg-[#14202e]/5 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] font-sans transition-colors cursor-pointer"
            >
              Accept All
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] font-sans font-medium transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
