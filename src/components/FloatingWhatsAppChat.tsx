import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Minus,
  Paperclip,
  Send,
  X,
  RotateCcw,
  Clock,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { submitAiSensyLead } from '../services/aisensy';

// Crisp outline Chat Bubble Icon matching uploaded Image 1
const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Navidha Monogram Avatar Badge matching Image 3 (replacing David Yurman DY with Navidha NV in brand palette)
const NavidhaAvatarBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <div
    className={`rounded-full bg-[#14202e] text-[#f8f1e4] flex items-center justify-center font-serif font-bold shrink-0 border border-[#c8a45d]/40 select-none shadow-xs ${
      size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs'
    }`}
  >
    <span className="tracking-tighter">NV</span>
  </div>
);

interface ChatMessage {
  id: string;
  sender: 'advisor' | 'user';
  text: string;
  time: string;
  attachmentName?: string;
  actionLink?: {
    label: string;
    url: string;
  };
}

const formatChatTime = (date = new Date()) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const INITIAL_WELCOME_PARAGRAPHS = [
  'Hi, I’m the Navidha Virtual Advisor.',
  'I’m an AI-powered chatbot that can answer questions and connect you with a Customer Care Specialist during business hours. All chats may be monitored and recorded by Navidha and its partners for quality and training purposes.',
  'How can I help you? I’m best with short statements such as “order status” or “start a return.”',
];

const QUICK_SUGGESTIONS = [
  'order status',
  'start a return',
  'speak with specialist',
  'pearl authenticity & certificates',
];

function getAdvisorResponse(userText: string): {
  text: string;
  actionLink?: { label: string; url: string };
} {
  const lower = userText.toLowerCase();

  // Order status inquiry
  if (lower.includes('order') || lower.includes('status') || lower.includes('track') || lower.includes('dispatch')) {
    return {
      text: 'To look up your order status, please provide your 6-digit Order ID (e.g. #NVD-84920) or your registered mobile number. All Navidha fine jewelry shipments are hand-inspected, packed in tamper-evident velvet cases, and delivered with 100% full transit insurance.',
      actionLink: {
        label: 'Track Armored Delivery',
        url: '/shipping-returns.html',
      },
    };
  }

  // Return & Exchange inquiry
  if (lower.includes('return') || lower.includes('exchange') || lower.includes('refund') || lower.includes('policy')) {
    return {
      text: 'We offer a 7-day complimentary insured return window for all unworn jewelry with unbroken authenticity tags. To initiate a return or request a complimentary armored courier pickup, our specialist can assist you directly.',
      actionLink: {
        label: 'View Shipping & Returns Policy',
        url: '/shipping-returns.html',
      },
    };
  }

  // Live Specialist or Human contact
  if (
    lower.includes('specialist') ||
    lower.includes('human') ||
    lower.includes('advisor') ||
    lower.includes('representative') ||
    lower.includes('speak') ||
    lower.includes('agent')
  ) {
    return {
      text: 'I would be happy to connect you with a Navidha Customer Care Specialist. Our specialists are available Monday through Saturday from 10:00 AM to 7:00 PM IST.',
      actionLink: {
        label: 'Schedule Atelier Consultation',
        url: '/consultation.html',
      },
    };
  }

  // Pearl quality, certificates, authenticity
  if (lower.includes('pearl') || lower.includes('basra') || lower.includes('certificate') || lower.includes('authentic') || lower.includes('lab')) {
    return {
      text: 'Every Navidha creation features certified natural pearls and certified 925 sterling silver. Each piece arrives sealed in an archival keepsake vault with our official Maison Certificate of Authenticity and independent gemological laboratory testing report.',
      actionLink: {
        label: 'Explore Our Heritage & Craft',
        url: '/faq.html',
      },
    };
  }

  // Bridal & Bespoke inquiry
  if (lower.includes('bridal') || lower.includes('wedding') || lower.includes('custom') || lower.includes('bespoke') || lower.includes('choker')) {
    return {
      text: 'Our Atelier specializes in custom bridal jewelry, Gulabi Meenakari, and certified Basra pearl chokers. Bespoke commissions begin with a private sketch session and typically require 3 to 6 weeks for master hand-setting.',
      actionLink: {
        label: 'Book Bridal Consultation',
        url: '/consultation.html',
      },
    };
  }

  // Phone number shared
  const phoneDigits = userText.replace(/[^0-9]/g, '');
  if (phoneDigits.length >= 10) {
    return {
      text: `Thank you for sharing your contact number (+${phoneDigits.slice(-10)}). A Customer Care Specialist has queued your request and will reach out with high-resolution lookbooks and styling assistance.`,
    };
  }

  // Default helpful Advisor reply
  return {
    text: 'Thank you for your message. How else may I assist you today? I can help with “order status”, “start a return”, jewelry certificates, or connect you directly with a Customer Care Specialist.',
  };
}

