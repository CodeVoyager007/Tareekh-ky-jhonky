import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Info, ChevronRight, Search, Sparkles, Maximize2, Volume2 } from 'lucide-react';
import { HERITAGE_SITES } from '../data/heritageSites';
import { HeritageSite } from '../types';
import { THEME } from '../constants';
import { SpeechButton } from '../components/SpeechButton';

export const SiteGuide = () => {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = HERITAGE_SITES.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    site.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32">
      <AnimatePresence mode="wait">
        {!selectedSite ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 md:px-0"
          >
            <header className="mb-16 space-y-4">
               <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">Guide</h2>
               <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Detailed Site Records</p>
            </header>

            <div className="relative mb-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-primary/40" size={22} />
              <input 
                type="text" 
                placeholder="Locate sites or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-border-warm rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:border-blue-primary transition-all font-bold text-[12px] text-text-primary uppercase tracking-widest santorini-shadow"
              />
            </div>

            <div className="grid grid-cols-1 gap-12">
              {filteredSites.map((site) => (
                <motion.div
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className="group relative h-80 rounded-[3.5rem] overflow-hidden border-2 border-white cursor-pointer santorini-shadow bg-white"
                >
                  <img src={site.image} alt={site.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/80 via-blue-dark/20 to-transparent" />
                  
                  <div className="absolute top-10 left-10">
                     {site.unesco && (
                        <div className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-accent-gold text-white shadow-lg shadow-accent-gold/20 flex items-center gap-2">
                           <Sparkles size={11} fill="currentColor" />
                           UNESCO Site
                        </div>
                     )}
                  </div>

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="space-y-2">
                       <p className="text-[10px] font-mono font-bold tracking-[0.4em] text-accent-gold uppercase leading-none">{site.city}, {site.region}</p>
                       <h3 className="text-4xl font-bold antique-text text-white leading-tight">{site.name}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pb-40 px-6 md:px-0"
          >
            <button 
              onClick={() => setSelectedSite(null)}
              className="mb-12 py-3 px-6 rounded-full bg-blue-light text-blue-primary flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-primary hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={18} className="rotate-180" strokeWidth={3} />
              Return to Catalog
            </button>

            <div className="aspect-[4/5] sm:aspect-video w-full rounded-[3.5rem] overflow-hidden mb-16 relative border-2 border-white santorini-shadow">
               <img src={selectedSite.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/60 via-transparent to-transparent" />
               <div className="absolute bottom-12 left-12 right-32">
                  <p className="text-[10px] font-mono font-bold tracking-[0.5em] text-accent-gold uppercase mb-3 leading-none">{selectedSite.city}</p>
                  <h2 className="text-6xl font-bold antique-text text-white leading-none tracking-tighter">{selectedSite.name}</h2>
               </div>
               <div className="absolute bottom-12 right-12 flex flex-col gap-4">
                  <SpeechButton text={`${selectedSite.name}. ${selectedSite.description}`} className="w-14 h-14 bg-white text-blue-primary" />
                  <button 
                     onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedSite.coordinates.lat},${selectedSite.coordinates.lng}`)}
                     className="w-14 h-14 rounded-3xl bg-blue-primary text-white flex items-center justify-center hover:bg-blue-dark transition-all shadow-xl shadow-blue-primary/30"
                     title="Open in Google Maps"
                  >
                     <Maximize2 size={28} />
                  </button>
               </div>
            </div>

            <div className="space-y-20">
               <div className="bg-white santorini-card p-12 -mt-24 relative z-10 mx-4 sm:mx-8">
                  <p className="text-xl leading-relaxed text-text-secondary font-medium italic text-center selection:bg-blue-light selection:text-blue-dark">
                    "{selectedSite.description}"
                  </p>
               </div>

               <section>
                  <div className="flex items-center gap-6 mb-10">
                     <h3 className="text-2xl font-bold antique-text text-text-primary">Key Attributes</h3>
                     <div className="h-[1px] flex-1 bg-border-warm" />
                  </div>
                  
                  <div className="space-y-6">
                     {selectedSite.elements.map((el, i) => (
                       <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-border-warm flex items-center justify-between group hover:border-blue-primary transition-all santorini-shadow">
                          <div className="space-y-2">
                             <p className="text-2xl font-bold antique-text text-text-primary group-hover:text-blue-primary transition-colors">{el.name}</p>
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-gold/40" />
                                <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">{el.era}</p>
                             </div>
                          </div>
                          <div className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest leading-none
                             ${el.difficulty === 'Easy' ? 'bg-blue-light text-blue-primary' : 
                                el.difficulty === 'Medium' ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/20' : 
                                'bg-blue-dark text-white shadow-lg shadow-blue-dark/20'}
                          `}>
                             {el.difficulty}
                          </div>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
