let voices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;

const getSystemVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length > 0) {
    voices = v;
  }
  return v;
};

// Initialize voices as soon as possible
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = getSystemVoices;
  }
  getSystemVoices();
}

export const speakStory = (text: string, lang: string, onEnd: () => void) => {
  console.log(`[TTS] Attempting to speak ${text.length} characters in ${lang}...`);
  
  if (!window.speechSynthesis) {
    console.error("[TTS] Speech synthesis NOT supported in this browser.");
    onEnd();
    return null;
  }

  // Cancel any existing speech BEFORE starting new one
  console.log("[TTS] Cancelling existing speech...");
  window.speechSynthesis.cancel();

  // Fresh voices check
  if (voices.length === 0) {
    console.log("[TTS] No voices cached, fetching...");
    getSystemVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance; // Prevent GC
  
  // Explicit BCP 47 mapping
  const langMap: Record<string, string> = {
    'en': 'en-US',
    'ur': 'ur-PK',
    'zh': 'zh-CN',
    'de': 'de-DE'
  };
  
  const targetLangCode = langMap[lang.toLowerCase().split('-')[0]] || lang;
  utterance.lang = targetLangCode;
  utterance.rate = 0.88; // Slightly slower for more gravitas and less robotic pace
  utterance.pitch = 0.95; // Slightly deeper tone for a documentary feel
  utterance.volume = 1.0;

  console.log(`[TTS] Configured for ${targetLangCode}`);

  const availableVoices = window.speechSynthesis.getVoices();
  if (availableVoices.length > 0) {
    const lowerLang = targetLangCode.toLowerCase();
    const langPrefix = lowerLang.split('-')[0];
    
    // Preference: 
    // 1. Google Urdu (Highest quality)
    // 2. Google Hindi (Excellent phonetic match for Urdu)
    // 3. Any Google Voice (Usually more neural/natural)
    // 4. Any Urdu/Hindi voice
    const bestVoice = 
      availableVoices.find(v => v.lang.startsWith('ur') && v.name.includes('Google')) ||
      availableVoices.find(v => v.lang.startsWith('hi') && v.name.includes('Google')) ||
      availableVoices.find(v => v.lang.startsWith('ur')) ||
      availableVoices.find(v => v.lang.startsWith('hi')) ||
      availableVoices.find(v => v.name.includes('Google')) ||
      availableVoices.find(v => v.lang.startsWith(langPrefix));

    if (bestVoice) {
      console.log(`[TTS] Selected optimized voice: ${bestVoice.name} (${bestVoice.lang})`);
      utterance.voice = bestVoice;
      
      // If we are using a Hindi/English voice for Urdu text (likely Roman Urdu),
      // we should update the utterance.lang to match the voice to ensure readability.
      if (langPrefix === 'ur' && !bestVoice.lang.toLowerCase().startsWith('ur')) {
        console.log(`[TTS] Using non-Urdu voice for Urdu text. Updating utterance.lang to ${bestVoice.lang} for compatibility.`);
        utterance.lang = bestVoice.lang;
      }
    } else {
      console.warn(`[TTS] No voice match found for ${targetLangCode}. Browser default will try to speak.`);
    }
  } else {
    console.warn("[TTS] No voices available from window.speechSynthesis.getVoices().");
  }

  utterance.onstart = () => {
    console.log("[TTS] Speech STARTED.");
  };

  utterance.onend = () => {
    console.log("[TTS] Speech finished naturally.");
    currentUtterance = null;
    onEnd();
  };
  
  utterance.onerror = (e) => {
    console.error("[TTS] Speech Synthesis Error Details:", {
      error: e.error,
      utterance: {
        lang: utterance.lang,
        textLen: utterance.text.length,
        voice: utterance.voice?.name
      },
      event: e
    });
    currentUtterance = null;
    onEnd();
  };

  // Resume is a crucial hack for many browsers that stall
  try {
    window.speechSynthesis.resume();
  } catch (e) {
    console.warn("[TTS] Error resuming:", e);
  }

  console.log("[TTS] Executing speak()...");
  window.speechSynthesis.speak(utterance);

  // Fallback for browsers that ignore the first speak call
  if (window.speechSynthesis.paused) {
    console.log("[TTS] Browser paused, forcing resume...");
    window.speechSynthesis.resume();
  }

  return utterance;
};

export const toggleSpeech = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    return 'resumed';
  } else {
    window.speechSynthesis.pause();
    return 'paused';
  }
};

export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};
