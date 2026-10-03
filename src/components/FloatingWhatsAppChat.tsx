import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  CheckCheck,
  Calendar,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { WhatsAppIcon } from './TopBarIcons';
import { BrandMark } from './BrandMark';
import {
  submitAiSensyLead,
  getAiSensyWhatsAppUrl,
  DEFAULT_WHATSAPP_NUMBER,
  formatAiSensyPhoneNumber,
} from '../services/aisensy';

export const WHATSAPP_PHONE_NUMBER = DEFAULT_WHATSAPP_NUMBER;

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
  actionLink?: {
    label: string;
    url: string;
    icon?: 'calendar' | 'external' | 'whatsapp';
  };
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome-1',
  sender: 'concierge',
  text: 'Namaste! Welcome to Navidha Pearls & Jewelry. Powered by AiSensy WhatsApp Business API. How may our concierge team assist you with our handcrafted bridal, pearls, or bespoke commissions today?',
  time: 'Just now',
};

const QUICK_INQUIRIES = [
  {
    label: 'Custom Bridal Inquiry',
    icon: '💎',
    text: 'I would like to inquire about a custom bridal jewelry commission.',
  },
  {
    label: 'Pearl Quality & Certifications',
    icon: '✨',
    text: 'Could you tell me more about your pearl grading and authenticity certificates?',
  },
  {
    label: 'Book Boutique Consultation',
    icon: '📅',
    text: 'I want to schedule a private in-person consultation at your boutique.',
  },
  {
    label: 'Ring Sizing & Insured Delivery',
    icon: '📦',
    text: 'What are your delivery timelines and how does insured shipping work?',
  },
];

function getConciergeResponse(userText: string): {
  text: string;
  actionLink?: { label: string; url: string; icon?: 'calendar' | 'external' | 'whatsapp' };
} {
  const lower = userText.toLowerCase();

  // If user appears to provide a phone number in the chat
  const phoneMatch = userText.replace(/[^0-9]/g, '');
  if (phoneMatch.length >= 10 && !lower.includes('bridal') && !lower.includes('price')) {
    return {
      text: `Thank you for sharing your WhatsApp number (+${phoneMatch.slice(-10)}). Our Concierge team has queued your inquiry via AiSensy WhatsApp Business API. You can also tap below to open the chat directly in your WhatsApp app.`,
      actionLink: {
        label: 'Open WhatsApp Conversation',
        url: getAiSensyWhatsAppUrl(`Namaste Navidha Atelier, connecting via website floater with number ${phoneMatch.slice(-10)}.`),
        icon: 'whatsapp',
      },
    };
  }

  if (lower.includes('bridal') || lower.includes('wedding') || lower.includes('bride') || lower.includes('trousseau')) {
    return {
      text: 'Our Bridal Atelier specializes in bespoke heirloom creations crafted with 22K gold, certified uncut polki, and natural pearls. Custom bridal commissions typically take 3 to 6 weeks, beginning with a curated design sketch.',
      actionLink: {
        label: 'Book Bridal Consultation',
        url: '/consultation.html',
        icon: 'calendar',
      },
    };
  }

  if (
    lower.includes('pearl') ||
    lower.includes('basra') ||
    lower.includes('south sea') ||
    lower.includes('certificate') ||
    lower.includes('authentic') ||
    lower.includes('quality') ||
    lower.includes('grading')
  ) {
    return {
      text: 'Every Navidha pearl is personally hand-selected for natural nacre thickness, high-luster reflection, and pristine orient. Each piece arrives with our Maison Certificate of Authenticity and independent gemological laboratory testing report.',
    };
  }

  if (
    lower.includes('appointment') ||
    lower.includes('consultation') ||
    lower.includes('visit') ||
    lower.includes('book') ||
    lower.includes('boutique') ||
    lower.includes('meet')
  ) {
    return {
      text: 'We would be honored to host you for a private appointment at our flagship atelier or via a bespoke virtual video consultation with our Master Designer.',
      actionLink: {
        label: 'Select Date & Time on Calendar',
        url: '/consultation.html',
        icon: 'calendar',
      },
    };
  }

  if (
    lower.includes('shipping') ||
    lower.includes('delivery') ||
    lower.includes('deliver') ||
    lower.includes('track') ||
    lower.includes('timeline') ||
    lower.includes('courier')
  ) {
    return {
      text: 'All Navidha jewelry is shipped via specialized tamper-evident armored courier with 100% full transit insurance. Domestic deliveries arrive within 2–5 business days, with live tracking provided upon dispatch.',
      actionLink: {
        label: 'View Shipping & Returns Policy',
        url: '/shipping-returns.html',
        icon: 'external',
      },
    };
  }

  if (
    lower.includes('size') ||
    lower.includes('sizing') ||
    lower.includes('ring') ||
    lower.includes('bangle') ||
    lower.includes('fit')
  ) {
    return {
      text: 'We provide complimentary bespoke sizing for all rings, necklaces, and bangles. If you are unsure of your size, we can also dispatch our complimentary physical Navidha Ring Sizer kit to your address.',
      actionLink: {
        label: 'Open Size & Measurement Guide',
        url: '/faq.html#size-guide',
        icon: 'external',
      },
    };
  }

  if (
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('quote') ||
    lower.includes('rate') ||
    lower.includes('estimate')
  ) {
    return {
      text: 'Our handcrafted pieces range from contemporary everyday pearl adornments starting from ₹4,500 to royal bridal polki sets. Please enter your WhatsApp number in the connection tab above, and our concierge will share tailored estimates and high-resolution lookbooks directly on WhatsApp.',
    };
  }

  // Default response
  return {
    text: 'Thank you for contacting Navidha! Our dedicated Jewelry Concierge is connected with AiSensy WhatsApp Business API. You may share your WhatsApp number above to receive lookbooks, quotes, and video walkthroughs directly on your phone.',
  };
}

