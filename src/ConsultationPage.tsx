import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MessageSquare,
  Gem,
  Award,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import { BrandMark } from './components/BrandMark';
import customCommissionImg from './assets/images/regenerated_image_1790622254646.png';
import bridalConsultationImg from './assets/images/regenerated_image_1790622256746.png';
import sizingAlterationImg from './assets/images/regenerated_image_1790622261362.png';
import jewelryServiceRepairImg from './assets/images/regenerated_image_1790691758631.png';
import {
  initAuth,
  getAccessToken,
  googleSignIn,
  checkCalendarAvailability,
  executeAllBookingActions,
  BookingDetails
} from './services/googleWorkspace';
import type { User as FirebaseUser } from 'firebase/auth';

const STEP_TO_HASH: Record<number, string> = {
  1: '#/services',
  2: '#/location',
  3: '#/datetime',
  4: '#/details',
  5: '#/confirmation'
};

const HASH_TO_STEP: Record<string, 1 | 2 | 3 | 4 | 5> = {
  '#/services': 1,
  '#services': 1,
  '#/location': 2,
  '#location': 2,
  '#/datetime': 3,
  '#datetime': 3,
  '#/details': 4,
  '#details': 4,
  '#/confirmation': 5,
  '#confirmation': 5
};

interface ServiceOption {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
}

const SERVICES: ServiceOption[] = [
  {
    id: 'bespoke-commission',
    title: 'Custom Design Consultation & Bespoke Commission',
    category: 'Artisanal Bespoke',
    duration: '60 MIN',
    description:
      'Collaborate directly with our master design consultants to envision, sketch, and produce a one-of-a-kind heirloom piece featuring certified gemstones, 24k gold leaf, or hand-drawn filigree.',
    highlights: ['Gemstone & metal selection', 'Concept sketches & 3D renderings', 'Direct master artisan coordination'],
    image: customCommissionImg,
    imageAlt: 'Master jeweler atelier drafting custom jewelry sketches and selecting fine gemstones'
  },
  {
    id: 'bridal-trousseau',
    title: 'Bridal & Heritage Wedding Consultation',
    category: 'Bridal Curation',
    duration: '60 MIN',
    description:
      'A private, comprehensive curation of wedding jewelry suites, heirloom necklaces, matching earrings, and bangles tailored to harmonize with your ceremony ensembles.',
    highlights: ['Multi-outfit jewelry coordination', 'Family heirloom matching', 'Express wedding timeline scheduling'],
    image: bridalConsultationImg,
    imageAlt: 'Indian royal bridal jewelry suite and heritage pearl collar'
  },
  {
    id: 'sizing-alteration',
    title: 'Jewelry Sizing & Personal Customization',
    category: 'Personalization',
    duration: '30 MIN',
    description:
      'Consult on custom ring sizes, custom necklace collar lengths, clasp modifications, and personalized engraving of initials, dates, or sacred motifs.',
    highlights: ['Precise ring & bracelet sizing guide', 'Custom engraving options', 'Complimentary insured shipping return'],
    image: sizingAlterationImg,
    imageAlt: 'Fine precious metal ring sizing and personalized jewelry alteration'
  },
  {
    id: 'care-restoration',
    title: 'Jewelry Service and Repair',
    category: 'Service & Repair',
    duration: '45 MIN',
    description:
      'Professional assessment and guidance for jewelry service and repair, including ultrasonic cleaning, repolishing, restringing organic pearls, and heirloom restoration.',
    highlights: ['Artisan damage assessment', 'Pearl re-knotting inspection', 'Conservation plan & estimate'],
    image: jewelryServiceRepairImg,
    imageAlt: 'Navidha jewelry service and repair atelier with ultrasonic cleaner, pearl restringing, and fine jewelry care'
  }
];

