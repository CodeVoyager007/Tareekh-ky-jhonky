import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, BookMarked, Compass, User, Award, Map, ChevronLeft, Sparkles, History } from 'lucide-react';
import { HeritageBackground } from './HeritageBackground';

const TABS = [
  { path: '/scan', icon: Camera, label: 'Scan' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/daily', icon: History, label: 'Daily' },
  { path: '/passport', icon: Award, label: 'Passport' },
  { path: '/guide', icon: Map, label: 'Guide' },
  { path: '/about', icon: User, label: 'Profile' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSplash = location.pathname === '/';
  const isScan = location.pathname === '/scan';

  const handleBack = () => navigate(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative bg-bg-primary text-text-primary selection:bg-blue-light selection:text-blue-dark font-sans">
      <HeritageBackground />
      
      {/* Subtle Top Fade for content safety */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-primary to-transparent pointer-events-none z-40" />

      {!isSplash && !isScan && (
        <div className="fixed top-0 left-0 right-0 z-[60] flex justify-between items-center px-8 h-20">
           <button 
             onClick={handleBack}
             className="w-12 h-12 rounded-2xl bg-white santorini-shadow flex items-center justify-center text-blue-primary hover:bg-blue-light transition-all active:scale-90"
           >
             <ChevronLeft size={24} strokeWidth={2} />
           </button>
           <div className="w-10 h-10 flex items-center justify-center text-accent-gold drop-shadow-sm">
              <Sparkles size={24} strokeWidth={1.5} />
           </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`pb-32 px-6 min-h-screen relative z-10 ${(!isSplash && !isScan) ? 'pt-24' : 'pt-0'}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Floating Modern Navigation Bar */}
      <div className="fixed bottom-6 left-6 right-6 z-[100] flex justify-center pointer-events-none">
        <nav className="relative w-full max-w-lg bg-blue-primary santorini-shadow rounded-[2rem] h-20 flex items-center justify-around px-4 pointer-events-auto border border-white/20">
           {TABS.map(({ path, icon: Icon, label }) => (
             <NavLink 
               key={path} 
               to={path}
               className={({ isActive }) => `
                 relative flex flex-col items-center justify-center gap-1 transition-all active:scale-90 px-3 py-2 rounded-2xl
                 ${isActive ? 'text-white' : 'text-blue-light/60 hover:text-white/80'}
               `}
             >
               {({ isActive }) => (
                 <>
                   <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} className="transition-all" />
                   <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 h-0'}`}>
                     {label}
                   </span>
                   {isActive && (
                     <motion.div 
                       layoutId="nav-glow"
                       className="absolute -inset-1 bg-white/10 rounded-2xl blur-md z-[-1]"
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                   )}
                 </>
               )}
             </NavLink>
           ))}
        </nav>
      </div>

      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L1,1 L1,0.25 Q0.5,-0.1 0,0.25 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
