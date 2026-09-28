import React, { useState, useEffect } from 'react';
import { X, Check, Globe, ChevronDown } from 'lucide-react';
import { BRAND_LOGO } from '../data';

export interface ShippingCountry {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  flag: string;
  timeline: string;
  dutyNote: string;
}

export const SUPPORTED_COUNTRIES: ShippingCountry[] = [
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    timeline: '2–4 Business Days (Express Insured)',
    dutyNote: 'All local taxes & GST included'
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    timeline: '3–5 Business Days (Air Express)',
    dutyNote: 'All customs duties & import taxes included'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    timeline: '3–5 Business Days (Air Express)',
    dutyNote: 'UK VAT & import clearance handled'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    symbol: 'AED',
    flag: '🇦🇪',
    timeline: '2–4 Business Days (Direct Courier)',
    dutyNote: 'Complimentary insured Gulf courier'
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    flag: '🇸🇬',
    timeline: '3–4 Business Days (Express Air)',
    dutyNote: 'GST & customs declaration prepaid'
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    symbol: 'CA$',
    flag: '🇨🇦',
    timeline: '4–6 Business Days (Express Courier)',
    dutyNote: 'Full doorstep insurance included'
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    timeline: '4–6 Business Days (Express Courier)',
    dutyNote: 'Complimentary insured international transit'
  },
  {
    code: 'DE',
    name: 'Germany (European Union)',
    currency: 'EUR',
    symbol: '€',
    flag: '🇩🇪',
    timeline: '3–5 Business Days (Air Express)',
    dutyNote: 'EU import taxes and duties cleared'
  }
];

interface ShippingCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountryChange?: (country: ShippingCountry) => void;
}

const STORAGE_KEY = 'navidha_shipping_country';
const SEEN_STORAGE_KEY = 'navidha_country_prompt_seen';

export const ShippingCountryModal: React.FC<ShippingCountryModalProps> = ({
  isOpen,
  onClose,
  onCountryChange
}) => {
  const [selectedCountry, setSelectedCountry] = useState<ShippingCountry>(SUPPORTED_COUNTRIES[0]);
  const [isChangingCountry, setIsChangingCountry] = useState(false);
  const [tempSelection, setTempSelection] = useState<ShippingCountry>(SUPPORTED_COUNTRIES[0]);

  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      if (savedCode) {
        const found = SUPPORTED_COUNTRIES.find((c) => c.code === savedCode);
        if (found) {
          setSelectedCountry(found);
          setTempSelection(found);
        }
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleContinue = () => {
    try {
      localStorage.setItem(STORAGE_KEY, selectedCountry.code);
      localStorage.setItem(SEEN_STORAGE_KEY, 'true');
    } catch {}
    if (onCountryChange) onCountryChange(selectedCountry);
    onClose();
  };

  const handleConfirmCountryChange = () => {
    setSelectedCountry(tempSelection);
    try {
      localStorage.setItem(STORAGE_KEY, tempSelection.code);
      localStorage.setItem(SEEN_STORAGE_KEY, 'true');
    } catch {}
    if (onCountryChange) onCountryChange(tempSelection);
    setIsChangingCountry(false);
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 bg-[#14202e]/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-prompt-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] bg-[#fbf9f5] border border-[#14202e]/15 p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        data-testid="shipping-country-prompt"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#14202e]/50 hover:text-[#14202e] hover:bg-[#14202e]/5 transition-colors cursor-pointer"
          aria-label="Close country prompt"
          data-testid="country-prompt-close"
        >
          <X size={20} />
        </button>

        {/* Brand Monogram */}
        <div className="w-16 h-16 flex items-center justify-center mb-6">
          <img
            src={BRAND_LOGO}
            alt="Navidha Monogram"
            className="w-14 h-14 object-contain contrast-125 filter drop-shadow-xs"
          />
        </div>

        {!isChangingCountry ? (
          <>
            {/* Title */}
            <h2
              id="country-prompt-title"
              className="font-serif text-2xl sm:text-[28px] text-[#14202e] font-normal leading-snug tracking-[-0.01em] max-w-sm"
              data-testid="country-prompt-headline"
            >
              You are shopping in {selectedCountry.name}
            </h2>

            <p className="mt-3 text-xs text-[#667383] font-sans max-w-xs leading-relaxed">
              Prices, delivery guarantees, and local currency ({selectedCountry.currency} {selectedCountry.symbol}) will be tailored to your location.
            </p>

            <div className="mt-8 w-full space-y-3">
              {/* Primary Action: CONTINUE TO SHOP */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] py-3.5 px-6 font-sans text-[11px] uppercase tracking-[0.22em] font-medium transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                data-testid="country-prompt-continue"
              >
                Continue to Shop
              </button>

              {/* Secondary Action: CHANGE YOUR SHIPPING COUNTRY */}
              <button
                type="button"
                onClick={() => setIsChangingCountry(true)}
                className="w-full border border-[#14202e]/30 bg-transparent text-[#14202e] hover:bg-[#14202e] hover:text-[#f8f1e4] py-3.5 px-6 font-sans text-[11px] uppercase tracking-[0.22em] font-medium transition-colors cursor-pointer active:scale-[0.99]"
                data-testid="country-prompt-change"
              >
                Change Your Shipping Country
              </button>
            </div>
          </>
        ) : (
          <div className="w-full text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#14202e]/10">
              <h3 className="font-serif text-lg text-[#14202e] font-normal">
                Select Destination
              </h3>
              <button
                type="button"
                onClick={() => setIsChangingCountry(false)}
                className="text-[10px] uppercase tracking-[0.16em] text-[#9a7a3e] hover:underline cursor-pointer"
              >
                Back
              </button>
            </div>

            {/* Country List */}
            <div className="mt-4 max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#14202e]/5">
              {SUPPORTED_COUNTRIES.map((country) => {
                const isSelected = tempSelection.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => setTempSelection(country)}
                    className={`w-full flex items-center justify-between p-2.5 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#14202e] text-[#f8f1e4]'
                        : 'hover:bg-[#14202e]/5 text-[#14202e]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#c8a45d]' : 'text-[#667383]'}`}>
                        ({country.currency} {country.symbol})
                      </span>
                    </div>
                    {isSelected && <Check size={14} className="text-[#c8a45d]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsChangingCountry(false)}
                className="flex-1 border border-[#14202e]/30 bg-transparent text-[#14202e] hover:bg-[#14202e]/5 py-3 px-4 font-sans text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCountryChange}
                className="flex-1 bg-[#14202e] text-[#f8f1e4] hover:bg-[#c8a45d] hover:text-[#14202e] py-3 px-4 font-sans text-[10px] uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer text-center shadow-xs"
              >
                Confirm Destination
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
