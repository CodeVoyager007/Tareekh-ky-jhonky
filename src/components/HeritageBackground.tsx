import React from 'react';

export const HeritageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      {/* Sharp Contrast Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a,transparent)]" />
      
      {/* Minimal Grid Layer */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} 
      />
    </div>
  );
};