export const FloatingWhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnreadIndicator, setHasUnreadIndicator] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // AiSensy Lead Capture State
  const [showAiSensyConnect, setShowAiSensyConnect] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('navidha_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('navidha_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom when messages update or typing state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showAiSensyConnect]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnreadIndicator(false);
      setShowTooltip(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Desktop tooltip prompt after gentle delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const cleanText = (textToSend || inputVal).trim();
    if (!cleanText) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputVal('');
    setIsTyping(true);

    // If user typed a phone number, automatically send lead to AiSensy in the background
    const phoneDigits = cleanText.replace(/[^0-9]/g, '');
    if (phoneDigits.length >= 10) {
      submitAiSensyLead({
        userName: 'Website Visitor',
        phone: phoneDigits,
        message: cleanText,
        inquiryType: 'In-Chat Phone Share',
        source: 'Navidha Floater Chat Window',
      }).catch(() => {});
    }

    // Natural concierge typing response
    setTimeout(() => {
      const response = getConciergeResponse(cleanText);
      const newConciergeMsg: ChatMessage = {
        id: `concierge-${Date.now()}`,
        sender: 'concierge',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: response.actionLink,
      };

      setMessages((prev) => [...prev, newConciergeMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...DEFAULT_WELCOME_MESSAGE,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLeadSuccessMsg(null);
  };

  const handleExternalWhatsAppFallback = () => {
    const latestUserMsg =
      [...messages].reverse().find((m) => m.sender === 'user')?.text ||
      'Namaste Navidha Atelier, I would like assistance with your jewelry collection.';
    const formattedMsg = `[AiSensy Ref: Web-Floater] ${latestUserMsg}`;
    const url = getAiSensyWhatsAppUrl(formattedMsg, WHATSAPP_PHONE_NUMBER);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Submit AiSensy WhatsApp Callback & Lead Request
  const handleAiSensyLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = leadPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) return;

    setIsSubmittingLead(true);
    const clientName = leadName.trim() || 'Valued Client';

    // Find the latest user inquiry message
    const latestInquiry = [...messages].reverse().find((m) => m.sender === 'user')?.text || 'Bespoke Jewelry Inquiry';

    try {
      const res = await submitAiSensyLead({
        userName: clientName,
        phone: cleanPhone,
        message: latestInquiry,
        inquiryType: 'WhatsApp Floater Lead Capture',
        source: 'Navidha Floater Lead Form',
      });

      const formattedNumber = formatAiSensyPhoneNumber(cleanPhone);
      setLeadSuccessMsg(`✓ WhatsApp Lead Registered (+${formattedNumber.slice(-10)})`);

      // Add confirmation message to chat stream
      const followUpMsg: ChatMessage = {
        id: `concierge-aisensy-${Date.now()}`,
        sender: 'concierge',
        text: `Thank you, ${clientName}! Your request has been queued via AiSensy WhatsApp Business API. Our Master Artisan will message you on WhatsApp (+${formattedNumber.slice(-10)}) with our high-resolution lookbook and custom design details.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: {
          label: 'Open Chat in WhatsApp App',
          url: res.whatsappUrl || getAiSensyWhatsAppUrl(`Namaste Navidha, I submitted my inquiry for ${latestInquiry}.`),
          icon: 'whatsapp',
        },
      };

      setMessages((prev) => [...prev, followUpMsg]);

      setTimeout(() => {
        setShowAiSensyConnect(false);
        setLeadPhone('');
        setLeadName('');
        setLeadSuccessMsg(null);
      }, 3500);
    } catch (err) {
      console.error('[AiSensy Lead Error]', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-6 right-5 sm:right-6 z-40 select-none print:hidden"
      data-testid="floating-whatsapp-container"
    >
      {/* IN-WEBSITE CONCIERGE CHAT WINDOW */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Navidha In-Website Live Concierge Chat"
          aria-modal="false"
          className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-[390px] max-w-[410px] h-[550px] max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-black/15 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200"
          data-testid="whatsapp-chat-popover"
        >
          {/* Header */}
          <div className="bg-[#14202e] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#c8a45d]/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#1b2a3c] border border-[#c8a45d]/40 flex items-center justify-center p-1 shadow-inner">
                  <BrandMark compact />
                </div>
                {/* Live green active badge */}
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#14202e] rounded-full"
                  title="Online"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-semibold tracking-wide text-[#fdfbf7]">
                    Navidha Concierge
                  </h3>
                  {/* AiSensy Official WhatsApp Business API Verified Badge */}
                  <span className="inline-flex items-center gap-0.5 text-[9px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider border border-[#25D366]/30">
                    <ShieldCheck size={10} className="text-[#25D366]" />
                    <span>AiSensy Verified</span>
                  </span>
                </div>
                <p className="text-[10px] text-[#c3cad5] flex items-center gap-1 font-sans">
                  <span>Official WhatsApp Business API</span>
                  <span className="text-[#c8a45d]">•</span>
                  <span className="text-[#25D366] font-medium">+91 89851 33732</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="text-[#99a6b8] hover:text-white p-1.5 rounded transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#c3cad5] hover:text-white p-1.5 rounded transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/40"
                aria-label="Close chat window"
                data-testid="whatsapp-close-btn"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Sub-Header Notice & Action Bar */}
          <div className="bg-[#f0ede6] px-3.5 py-2 border-b border-black/8 flex items-center justify-between text-[11px] text-[#444444] shrink-0">
            <button
              type="button"
              onClick={() => setShowAiSensyConnect(!showAiSensyConnect)}
              className="inline-flex items-center gap-1.5 text-[#14202e] hover:text-[#9a7a3e] font-semibold text-[11px] cursor-pointer"
            >
              <Smartphone size={13} className="text-[#25D366]" />
              <span>{showAiSensyConnect ? 'Hide WhatsApp Form' : 'Get Lookbook on WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={handleExternalWhatsAppFallback}
              className="text-[#14202e] hover:text-[#25D366] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer text-[10px] bg-white px-2 py-0.5 rounded border border-black/10 shadow-2xs"
              title="Launch chat in WhatsApp application"
            >
              <WhatsAppIcon size={12} className="text-[#25D366]" />
              <span>Open in WhatsApp</span>
              <ExternalLink size={9} />
            </button>
          </div>

          {/* AiSensy WhatsApp Callback & Lead Capture Drawer */}
          {showAiSensyConnect && (
            <div className="bg-[#fcfaf7] border-b border-[#c8a45d]/30 p-3.5 text-xs animate-in slide-in-from-top-2 duration-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-[12px] font-semibold text-[#14202e] flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#c8a45d]" />
                  <span>AiSensy Direct WhatsApp Dispatch</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAiSensyConnect(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="text-[11px] text-[#666666] mb-2.5 leading-snug">
                Enter your WhatsApp number to receive our private jewelry lookbook, pricing details, and artisan sketches directly on WhatsApp.
              </p>

              {leadSuccessMsg ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] font-medium flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>{leadSuccessMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleAiSensyLeadSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="px-2.5 py-1.5 border border-black/20 text-xs rounded bg-white focus:outline-none focus:border-[#14202e]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="px-2.5 py-1.5 border border-black/20 text-xs rounded bg-white focus:outline-none focus:border-[#14202e]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingLead || !leadPhone.trim()}
                    className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmittingLead ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Connecting with AiSensy...</span>
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon size={14} className="text-white" />
                        <span>Send Lookbook & Connect via WhatsApp</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 bg-[#f8f6f0] overflow-y-auto space-y-3 text-xs text-[#222222]">
            {/* Timestamp label */}
            <div className="text-center my-1">
              <span className="text-[10px] uppercase tracking-widest text-[#888888] bg-white/80 px-2.5 py-0.5 rounded-full border border-black/5 shadow-2xs">
                AiSensy Live Session
              </span>
            </div>

            {/* Conversation Stream */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#14202e] text-white rounded-br-none'
                      : 'bg-white text-[#14202e] border border-black/8 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional In-Chat Action Link */}
                  {msg.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-black/10">
                      <a
                        href={msg.actionLink.url}
                        target={msg.actionLink.icon === 'whatsapp' ? '_blank' : '_self'}
                        rel={msg.actionLink.icon === 'whatsapp' ? 'noopener noreferrer' : undefined}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium tracking-wide transition-all shadow-xs ${
                          msg.actionLink.icon === 'whatsapp'
                            ? 'bg-[#25D366] hover:bg-[#20ba59] text-white'
                            : 'bg-[#14202e] hover:bg-[#1f3147] text-[#fdfbf7]'
                        }`}
                      >
                        {msg.actionLink.icon === 'whatsapp' ? (
                          <WhatsAppIcon size={13} className="text-white" />
                        ) : msg.actionLink.icon === 'calendar' ? (
                          <Calendar size={12} className="text-[#c8a45d]" />
                        ) : (
                          <ExternalLink size={12} className="text-[#c8a45d]" />
                        )}
                        <span>{msg.actionLink.label}</span>
                      </a>
                    </div>
                  )}

                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      msg.sender === 'user' ? 'text-[#a0aec0]' : 'text-[#888888]'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck size={11} className="text-[#25D366]" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="bg-white border border-black/8 px-3.5 py-2 rounded-xl rounded-tl-none shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14202e] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14202e] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14202e] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-[#666666] ml-1">Navidha Concierge typing...</span>
                </div>
              </div>
            )}

            {/* Quick Inquiries (shown if conversation has only welcome message) */}
            {messages.length <= 1 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#666666] block mb-2">
                  Frequently Asked Topics:
                </span>
                <div className="space-y-1.5">
                  {QUICK_INQUIRIES.map((inq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(inq.text)}
                      className="w-full text-left p-2.5 bg-white hover:bg-[#14202e] hover:text-white border border-black/10 hover:border-[#14202e] rounded-lg transition-all text-xs flex items-center justify-between group cursor-pointer shadow-2xs"
                      data-testid={`quick-inquiry-btn-${idx}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{inq.icon}</span>
                        <span className="font-medium text-inherit">{inq.label}</span>
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-[#9a7a3e] group-hover:text-[#c8a45d] group-hover:translate-x-0.5 transition-transform shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* In-Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-black/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question or share WhatsApp number..."
              className="flex-1 px-3 py-2 text-xs border border-black/20 rounded-lg focus:border-[#14202e] focus:outline-none text-[#14202e] placeholder:text-[#999999]"
              data-testid="whatsapp-input"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-3.5 py-2 bg-[#14202e] hover:bg-[#1f3147] disabled:opacity-40 disabled:hover:bg-[#14202e] text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
              aria-label="Send message"
              data-testid="whatsapp-send-btn"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING ACTION TRIGGER BUTTON */}
      <div className="relative flex items-center justify-end">
        {/* Hover / Auto Tooltip on Desktop */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 bg-[#14202e] text-white text-xs rounded-full shadow-lg border border-[#c8a45d]/40 animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-sans font-medium tracking-wide flex items-center gap-1.5">
              <span>WhatsApp Concierge</span>
              <span className="text-[10px] text-[#c8a45d] bg-[#c8a45d]/15 px-1.5 py-0.2 rounded font-mono">AiSensy</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-[#999999] hover:text-white ml-0.5 cursor-pointer"
              aria-label="Dismiss tooltip"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 ${
            isOpen ? 'rotate-90 bg-[#14202e] hover:bg-[#1b2a3c]' : ''
          }`}
          aria-label={isOpen ? 'Close chat window' : 'Open in-site concierge chat'}
          aria-expanded={isOpen}
          data-testid="floating-whatsapp-btn"
        >
          {isOpen ? (
            <X size={24} className="text-white transition-transform" />
          ) : (
            <>
              <WhatsAppIcon size={28} className="text-white drop-shadow-xs" />
              {/* Unread indicator dot */}
              {hasUnreadIndicator && (
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8a45d] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#c8a45d] border-2 border-white" />
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
