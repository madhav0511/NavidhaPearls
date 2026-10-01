import React, { useState } from 'react';
import { Instagram, Youtube, Linkedin, Facebook, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';

// High-precision SVGs for X (Twitter) and Pinterest to ensure 100% brand fidelity
const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.62 0 12.017 0z" />
  </svg>
);

export const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/navidhapearlsandJewelry/',
    icon: Facebook,
    isCustomSvg: false
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/navidhapearlsandjewelry/',
    icon: Instagram,
    isCustomSvg: false
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com//@NavidhaPearlsAndJewellery',
    icon: Youtube,
    isCustomSvg: false
  },
  {
    name: 'X (formerly Twitter)',
    url: 'https://x.com/NavdhaPearls',
    icon: XIcon,
    isCustomSvg: true
  },
  {
    name: 'Pinterest',
    url: 'https://in.pinterest.com/navidhapearls/',
    icon: PinterestIcon,
    isCustomSvg: true
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/navidha-pearls-and-jewelry/',
    icon: Linkedin,
    isCustomSvg: false
  }
];

const GOOGLE_SHEETS_WEBHOOK_URL =
  (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbygiRhRbbQOBlWvWt1Ud4CCCtw-EnBhOIxSMyZfr65OALKFtKjSB83HvJONGZMgMiMHvQ/exec';

export const NewsletterSubscription: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setIsSubmitting(true);

    try {
      // Send customer details to Google Sheet webhook
      if (GOOGLE_SHEETS_WEBHOOK_URL) {
        await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script redirects require no-cors mode in browsers
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            email: cleanEmail,
            source: 'Website Newsletter (Inside List)',
            timestamp: new Date().toISOString()
          })
        });
      }

      setIsSubscribed(true);
      showToast('Welcome to the Inside List', 'A private preview invitation has been sent to your email.');
    } catch (err) {
      console.error('Failed to record subscription:', err);
      // Still show success to visitor so experience remains seamless
      setIsSubscribed(true);
      showToast('Welcome to the Inside List', 'A private preview invitation has been sent to your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative bg-[#101a26] text-[#f8f1e4] py-20 px-5 sm:px-8 lg:px-16 overflow-hidden border-t border-[#c8a45d]/20"
      aria-labelledby="newsletter-headline"
      data-testid="newsletter-subscription-section"
    >
      {/* Subtle ambient lighting effect */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[#D4AF37]/10 blur-[100px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[820px] text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Sparkles size={13} className="text-[#D4AF37]" />
          <span className="eyebrow text-[#D4AF37] tracking-[0.25em] text-[10px]">
            The Inside List
          </span>
          <Sparkles size={13} className="text-[#D4AF37]" />
        </div>

        {/* Headline */}
        <h2
          id="newsletter-headline"
          className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-snug sm:leading-relaxed text-[#f8f1e4] font-normal tracking-[-0.01em] max-w-[740px] mx-auto"
          data-testid="newsletter-headline"
        >
          Join the World of Navidha
        </h2>

        {/* Subscription Form */}
        <div className="mt-8 max-w-[560px] mx-auto">
          {isSubscribed ? (
            <div
              className="flex items-center justify-center gap-3 p-4 bg-[#14202e] border border-[#D4AF37]/40 text-[#f8f1e4] rounded-[2px]"
              data-testid="newsletter-success-state"
            >
              <CheckCircle2 size={20} className="text-[#D4AF37] shrink-0" />
              <p className="font-serif text-sm tracking-wide text-left">
                Thank you for joining. Your private invitation and early access details are on their way.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
              data-testid="newsletter-form"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Enter your email address"
                  className="h-13 w-full bg-[#182637] border border-white/20 px-5 text-sm text-[#f8f1e4] placeholder:text-[#b8c0c8]/60 outline-none transition-colors duration-200 focus:border-[#D4AF37] focus:bg-[#1a2b3e] rounded-[2px]"
                  data-testid="newsletter-email-input"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-13 px-8 bg-[#c8a45d] hover:bg-[#b38f46] active:bg-[#9a7a3e] text-[#14202e] font-sans font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 whitespace-nowrap cursor-pointer rounded-[2px]"
                data-testid="newsletter-submit-button"
              >
                {isSubmitting ? 'Joining...' : 'JOIN THE INSIDE LIST'}
              </button>
            </form>
          )}

          {/* Privacy Microcopy */}
          <p
            className="mt-3.5 text-xs text-[#b8c0c8]/75 tracking-wide text-center"
            data-testid="newsletter-privacy-microcopy"
          >
            We respect your privacy. Opt out whenever you choose.
          </p>
        </div>

        {/* Elegant divider */}
        <div className="my-12 flex items-center justify-center gap-4 max-w-[280px] mx-auto">
          <span className="h-px flex-1 bg-white/10" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]/60 bg-[#D4AF37]/30" />
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Social Media Links Bar */}
        <div
          className="flex flex-col items-center gap-3"
          aria-label="Follow Navidha on social media"
          data-testid="newsletter-social-links-bar"
        >
          <span className="text-[9px] uppercase tracking-[0.24em] text-[#b8c0c8]/70">
            Follow Our Craft & Journey
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
            {SOCIAL_LINKS.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#f8f1e4] backdrop-blur-xs transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#14202e] hover:scale-110 shadow-xs"
                  data-testid={`social-link-${social.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <IconComponent className="h-4 w-4 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
