import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Music2, Waves, Play, Pause, Info } from 'lucide-react';
import { InstrumentResult } from '../types';

interface MusicExperienceProps {
  data: InstrumentResult;
}

export const MusicExperience: React.FC<MusicExperienceProps> = ({ data }) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isPlayingScale, setIsPlayingScale] = useState(false);
  const synthRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  useEffect(() => {
    const initSynth = () => {
      try {
        let synth;
        switch (data.sound_type) {
          case 'string':
            // Rich string sound using FM
            synth = new Tone.PolySynth(Tone.Synth, {
              oscillator: { type: 'sine' },
              envelope: {
                attack: 0.02,
                decay: 0.2,
                sustain: 0.2,
                release: 1.5
              }
            }).toDestination();
            break;
          case 'percussion':
            synth = new Tone.PolySynth(Tone.MembraneSynth, {
              pitchDecay: 0.05,
              octaves: 10,
              oscillator: { type: 'sine' }
            }).toDestination();
            break;
          case 'wind':
            synth = new Tone.PolySynth(Tone.Synth, {
              oscillator: { type: 'triangle' },
              envelope: {
                attack: 0.2,
                decay: 0.3,
                sustain: 0.8,
                release: 1.2
              }
            }).toDestination();
            break;
          default:
            synth = new Tone.PolySynth(Tone.Synth).toDestination();
        }
        
        synthRef.current = synth;
        setIsReady(true);
      } catch (e) {
        console.error("Tone.js synth creation error:", e);
      }
    };

    initSynth();

    return () => {
      stopSequence();
      synthRef.current?.dispose();
    };
  }, [data.sound_type]);

  const startAudio = async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
      console.log("[Audio] Context started");
    }
  };

  const playNote = async (note: string) => {
    if (!synthRef.current) return;
    await startAudio();

    const duration = data.sound_type === 'percussion' ? '8n' : '2n';
    synthRef.current.triggerAttackRelease(note, duration);
    setActiveNote(note);
    setTimeout(() => setActiveNote(null), 300);
  };

  const playSequence = async () => {
    if (!synthRef.current || isPlayingScale) return;
    await startAudio();

    setIsPlayingScale(true);
    const notes = data.notes_suggested || [];
    let step = 0;

    const interval = setInterval(() => {
      if (step >= notes.length) {
        clearInterval(interval);
        setIsPlayingScale(false);
        return;
      }
      playNote(notes[step]);
      step++;
    }, 600);

    // Save interval to clear on unmount
    (window as any)._instInterval = interval;
  };

  const stopSequence = () => {
    if ((window as any)._instInterval) {
      clearInterval((window as any)._instInterval);
    }
    setIsPlayingScale(false);
  };

  return (
    <div className="space-y-8 bg-white/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/60 santorini-shadow overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-primary/5 rounded-full blur-[100px]" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-3xl bg-blue-primary text-white flex items-center justify-center shadow-2xl shadow-blue-primary/30">
            {data.sound_type === 'string' ? <Music2 size={28} /> : data.sound_type === 'wind' ? <Waves size={28} /> : <Music size={28} />}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-primary mb-1">Acoustic Reconstruction</h3>
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 rounded-full bg-blue-primary/10 text-blue-primary text-[9px] font-black uppercase tracking-widest leading-none">
                 {data.sound_type}
               </span>
               <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{data.instrument_name}</span>
            </div>
          </div>
        </div>

        <button
          onClick={isPlayingScale ? stopSequence : playSequence}
          disabled={!isReady}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
            ${isPlayingScale 
              ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/40' 
              : 'bg-white text-blue-primary border border-blue-primary/10 hover:border-blue-primary/30 santorini-shadow'
            }
          `}
        >
          {isPlayingScale ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          {isPlayingScale ? 'Stop Melody' : 'Listen to Echoes'}
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 py-4 relative z-10">
        {(data.notes_suggested || []).map((note, index) => (
          <motion.button
            key={`${note}-${index}`}
            whileTap={{ scale: 0.9, y: 8 }}
            onClick={() => playNote(note)}
            className={`relative aspect-[3/8] rounded-full border-2 transition-all flex flex-col items-center justify-end pb-6
              ${activeNote === note 
                ? 'bg-blue-primary border-blue-primary shadow-2xl shadow-blue-primary/40 -translate-y-4' 
                : 'bg-white/80 border-blue-primary/5 hover:border-blue-primary/20 backdrop-blur-sm'
              }
            `}
          >
            {/* The "String" visual */}
            <div className={`absolute top-4 bottom-16 w-0.5 rounded-full left-1/2 -translate-x-1/2 transition-colors
              ${activeNote === note ? 'bg-white/60 scale-x-150 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-blue-primary/10'}
            `} />
            
            <span className={`text-[10px] font-black tracking-tighter ${activeNote === note ? 'text-white' : 'text-blue-primary/40'}`}>
              {note}
            </span>

            {activeNote === note && (
              <motion.div 
                layoutId="pulse"
                className="absolute inset-0 bg-blue-primary/20 rounded-full animate-ping pointer-events-none" 
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="p-6 rounded-[2rem] bg-white/60 border border-white/80 space-y-3 santorini-shadow">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-blue-primary/10 flex items-center justify-center">
                <Music2 size={12} className="text-blue-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Sound Profile</span>
           </div>
           <p className="text-xs font-medium text-text-secondary leading-relaxed italic">
              "{data.sound_description}"
           </p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 border border-white/80 space-y-3 santorini-shadow">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-accent-gold/10 flex items-center justify-center">
                <Info size={12} className="text-accent-gold" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Playing Era</span>
           </div>
           <p className="text-xs font-bold text-text-primary tracking-wide">
              {data.era} • {data.culture}
           </p>
           <p className="text-[10px] text-text-muted leading-tight uppercase tracking-tight">
             Traditional technique: {data.playing_technique}
           </p>
        </div>
      </div>

      <div className="flex justify-center pt-4 opacity-30 select-none pointer-events-none">
        <p className="text-[8px] uppercase tracking-[0.6em] font-black text-blue-primary">
          Archeo-Acoustic Reconstruction Engine v1.0
        </p>
      </div>
    </div>
  );
};
