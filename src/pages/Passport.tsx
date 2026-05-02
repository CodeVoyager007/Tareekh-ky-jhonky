import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Share2, Edit2, Check, Download, Sparkles, Lock } from 'lucide-react';
import { HeritageStamp } from '../types';
import { useAuth } from '../components/AuthContext';
import { getStamps } from '../lib/firebase';

export const Passport = () => {
  const { user, login } = useAuth();
  const [explorerName, setExplorerName] = useState(() => 
    localStorage.getItem('explorerName') || 'Curator'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [stamps, setStamps] = useState<HeritageStamp[]>([]);
  const passportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setExplorerName(user.displayName || 'Curator');
      const fetchFirebaseStamps = async () => {
        const firebaseStamps = await getStamps(user.uid);
        if (firebaseStamps && firebaseStamps.length > 0) {
          // Map Firestore data to HeritageStamp type
          const formatted = (firebaseStamps as any[]).map(s => ({
            ...s,
            dateEarned: s.dateEarned.toDate ? s.dateEarned.toDate().toLocaleDateString('en-GB') : s.dateEarned
          }));
          setStamps(formatted);
        }
      };
      fetchFirebaseStamps();
    } else {
      const savedStamps = localStorage.getItem('heritageStamps');
      if (savedStamps) {
        try {
          const parsed = JSON.parse(savedStamps);
          if (Array.isArray(parsed)) {
            setStamps(parsed);
          }
        } catch (e) {
          console.error("Failed to parse stamps", e);
        }
      }
    }
  }, [user]);

  const handleNameSave = () => {
    localStorage.setItem('explorerName', explorerName);
    setIsEditingName(false);
  };

  const totalSlots = 24;

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32">
      <header className="mb-16 space-y-4 px-6 md:px-0">
         <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">
            Passport
         </h2>
         <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Your Passport</p>
      </header>

      <section className="mb-20 space-y-12 px-6 md:px-0">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-[2px] w-16 bg-accent-gold" />
              <p className="text-[10px] font-black tracking-[0.5em] text-blue-primary uppercase">Explorer Profile</p>
           </div>
           <div className="flex items-end justify-between">
              <div className="space-y-3">
                <h3 className="text-6xl font-bold antique-text text-text-primary leading-none tracking-tighter">
                  {explorerName}
                </h3>
                <p className="text-[11px] font-mono font-bold tracking-widest text-text-muted uppercase">
                  ID NO: TK-{(stamps.length * 777).toString(16).toUpperCase().padStart(6, '0')}
                </p>
              </div>
              <button 
                onClick={() => !user && setIsEditingName(true)}
                className="w-14 h-14 rounded-2xl bg-white border border-border-warm flex items-center justify-center text-blue-primary hover:bg-blue-light transition-all santorini-shadow active:scale-95"
              >
                <Edit2 size={20} strokeWidth={1.5} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-0 py-12 bg-white santorini-card border border-border-warm">
           <div className="text-center space-y-3">
              <p className="text-4xl font-bold text-blue-primary leading-none tracking-tighter">
                {stamps.length}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Discoveries</p>
           </div>
           <div className="text-center space-y-3 border-x border-border-warm/50">
              <p className="text-4xl font-bold text-blue-dark leading-none tracking-tighter">
                {new Set(stamps.map(s => s.siteName)).size}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Archives</p>
           </div>
           <div className="text-center space-y-3">
              <p className="text-4xl font-bold text-accent-gold leading-none tracking-tighter">
                {stamps.length > 0 ? '7' : '0'}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Day Streak</p>
           </div>
        </div>
      </section>

      <section className="px-6 md:px-0">
         <div className="flex items-center gap-6 mb-12">
            <h4 className="text-2xl font-bold antique-text text-accent-gold leading-none">Your Collection</h4>
            <div className="h-[1px] flex-1 bg-border-warm" />
         </div>

         <div className="grid grid-cols-3 gap-8">
            {Array.from({ length: 12 }).map((_, i) => {
              const stamp = stamps[i];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-700
                    ${stamp ? 'bg-white border-2 border-blue-primary/40 santorini-shadow translate-y-0 shadow-blue-primary/5' : 'bg-bg-secondary border border-blue-primary/20 border-dashed'}
                  `}>
                    {stamp ? (
                      <div className="relative w-16 h-16 flex items-center justify-center">
                         {/* Islamic Star - Aegean Blue */}
                         <div className="absolute inset-0 bg-blue-primary rotate-45 scale-[0.9] rounded-sm" />
                         <div className="absolute inset-0 bg-blue-primary scale-[0.9] rounded-sm" />
                         <Sparkles size={24} className="text-white relative z-10" strokeWidth={2} />
                      </div>
                    ) : (
                      <Lock size={20} className="text-blue-primary/30" strokeWidth={1} />
                    )}
                  </div>
                  <div className="text-center w-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-primary h-4 transition-all truncate">
                      {stamp?.siteName || 'Locked'}
                    </p>
                    {stamp && <p className="text-[8px] font-mono font-bold text-accent-gold mt-1">EARNED</p>}
                  </div>
                </motion.div>
              );
            })}
         </div>
      </section>
    </div>
  );
};

