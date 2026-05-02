import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Linkedin, Sparkles, History, LogOut, Mail, User as UserIcon, ShieldCheck, Volume2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { SpeechButton } from '../components/SpeechButton';

export const About = () => {
  const { user, login, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-heritage-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-24 px-6 md:px-0">
      {/* User Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 p-12 bg-white rounded-[3.5rem] border border-border-warm santorini-shadow relative overflow-hidden"
      >
        <div className="absolute top-[-2rem] right-[-2rem] p-4 opacity-[0.03] rotate-12">
          <ShieldCheck size={240} strokeWidth={1} className="text-blue-dark" />
        </div>

        {user ? (
          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="relative">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                alt="Profile" 
                className="w-36 h-36 rounded-[2.5rem] border-4 border-white shadow-2xl object-cover santorini-shadow"
              />
              <div className="absolute -bottom-3 -right-3 bg-accent-gold text-white p-3 rounded-2xl shadow-xl shadow-accent-gold/30">
                <ShieldCheck size={24} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-5xl font-bold antique-text text-blue-dark tracking-tighter leading-none">{user.displayName}</h1>
              <p className="text-[11px] uppercase font-black text-accent-gold tracking-[0.4em]">{user.email}</p>
            </div>

            <button 
              onClick={() => signOut()}
              className="flex items-center gap-3 px-12 py-5 bg-blue-light/50 border border-blue-light text-blue-primary font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95"
            >
              <LogOut size={18} strokeWidth={2.5} /> Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-12 relative z-10">
            <div className="w-28 h-28 bg-blue-light border border-white flex items-center justify-center rounded-[2rem] santorini-shadow">
              <UserIcon size={56} strokeWidth={1.5} className="text-blue-primary" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-bold antique-text text-blue-dark tracking-tighter leading-none">Sign In</h2>
              <p className="text-[11px] uppercase font-black text-text-muted tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                Save your history and symbols across your devices.
              </p>
            </div>

            <button 
              onClick={() => login()}
              className="w-full max-w-sm py-6 bg-blue-primary text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2rem] transition-all hover:bg-blue-dark active:scale-95 shadow-xl shadow-blue-primary/40"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </motion.div>

      {/* About Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-left space-y-16"
      >
        <section className="space-y-8">
           <div className="flex items-center gap-6">
              <h3 className="text-3xl font-bold antique-text text-text-primary">The Vision</h3>
              <div className="flex-1 h-[2px] bg-border-warm" />
              <SpeechButton text="The Vision. Tareekh-ky-Jhonky is a digital tribute to the 5,000-year-old heritage of the Indus and beyond. Using advanced Gemini 1.5 Pro AI, we explore the stories within silent stones, intricate carvings, and ancient artifacts." className="w-14 h-14 bg-white text-blue-primary" />
           </div>
           <p className="text-2xl leading-relaxed text-text-secondary font-medium italic selection:bg-blue-light selection:text-blue-primary">
            "Tareekh-ky-Jhonky" is a digital tribute to the 5,000-year-old heritage of the Indus and beyond. Using advanced Gemini 1.5 Pro AI, we explore the stories within silent stones, intricate carvings, and ancient artifacts. 
          </p>
        </section>

        <section className="p-12 bg-blue-light/50 border border-white rounded-[3.5rem] santorini-shadow relative overflow-hidden">
           <div className="absolute -top-12 -right-12 opacity-5 scale-150 rotate-[-15deg]">
              <History size={160} strokeWidth={1} className="text-blue-dark" />
           </div>
           <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent-gold mb-12 flex items-center gap-3 leading-none">
              <History size={18} strokeWidth={2.5} /> System Diagnostics
           </h3>
           <div className="grid grid-cols-2 gap-y-12 gap-x-8 relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em] text-blue-dark">AI Core</p>
                <p className="text-2xl font-bold antique-text text-blue-dark leading-none">Gemini 1.5 Pro</p>
              </div>
              <div className="space-y-2 text-right sm:text-left">
                <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em] text-blue-dark">Registry</p>
                <p className="text-2xl font-bold antique-text text-blue-dark leading-none">Global Cloud</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em] text-blue-dark">Aesthetic</p>
                <p className="text-2xl font-bold antique-text text-blue-dark leading-none">Santorini / PK</p>
              </div>
              <div className="space-y-2 text-right sm:text-left">
                <p className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em] text-blue-dark">Build</p>
                <p className="text-2xl font-bold antique-text text-blue-dark leading-none text-accent-gold">v2.1.0</p>
              </div>
           </div>
        </section>

        <section className="flex flex-col gap-8 pb-10">
           <div className="flex items-center justify-between p-8 bg-white border border-border-warm rounded-[2.5rem] santorini-shadow hover:border-blue-primary/40 transition-all group cursor-pointer" onClick={() => window.open('https://linkedin.com', '_blank')}>
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 bg-blue-light flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform">
                    <Linkedin size={32} className="text-blue-primary" strokeWidth={1.5} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-black opacity-40 tracking-widest text-blue-dark">Curator</p>
                    <p className="text-2xl font-bold antique-text text-text-primary group-hover:text-blue-primary transition-colors">Ayesha Mughal</p>
                 </div>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-primary text-text-muted group-hover:text-blue-primary transition-colors">
                <ExternalLink size={24} strokeWidth={2} />
              </div>
           </div>

           <div className="p-10 border-2 border-dashed border-accent-gold/20 rounded-[3rem] flex items-center gap-8 bg-bg-primary">
              <div className="w-20 h-20 bg-accent-gold/10 flex items-center justify-center rounded-full">
                 <Sparkles size={36} className="text-accent-gold" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-accent-gold/60 tracking-[0.4em]">Heritage Project</p>
                 <p className="text-2xl font-bold antique-text text-blue-dark">Historical Exhibition 2026</p>
              </div>
           </div>
        </section>
      </motion.div>
    </div>
  );
};

