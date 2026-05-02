import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Save, Loader2, Volume2, Globe, Sparkles, X, Music, Search, ImageIcon, Share2, AlertCircle } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { speakStory, stopSpeech } from '../lib/voice';
import { translateStory } from '../lib/gemini';
import { useAuth } from '../components/AuthContext';
import { saveDiscovery, saveStamp } from '../lib/firebase';

import { MusicExperience } from '../components/MusicExperience';

export const Result = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('userLanguage') as Language) || 'English');
  const [displayStory, setDisplayStory] = useState<string>('');
  const [phoneticStory, setPhoneticStory] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showFolkLegend, setShowFolkLegend] = useState(false);

  useEffect(() => {
    if (!result) return;
    
    // Stop playback if playing when language changes
    stopSpeech();
    setIsPlaying(false);
    setTranslationError(null);
    
    if (language === 'English') {
      setDisplayStory(result.story);
      setPhoneticStory('');
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    // Clear display story while translating to avoid stale English speech
    setDisplayStory(''); 
    setPhoneticStory('');
    translateStory(result.story, language)
      .then(translated => {
        if (translated) {
          if (language === 'Urdu' && translated.includes('[PHONETIC]')) {
            const parts = translated.split('[PHONETIC]');
            setDisplayStory(parts[0].trim());
            setPhoneticStory(parts[1].trim());
          } else {
            setDisplayStory(translated);
          }
        }
        else setDisplayStory(result.story);
      })
      .catch((err) => {
        console.error('Translation error:', err);
        setTranslationError(err.message || 'Translation failed');
        setDisplayStory(result.story);
      })
      .finally(() => setIsTranslating(false));
  }, [language, result]);

  useEffect(() => {
    const lastResultString = sessionStorage.getItem('lastResult');
    if (!lastResultString) {
      navigate('/scan');
      return;
    }
    const lastResult = JSON.parse(lastResultString);
    setResult(lastResult);

    // If initial story already has phonetic block (e.g. scanned directly in Urdu)
    if (lastResult.story.includes('[PHONETIC]')) {
      const parts = lastResult.story.split('[PHONETIC]');
      setDisplayStory(parts[0].trim());
      setPhoneticStory(parts[1].trim());
    } else {
      setDisplayStory(lastResult.story);
    }
    
    // Check locally
    const saved = localStorage.getItem('savedDiscoveries');
    const savedItems = saved ? JSON.parse(saved) : [];
    setIsSaved(!!savedItems.find((i: any) => i.id === lastResult.id));

    return () => stopSpeech();
  }, [navigate]);

  const handleListen = () => {
    if (!result || isTranslating) return;
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const textToSpeak = phoneticStory || displayStory || result.story;
      if (!textToSpeak) return;

      setIsPlaying(true);
      const langMap: Record<Language, string> = {
        'English': 'en',
        'Urdu': 'ur',
        'Chinese': 'zh',
        'German': 'de'
      };

      // For Urdu, if we are using phoneticStory, we might need to tell the voice engine 
      // it's actually Roman Urdu (which sounds like Hindi) if no Urdu voice exists.
      speakStory(textToSpeak, langMap[language] || 'en', () => setIsPlaying(false));
    }
  };

  const saveToArchive = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      if (user) {
        await saveDiscovery(user.uid, result);
        await saveStamp(user.uid, {
          id: result.id,
          siteName: result.cultural_region,
          elementName: result.specific_name,
          era: result.era,
          dateEarned: new Date().toLocaleDateString(),
          thumbnail: result.image || ''
        });
      }
      const saved = localStorage.getItem('savedDiscoveries');
      let savedItems = saved ? JSON.parse(saved) : [];
      let stamps = localStorage.getItem('heritageStamps') ? JSON.parse(localStorage.getItem('heritageStamps')!) : [];
      if (!isSaved) {
        savedItems = [result, ...savedItems];
        stamps = [{ id: result.id, siteName: result.cultural_region, elementName: result.specific_name, era: result.era, dateEarned: new Date().toLocaleDateString(), thumbnail: result.image }, ...stamps];
        localStorage.setItem('savedDiscoveries', JSON.stringify(savedItems));
        localStorage.setItem('heritageStamps', JSON.stringify(stamps));
        setIsSaved(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  return (
    <div className="min-h-screen bg-bg-primary overflow-y-auto no-scrollbar pb-48">
      {/* Hero Section */}
      <div className="relative h-[48vh] w-full overflow-hidden rounded-b-[3.5rem] santorini-shadow">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={result.image} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/60 via-transparent to-transparent" />
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
             if (navigator.share) {
               navigator.share({ title: result.specific_name, text: result.story, url: window.location.href }).catch(() => {});
             }
          }}
          className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-all"
        >
           <Share2 size={24} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Content Card */}
      <motion.div 
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="px-6 -mt-12 relative z-10"
      >
        <div className="bg-white santorini-card p-8 md:p-12 space-y-12 min-h-[60vh]">
           <header className="space-y-6">
              <div className="flex flex-wrap gap-3">
                 <span className="px-5 py-1.5 rounded-full bg-blue-light text-[10px] font-black uppercase tracking-[0.2em] text-blue-primary">
                    {result.element_type}
                 </span>
                 <span className="px-5 py-1.5 rounded-full bg-bg-secondary text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    {result.era}
                 </span>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold antique-text text-text-primary leading-none tracking-tight">
                  {result.specific_name}
                </h1>
                <p className="text-xl antique-text italic text-accent-gold urdu-text leading-none">تاریخ کے جھونکے</p>
              </div>
           </header>

           <section className="space-y-8">
              <p className="text-lg leading-relaxed text-text-secondary font-medium selection:bg-blue-light selection:text-blue-dark">
                 {isTranslating ? "Translating..." : (displayStory || result.story)}
              </p>

              {translationError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-xs text-red-700 font-medium">{translationError}</p>
                </div>
              )}

              {result.folk_legend && (
                 <div className="border-t border-border-warm pt-8">
                    <button 
                      onClick={() => setShowFolkLegend(!showFolkLegend)}
                      className={`flex items-center justify-between w-full p-6 rounded-[1.5rem] transition-all
                        ${showFolkLegend ? 'bg-blue-light/40' : 'bg-bg-secondary/30 hover:bg-bg-secondary/50'}
                      `}
                    >
                       <div className="flex items-center gap-4">
                          <Sparkles size={18} className="text-accent-gold" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-primary">Folk Legend</span>
                       </div>
                       <motion.div animate={{ rotate: showFolkLegend ? 180 : 0 }}>
                          <X className="rotate-45 text-blue-primary/40" size={18} />
                       </motion.div>
                    </button>
                    <AnimatePresence>
                       {showFolkLegend && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <div className="bg-blue-light/20 p-8 rounded-b-[1.5rem] border-x border-b border-blue-light/10">
                                <p className="text-xl urdu-text text-blue-dark italic leading-relaxed">
                                  "{result.folk_legend}"
                                </p>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              )}
           </section>

           {/* Instrument Reconstruction */}
           {(result as any).instrument_data && (
             <MusicExperience data={(result as any).instrument_data} />
           )}
        </div>
      </motion.div>

      {/* Floating Actions */}
      <div className="fixed bottom-24 left-6 right-6 flex gap-4 max-w-md mx-auto z-[110]">
         <button 
           onClick={saveToArchive}
           className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all border-2
             ${isSaved ? 'bg-accent-gold border-accent-gold text-white shadow-lg shadow-accent-gold/30' : 'bg-white border-blue-primary/10 text-blue-primary hover:border-blue-primary shadow-xl'}
           `}
         >
            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} fill={isSaved ? "white" : "none"} strokeWidth={1.5} />}
         </button>
         
         <div className="flex-1 flex gap-3">
            <button 
              onClick={handleListen}
              disabled={isTranslating}
              className={`flex-1 h-16 flex items-center justify-center gap-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] active:scale-95 transition-all santorini-shadow
                ${isPlaying ? 'bg-blue-primary text-white' : 'bg-white text-blue-primary border-2 border-blue-primary/5'}
                ${isTranslating ? 'opacity-50' : ''}
              `}
            >
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-white text-blue-primary' : 'bg-blue-primary text-white'}`}>
                  {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />}
               </div>
               {isTranslating ? "Readying..." : (isPlaying ? "Stop" : "Listen")}
            </button>
            <button 
              onClick={() => setShowLanguageSheet(true)}
              className="w-16 h-16 rounded-3xl bg-blue-dark text-white shadow-xl shadow-blue-dark/20 flex items-center justify-center active:scale-95 transition-all"
            >
               <Globe size={24} strokeWidth={1.5} />
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showLanguageSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLanguageSheet(false)} className="fixed inset-0 z-[150] bg-blue-dark/40 backdrop-blur-md" />
            <motion.div 
               initial={{ y: '100%' }} 
               animate={{ y: 0 }} 
               exit={{ y: '100%' }} 
               className="fixed bottom-0 left-0 right-0 z-[160] bg-white rounded-t-[3rem] p-10 pb-16 santorini-shadow border-t border-border-warm"
            >
               <div className="w-12 h-1 bg-border-warm rounded-full mx-auto mb-10" />
               <div className="space-y-3">
                  {(['English', 'Urdu', 'Chinese', 'German'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); localStorage.setItem('userLanguage', lang); setShowLanguageSheet(false); }}
                      className={`w-full p-6 flex justify-between items-center rounded-2xl transition-all
                        ${language === lang ? 'bg-blue-light text-blue-primary' : 'hover:bg-bg-secondary text-text-muted'}
                      `}
                    >
                      <span className="text-2xl font-bold antique-text">
                        {lang === 'Urdu' ? 'اردو' : lang === 'Chinese' ? '中文' : lang}
                      </span>
                      {language === lang && <div className="w-2.5 h-2.5 rounded-full bg-blue-primary" />}
                    </button>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