const LOCATIONS = [
  {
    id: 'virtual',
    name: 'Virtual Video Consultation',
    type: 'Online (Video Conference)',
    address: 'Encrypted HD Video Link via Google Meet / Zoom',
    icon: Video,
    note: 'Join from anywhere in India or internationally'
  },
  {
    id: 'hyderabad-atelier',
    name: 'Navidha Flagship Atelier - Hyderabad',
    type: 'In-Person Salon',
    address: 'G20, Village Pointe, Manikonda, Hyderabad 500089',
    icon: MapPin,
    note: 'Private salon suite with dedicated valet parking'
  }
];

// Generate upcoming 10 days for the calendar with weekend detection
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let count = 0;
  let offset = 1;

  while (count < 10) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();
    const formatted = d.toISOString().split('T')[0];

    dates.push({
      dateStr: formatted,
      weekday: dayName,
      month: monthName,
      day: dayNumber,
      isWeekend,
      fullDisplay: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    });
    count++;
    offset++;
  }
  return dates;
};

const TIME_SLOTS = [
  '10:30 AM',
  '11:45 AM',
  '01:15 PM',
  '02:30 PM',
  '03:45 PM',
  '05:00 PM',
  '06:15 PM'
];

export const ConsultationPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption>(SERVICES[0]);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const availableDates = generateAvailableDates();
  const [selectedDate, setSelectedDate] = useState(() => availableDates.find((d) => !d.isWeekend) || availableDates[0]);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1]);

  // Client Details Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interests: 'Thewa 24k Gold Craft',
    notes: ''
  });

  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Google Workspace Token & Background Trigger
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Google Calendar Availability State for busy meeting slots
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [showUnavailableSlots, setShowUnavailableSlots] = useState<boolean>(false);

  // Function to query Google Calendar for busy meeting slots silently
  const refreshCalendarAvailability = async (tokenToUse?: string) => {
    const token = tokenToUse || authToken || (await getAccessToken());
    if (!token) return;

    try {
      const result = await checkCalendarAvailability(
        token,
        selectedDate.dateStr,
        TIME_SLOTS,
        'navidha.pearls@gmail.com'
      );
      if (!result.error && result.busySlots) {
        setBusySlots(result.busySlots);

        // If the selected slot is busy, automatically pick the first available slot
        if (result.busySlots.includes(selectedTime)) {
          const firstOpen = TIME_SLOTS.find((s) => !result.busySlots.includes(s));
          if (firstOpen) {
            setSelectedTime(firstOpen);
          }
        }
      }
    } catch (err: any) {
      console.warn('Background calendar check error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = initAuth((_user, token) => {
      setAuthToken(token);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const triggerAutomationsSilently = async (details: BookingDetails) => {
    try {
      const activeToken = authToken || (await getAccessToken());
      if (activeToken) {
        console.log('[Automations] Firing executeAllBookingActions with active OAuth token...');
        await executeAllBookingActions(activeToken, details);
      } else {
        console.log('[Automations] Webhook successfully recorded to Google Sheets without requiring visitor OAuth.');
      }
    } catch (err) {
      console.warn('[Automations] Background workspace task notice:', err);
    }
  };

  // Re-check Google Calendar whenever selected date changes or token arrives
  useEffect(() => {
    if (authToken && !selectedDate.isWeekend) {
      refreshCalendarAvailability(authToken);
    }
  }, [selectedDate.dateStr, authToken]);

  // Sync step with URL hash (e.g. #/services) matching JRNI booking portal pattern
  useEffect(() => {
    const currentHash = window.location.hash;
    if (currentHash && HASH_TO_STEP[currentHash]) {
      setStep(HASH_TO_STEP[currentHash]);
    } else {
      window.history.replaceState(null, '', '#/services');
    }

    const onHashChange = () => {
      const h = window.location.hash;
      if (h && HASH_TO_STEP[h]) {
        setStep(HASH_TO_STEP[h]);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const targetHash = STEP_TO_HASH[step] || '#/services';
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [step]);

  const handleNext = () => {
    if (step === 3 && busySlots.includes(selectedTime)) {
      const firstOpen = TIME_SLOTS.find((s) => !busySlots.includes(s));
      if (firstOpen) {
        setSelectedTime(firstOpen);
      }
    }
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sendConsultationWebhook = async (details: BookingDetails) => {
    const endpoints = [
      (import.meta as any).env?.VITE_CONSULTATION_WEBHOOK_URL,
      (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL,
      'https://script.google.com/macros/s/AKfycbwAUAAFAr9x1yjq4Z2l6VGHU9H4SKuLx1BB06Adi_hkUYiDnj5mg5qru61m5ZvTl-7C9Q/exec',
      'https://script.google.com/macros/s/AKfycbygiRhRbbQOBlWvWt1Ud4CCCtw-EnBhOIxSMyZfr65OALKFtKjSB83HvJONGZMgMiMHvQ/exec'
    ].filter(Boolean) as string[];

    const payload = JSON.stringify({
      type: 'consultation',
      action: 'consultation_booking',
      sheetName: 'Consultation Booking',
      bookingRef: details.bookingRef,
      customerName: `${details.firstName} ${details.lastName}`.trim(),
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone,
      serviceTitle: details.serviceTitle,
      serviceDescription: details.serviceDescription,
      date: details.dateDisplay,
      time: details.timeDisplay,
      locationName: details.locationName,
      locationAddress: details.locationAddress,
      occasion: details.occasion,
      notes: details.notes,
      timestamp: new Date().toISOString(),
    });

    console.log('[Consultation Webhook] 🚀 Dispatching booking to Google Sheets endpoints:', endpoints);

    // Send to webhooks in parallel without blocking UI
    await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: payload,
        })
      )
    );
    console.log('[Consultation Webhook] ✅ Dispatched successfully to Google Sheets');
  };

  // Directly confirm booking, log to Google Sheets webhook, and advance smoothly
  const handleSubmitBooking = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormError(null);

    const fName = (formData.firstName || '').trim();
    const lName = (formData.lastName || '').trim();
    const mail = (formData.email || '').trim();
    const tel = (formData.phone || '').trim();

    if (!fName) {
      setFormError('Please enter your First Name to confirm appointment.');
      return;
    }
    if (!lName) {
      setFormError('Please enter your Last Name to confirm appointment.');
      return;
    }
    if (!mail || !mail.includes('@')) {
      setFormError('Please enter a valid Email Address to receive confirmation.');
      return;
    }
    if (!tel || tel.length < 7) {
      setFormError('Please enter a valid Contact Number / WhatsApp.');
      return;
    }

    setIsSubmitting(true);

    const randomCode = `NAV-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(randomCode);

    const details: BookingDetails = {
      bookingRef: randomCode,
      firstName: fName,
      lastName: lName,
      email: mail,
      phone: tel,
      occasion: formData.interests,
      notes: formData.notes,
      serviceTitle: selectedService.title,
      serviceDescription: selectedService.description,
      dateDisplay: selectedDate.fullDisplay,
      dateRaw: selectedDate.dateStr,
      timeDisplay: selectedTime,
      locationName: selectedLocation.name,
      locationAddress: selectedLocation.address,
    };

    console.log('[handleSubmitBooking] Submitting booking details:', details);

    // 1. Immediately advance to confirmation UI (Step 5) with zero popup or delay
    setIsSubmitting(false);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Dispatch Webhook to Google Sheet tab "Consultation Booking" purely in the background
    sendConsultationWebhook(details);

    // 3. Execute background OAuth automations if token is active
    triggerAutomationsSilently(details);
  };

  const downloadCalendarEvent = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Navidha Luxury Jewelry//Appointment Booking//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
SUMMARY:Navidha: ${selectedService.title}
DESCRIPTION:${selectedService.description}\\nLocation: ${selectedLocation.name}\\nReference: ${bookingRef}
LOCATION:${selectedLocation.address}
ORGANIZER;CN="Navidha Pearls":mailto:navidha.pearls@gmail.com
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="Navidha Pearls Atelier":mailto:navidha.pearls@gmail.com
${formData.email ? `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN="${formData.firstName} ${formData.lastName}":mailto:${formData.email}` : ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `navidha-consultation-${bookingRef || 'appointment'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#14202e] flex flex-col font-sans selection:bg-[#c8a45d]/30 selection:text-[#14202e]">
      {/* Top Banner */}
      <div className="bg-[#14202e] text-[#f8f1e4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
        <span className="hidden sm:inline-block">Navidha Private Atelier</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>Custom Design & Bespoke Consultation</span>
        <span className="h-1 w-1 rounded-full bg-[#c8a45d]" />
        <span>India & International</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#14202e]/10">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#14202e] hover:text-[#9a7a3e] transition-colors py-2 group font-semibold"
              data-testid="booking-return-link"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span>Return to Boutique</span>
            </a>
          </div>

          <a href="/" className="flex items-center" aria-label="Navidha Home">
            <BrandMark />
          </a>

          <div className="hidden sm:flex items-center gap-3 text-xs text-[#667383]">
            <Sparkles size={14} className="text-[#c8a45d]" />
            <span className="tracking-widest uppercase text-[10px] font-semibold text-[#14202e]">Artisan Concierge</span>
          </div>
        </div>
      </header>

      {/* Progress Steps Header (Modeled on David Yurman / JRNI Journey) */}
      <div className="bg-[#f0ebe3] border-b border-[#14202e]/10 py-4 px-4 sm:px-8">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center justify-between text-xs font-serif uppercase tracking-[0.12em]">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#14202e] font-semibold' : 'text-[#8c9ba5]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#14202e] text-white' : step > 1 ? 'bg-[#c8a45d] text-white' : 'border border-[#8c9ba5]'}`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span className="hidden sm:inline">1. Service</span>
            </div>
            <div className="h-[1px] w-8 sm:w-16 bg-[#14202e]/20" />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#14202e] font-semibold' : 'text-[#8c9ba5]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#14202e] text-white' : step > 2 ? 'bg-[#c8a45d] text-white' : 'border border-[#8c9ba5]'}`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span className="hidden sm:inline">2. Format</span>
            </div>
            <div className="h-[1px] w-8 sm:w-16 bg-[#14202e]/20" />

            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#14202e] font-semibold' : 'text-[#8c9ba5]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#14202e] text-white' : step > 3 ? 'bg-[#c8a45d] text-white' : 'border border-[#8c9ba5]'}`}>
                {step > 3 ? '✓' : '3'}
              </span>
              <span className="hidden sm:inline">3. Date & Time</span>
            </div>
            <div className="h-[1px] w-8 sm:w-16 bg-[#14202e]/20" />

            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-[#14202e] font-semibold' : 'text-[#8c9ba5]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-[#14202e] text-white' : step > 4 ? 'bg-[#c8a45d] text-white' : 'border border-[#8c9ba5]'}`}>
                {step > 4 ? '✓' : '4'}
              </span>
              <span className="hidden sm:inline">4. Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center max-w-[680px] mx-auto mb-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a7a3e] font-bold mb-2">
                JRNI Concierge & Appointment Portal
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#14202e] tracking-tight">
                Select Your Consultation Service
              </h1>
              <p className="text-sm text-[#667383] mt-3 leading-relaxed">
                Whether you wish to commission a bespoke bridal necklace, tailor an heirloom ring, or tour our collection virtually, our master artisans are dedicated to your vision.
              </p>
            </div>

            <div className="space-y-5">
              {SERVICES.map((srv) => {
                const isSelected = selectedService.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`overflow-hidden border transition-all cursor-pointer rounded-xs relative group ${
                      isSelected
                        ? 'border-[#14202e] bg-white shadow-lg ring-1 ring-[#14202e]'
                        : 'border-[#14202e]/15 bg-white/80 hover:border-[#14202e]/40 hover:bg-white hover:shadow-sm'
                    }`}
                    data-testid={`service-option-${srv.id}`}
                  >
                    <div className="flex flex-col md:flex-row items-stretch">
                      {/* Service Editorial Photography */}
                      <div className="md:w-56 lg:w-64 shrink-0 relative overflow-hidden bg-[#14202e]/5 h-48 md:h-auto min-h-[190px]">
                        <img
                          src={srv.image}
                          alt={srv.imageAlt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:hidden" />
                        <span className="absolute bottom-3 left-3 md:hidden text-[10px] uppercase font-bold tracking-[0.16em] text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full">
                          {srv.category}
                        </span>
                      </div>

                      {/* Service Details & Action */}
                      <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-[0.16em] text-[#9a7a3e] bg-[#9a7a3e]/10 px-2.5 py-0.5 rounded-full">
                                {srv.category}
                              </span>
                              <span className="text-xs text-[#667383] flex items-center gap-1 font-mono">
                                <Clock size={12} /> {srv.duration}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14202e] bg-[#f4ece1] px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 size={13} className="text-[#9a7a3e]" /> Selected
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-xl sm:text-2xl text-[#14202e] font-normal group-hover:text-[#9a7a3e] transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#4b5563] mt-2.5 leading-relaxed max-w-[720px]">
                            {srv.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-[11px] text-[#667383]">
                            {srv.highlights.map((h, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#c8a45d]" />
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#14202e]/10 flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-[0.14em] text-[#9a7a3e] font-medium">
                            Private Consultation Included
                          </span>
                          <button
                            type="button"
                            className={`px-6 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#14202e] text-white border-[#14202e]'
                                : 'bg-transparent text-[#14202e] border-black/20 hover:border-black group-hover:bg-[#14202e] group-hover:text-white'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select Service'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-10 py-4 bg-[#14202e] text-white font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#c8a45d] transition-colors cursor-pointer"
                data-testid="service-continue-btn"
              >
                Continue to Format & Location →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FORMAT & LOCATION */}
        {step === 2 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center max-w-[680px] mx-auto mb-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a7a3e] font-bold mb-2">
                Step 2 of 4
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#14202e] tracking-tight">
                Choose Consultation Experience
              </h1>
              <p className="text-sm text-[#667383] mt-3">
                Experience our personalized curation via private encrypted video call or at our flagship atelier salon in Hyderabad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6">
              {LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                const IconComponent = loc.icon;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-6 border transition-all cursor-pointer flex flex-col justify-between rounded-xs ${
                      isSelected
                        ? 'border-[#14202e] bg-white shadow-md ring-1 ring-[#14202e]'
                        : 'border-[#14202e]/15 bg-white/70 hover:border-[#14202e]/40 hover:bg-white'
                    }`}
                    data-testid={`location-option-${loc.id}`}
                  >
                    <div>
                      <div className="h-12 w-12 rounded-full border border-[#14202e]/15 flex items-center justify-center text-[#14202e] mb-4 bg-[#fbf9f5]">
                        <IconComponent size={22} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#9a7a3e]">
                        {loc.type}
                      </span>
                      <h3 className="font-serif text-xl text-[#14202e] mt-1 mb-2 font-normal">
                        {loc.name}
                      </h3>
                      <p className="text-xs text-[#555555] leading-relaxed mb-4">
                        {loc.address}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/10">
                      <p className="text-[11px] text-[#777777] italic mb-4">{loc.note}</p>
                      <button
                        type="button"
                        className={`w-full py-2.5 text-xs uppercase tracking-[0.14em] font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#14202e] text-white border-[#14202e]'
                            : 'bg-transparent text-[#14202e] border-black/20 hover:border-black'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose This'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-black/20 text-[#14202e] text-xs uppercase tracking-[0.16em] hover:border-black transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-10 py-4 bg-[#14202e] text-white font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#c8a45d] transition-colors cursor-pointer"
              >
                Continue to Date & Time →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center max-w-[680px] mx-auto mb-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a7a3e] font-bold mb-2">
                Step 3 of 4
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#14202e] tracking-tight">
                Select Date & Time Slot
              </h1>
              <p className="text-sm text-[#667383] mt-3">
                All appointment times are displayed in Indian Standard Time (IST / GMT+5:30).
              </p>
            </div>

            <div className="bg-white border border-[#14202e]/15 p-6 sm:p-8 rounded-xs shadow-sm">
              {/* Date horizontal strip picker */}
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs uppercase font-bold tracking-[0.16em] text-[#14202e]">
                  Available Dates
                </label>
                <span className="text-[11px] text-[#8c827a] font-normal">
                  Saturdays & Sundays Atelier Closed
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                {availableDates.map((d) => {
                  const isSelected = !d.isWeekend && selectedDate.dateStr === d.dateStr;
                  const isWeekend = d.isWeekend;

                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      disabled={isWeekend}
                      aria-disabled={isWeekend}
                      onClick={() => !isWeekend && setSelectedDate(d)}
                      className={`p-3 text-center border transition-all rounded-xs select-none ${
                        isWeekend
                          ? 'border-black/10 bg-[#f4f2ee] text-[#a8a199] opacity-45 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#14202e] bg-[#14202e] text-white shadow-sm cursor-pointer'
                          : 'border-black/15 bg-[#fbf9f5] hover:border-black text-[#14202e] cursor-pointer'
                      }`}
                      data-testid={`date-slot-${d.dateStr}`}
                    >
                      <span className={`block text-[10px] uppercase tracking-widest ${isWeekend ? 'text-[#a8a199]' : 'opacity-80'}`}>
                        {d.weekday}
                      </span>
                      <span className={`block font-serif text-2xl font-normal my-0.5 ${isWeekend ? 'text-[#a8a199]' : ''}`}>
                        {d.day}
                      </span>
                      <span className={`block text-[10px] uppercase tracking-wider ${isWeekend ? 'text-[9px] font-medium text-[#8c827a]' : ''}`}>
                        {isWeekend ? 'Closed' : d.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Header & Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-black/10">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-[0.16em] text-[#14202e]">
                    Available Time Slots for {selectedDate.fullDisplay}
                  </label>
                  <span className="text-[11px] text-[#667383] flex items-center gap-1.5 mt-0.5">
                    <span>{selectedService.duration} private session</span>
                    <span className="text-[#c8a45d]">•</span>
                    <span className="text-[#9a7a3e] font-semibold">10-Min Mandatory Buffer Enforced</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-[#14202e]">
                    <input
                      type="checkbox"
                      checked={showUnavailableSlots}
                      onChange={(e) => setShowUnavailableSlots(e.target.checked)}
                      className="rounded border-gray-300 text-[#14202e] focus:ring-[#c8a45d] h-4 w-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium text-[#4b5563]">Show Unavailable / Grayed Out</span>
                  </label>

                  <a
                    href="/appointment-booking-widget.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#9a7a3e] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Full Calendar Widget ↗</span>
                  </a>
                </div>
              </div>

              {(() => {
                const displayedSlots = showUnavailableSlots
                  ? TIME_SLOTS
                  : TIME_SLOTS.filter((s) => !busySlots.includes(s));

                if (displayedSlots.length === 0) {
                  return (
                    <div className="p-8 text-center bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xs text-[#667383] text-xs">
                      <p className="font-semibold text-[#14202e] mb-1">No completely open slots on this date.</p>
                      <p>All appointment windows and their 10-minute buffers are occupied. Please select another date or turn on &quot;Show Unavailable / Grayed Out&quot;.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {displayedSlots.map((slot) => {
                      const isBusy = busySlots.includes(slot);
                      const isSelected = !isBusy && selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBusy}
                          onClick={() => !isBusy && setSelectedTime(slot)}
                          className={`py-3 px-4 text-center border text-xs tracking-wider transition-all rounded-xs font-mono select-none ${
                            isBusy
                              ? 'border-black/10 bg-[#f4f2ee] text-[#a8a199] opacity-55 cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-[#14202e] bg-[#14202e] text-white font-bold cursor-pointer shadow-xs'
                              : 'border-black/15 bg-white hover:border-black text-[#14202e] cursor-pointer'
                          }`}
                          data-testid={`time-slot-${slot.replace(/\s+/g, '')}`}
                        >
                          <span>{slot}</span>
                          {isBusy && (
                            <span className="block text-[9px] uppercase tracking-wider text-[#b02a37] font-sans font-semibold mt-0.5 no-underline">
                              Booked / Buffer
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Appointment summary review */}
              <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#555555] gap-4">
                <div>
                  <span className="font-bold text-[#14202e] uppercase tracking-wider block">Chosen Slot:</span>
                  <span>{selectedDate.fullDisplay} at {selectedTime} IST</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#14202e] uppercase tracking-wider block">Duration:</span>
                  <span>{selectedService.duration} ({selectedLocation.name})</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-black/20 text-[#14202e] text-xs uppercase tracking-[0.16em] hover:border-black transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-10 py-4 bg-[#14202e] text-white font-sans text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#c8a45d] transition-colors cursor-pointer"
                data-testid="datetime-continue-btn"
              >
                Continue to Client Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CLIENT DETAILS */}
        {step === 4 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center max-w-[680px] mx-auto mb-10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a7a3e] font-bold mb-2">
                Step 4 of 4
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#14202e] tracking-tight">
                Guest & Consultation Details
              </h1>
              <p className="text-sm text-[#667383] mt-3">
                Please provide your contact information to receive your confirmation, calendar invite, and secure video access link.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-2 bg-white border border-[#14202e]/15 p-6 sm:p-8 rounded-xs shadow-sm">
                <form onSubmit={handleSubmitBooking} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        placeholder="Radhika"
                        className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none"
                        data-testid="input-firstname"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData({ ...formData, lastName: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        placeholder="Sharma"
                        className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none"
                        data-testid="input-lastname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        placeholder="radhika@example.com"
                        className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (formError) setFormError(null);
                        }}
                        placeholder="+91 98200 12345"
                        className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                      Jewelry Focus / Primary Interest
                    </label>
                    <select
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none bg-white"
                      data-testid="select-interest"
                    >
                      <option value="Thewa 24k Gold Craft">Thewa Jewelry (24k Gold Fused on Colored Glass)</option>
                      <option value="Gulabi Meenakari">Gulabi Meenakari (Pink Enamel on Silver & Gold)</option>
                      <option value="Silver Filigree">Tarkashi Silver Filigree (Cuttack & Karimnagar)</option>
                      <option value="Hupari Solid Silver">Hupari Handcrafted 925 Solid Silver</option>
                      <option value="Bridal Suite & Heirloom Sets">Bridal Suite & Custom Trousseau</option>
                      <option value="Custom Sizing & Gemstone Sourcing">Custom Gemstone Sourcing & Sizing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-[0.14em] text-[#14202e] mb-1.5">
                      Special Requests / Inspiration Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Share details on target budget, occasion date, stone preferences, or heirloom pieces you wish to coordinate."
                      className="w-full px-3.5 py-3 border border-black/20 text-sm focus:border-black focus:outline-none"
                    />
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle size={16} className="text-red-600 shrink-0" />
                      <span className="font-medium">{formError}</span>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3.5 border border-black/20 text-[#14202e] text-xs uppercase tracking-[0.16em] hover:border-black transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSubmitBooking(e)}
                      className="px-9 py-4 font-sans text-xs uppercase tracking-[0.18em] font-bold rounded-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md bg-[#14202e] text-white hover:bg-[#c8a45d] hover:text-[#14202e] hover:shadow-lg cursor-pointer active:scale-[0.98]"
                      data-testid="submit-booking-btn"
                    >
                      <span>Confirm Consultation Booking</span>
                      <Check size={16} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Booking Summary Sidebar */}
              <div className="bg-[#f0ebe3] border border-[#14202e]/15 p-6 rounded-xs h-fit space-y-5">
                <div className="overflow-hidden rounded-xs border border-[#14202e]/10 -mt-1 mb-2">
                  <img
                    src={selectedService.image}
                    alt={selectedService.imageAlt}
                    className="w-full h-32 object-cover"
                  />
                </div>
                <h3 className="font-serif text-lg text-[#14202e] pb-3 border-b border-black/10">
                  Appointment Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#777777]">Service</span>
                    <span className="font-semibold text-[#14202e]">{selectedService.title}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#777777]">Duration</span>
                    <span className="font-mono text-[#14202e]">{selectedService.duration}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#777777]">Format & Location</span>
                    <span className="font-semibold text-[#14202e]">{selectedLocation.name}</span>
                    <p className="text-[11px] text-[#666666] mt-0.5">{selectedLocation.address}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#777777]">Date & Time</span>
                    <span className="font-semibold text-[#14202e]">
                      {selectedDate.fullDisplay} at {selectedTime} IST
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/10 text-[11px] text-[#555555] space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#9a7a3e] shrink-0" />
                    <span>Complimentary, zero obligation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-[#9a7a3e] shrink-0" />
                    <span>Assisted by certified jewelry designers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & 3 AUTOMATED ACTIONS DASHBOARD */}
        {step === 5 && (
          <div className="animate-in zoom-in-95 duration-300 max-w-[800px] mx-auto text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} />
            </div>

            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9a7a3e] font-bold mb-2">
              Appointment Confirmed
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#14202e] tracking-tight">
              We Look Forward to Welcoming You
            </h1>
            <p className="text-sm text-[#555555] mt-3 leading-relaxed max-w-xl mx-auto">
              Your consultation request is registered with Navidha Pearls Atelier. A confirmation with your full appointment details and calendar invitation has been prepared.
            </p>

            {/* Booking Details Card */}
            <div className="my-8 p-6 bg-white border border-[#14202e]/15 text-left rounded-xs shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedService.image}
                    alt={selectedService.imageAlt}
                    className="w-16 h-16 object-cover rounded-xs border border-black/10 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#777777]">Booking Reference</span>
                    <p className="font-mono text-lg font-bold text-[#14202e]">{bookingRef}</p>
                  </div>
                </div>
                <span className="self-start sm:self-center text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 font-semibold uppercase tracking-wider">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777777] block">Service</span>
                  <span className="font-medium text-[#14202e]">{selectedService.title}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777777] block">Date & Time</span>
                  <span className="font-medium text-[#14202e]">{selectedDate.fullDisplay} at {selectedTime} IST</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777777] block">Format</span>
                  <span className="font-medium text-[#14202e]">{selectedLocation.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777777] block">Guest Name</span>
                  <span className="font-medium text-[#14202e]">{formData.firstName} {formData.lastName}</span>
                </div>
              </div>
            </div>

            {/* Customer Reassurance Note */}
            <div className="my-8 p-5 bg-white border border-[#14202e]/10 text-center rounded-xs shadow-xs">
              <p className="text-xs text-[#555555] leading-relaxed max-w-lg mx-auto">
                A formal calendar invitation and confirmation dossier have been prepared for your visit. Our Senior Concierge will be in touch should you require custom design references prior to your session.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={downloadCalendarEvent}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#14202e] text-[#14202e] text-xs uppercase tracking-[0.16em] font-bold hover:bg-[#14202e] hover:text-white transition-colors cursor-pointer"
                data-testid="add-calendar-btn"
              >
                <Download size={15} />
                <span>Add to Calendar (.ics)</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#14202e] text-white text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#c8a45d] transition-colors no-underline cursor-pointer"
                data-testid="return-home-btn"
              >
                Return to Boutique
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#14202e]/10 bg-[#fbf9f5] py-8 text-center text-xs text-[#777777]">
        <div className="max-w-[1440px] mx-auto px-5">
          <p>© {new Date().getFullYear()} Navidha Jewelry Atelier. Complimentary Insured Delivery Across India.</p>
        </div>
      </footer>
    </div>
  );
};
