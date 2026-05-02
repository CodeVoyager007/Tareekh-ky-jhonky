import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Loader2, X, Image as ImageIcon, Languages, Sparkles, Music, Volume2 } from 'lucide-react';
import { analyzeHeritageImage, translateInscription, analyzeInstrument, translateStory } from '../lib/gemini';
import { Language, InscriptionResult } from '../types';
import { SpeechButton } from '../components/SpeechButton';

export const Scanner = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'heritage' | 'inscription' | 'instrument'>('heritage');
  const [inscriptionResult, setInscriptionResult] = useState<InscriptionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showLiveCamera, setShowLiveCamera] = useState(false);

  const language = (localStorage.getItem('userLanguage') as Language) || 'English';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      analyze(base64);
    };
    reader.readAsDataURL(file);
  };

  const startLiveCamera = async () => {
    try {
      setShowLiveCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Archive access denied. Please verify camera permissions.");
      setShowLiveCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg');
      
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      
      setShowLiveCamera(false);
      setImage(base64);
      analyze(base64);
    }
  };

  const analyze = async (base64: string) => {
    setScanning(true);
    setError(null);
    setInscriptionResult(null);
    try {
      if (mode === 'heritage') {
        const result = await analyzeHeritageImage(base64, language);
        sessionStorage.setItem('lastResult', JSON.stringify({
          ...result,
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString(),
          image: base64
        }));
        setTimeout(() => navigate('/result'), 1200);
      } else if (mode === 'instrument') {
        const result = await analyzeInstrument(base64);
        let story = `${result.instrument_name}, also known as ${result.local_name}, is a significant artifact of ${result.culture} heritage dating back to the ${result.era}. ${result.historical_significance}`;
        
        if (language !== 'English') {
          try {
            story = await translateStory(story, language);
          } catch (tErr) {
            console.warn("Instrument story translation failed, sticking to English");
          }
        }

        sessionStorage.setItem('lastResult', JSON.stringify({
          element_type: 'Ancient Instrument',
          era: result.era,
          cultural_region: result.culture,
          specific_name: result.instrument_name,
          confidence: 'high',
          confidence_reason: "Archeo-acoustic signatures detected.",
          story: story,
          folk_legend: `Legend states that its sound could ${result.sound_description.toLowerCase()}.`,
          sources_hint: "Heritage Musicology Archives",
          instrument_data: result,
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString(),
          image: base64
        }));
        setTimeout(() => navigate('/result'), 1200);
      } else {
        const result = await translateInscription(base64);
        setInscriptionResult(result);
        setScanning(false);
      }
    } catch (err: any) {
      console.error("Scanner Error:", err);
      setError(err.message || "The archive could not be reached. (Analysis failed)");
      setScanning(false);
      setImage(null);
    }
  };

  return (
    <div className="pt-8 relative z-10 pb-40 lg:pb-20">
      <div className="text-center mb-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-1"
        >
          <h1 className="text-2xl antique-text text-blue-dark font-bold tracking-tight">Scanner</h1>
          <span className="text-[10px] font-black tracking-[0.5em] text-accent-gold uppercase ml-2">Digital Archive</span>
        </motion.div>
      </div>

      <div className="flex justify-center mb-14 px-6 relative z-50">
         <div className="bg-white/80 backdrop-blur-xl santorini-shadow rounded-3xl p-1.5 flex gap-1 border border-white">
            {[
              { id: 'heritage', label: 'Heritage', icon: Sparkles },
              { id: 'inscription', label: 'Scripts', icon: Languages },
              { id: 'instrument', label: 'Instruments', icon: Music },
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2
                  ${mode === m.id ? 'bg-blue-primary text-white shadow-lg shadow-blue-primary/20 scale-105' : 'text-text-muted hover:bg-blue-light hover:text-blue-primary'}
                `}
              >
                <m.icon size={14} strokeWidth={2.5} />
                {m.label}
              </button>
            ))}
         </div>
      </div>

      <AnimatePresence>
        {!image && !scanning && !showLiveCamera && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="flex flex-col items-center px-6"
          >
            <div className="relative w-full flex-1 flex flex-col items-center justify-center">
              <motion.div 
                whileHover={{ y: -5 }}
                onClick={startLiveCamera}
                className="relative w-full aspect-[1/1.4] max-w-sm cursor-pointer group"
              >
                {/* Architectural Scanner Frame */}
                <div className="absolute inset-0 rounded-[4rem] border-4 border-white bg-white/40 santorini-shadow overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,107,168,0.05)_0%,transparent_70%)]" />
                </div>
                
                {/* Pulsing Beacon */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-[15%] rounded-full bg-blue-primary/5 blur-3xl pointer-events-none"
                />

                {/* Decorative Sultanic Corners */}
                <div className="absolute inset-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-primary rounded-tl-3xl opacity-40 group-hover:opacity-100 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-primary rounded-tr-3xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-primary rounded-bl-3xl opacity-40 group-hover:opacity-100 group-hover:-translate-x-2 group-hover:translate-y-2 transition-all" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-primary rounded-br-3xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 group-hover:translate-y-2 transition-all" />
                </div>

                <div className="relative h-full flex flex-col items-center justify-center gap-12 px-12 text-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-primary/10 rounded-full blur-xl scale-75" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[3px] border-dashed border-blue-primary/30 rounded-full"
                    />
                    <Camera size={56} strokeWidth={1} className="text-blue-primary group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-5xl antique-text text-blue-dark leading-[0.9] font-bold tracking-tighter">
                      Find<br/><span className="text-blue-primary underline decoration-accent-gold/40 decoration-4 underline-offset-8">Heritage</span>
                    </h2>
                    <p className="text-[12px] uppercase tracking-[0.4em] font-black text-text-muted max-w-[240px] mx-auto leading-relaxed">
                      {mode === 'heritage' && 'Scan old buildings and sites'}
                      {mode === 'inscription' && 'Read ancient writing'}
                      {mode === 'instrument' && 'Scan old instruments'}
                    </p>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="px-8 py-4 rounded-full bg-blue-primary text-white text-[11px] font-black uppercase tracking-[0.3em] santorini-shadow group-hover:bg-blue-dark transition-colors flex items-center gap-3">
                      <Sparkles size={16} />
                      Begin Capture
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="mt-16 flex flex-col items-center gap-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-4 px-12 py-6 rounded-[2rem] bg-white border border-border-warm text-[12px] font-black uppercase tracking-[0.3em] text-blue-primary hover:border-blue-primary transition-all santorini-shadow active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-light flex items-center justify-center text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
                  <ImageIcon size={20} />
                </div>
                Browse Archives
              </button>
              <div className="w-12 h-px bg-accent-gold/20" />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {showLiveCamera && (
        <div className="fixed inset-0 z-[100] bg-blue-dark">
          {/* Edge Blur Border for theatrical feel */}
          <div className="absolute inset-0 pointer-events-none z-20 border-[2rem] border-blue-dark/20 backdrop-blur-[2px]" />
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />

          <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none z-30">
             {/* The Focal Point */}
             <div className="relative w-80 h-[100vw] sm:h-80 rounded-[4rem] border-2 border-white/50 shadow-[0_0_0_100vh_rgba(15,44,89,0.85)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] opacity-30" />
             </div>
             
             {/* Dynamic Scan Line */}
             <motion.div 
               animate={{ top: ['20%', '80%', '20%'] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute left-1/2 -translate-x-1/2 w-80 h-0.5 bg-white shadow-[0_0_30px_#FFF] z-40"
             />

             {/* Measurement Notches */}
             <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-10 opacity-40">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-0.5 bg-white" />
                ))}
             </div>
          </div>

          <div className="absolute inset-x-0 bottom-16 flex justify-between items-center px-12 z-[60]">
            <button 
              onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                setShowLiveCamera(false);
              }}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <X size={28} />
            </button>

            <button 
              onClick={capturePhoto}
              className="group relative w-28 h-28 flex items-center justify-center"
            >
               <div className="absolute inset-0 rounded-full border-[6px] border-white/20 group-active:scale-95 transition-all" />
               <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-primary flex items-center justify-center">
                    <Camera size={28} className="text-blue-primary" />
                  </div>
               </div>
            </button>

            <div className="w-16" />
          </div>

          <div className="absolute top-12 left-0 right-0 flex justify-center z-[60]">
            <div className="px-6 py-3 bg-blue-dark/40 backdrop-blur-md rounded-full border border-white/10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Center the {mode}</span>
            </div>
          </div>
        </div>
      )}

      {(image || scanning) && !showLiveCamera && (
        <motion.section 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[70vh] px-6"
        >
          {error && (
            <div className="mb-12 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-center max-w-sm">
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
              <button onClick={() => {setImage(null); setScanning(false); setError(null);}} className="mt-4 text-blue-primary font-black text-[10px] uppercase tracking-widest underline">Retry Access</button>
            </div>
          )}

          <div className="relative w-80 h-80 rounded-[3rem] overflow-hidden mb-12 border-4 border-white santorini-shadow group">
            {image && <img src={image} alt="Preview" className="w-full h-full object-cover transition-transform duration-[10s] scale-110 group-hover:scale-100" />}
            <div className="absolute inset-0 bg-blue-dark/20" />
            
            {scanning && (
              <div className="absolute inset-0 bg-blue-dark/40 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-6">
                   <motion.div 
                     animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="absolute inset-0 bg-white rounded-full blur-xl"
                   />
                   <Loader2 size={40} className="animate-spin text-white relative z-10" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Consulting the</p>
                  <p className="text-[14px] antique-text text-accent-gold font-bold">Historical Archive</p>
                </div>
              </div>
            )}
          </div>

          {inscriptionResult && (
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full bg-white santorini-shadow rounded-[3.5rem] p-12 border border-border-warm overflow-hidden relative"
             >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                   <Languages size={240} strokeWidth={1} className="text-blue-dark" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 mb-14 relative z-10">
                   <div className="text-center sm:text-left space-y-2">
                      <span className="text-[10px] uppercase font-black text-blue-primary tracking-[0.4em] opacity-50 bg-blue-light/50 px-3 py-1 rounded-full">Archive Result</span>
                      <h3 className="text-4xl font-bold antique-text text-text-primary leading-none tracking-tighter">{inscriptionResult.script_type}</h3>
                   </div>
                   
                   <div className="flex gap-4">
                      <SpeechButton 
                        text={`Deciphered text: ${inscriptionResult.translation}. Analysis: ${inscriptionResult.context}`} 
                        className="w-14 h-14 bg-blue-primary text-white shadow-lg shadow-blue-primary/30" 
                      />
                      <button 
                        onClick={() => { setImage(null); setInscriptionResult(null); }} 
                        className="w-14 h-14 rounded-3xl bg-bg-secondary flex items-center justify-center text-text-muted hover:bg-blue-light hover:text-blue-primary transition-all active:scale-95"
                      >
                         <X size={24} strokeWidth={2.5}/>
                      </button>
                   </div>
                </div>

                <div className="bg-bg-primary p-12 rounded-[3.5rem] mb-12 border-2 border-dashed border-border-warm relative">
                   <p className="text-5xl urdu-text text-blue-dark leading-[1.6] text-center drop-shadow-sm">
                      {inscriptionResult.original_text}
                   </p>
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-accent-gold text-white rounded-full text-[9px] font-black tracking-widest shadow-xl">
                      RAW SCRIPT
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-10">
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-blue-primary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-primary/60">Transliteration</p>
                         </div>
                         <p className="text-xl italic text-text-secondary leading-relaxed font-serif tracking-tight pr-6">{inscriptionResult.transliteration}</p>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-blue-primary opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-primary/60">Meaning</p>
                         </div>
                         <p className="text-3xl font-bold text-text-primary leading-[1.1] antique-text tracking-tighter">{inscriptionResult.translation}</p>
                      </div>
                   </div>
                   
                   <div className="p-10 rounded-[2.5rem] bg-blue-light/50 border border-white santorini-shadow flex flex-col gap-6">
                      <div className="flex items-center gap-3">
                         <Sparkles size={18} className="text-accent-gold" />
                         <p className="text-[11px] uppercase tracking-[0.4em] text-blue-dark font-black">History</p>
                      </div>
                      <p className="text-lg text-text-secondary leading-relaxed font-medium italic">
                         "{inscriptionResult.context}"
                      </p>
                   </div>
                </div>
             </motion.div>
          )}
        </motion.section>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
    </div>
  );
};
