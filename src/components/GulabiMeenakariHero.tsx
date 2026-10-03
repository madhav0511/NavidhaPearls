import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

// 7 Sequential High-Resolution Craft Stage Images
import stage1Img from '../assets/images/gulabi_stage_1_1791013423822.jpg';
import stage2Img from '../assets/images/gulabi_stage_2_1791013446365.jpg';
import stage3Img from '../assets/images/gulabi_stage_3_1791013466737.jpg';
import stage4Img from '../assets/images/gulabi_stage_4_1791013485142.jpg';
import stage5Img from '../assets/images/gulabi_stage_5_1791013509652.jpg';
import stage6Img from '../assets/images/gulabi_stage_6_1791013529393.jpg';
import stage7Img from '../assets/images/gulabi_stage_7_1791013548102.jpg';

export interface CraftStage {
  id: number;
  stageNumber: string;
  stageNumberHindi: string;
  hindiTitle: string;
  craftTerm: string;
  title: string;
  titleHindi: string;
  durationSeconds: number;
  image: string;
  audioSrcEn: string;
  audioSrcHi: string;
  narrationTextEn: string;
  narrationTextHi: string;
}

export const CRAFT_STAGES: CraftStage[] = [
  {
    id: 0,
    stageNumber: '01',
    stageNumberHindi: '०१',
    hindiTitle: 'नक़्क़ाशी',
    craftTerm: 'Naqqashi',
    title: 'Design & Ideation',
    titleHindi: 'डिज़ाइन एवं रूपरेखा',
    durationSeconds: 22.3,
    image: stage1Img,
    audioSrcEn: '/audio/01-voice-design.wav',
    audioSrcHi: '/audio/hi/01-voice-design-hi.wav',
    narrationTextEn:
      'The story begins on paper. The chitera hand-draws intricate sketches inspired by Mughal royalty: blooming gulab roses, graceful peacocks, and flowing floral vines. Drafted at an exact one-to-one scale on fine silver or gold, every motif is measured with traditional dividers to guarantee perfect symmetry.',
    narrationTextHi:
      'कहानी कागज़ पर शुरू होती है। चितेरा मुग़ल वास्तुकला, खिलते गुलाब और मोरों से प्रेरित होकर सोने या चाँदी पर बारीक नक़्शे खींचता है, ताकि हर डिज़ाइन में पूर्ण समरूपता हो।',
  },
  {
    id: 1,
    stageNumber: '02',
    stageNumberHindi: '०२',
    hindiTitle: 'छिलाई',
    craftTerm: 'Chilai',
    title: 'Metal Fabrication & Engraving',
    titleHindi: 'धातु गढ़ाई एवं नक़्क़ाशी',
    durationSeconds: 16.5,
    image: stage2Img,
    audioSrcEn: '/audio/02-voice-chilai.wav',
    audioSrcHi: '/audio/hi/02-voice-chilai-hi.wav',
    narrationTextEn:
      'The silversmith hammers pure metal into shape, filling hollow structures with warm natural resin for support. Then, the engraver uses micro-chisels to carve deep channels into the surface, cross-hatching the metal base so light can refract beneath the glass.',
    narrationTextHi:
      'सुनार धातु को पीटकर आकार देता है और मज़बूती के लिए उसमें लाख भरता है। फिर छिलाई-कार सूक्ष्म छेनियों से धातु पर गहरी लकीरें उकेरता है, जिससे रोशनी मीने के नीचे चमक सके।',
  },
  {
    id: 2,
    stageNumber: '03',
    stageNumberHindi: '०३',
    hindiTitle: 'सफ़ेद मीना',
    craftTerm: 'Safed Meena',
    title: 'Base Enamel Application',
    titleHindi: 'सफ़ेद मीना आधार',
    durationSeconds: 14.7,
    image: stage3Img,
    audioSrcEn: '/audio/03-voice-safed-meena.wav',
    audioSrcHi: '/audio/hi/03-voice-safed-meena-hi.wav',
    narrationTextEn:
      'Crushed glass stones, ground fine with water, form the backdrop. The enameler uses delicate copper needles to pack this wet white enamel into the carved grooves, blotting away excess moisture with meticulous care.',
    narrationTextHi:
      'पिसा हुआ काँच और पानी का लेप आधार बनाता है। मीनाकार तांबे की सुइयों से गीला सफ़ेद मीना धातु की लकीरों में सावधानी से भरता है।',
  },
  {
    id: 3,
    stageNumber: '04',
    stageNumberHindi: '०४',
    hindiTitle: 'भट्टी तपाना',
    craftTerm: 'Bhatti Firing',
    title: 'Kiln Vitrification (800°C)',
    titleHindi: 'भट्टी में उच्च तापमान पर तपाना',
    durationSeconds: 11.1,
    image: stage4Img,
    audioSrcEn: '/audio/04-voice-bhatti.wav',
    audioSrcHi: '/audio/hi/04-voice-bhatti-hi.wav',
    narrationTextEn:
      'Surrendering to the flame, the piece is placed inside an intense 800-degree kiln. The white glass powder melts, fusing seamlessly into every engraved contour of the metal.',
    narrationTextHi:
      'आठ सौ डिग्री की भट्टी में तपाने पर काँच का चूर्ण पिघलकर धातु के साथ एकाकार हो जाता है और एक चमकीला आधार बनाता है।',
  },
  {
    id: 4,
    stageNumber: '05',
    stageNumberHindi: '०५',
    hindiTitle: 'गुलाबी चित्रांकन',
    craftTerm: 'Gulabi Chitra',
    title: 'Micro Hand-Painting',
    titleHindi: 'गुलाबी ऑक्साइड से सूक्ष्म चित्रकारी',
    durationSeconds: 22.3,
    image: stage5Img,
    audioSrcEn: '/audio/05-voice-gulabi-chitra.wav',
    audioSrcHi: '/audio/hi/05-voice-gulabi-chitra-hi.wav',
    narrationTextEn:
      'The defining signature of Varanasi. Using a brush made from a single squirrel hair, the master painter hand-renders delicate rose petals over the white glazed base. The pink pigment, a secret blend of crushed enamel, sandalwood oil, and gold oxides, is refired at lower heat, blooming into a soft watercolor gradient.',
    narrationTextHi:
      'यह वाराणसी की पहचान है—गुलाबी मीनाकारी। गिलहरी के एक बाल के ब्रश से सफ़ेद सतह पर गुलाबी ऑक्साइड से गुलाब की पंखुड़ियाँ उकेरी जाती हैं, जो धीमी आँच पर फिर पककर गुलाबी रंग बिखेरती हैं।',
  },
  {
    id: 5,
    stageNumber: '06',
    stageNumberHindi: '०६',
    hindiTitle: 'जड़ाई और घोटाई',
    craftTerm: 'Jadai & Gotai',
    title: 'Kundan Setting & Agate Polishing',
    titleHindi: 'कुंदन जड़ाई एवं अकीक घोटाई',
    durationSeconds: 16.1,
    image: stage6Img,
    audioSrcEn: '/audio/06-voice-jadai-gotai.wav',
    audioSrcHi: '/audio/hi/06-voice-jadai-gotai-hi.wav',
    narrationTextEn:
      'Ancient art meets precious stones. Hyper-purified gold foil is hand-pressed around rubies, pearls, and uncut diamonds, securing them without a single prong. The piece is then burnished with an agate stone, polishing the silver to a brilliant mirror shine.',
    narrationTextHi:
      'शुद्ध सोने के वर्क से बिना किसी कुंडी के रत्नों और मोतियों की जड़ाई की जाती है, और फिर अकीक पत्थर से घोटाई करके दर्पण जैसी चमक लाई जाती है।',
  },
  {
    id: 6,
    stageNumber: '07',
    stageNumberHindi: '०७',
    hindiTitle: 'शाही श्रृंगार',
    craftTerm: 'Royal Showcase',
    title: 'Final Assembly & Adornment',
    titleHindi: 'अंतिम संयोजन एवं राजसी श्रृंगार',
    durationSeconds: 15.4,
    image: stage7Img,
    audioSrcEn: '/audio/07-voice-showcase.wav',
    audioSrcHi: '/audio/hi/07-voice-showcase-hi.wav',
    narrationTextEn:
      'Enamelled beads, pendants, and pearls are strung together on hand-twisted silk. Inspected under magnification for absolute perfection, the finished heirloom comes to life, bridging 18th-century royal heritage with modern luxury.',
    narrationTextHi:
      'हाथ से बंटे रेशमी धागों में मीनाकारी के मनके और बसरा मोती पिरोए जाते हैं। इस तरह सदियों पुरानी शाही विरासत एक आधुनिक आभूषण के रूप में जीवंत हो उठती है।',
  },
];

