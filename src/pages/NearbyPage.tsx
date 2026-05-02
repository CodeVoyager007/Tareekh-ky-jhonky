import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Volume2 } from 'lucide-react';
import { HERITAGE_SITES } from '../data/heritageSites';
import { HeritageSite } from '../types';
import { SpeechButton } from '../components/SpeechButton';

export const NearbyPage = () => {
  const sortedSites = HERITAGE_SITES;

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32">
      <header className="mb-16 space-y-4 px-6 md:px-0">
         <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">
            Nearby
         </h2>
         <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Sites Near You</p>
      </header>

      <div className="space-y-12 px-6 md:px-0">
         <div className="flex items-center gap-6">
            <h3 className="text-2xl font-bold antique-text text-text-primary">Nearby Sites</h3>
            <div className="h-[1px] flex-1 bg-border-warm" />
         </div>

         <div className="space-y-6">
            {sortedSites.map((site: any, i) => (
               <motion.div 
                  key={site.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${site.coordinates.lat},${site.coordinates.lng}`)}
               >
                  <div className="flex gap-6 items-center p-5 bg-white border border-border-warm rounded-[2.5rem] hover:border-blue-primary/30 transition-all cursor-pointer santorini-shadow">
                     <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-bg-secondary">
                        <img 
                          src={site.image} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                     </div>
                     <div className="flex-1 min-w-0 space-y-3">
                        <div className="space-y-1">
                           <p className="text-[9px] font-mono font-bold tracking-[0.3em] text-accent-gold uppercase">{site.city}</p>
                           <h4 className="text-2xl font-bold antique-text text-text-primary group-hover:text-blue-primary transition-colors truncate">
                              {site.name}
                           </h4>
                        </div>
                        <div className="flex items-center gap-4">
                           <SpeechButton 
                             text={`${site.name}. ${site.description}`} 
                             className="w-10 h-10 bg-blue-light text-blue-primary" 
                           />
                           <span className="text-[10px] uppercase font-black tracking-widest text-blue-primary/40">Heritage Site</span>
                        </div>
                     </div>
                     
                     <div className="hidden sm:flex flex-col items-end gap-1 px-4">
                        <p className="text-2xl font-bold text-blue-primary tracking-tighter">
                           VIEW
                        </p>
                        <p className="text-[9px] font-black tracking-widest text-text-muted uppercase">On Map</p>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};
