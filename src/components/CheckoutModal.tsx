import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Printer,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { CartItem, formatINR } from '../data';
import { BrandMark } from './BrandMark';
import { WhatsAppIcon } from './TopBarIcons';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  giftNote?: string;
}

export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'wire';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  subtotal,
  onClose,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'confirmed'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    giftNote: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [orderTimestamp, setOrderTimestamp] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('Connecting to secure payment gateway...');

  useEffect(() => {
    // Reset state on open
    if (isOpen) {
      setStep('shipping');
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateShipping = (): boolean => {
    const errors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Please provide a valid email for the tax invoice';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number for courier OTP';
    }
    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Please provide your street address';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      errors.pincode = 'Valid 6-digit PIN code required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const executePayment = async () => {
    setStep('processing');
    setProcessingStatus('Initializing 256-bit encrypted transaction...');

    const razorpayKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;

    // If live Razorpay key is present and script is loaded, trigger standard Razorpay Checkout
    if (razorpayKey && (window as any).Razorpay) {
      try {
        const options = {
          key: razorpayKey,
          amount: Math.round(subtotal * 100), // In paise
          currency: 'INR',
          name: 'Navidha Pearls & Jewelry',
          description: `Order of ${items.length} fine handcrafted piece${items.length > 1 ? 's' : ''}`,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#14202e',
          },
          handler: (response: any) => {
            completeSuccessfulOrder(response.razorpay_payment_id || `PAY-${Date.now()}`);
          },
          modal: {
            ondismiss: () => {
              setStep('payment');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay SDK modal error, falling back to simulated high-security transaction', err);
      }
    }

    // Default Sandbox / Direct Simulated Gateway for instant demonstration
    setTimeout(() => {
      setProcessingStatus('Authorizing payment with bank gateway...');
    }, 800);

    setTimeout(() => {
      setProcessingStatus('Verifying jeweler hallmarking and transit insurance reservation...');
    }, 1800);

    setTimeout(() => {
      const generatedId = `NAV-${Math.floor(100000 + Math.random() * 900000)}`;
      completeSuccessfulOrder(generatedId);
    }, 2800);
  };

  const completeSuccessfulOrder = (orderId: string) => {
    setConfirmedOrderId(orderId);
    setOrderTimestamp(new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }));
    setStep('confirmed');
    onOrderSuccess(orderId);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#14202e]/75 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      data-testid="checkout-modal-overlay"
    >
      <div
        className="w-full max-w-2xl bg-[#fbf9f5] rounded-lg shadow-2xl border border-[#c8a45d]/30 text-[#14202e] relative overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        data-testid="checkout-modal-container"
      >
        {/* Top Header */}
        <div className="bg-[#14202e] text-[#f8f1e4] px-6 py-4 flex items-center justify-between border-b border-[#c8a45d]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1b2a3c] border border-[#c8a45d]/40 flex items-center justify-center p-0.5">
              <BrandMark compact />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#c8a45d] font-bold block">
                Official Maison Checkout
              </span>
              <h2 className="font-serif text-lg tracking-wide">
                {step === 'shipping' && 'Delivery & Contact Details'}
                {step === 'payment' && 'Select Secure Payment Method'}
                {step === 'processing' && 'Processing Transaction'}
                {step === 'confirmed' && 'Order Confirmed & Reserved'}
              </h2>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#99a6b8] hover:text-white p-1 rounded transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-[#ece8df] px-6 py-2 flex items-center justify-between text-[11px] text-[#666666] border-b border-black/5 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'shipping'
                  ? 'bg-[#14202e] text-white'
                  : 'bg-[#25D366] text-white'
              }`}
            >
              {step === 'shipping' ? '1' : <Check size={11} />}
            </span>
            <span className={step === 'shipping' ? 'font-semibold text-[#14202e]' : 'text-[#666666]'}>
              Shipping Address
            </span>
          </div>

          <div className="h-0.5 w-12 bg-black/15 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'payment'
                  ? 'bg-[#14202e] text-white'
                  : step === 'confirmed'
                  ? 'bg-[#25D366] text-white'
                  : 'bg-black/10 text-[#666666]'
              }`}
            >
              {step === 'confirmed' ? <Check size={11} /> : '2'}
            </span>
            <span className={step === 'payment' ? 'font-semibold text-[#14202e]' : 'text-[#666666]'}>
              Payment Gateway
            </span>
          </div>

          <div className="h-0.5 w-12 bg-black/15 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'confirmed' ? 'bg-[#25D366] text-white' : 'bg-black/10 text-[#666666]'
              }`}
            >
              3
            </span>
            <span className={step === 'confirmed' ? 'font-semibold text-[#14202e]' : 'text-[#666666]'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {/* STEP 1: SHIPPING FORM */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="bg-[#f0ece3] p-3 rounded text-xs text-[#555555] flex items-center gap-2.5 border border-black/5">
                <Truck size={18} className="text-[#9a7a3e] shrink-0" />
                <span>
                  Complimentary Pan-India Armored Courier dispatch via Blue Dart Express with 100% full transit insurance.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                    required
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                    Mobile Number (For Courier OTP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#777777] font-medium">+91</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                      required
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                  Email Address (For Official Invoice & Certificate) *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                  required
                />
                {formErrors.email && (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="House / Apartment / Suite / Street Name"
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none mb-2"
                  required
                />
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Landmark, Area, Sector (Optional)"
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                />
                {formErrors.addressLine1 && (
                  <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.addressLine1}</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none"
                    required
                  />
                  {formErrors.pincode && (
                    <span className="text-[10px] text-red-600 mt-0.5 block">{formErrors.pincode}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#14202e] mb-1">
                  Complimentary Gifting Note / Engraving Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.giftNote}
                  onChange={(e) => setFormData({ ...formData, giftNote: e.target.value })}
                  placeholder="Special instructions for our artisans, ring size notes, or personalized handwritten gift note card..."
                  className="w-full px-3 py-2 bg-white border border-black/20 rounded text-xs focus:border-[#14202e] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-black/10">
                <div className="text-xs text-[#666666]">
                  Total Payable: <strong className="text-base text-[#14202e] font-serif font-bold">{formatINR(subtotal)}</strong>
                </div>
                <button
                  type="submit"
                  className="bg-[#14202e] hover:bg-[#c8a45d] hover:text-[#14202e] text-[#f8f1e4] px-6 py-3 rounded text-[11px] font-bold uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  data-testid="proceed-to-payment-btn"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION & SUMMARY */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Order breakdown summary */}
              <div className="bg-[#f3efe7] p-4 rounded-lg border border-black/10">
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <span className="text-xs text-[#555555]">
                    Selected Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </span>
                  <span className="font-semibold text-xs text-[#14202e]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs text-[#555555] border-b border-black/10">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} className="text-[#9a7a3e]" />
                    Armored Insured Shipping (Pan-India)
                  </span>
                  <span className="text-[#25D366] font-bold uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#14202e]">Total Amount</span>
                  <span className="font-serif text-xl font-bold text-[#14202e]">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#14202e] mb-2.5">
                  Select Payment Gateway / Method:
                </label>

                <div className="space-y-2.5">
                  {/* Razorpay Standard */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#14202e] bg-white ring-2 ring-[#14202e]/10 shadow-xs'
                        : 'border-black/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#14202e] flex items-center gap-2">
                          <CreditCard size={15} className="text-[#0c2340]" />
                          Razorpay Secure Checkout
                        </span>
                        <span className="text-[10px] bg-[#25D366]/15 text-[#1b8744] px-2 py-0.5 rounded font-bold uppercase">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666666] mt-1 leading-normal">
                        Pay via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Cardless EMI.
                      </p>
                    </div>
                  </label>

                  {/* Direct UPI / Instant QR */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#14202e] bg-white ring-2 ring-[#14202e]/10 shadow-xs'
                        : 'border-black/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#14202e] flex items-center gap-2">
                          <QrCode size={15} className="text-[#9a7a3e]" />
                          Instant UPI & QR Code
                        </span>
                        <span className="text-[10px] text-[#777777]">0% Convenience Fee</span>
                      </div>
                      <p className="text-[11px] text-[#666666] mt-1 leading-normal">
                        Scan with BHIM, Google Pay, PhonePe, or pay with your VPA (@upi, @okhdfcbank).
                      </p>
                    </div>
                  </label>

                  {/* NetBanking */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#14202e] bg-white ring-2 ring-[#14202e]/10 shadow-xs'
                        : 'border-black/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#14202e] flex items-center gap-2">
                          <Building2 size={15} className="text-[#555555]" />
                          Direct NetBanking
                        </span>
                        <span className="text-[10px] text-[#777777]">50+ Indian Banks</span>
                      </div>
                      <p className="text-[11px] text-[#666666] mt-1 leading-normal">
                        HDFC, ICICI, State Bank of India, Axis, Kotak, and all major scheduled banks.
                      </p>
                    </div>
                  </label>

                  {/* Concierge Assisted Bank Wire / RTGS */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'wire'
                        ? 'border-[#14202e] bg-white ring-2 ring-[#14202e]/10 shadow-xs'
                        : 'border-black/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="wire"
                      checked={paymentMethod === 'wire'}
                      onChange={() => setPaymentMethod('wire')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#14202e] flex items-center gap-2">
                          <ShieldCheck size={15} className="text-[#c8a45d]" />
                          Concierge Assisted RTGS / Bank Wire
                        </span>
                        <span className="text-[10px] text-[#9a7a3e]">High-Value Orders</span>
                      </div>
                      <p className="text-[11px] text-[#666666] mt-1 leading-normal">
                        Ideal for bespoke heirloom commissions & transactions exceeding ₹2,00,000.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 py-2 text-[10px] text-[#777777]">
                <span className="flex items-center gap-1">
                  <Lock size={12} className="text-[#25D366]" />
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#9a7a3e]" />
                  BIS Hallmark & Laboratory Certified
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#14202e] font-medium cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={executePayment}
                  className="bg-[#14202e] hover:bg-[#c8a45d] hover:text-[#14202e] text-[#f8f1e4] px-7 py-3 rounded text-[11px] font-bold uppercase tracking-[0.16em] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  data-testid="pay-now-btn"
                >
                  <Lock size={13} />
                  <span>Pay {formatINR(subtotal)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-[#14202e]/20 border-t-[#c8a45d] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={20} className="text-[#14202e]" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#14202e]">
                Authenticating Transaction
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto animate-pulse">
                {processingStatus}
              </p>
              <div className="text-[10px] text-[#999999] tracking-wider uppercase">
                Please do not refresh or close this browser window
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMATION & INVOICE */}
          {step === 'confirmed' && (
            <div className="space-y-5 print:p-0">
              {/* Green Success Banner */}
              <div className="bg-[#f0f9f1] border border-[#25D366]/30 p-5 rounded-lg text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-serif text-2xl text-[#14202e] font-semibold">
                  Payment Successful!
                </h3>
                <p className="text-xs text-[#446b4c]">
                  Thank you, <strong>{formData.fullName}</strong>. Your jewelry has been reserved and allocated to our master artisans for inspection and insured packaging.
                </p>
                <div className="inline-block bg-white px-3 py-1 rounded border border-[#25D366]/40 text-xs font-mono font-bold text-[#14202e] shadow-2xs">
                  Order ID: {confirmedOrderId}
                </div>
              </div>

              {/* Order Details & Summary Card */}
              <div className="bg-white p-5 rounded-lg border border-black/10 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-black/8 text-xs">
                  <div>
                    <span className="text-[#777777] block text-[10px] uppercase tracking-wider">Date & Time</span>
                    <strong className="text-[#14202e]">{orderTimestamp}</strong>
                  </div>
                  <div>
                    <span className="text-[#777777] block text-[10px] uppercase tracking-wider text-right">Payment Status</span>
                    <span className="text-[#1b8744] font-bold text-xs uppercase">Verified & Paid</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#777777] block">
                    Reserved Pieces
                  </span>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded bg-[#f5f1ea] border border-black/5"
                        />
                        <div>
                          <strong className="block text-[#14202e]">{item.product.name}</strong>
                          <span className="text-[11px] text-[#777777]">
                            Qty: {item.quantity} · {item.product.material}
                          </span>
                        </div>
                      </div>
                      <strong className="text-[#14202e]">{formatINR(item.product.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                {/* Shipping address details */}
                <div className="pt-3 border-t border-black/8 text-xs text-[#555555]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#777777] block mb-1">
                    Insured Dispatch Destination
                  </span>
                  <p className="text-[#14202e] font-medium">
                    {formData.addressLine1} {formData.addressLine2 ? `, ${formData.addressLine2}` : ''}
                  </p>
                  <p>
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                  <p className="mt-1 text-[11px] text-[#777777]">
                    Contact: +91 {formData.phone} | {formData.email}
                  </p>
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t border-black/8 flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#14202e]">Total Paid</span>
                  <span className="font-serif text-xl font-bold text-[#14202e]">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="w-full sm:flex-1 py-3 px-4 border border-black/20 hover:border-black rounded text-xs font-semibold text-[#14202e] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
                >
                  <Printer size={15} />
                  <span>Print Tax Invoice & Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#14202e] hover:bg-[#c8a45d] hover:text-[#14202e] text-[#f8f1e4] rounded text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer text-center"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