export const FloatingWhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Transcript & End Conversation states
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptEmail, setTranscriptEmail] = useState('');
  const [transcriptSuccess, setTranscriptSuccess] = useState<string | null>(null);
  const [isChatEnded, setIsChatEnded] = useState(false);

  // Hover Popups State (Image 2)
  const [isHovered, setIsHovered] = useState(false);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag & reposition state for flexible portal placement
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('navidha_chat_position');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
  });

  // Timestamp recorded when session starts
  const [sessionTime] = useState<string>(() => formatChatTime());

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('navidha_advisor_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clampPosition = (x: number, y: number) => {
    const btnSize = 52;
    const margin = 16;
    const maxX = Math.max(margin, (window.innerWidth || 800) - btnSize - margin);
    const maxY = Math.max(margin, (window.innerHeight || 600) - btnSize - margin);
    return {
      x: Math.min(Math.max(margin, x), maxX),
      y: Math.min(Math.max(margin, y), maxY),
    };
  };

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => (prev ? clampPosition(prev.x, prev.y) : null));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hover timer logic (Image 2)
  const handleMouseEnter = () => {
    if (isOpen || isDraggingRef.current) return;
    setIsHovered(true);
    setShowSecondPopup(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    // After a few seconds, second popup appears
    hoverTimerRef.current = setTimeout(() => {
      setShowSecondPopup(true);
    }, 1800);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowSecondPopup(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const currentRect = popoverRef.current?.getBoundingClientRect();
    const currentX = position?.x ?? (currentRect?.left ?? ((window.innerWidth || 800) - 72));
    const currentY = position?.y ?? (currentRect?.top ?? ((window.innerHeight || 600) - 72));

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: currentX,
      startY: currentY,
    };
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    if (!dragMovedRef.current && Math.hypot(dx, dy) > 5) {
      dragMovedRef.current = true;
      setIsHovered(false);
      setShowSecondPopup(false);
    }
    if (dragMovedRef.current) {
      const clamped = clampPosition(dragStartRef.current.startX + dx, dragStartRef.current.startY + dy);
      setPosition(clamped);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}

    if (dragMovedRef.current) {
      if (position) {
        try {
          localStorage.setItem('navidha_chat_position', JSON.stringify(position));
        } catch {}
      }
    } else {
      // Clean click: toggle chat open state
      setIsHovered(false);
      setShowSecondPopup(false);
      setIsOpen((prev) => !prev);
    }
  };

  // Sync messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('navidha_advisor_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (menuOpen) {
          setMenuOpen(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (isOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, menuOpen]);

  // Auto-focus input when chat window opens
  useEffect(() => {
    if (isOpen && !isChatEnded) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isChatEnded]);

  const handleSendMessage = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    if (isChatEnded) return;

    const textToSend = (presetText || inputVal).trim();
    if (!textToSend && !attachedFile) return;

    const timeString = formatChatTime();

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: timeString,
      attachmentName: attachedFile || undefined,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputVal('');
    setAttachedFile(null);
    setIsTyping(true);

    // If client shares a phone number, background sync to AiSensy
    const phoneDigits = textToSend.replace(/[^0-9]/g, '');
    if (phoneDigits.length >= 10) {
      submitAiSensyLead({
        userName: 'Chat Advisor Client',
        phone: phoneDigits,
        message: textToSend,
        inquiryType: 'Virtual Advisor Live Inquiry',
        source: 'Navidha Virtual Advisor Floater',
      }).catch(() => {});
    }

    // Natural advisor response delay
    setTimeout(() => {
      const response = getAdvisorResponse(textToSend);
      const newAdvisorMsg: ChatMessage = {
        id: `advisor-${Date.now()}`,
        sender: 'advisor',
        text: response.text,
        time: formatChatTime(),
        actionLink: response.actionLink,
      };

      setMessages((prev) => [...prev, newAdvisorMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Request & Download Chat Transcript
  const handleDownloadTranscript = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const transcriptLines = [
      '=================================================================',
      'NAVIDHA PEARLS & JEWELRY - OFFICIAL CHAT TRANSCRIPT',
      `Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Session Time: ${sessionTime}`,
      `Virtual Advisor: Navidha Virtual Advisor`,
      transcriptEmail.trim() ? `Client Email: ${transcriptEmail.trim()}` : null,
      '=================================================================\n',
      '--- CONVERSATION TRANSCRIPT ---\n',
      `[${sessionTime}] Navidha Virtual Advisor:`,
      INITIAL_WELCOME_PARAGRAPHS.join('\n\n'),
      '',
    ];

    messages.forEach((m) => {
      const senderLabel = m.sender === 'user' ? 'Client' : 'Navidha Virtual Advisor';
      transcriptLines.push(`[${m.time}] ${senderLabel}:`);
      transcriptLines.push(m.text);
      if (m.attachmentName) {
        transcriptLines.push(`[Attached File]: ${m.attachmentName}`);
      }
      transcriptLines.push('');
    });

    transcriptLines.push(
      '=================================================================',
      'Navidha Fine Jewelry Atelier',
      'Certified 925 Sterling Silver & Natural Pearls',
      'Official Boutique: https://navidhapearls.com',
      'Business Hours: Mon–Sat, 10:00 AM – 7:00 PM IST',
      '================================================================='
    );

    const fullContent = transcriptLines.filter((l) => l !== null).join('\n');
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `navidha-chat-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTranscriptSuccess('Transcript generated & downloaded successfully!');
    setTimeout(() => {
      setShowTranscriptModal(false);
      setTranscriptSuccess(null);
    }, 2200);
  };

  // End the Conversation
  const handleEndConversation = () => {
    setMenuOpen(false);
    setIsChatEnded(true);

    const endMsg: ChatMessage = {
      id: `advisor-ended-${Date.now()}`,
      sender: 'advisor',
      text: 'Thank you for connecting with the Navidha Virtual Advisor. This conversation has ended. If you need any further assistance, feel free to start a new chat below.',
      time: formatChatTime(),
    };
    setMessages((prev) => [...prev, endMsg]);
  };

  // Start New Chat after ending
  const handleStartNewChat = () => {
    setIsChatEnded(false);
    setMessages([]);
    try {
      sessionStorage.removeItem('navidha_advisor_messages');
    } catch {}
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 select-none print:hidden touch-none"
      style={
        position
          ? { left: `${position.x}px`, top: `${position.y}px` }
          : { bottom: '24px', right: '24px' }
      }
      data-testid="floating-advisor-container"
    >
      {/* ========================================================
          1. CHAT WINDOW POPUP (MATCHING UPLOADED IMAGE 3)
         ======================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with an Advisor"
          aria-modal="false"
          style={{
            position: 'absolute',
            ...(position && position.x < (typeof window !== 'undefined' ? window.innerWidth : 800) / 2
              ? { left: 0 }
              : { right: 0 }),
            ...(position && position.y < 580
              ? { top: '100%', marginTop: '12px' }
              : { bottom: '100%', marginBottom: '12px' }),
          }}
          className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] h-[550px] max-h-[calc(100vh-5.5rem)] bg-white rounded-t-lg sm:rounded-lg shadow-2xl border border-[#14202e]/25 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 z-50 text-left font-sans"
          data-testid="advisor-chat-window"
        >
          {/* A. NAVY & GOLD LUXURY HEADER (Matching website color theme) */}
          <div className="relative bg-[#14202e] text-[#f8f1e4] h-12 px-4 flex items-center justify-between shrink-0 select-none border-b border-[#c8a45d]/30">
            {/* Hamburger 3 bars button with dropdown menu directly underneath */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-[#f8f1e4] hover:text-[#c8a45d] transition-colors cursor-pointer"
                aria-label="Advisor menu"
                title="Advisor menu options"
                data-testid="advisor-menu-btn"
              >
                <Menu size={18} />
              </button>

              {/* DROPDOWN MENU MATCHING USER SCREENSHOT */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white rounded-md shadow-2xl border border-gray-200 z-50 text-left text-gray-900 animate-in fade-in slide-in-from-top-1 duration-150 select-none"
                  data-testid="advisor-dropdown-menu"
                >
                  {/* Top pointy arrow pointing up to the 3 bars */}
                  <div className="absolute -top-1.5 left-2.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45" />

                  <div className="relative z-10 overflow-hidden rounded-md bg-white">
                    {/* 1. Request Chat Transcript */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowTranscriptModal(true);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs sm:text-[13px] text-[#0f172a] hover:bg-gray-50 transition-colors font-medium border-b border-gray-100 flex items-center justify-between cursor-pointer"
                      data-testid="menu-request-transcript-btn"
                    >
                      <span>Request Chat Transcript</span>
                    </button>

                    {/* 2. End Conversation */}
                    <button
                      type="button"
                      onClick={handleEndConversation}
                      className="w-full text-left px-4 py-3 text-xs sm:text-[13px] text-[#0f172a] hover:bg-gray-50 transition-colors font-medium border-b border-gray-100 flex items-center justify-between cursor-pointer"
                      data-testid="menu-end-conversation-btn"
                    >
                      <span>End Conversation</span>
                    </button>

                    {/* 3. Business Hours (Kept as requested, mobile number & whatsapp removed) */}
                    <div className="px-4 py-2.5 bg-gray-50/90 text-[11px] text-gray-500 flex items-center gap-1.5 leading-snug">
                      <Clock size={12} className="text-[#9a7a3e] shrink-0" />
                      <span>Business Hours: Mon–Sat, 10:00 AM – 7:00 PM IST</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className="font-bold tracking-[0.14em] text-xs sm:text-[13px] uppercase text-white font-sans">
              CHAT WITH AN ADVISOR
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Minimize chat window"
              title="Minimize chat"
              data-testid="advisor-minimize-btn"
            >
              <Minus size={18} />
            </button>
          </div>

          {/* REQUEST CHAT TRANSCRIPT MODAL / DIALOG */}
          {showTranscriptModal && (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg p-5 w-full max-w-[320px] shadow-2xl text-left space-y-3.5 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-900 font-serif tracking-wide">
                    Request Chat Transcript
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTranscriptModal(false);
                      setTranscriptSuccess(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  Enter your email address to receive your official Navidha chat transcript, or download it immediately:
                </p>

                <form onSubmit={handleDownloadTranscript} className="space-y-3">
                  <input
                    type="email"
                    value={transcriptEmail}
                    onChange={(e) => setTranscriptEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-black font-sans"
                    data-testid="transcript-email-input"
                  />

                  {transcriptSuccess && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                      <span>{transcriptSuccess}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] rounded text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      data-testid="confirm-download-transcript-btn"
                    >
                      <Download size={13} />
                      <span>Download Transcript</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTranscriptModal(false);
                        setTranscriptSuccess(null);
                      }}
                      className="px-3 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded text-xs font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* C. CHAT MESSAGES STREAM (Exact Image 3 Layout & Typography) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white text-left">
            {/* 1. Date Header: Today • 2:34 PM */}
            <div className="text-center text-xs text-gray-500 font-sans font-medium py-1 select-none">
              Today • {sessionTime}
            </div>

            {/* 2. Initial Virtual Advisor Joined Announcement & Message (Image 3) */}
            <div className="space-y-1.5">
              {/* Header line with monogram avatar: Navidha Virtual Advisor has joined the chat. • 2:34 PM */}
              <div className="flex items-center gap-2 text-xs text-gray-700 font-sans">
                <NavidhaAvatarBadge size="sm" />
                <span className="font-medium text-[#222222]">
                  Navidha Virtual Advisor has joined the chat. • {sessionTime}
                </span>
              </div>

              {/* Message Box: Exact text as in attached image with David Yurman replaced with NAVIDHA */}
              <div className="ml-7 bg-[#fbf9f5] text-[#14202e] p-4 rounded-lg text-xs sm:text-[13px] leading-relaxed space-y-3 font-sans shadow-2xs border border-[#14202e]/10">
                {INITIAL_WELCOME_PARAGRAPHS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Sub-avatar & timestamp line: Navidha Virtual Advisor • 2:34 PM */}
              <div className="flex items-center gap-2 text-[11px] text-[#77808a] font-sans pt-1">
                <NavidhaAvatarBadge size="sm" />
                <span>Navidha Virtual Advisor • {sessionTime}</span>
              </div>
            </div>

            {/* Quick Suggestion Pills */}
            {messages.length === 0 && !isChatEnded && (
              <div className="ml-7 pt-1 flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(undefined, sug)}
                    className="px-2.5 py-1 bg-white hover:bg-[#14202e] hover:text-[#f8f1e4] text-[#14202e] text-[11px] rounded-full border border-[#14202e]/20 hover:border-[#14202e] transition-colors cursor-pointer shadow-2xs"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* 3. Dynamic Message Stream (User messages & Advisor responses) */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                {msg.sender === 'advisor' && (
                  <div className="flex items-center gap-2 text-[11px] text-[#77808a] font-sans">
                    <NavidhaAvatarBadge size="sm" />
                    <span>Navidha Virtual Advisor • {msg.time}</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs sm:text-[13px] leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-[#14202e] text-[#f8f1e4] rounded-br-none ml-auto shadow-xs'
                      : 'bg-[#fbf9f5] text-[#14202e] rounded-tl-none border border-[#14202e]/10 ml-7 shadow-2xs'
                  }`}
                >
                  {msg.attachmentName && (
                    <div className="flex items-center gap-1.5 text-[11px] opacity-80 mb-1 pb-1 border-b border-white/20">
                      <Paperclip size={11} />
                      <span className="truncate">{msg.attachmentName}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Action Link */}
                  {msg.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-black/10">
                      <a
                        href={msg.actionLink.url}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14202e] hover:text-[#c8a45d] underline"
                      >
                        <span>{msg.actionLink.label}</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Live Advisor Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 ml-7 text-xs text-gray-500 font-sans">
                <NavidhaAvatarBadge size="sm" />
                <div className="bg-[#f4f4f4] border border-black/5 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-gray-600 ml-1">Advisor typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached File Preview Chip */}
          {attachedFile && !isChatEnded && (
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-700">
              <span className="flex items-center gap-1.5 truncate">
                <Paperclip size={13} className="text-black" />
                <span className="truncate">{attachedFile}</span>
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-gray-400 hover:text-black p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* D. FOOTER INPUT BAR OR ENDED STATE */}
          {isChatEnded ? (
            <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-gray-500 italic font-sans">Conversation has ended.</span>
              <button
                type="button"
                onClick={handleStartNewChat}
                className="px-4 py-2 bg-[#14202e] hover:bg-[#c8a45d] text-[#f8f1e4] hover:text-[#14202e] rounded text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                data-testid="start-new-chat-btn"
              >
                Start New Conversation
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => handleSendMessage(e)}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Paperclip attachment icon matching Image 3 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-[#14202e] hover:text-[#c8a45d] transition-colors cursor-pointer shrink-0"
                title="Attach photo or file"
                aria-label="Attach photo or file"
              >
                <Paperclip size={20} className="rotate-45" />
              </button>

              {/* Input with exact placeholder: "Type your message..." */}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-[#14202e]/20 rounded-md text-xs sm:text-sm text-[#14202e] focus:outline-none focus:border-[#9a7a3e] placeholder-gray-400 font-sans"
                data-testid="advisor-message-input"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputVal.trim() && !attachedFile}
                className="p-2 text-[#14202e] hover:text-[#c8a45d] disabled:opacity-25 transition-colors cursor-pointer shrink-0"
                aria-label="Send message"
                data-testid="advisor-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* ========================================================
          2. FLOATING ACTION TRIGGER BUTTON (STRETCHES LEFTWARDS)
         ======================================================== */}
      <div
        className="relative w-12 h-12 flex items-center justify-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger Button - Anchored right-0 so all expansion stretches strictly towards the left side of the icon */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`absolute right-0 top-0 h-12 group flex items-center overflow-hidden rounded-full bg-[#14202e] hover:bg-[#1a293b] text-[#f8f1e4] shadow-xl hover:shadow-2xl border border-[#c8a45d]/40 hover:border-[#c8a45d] transition-all duration-300 ease-out cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-[#c8a45d]/50 touch-none select-none ${
            isOpen
              ? 'w-12 justify-center scale-95 bg-[#14202e]'
              : isHovered
              ? 'w-[225px] sm:w-[240px] pl-4 pr-0 justify-between shadow-[0_6px_24px_rgba(20,32,46,0.35)]'
              : 'w-12 p-0 justify-center'
          }`}
          aria-label={isOpen ? 'Close chat window' : 'Chat with an Advisor'}
          aria-expanded={isOpen}
          data-testid="floating-advisor-btn"
        >
          {isOpen ? (
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Minus size={20} className="text-[#f8f1e4] transition-transform" />
            </div>
          ) : (
            <>
              {/* Expanding text container strictly to the left of the icon */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out flex items-center flex-1 ${
                  isHovered
                    ? 'opacity-100 pr-1'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <span className="font-sans uppercase tracking-[0.14em] text-[11px] font-bold text-[#f8f1e4] whitespace-nowrap">
                  CHAT WITH AN ADVISOR
                </span>
              </div>

              {/* Exact 48px circle container holding the chat icon in place at the right */}
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <ChatBubbleIcon className="w-5 h-5 text-[#f8f1e4]" />
              </div>
            </>
          )}
        </button>

        {/* Second Popup: Appears in a few seconds directly underneath the stretched chat button (Image 2) */}
        {showSecondPopup && !isOpen && (
          <div
            className="absolute top-[calc(100%+8px)] right-0 bg-[#14202e] text-[#f8f1e4] text-xs px-4 py-2.5 rounded-sm shadow-2xl border border-[#c8a45d]/50 whitespace-nowrap animate-in fade-in slide-in-from-top-1 duration-200 select-none pointer-events-none z-50"
            data-testid="advisor-second-popup"
          >
            <span className="font-sans tracking-wide text-white font-medium">
              Hello, have a question? Let's chat.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
