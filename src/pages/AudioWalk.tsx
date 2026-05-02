import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, MapPin, Headphones, Volume2, Info } from 'lucide-react';
import { HERITAGE_SITES } from '../data/heritageSites';
import { HeritageSite, Waypoint } from '../types';
import { THEME } from '../constants';

export const AudioWalk = () => {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [currentWaypoint, setCurrentWaypoint] = useState<Waypoint | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startWalk = (site: HeritageSite) => {
    setSelectedSite(site);
    if (site.waypoints && site.waypoints.length > 0) {
      setCurrentWaypoint(site.waypoints[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-40">
      {!selectedSite ? (
        <>
          <header className="mb-16 space-y-4 px-6 md:px-0">
             <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">Narratives</h2>
             <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Echoes of the past</p>
          </header>

          <div className="space-y-8 px-6 md:px-0">
             {HERITAGE_SITES.filter(s => s.waypoints).map((site, idx) => (
                <motion.div 
                  key={site.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => startWalk(site)}
                  className="relative h-72 rounded-[3.5rem] overflow-hidden group cursor-pointer border border-border-warm santorini-shadow bg-white"
                >
                   <img 
                    src={site.image} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-blue-dark/80 via-blue-dark/20 to-transparent" />
                   
                   <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <Headphones size={18} className="text-white" strokeWidth={1.5} />
                            <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">{site.waypoints?.length} Chapters</span>
                         </div>
                         <h3 className="text-3xl font-bold antique-text text-white leading-tight">{site.name}</h3>
                      </div>
                      <div className="w-16 h-16 rounded-3xl bg-blue-primary text-white flex items-center justify-center shadow-xl shadow-blue-primary/30 group-hover:bg-blue-dark transition-all">
                         <Play size={28} strokeWidth={1.5} fill="currentColor" />
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[80vh] px-6 md:px-0"
        >
           <button 
             onClick={() => setSelectedSite(null)}
             className="mb-12 py-3 px-6 rounded-full bg-blue-light text-blue-primary flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-primary hover:text-white shadow-sm"
           >
              <ChevronRight size={18} className="rotate-180" strokeWidth={3} />
              All Catalog
           </button>

           <div className="space-y-16">
              <header className="space-y-4">
                 <p className="text-[11px] font-black tracking-[0.4em] text-accent-gold uppercase">Now Narrating</p>
                 <h2 className="text-6xl font-bold antique-text text-blue-dark leading-none tracking-tighter">{selectedSite.name}</h2>
              </header>

              <div className="relative pl-14 space-y-12">
                 {/* Timeline Line */}
                 <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-border-warm" />

                 {selectedSite.waypoints?.map((wp, idx) => (
                    <motion.div 
                      key={wp.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group cursor-pointer"
                      onClick={() => setCurrentWaypoint(wp)}
                    >
                       {/* Timeline Point */}
                       <div className={`absolute -left-[54px] top-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all santorini-shadow
                         ${currentWaypoint?.order === wp.order ? 'bg-accent-gold border-accent-gold text-white shadow-lg shadow-accent-gold/20' : 'bg-white border-border-warm text-text-muted hover:border-blue-primary hover:text-blue-primary'}
                       `}>
                          <span className="text-lg font-bold">{wp.order}</span>
                       </div>

                       <div className="space-y-4 pt-2 ml-8">
                          <h4 className={`text-2xl font-bold antique-text transition-colors
                            ${currentWaypoint?.order === wp.order ? 'text-blue-dark' : 'text-text-muted group-hover:text-text-primary'}
                          `}>
                             {wp.name}
                          </h4>
                          {currentWaypoint?.order === wp.order && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               className="bg-white santorini-card p-8 border border-border-warm mt-4"
                             >
                                <p className="text-lg leading-relaxed text-text-secondary font-medium italic">
                                   "{wp.description}"
                                </p>
                             </motion.div>
                          )}
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Audio Floating Bar */}
           <div className="fixed bottom-12 left-6 right-6 flex justify-center z-50">
              <motion.div 
                layoutId="player"
                className="bg-white/80 backdrop-blur-3xl border border-white/50 rounded-full px-12 py-8 flex items-center gap-12 santorini-shadow"
              >
                 <button className="text-text-muted hover:text-blue-primary transition-colors">
                    <ChevronRight size={32} className="rotate-180" strokeWidth={1.5} />
                 </button>
                 <button 
                   onClick={() => setIsPlaying(!isPlaying)}
                   className="w-20 h-20 rounded-full bg-blue-primary text-white flex items-center justify-center shadow-xl shadow-blue-primary/30 active:scale-90 transition-all hover:scale-105"
                 >
                    {isPlaying ? <Pause size={36} strokeWidth={1.5} fill="currentColor" /> : <Play size={36} strokeWidth={1.5} fill="currentColor" />}
                 </button>
                 <button className="text-text-muted hover:text-blue-primary transition-colors">
                    <ChevronRight size={32} strokeWidth={1.5} />
                 </button>
              </motion.div>
           </div>
        </motion.div>
      )}
    </div>
  );
};