interface GulabiMeenakariHeroProps {
  onExploreCollection?: () => void;
  onExploreHeritage?: () => void;
}

export const GulabiMeenakariHero: React.FC<GulabiMeenakariHeroProps> = ({
  onExploreCollection,
  onExploreHeritage,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [audioLang, setAudioLang] = useState<'en' | 'hi'>('en');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [userHasInteracted, setUserHasInteracted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  const currentStage = CRAFT_STAGES[currentStageIdx];
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fallbackIntervalRef = useRef<any>(null);

  // Advance stage smoothly. When reaching the end of stage 7, stop unless customer clicks play
  const handleNextStage = useCallback(() => {
    if (currentStageIdx >= CRAFT_STAGES.length - 1) {
      // Narration sequence completed: stop automatically
      setIsPlaying(false);
      setHasEnded(true);
      setProgressPercent(100);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      return;
    }

    setAudioError(false);
    setCurrentStageIdx((prev) => prev + 1);
    setProgressPercent(0);
  }, [currentStageIdx]);

  // Restart sequence from Stage 1
  const restartSequence = useCallback(() => {
    setCurrentStageIdx(0);
    setProgressPercent(0);
    setHasEnded(false);
    setIsPlaying(true);
    setUserHasInteracted(true);
    setIsMuted(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.muted = false;
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play().catch(() => {});
    }
  }, []);

  // Current active audio source based on selected language
  const activeAudioSrc = audioLang === 'hi' ? currentStage.audioSrcHi : currentStage.audioSrcEn;

  // Sync HTML5 audio with active stage and language
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    audio.src = activeAudioSrc;
    audio.muted = isMuted;

    if (!isMuted && isPlaying && userHasInteracted && !hasEnded) {
      audio
        .play()
        .then(() => {
          setAudioError(false);
        })
        .catch(() => {
          // If the specific audio file hasn't finished generating yet, use fallback synthesis
          setAudioError(true);
        });
    } else {
      audio.pause();
    }
  }, [currentStageIdx, isMuted, isPlaying, userHasInteracted, hasEnded, activeAudioSrc]);

  // Audio player time updates & end-of-track handler
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        setProgressPercent(Math.min(100, Math.max(0, pct)));
      }
    };

    const handleEnded = () => {
      if (isPlaying) {
        handleNextStage();
      }
    };

    const handleError = () => {
      setAudioError(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying, handleNextStage]);

  // Speech synthesis fallback for audio streams (e.g. Hindi stages or browser audio block)
  useEffect(() => {
    if (!audioError || isMuted || !isPlaying || !userHasInteracted || hasEnded) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = audioLang === 'hi' ? currentStage.narrationTextHi : currentStage.narrationTextEn;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = audioLang === 'hi' ? 'hi-IN' : 'en-GB';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(
        (v) =>
          (audioLang === 'hi' && (v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Swara'))) ||
          (audioLang === 'en' && (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.includes('Natural') || v.name.includes('Female')))
      );
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (isPlaying && !hasEnded) {
          handleNextStage();
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioError, audioLang, currentStage, isMuted, isPlaying, userHasInteracted, hasEnded, handleNextStage]);

  // Fallback timer when muted, in error, or waiting for customer action
  useEffect(() => {
    if (!isPlaying || hasEnded) {
      if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
      return;
    }

    if (isMuted || audioError) {
      const stageDurationMs = currentStage.durationSeconds * 1000;
      const intervalMs = 100;
      const increment = (intervalMs / stageDurationMs) * 100;

      fallbackIntervalRef.current = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            handleNextStage();
            return 0;
          }
          return prev + increment;
        });
      }, intervalMs);

      return () => {
        if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);
      };
    }
  }, [isPlaying, isMuted, audioError, hasEnded, currentStage, handleNextStage]);

  // Speaker toggle: Mute / Unmute (or Play if stopped/ended)
  const handleSpeakerClick = () => {
    setUserHasInteracted(true);

    if (hasEnded) {
      restartSequence();
      return;
    }

    if (!isPlaying) {
      setIsPlaying(true);
      setIsMuted(false);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = false;
        audioPlayerRef.current.play().catch(() => {});
      }
      return;
    }

    // Toggle mute
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.muted = nextMuted;
        if (!nextMuted) {
          audioPlayerRef.current.play().catch(() => {});
        }
      }
      return nextMuted;
    });
  };

  // Toggle Hindi / English language
  const toggleLanguage = () => {
    setUserHasInteracted(true);
    setAudioError(false);
    setAudioLang((prev) => (prev === 'en' ? 'hi' : 'en'));
    setProgressPercent(0);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
    }
  };

  return (
    <section
      className="hero-section relative w-full overflow-hidden select-none bg-[#090f17] text-[#f8f1e4]"
      data-testid="hero-section"
      aria-label="Navidha Pearls & Jewelry Hero"
    >
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioPlayerRef}
        preload="auto"
        playsInline
        aria-hidden="true"
        className="hidden"
      />

      {/* 1. VISUAL LAYER: Sequential Ken-Burns Crossfading Craft Images */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {CRAFT_STAGES.map((stage, idx) => {
          const isActive = idx === currentStageIdx;
          return (
            <div
              key={stage.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={stage.image}
                alt={`${stage.stageNumber} ${stage.title} — Navidha Gulabi Meenakari`}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[18000ms] ease-linear ${
                  isActive && isPlaying ? 'scale-110 translate-y-[-1.5%]' : 'scale-100'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Elegant Luxury Scrim & Gradient Overlays for maximum text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14202e]/92 via-[#14202e]/72 to-[#14202e]/35" />
        <div className="absolute inset-0 bg-[#14202e]/15 mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#14202e] to-transparent" />
      </div>

      {/* 2. MAIN ORIGINAL HERO COPY (Left Side - Kept Exactly as Original) */}
      <div className="hero-copy relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-16 sm:py-20 lg:py-24 relative min-h-[560px] sm:min-h-[620px] flex flex-col justify-center">
          <p className="eyebrow text-[#c8a45d]" data-testid="hero-eyebrow">
            Navidha Pearls &amp; Jewelry · Est. India
          </p>

          <div className="mt-4 max-w-[760px]">
            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-[4rem] leading-[1.02] tracking-[-0.035em] text-[#f8f1e4]"
              data-testid="hero-title"
            >
              Jewelry,<br className="hidden sm:inline" />
              <em className="text-[#c8a45d] not-italic font-serif"> reimagined.</em>
            </h1>

            <p
              className="mt-4 text-sm sm:text-base leading-relaxed text-[#c6cfd8] max-w-[560px]"
              data-testid="hero-description"
            >
              Where India's timeless craftsmanship meets contemporary form. A considered edit of silver, pearls, gold and the hands that make them.
            </p>

            {/* Original CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="inline-flex h-11 items-center justify-center gap-2.5 bg-[#c8a45d] px-7 text-[10px] uppercase tracking-[0.2em] text-[#14202e] font-bold transition-all hover:bg-[#d8b56f] cursor-pointer shadow-md"
                data-testid="hero-explore-button"
              >
                Explore The Collection
              </button>

              <button
                type="button"
                onClick={onExploreHeritage}
                className="inline-flex h-11 items-center justify-center gap-2.5 border border-white/30 bg-white/5 backdrop-blur-xs px-6 text-[10px] uppercase tracking-[0.2em] text-[#f8f1e4] font-semibold transition-all hover:border-[#c8a45d] hover:text-[#c8a45d] cursor-pointer"
                data-testid="hero-craft-button"
              >
                Our Heritage Craft
              </button>
            </div>
          </div>

          {/* 3. TRANSPARENT FLASHING BADGE AT THE RIGHT MIDDLE OF HERO SECTION */}
          <div
            className="hidden md:flex flex-col items-end absolute right-5 sm:right-8 lg:right-14 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none"
            aria-live="polite"
          >
            <div className="backdrop-blur-md bg-black/25 border border-white/15 px-4 py-3 rounded-lg text-right max-w-[280px] shadow-2xl transition-all duration-700 animate-pulse">
              {/* Flashing craft indicator dot */}
              <div className="flex items-center justify-end gap-1.5 text-[9px] uppercase tracking-[0.22em] text-[#e89cae] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#e89cae] animate-ping" />
                <span>
                  {audioLang === 'hi'
                    ? `चरण ${currentStage.stageNumberHindi} / ०७`
                    : `STAGE ${currentStage.stageNumber} / 07`}
                </span>
              </div>

              {/* Hindi & English craft term */}
              <p className="font-serif text-sm sm:text-base text-[#f8f1e4] mt-1 tracking-wide font-normal">
                {audioLang === 'hi' ? currentStage.hindiTitle : currentStage.craftTerm}
              </p>

              {/* Stage Description */}
              <p className="text-[10px] text-[#c6cfd8]/85 font-sans tracking-wider uppercase mt-0.5">
                {audioLang === 'hi' ? currentStage.titleHindi : currentStage.title}
              </p>

              <p className="text-[8.5px] text-[#c8a45d]/80 uppercase tracking-[0.16em] mt-1.5 pt-1.5 border-t border-white/10">
                Varanasi Gulabi Meenakari
              </p>
            </div>
          </div>

          {/* 4. CLEAN CONTROLS (Bottom Right): Speaker Icon & Hindi Version Button */}
          <div className="absolute right-5 sm:right-8 lg:right-14 bottom-6 sm:bottom-10 z-20 flex items-center gap-2.5">
            {/* Small Hindi / English audio version toggle button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-[10px] font-sans tracking-[0.14em] uppercase font-semibold border border-white/20 bg-black/30 hover:bg-black/50 text-[#f8f1e4] hover:text-[#c8a45d] rounded transition-all cursor-pointer backdrop-blur-xs flex items-center gap-1 shadow-sm"
              title={audioLang === 'en' ? 'Switch to Hindi Audio (हिंदी)' : 'Switch to English Audio'}
              aria-label={audioLang === 'en' ? 'Switch to Hindi audio' : 'Switch to English audio'}
              data-testid="hero-audio-lang-toggle"
            >
              <span className={audioLang === 'en' ? 'text-[#c8a45d] font-bold' : 'text-white/60'}>EN</span>
              <span className="text-white/30">|</span>
              <span className={audioLang === 'hi' ? 'text-[#e89cae] font-bold' : 'text-white/60'}>हिन्दी</span>
            </button>

            {/* Speaker Icon with Mute / Unmute (and Play if ended/stopped) */}
            <button
              type="button"
              onClick={handleSpeakerClick}
              className="flex items-center justify-center p-2 text-[#f8f1e4] hover:text-[#c8a45d] transition-colors cursor-pointer bg-black/20 hover:bg-black/40 border border-white/10 rounded-full shadow-md outline-none"
              data-testid="hero-audio-button"
              title={
                hasEnded
                  ? 'Replay Narration'
                  : !isPlaying
                  ? 'Play Narration'
                  : isMuted
                  ? 'Unmute Audio Narration'
                  : 'Mute Audio Narration'
              }
              aria-label={
                hasEnded
                  ? 'Replay narration'
                  : !isPlaying
                  ? 'Play narration'
                  : isMuted
                  ? 'Unmute audio narration'
                  : 'Mute audio narration'
              }
            >
              {hasEnded ? (
                <RotateCcw size={20} className="text-[#c8a45d] drop-shadow-md hover:scale-110 transition-transform" />
              ) : !isPlaying ? (
                <Play size={20} className="text-[#c8a45d] drop-shadow-md hover:scale-110 transition-transform ml-0.5" />
              ) : !isMuted ? (
                <Volume2 size={22} className="text-[#c8a45d] drop-shadow-md transition-transform hover:scale-110" />
              ) : (
                <VolumeX size={22} className="text-[#f8f1e4]/80 hover:text-[#f8f1e4] drop-shadow-md transition-transform hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. SUBTLE HAIRLINE PROGRESS INDICATOR AT BOTTOM EDGE */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10 z-20 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#e89cae] via-[#c8a45d] to-[#f8f1e4] transition-all duration-100 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
};
