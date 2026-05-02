import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, BookMarked, Globe, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const LANGUAGES = [
  { id: 'en', name: 'English', label: 'Standard' },
  { id: 'ur', name: 'اردو', label: 'اردو' },
  { id: 'zh', name: '中文', label: '中文' },
  { id: 'de', name: 'Deutsch', label: 'Deutsch' },
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [slide, setSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    if (slide < 2) {
      const timer = setTimeout(() => setSlide(s => s + 1), 4000);
      return () => clearTimeout(timer);
    }
  }, [slide]);

  const handleComplete = () => {
    const lang = LANGUAGES.find(l => l.id === selectedLang);
    if (lang) {
      localStorage.setItem('userLanguage', lang.name);
    } else {
      localStorage.setItem('userLanguage', 'English');
    }
    onComplete();
  };

  const colors = ['bg-[#000000]', 'bg-[#0A0A0A]', 'bg-[#111111]'];

  return (
    <div className="min-h-screen z-[100] bg-bg-primary flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,107,168,0.03)_0%,transparent_70%)]" />

      <AnimatePresence mode="wait">
        {slide === 0 && (
          <motion.div
            key="slide0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-16 relative z-10"
          >
            <div className="relative w-80 h-80">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <motion.path
                  d="M50 5 L61 35 L96 35 L68 55 L78 85 L50 66 L22 85 L32 55 L4 35 L39 35 Z"
                  fill="none"
                  stroke="#C8973A"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="#2E6BA8"
                  strokeWidth="0.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 3, delay: 1 }}
                />
              </svg>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="text-center space-y-4"
            >
              <h1 className="text-7xl font-bold antique-text text-blue-dark leading-none tracking-tighter">Tareekh</h1>
              <p className="text-[12px] uppercase font-black tracking-[1em] text-accent-gold ml-4">ky Jhonky</p>
            </motion.div>
          </motion.div>
        )}

        {slide === 1 && (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center gap-24 px-10 relative z-10"
          >
            <div className="relative flex items-center justify-center gap-14">
              <div className="absolute w-full h-[2px] bg-blue-light" />
              {[Sparkles, Camera, BookMarked].map((Icon, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: i * 0.4, type: "spring" }}
                  className="relative z-10 w-24 h-24 rounded-[2rem] bg-white border-2 border-blue-light santorini-shadow flex items-center justify-center text-blue-primary"
                >
                  <Icon size={36} strokeWidth={1.5} />
                </motion.div>
              ))}
            </div>
            <div className="text-center max-w-sm space-y-8">
              <h2 className="text-5xl font-bold antique-text text-blue-dark tracking-tighter leading-tight">See the Past</h2>
              <p className="text-[13px] font-medium text-text-secondary leading-loose tracking-wide font-sans">
                Experience history with AI. Listen to stories and old voices from the past.
              </p>
            </div>
          </motion.div>
        )}

        {slide === 2 && (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-screen pt-20 pb-12 px-8 w-full max-w-lg relative z-10"
          >
            <div className="text-center mb-16 space-y-4">
               <div className="w-20 h-20 bg-blue-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="text-blue-primary" size={40} strokeWidth={1.5} />
               </div>
               <h2 className="text-5xl font-bold antique-text text-blue-dark tracking-tighter leading-none">Select Language</h2>
               <p className="text-[11px] uppercase font-black text-text-muted tracking-widest">Select your voice</p>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLang(l.id)}
                  className={`flex items-center justify-between p-8 transition-all duration-500 border-2 rounded-[2.5rem] group active:scale-95 santorini-shadow bg-white
                    ${selectedLang === l.id ? 'border-blue-primary text-blue-primary' : 'border-border-warm text-text-muted grayscale opacity-60'}
                  `}
                >
                  <div className="text-left space-y-1">
                    <p className="text-2xl font-bold antique-text leading-none">{l.name}</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">{l.label}</p>
                  </div>
                  {selectedLang === l.id && (
                    <div className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center shadow-lg shadow-blue-primary/40">
                      <Check size={18} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              className="mt-20 w-full py-7 bg-blue-primary text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-[2.5rem] transition-all hover:bg-blue-dark active:scale-95 shadow-2xl shadow-blue-primary/30"
            >
              Start Exploring
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 flex gap-4">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-700 ${slide === i ? 'bg-blue-primary w-12' : 'bg-blue-light w-4'}`} 
          />
        ))}
      </div>
    </div>
  );
};
