import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Trash2, BookOpen, ImageIcon, Search, Sparkles } from 'lucide-react';
import { THEME } from '../constants';
import { AnalysisResult } from '../types';
import { useAuth } from '../components/AuthContext';
import { getSavedDiscoveries } from '../lib/firebase';

export const Saved = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discoveries, setDiscoveries] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDiscoveries = async () => {
      setLoading(true);
      if (user) {
        try {
          const firebaseData = await getSavedDiscoveries(user.uid);
          if (firebaseData) {
            setDiscoveries(firebaseData as AnalysisResult[]);
          }
        } catch (error) {
          console.error('Error fetching discoveries:', error);
        }
      } else {
        const saved = localStorage.getItem('savedDiscoveries');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setDiscoveries(parsed);
            }
          } catch (e) {
            console.error("Failed to parse saved discoveries", e);
          }
        }
      }
      setLoading(false);
    };

    fetchDiscoveries();
  }, [user]);

  const removeDiscovery = (id: string) => {
    const updated = discoveries.filter(d => d.id !== id);
    setDiscoveries(updated);
    
    // Only update local for now in this action
    localStorage.setItem('savedDiscoveries', JSON.stringify(updated));
    
    // Also remove from stamps if present
    const savedStamps = localStorage.getItem('heritageStamps');
    if (savedStamps) {
      const stamps = JSON.parse(savedStamps);
      const updatedStamps = stamps.filter((s: any) => s.id !== id);
      localStorage.setItem('heritageStamps', JSON.stringify(updatedStamps));
    }
  };


  const openDiscovery = (discovery: AnalysisResult) => {
    sessionStorage.setItem('lastResult', JSON.stringify(discovery));
    navigate('/result');
  };

  const filteredDiscoveries = discoveries.filter(d => 
    d.specific_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.cultural_region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.element_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32">
      <header className="mb-16 space-y-4 px-6 md:px-0">
         <h2 className="text-7xl font-bold antique-text text-blue-dark tracking-tighter leading-none">
            Archives
         </h2>
         <p className="text-[11px] uppercase font-black tracking-[0.4em] text-accent-gold">Saved History</p>
      </header>

      {discoveries.length > 0 && (
        <div className="mb-12 relative px-6 md:px-0">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-border-warm rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-text-primary outline-none focus:border-blue-primary santorini-shadow transition-all placeholder:text-text-muted"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-6 px-6 md:px-0">
           {[1,2,3].map(i => (
             <div key={i} className="h-28 bg-white/50 border border-border-warm rounded-3xl animate-pulse" />
           ))}
        </div>
      ) : discoveries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center py-20 text-center px-6"
        >
          <div className="mb-12 text-blue-primary/20 flex flex-col items-center">
             <div className="w-24 h-24 border-2 border-blue-primary/10 rotate-45 flex items-center justify-center bg-white santorini-shadow">
                <Sparkles size={40} strokeWidth={1} className="-rotate-45 text-accent-gold" />
             </div>
          </div>
          <p className="text-xs uppercase tracking-[0.5em] text-blue-primary font-black mb-12 leading-relaxed">
            Your discoveries will live here
          </p>
          <button 
            onClick={() => navigate('/scan')}
            className="px-12 py-5 bg-blue-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-dark shadow-xl shadow-blue-primary/20 transition-all"
          >
            Start Discovering
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6 px-6 md:px-0">
          <AnimatePresence mode="popLayout">
            {filteredDiscoveries.map((discovery, idx) => (
              <motion.div
                key={discovery.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.08 }}
                className="relative group"
              >
                <div 
                  className="flex gap-6 items-center p-4 bg-white border border-border-warm rounded-3xl hover:border-blue-primary/30 transition-all cursor-pointer santorini-shadow"
                  onClick={() => openDiscovery(discovery)}
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-bg-secondary">
                    <img 
                      src={discovery.image} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                       <span className="text-[9px] font-mono font-bold tracking-widest text-accent-gold uppercase">
                         {discovery.era}
                       </span>
                       <button 
                        onClick={(e) => { e.stopPropagation(); removeDiscovery(discovery.id!); }}
                        className="p-2 -mr-2 text-text-muted hover:text-red-500 transition-all"
                       >
                         <Trash2 size={16} strokeWidth={1.5} />
                       </button>
                    </div>
                    <h3 className="text-2xl font-bold antique-text text-text-primary leading-tight">
                       {discovery.specific_name}
                    </h3>
                    <p className="text-[10px] text-blue-primary font-black uppercase tracking-widest leading-none">
                      {discovery.cultural_region}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Decorative Brand Mark */}
      <div className="mt-40 flex flex-col items-center opacity-30">
         <div className="w-16 h-[2px] bg-accent-gold mb-6" />
         <p className="text-[9px] font-black uppercase tracking-[1em] text-blue-dark">History List</p>
      </div>
    </div>
  );
};
