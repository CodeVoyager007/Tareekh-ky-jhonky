import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakStory, stopSpeech } from '../lib/voice';
import { Language } from '../types';

interface SpeechButtonProps {
  text: string;
  className?: string;
  lang?: Language;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({ text, className = "", lang }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentLang = lang || (localStorage.getItem('userLanguage') as Language) || 'English';

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const toggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const langMap: Record<Language, string> = {
        'English': 'en',
        'Urdu': 'ur',
        'Chinese': 'zh',
        'German': 'de'
      };
      speakStory(text, langMap[currentLang] || 'en', () => setIsSpeaking(false));
    }
  };

  return (
    <button
      onClick={toggleSpeech}
      className={`p-3 rounded-full transition-all active:scale-90 flex items-center justify-center ${
        isSpeaking 
          ? 'bg-heritage-gold text-black shadow-[0_0_20px_rgba(255,245,0,0.4)]' 
          : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
      } ${className}`}
      title={isSpeaking ? "Stop Listening" : "Listen to Guide"}
    >
      {isSpeaking ? (
        <VolumeX size={18} />
      ) : (
        <Volume2 size={18} />
      )}
    </button>
  );
};
