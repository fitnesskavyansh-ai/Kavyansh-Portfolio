import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Compass, Palette, Zap, ArrowRight } from 'lucide-react';
import { InfernoBackground } from './InfernoBackground';
import { soundManager } from '../lib/sound';
import { useTouchDevice } from '../hooks/useDevice';
import { useScrollLock } from '../hooks/useScrollLock';

const profiles = [
  { id: 'recruiter', name: 'RECRUITER', icon: Shield, color: 'from-blue-600/20 to-black', accent: 'text-blue-500', border: 'border-blue-500/30' },
  { id: 'developer', name: 'DEVELOPER', icon: User, color: 'from-red-600/20 to-black', accent: 'text-red-500', border: 'border-red-500/30' },
  { id: 'explorer', name: 'EXPLORER', icon: Compass, color: 'from-emerald-600/20 to-black', accent: 'text-emerald-500', border: 'border-emerald-500/30' },
  { id: 'creative', name: 'CREATIVE', icon: Palette, color: 'from-amber-600/20 to-black', accent: 'text-amber-500', border: 'border-amber-500/30' },
];

export const ProfileSelection: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  useScrollLock(true);
  const isTouch = useTouchDevice();
  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden perspective-1000">
      <InfernoBackground />
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: easing }}
        className="relative z-10 text-center mb-16 md:mb-32 px-6"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
           <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-brand-red" />
           <span className="text-zinc-500 tracking-[0.6em] md:tracking-[1em] text-[10px] md:text-xs uppercase font-black">Identify Subject</span>
           <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-brand-red" />
        </div>
        <h1 className="text-5xl md:text-[110px] font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          WHO'S <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">WATCHING?</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:flex lg:flex-row justify-center gap-6 md:gap-10 px-6 md:px-8 relative z-10 w-full max-w-7xl mx-auto">
        {profiles.map((profile, index) => (
          <motion.button
            key={profile.id}
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              delay: 0.4 + index * 0.1, 
              duration: 1.2, 
              ease: easing
            }}
            onClick={() => {
              if (!isTouch) soundManager.playImpact();
              onSelect(profile.id);
            }}
            className="group flex flex-col items-center gap-6 md:gap-12 focus:outline-none"
          >
            <motion.div
              onMouseEnter={() => !isTouch && soundManager.playHover()}
              whileHover={!isTouch ? { 
                scale: 1.05, 
                y: -10,
                rotateY: 5,
              } : {}}
              whileTap={{ scale: 0.95 }}
              className={`relative w-full aspect-square md:w-56 md:h-56 rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border-2 ${profile.border} group-hover:border-white transition-all duration-700 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-40 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <profile.icon className={`w-14 h-14 md:w-24 md:h-24 text-white/10 group-hover:text-white transition-all duration-700 relative z-10`} />
              
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/40 transition-all rounded-2xl md:rounded-3xl" />
              
              {/* Corner Glitch Effect */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/0 group-hover:border-white transition-all duration-500" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/0 group-hover:border-white transition-all duration-500" />
            </motion.div>
            
            <div className="relative overflow-hidden py-1 text-center">
              <span className="text-zinc-500 group-hover:text-white text-sm md:text-2xl font-black tracking-[0.2em] transition-all duration-500 uppercase italic block">
                {profile.name}
              </span>
              <motion.div 
                className="flex items-center justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
                animate={{ x: isTouch ? 0 : -5 }}
                whileHover={{ x: 0 }}
              >
                 <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${profile.accent}`}>Enter Session</span>
                 <ArrowRight className={`w-3 h-3 ${profile.accent}`} />
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-20 md:mt-40 relative z-10"
      >
        <button className="group relative px-12 py-4 overflow-hidden rounded-full border border-white/10 bg-white/5 transition-all hover:border-brand-red hover:bg-brand-red/10">
          <span className="relative z-10 text-zinc-500 group-hover:text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">
            Neural Protocol Active
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-40 h-40 border-t border-l border-white/20 rounded-tl-[60px]" />
         <div className="absolute bottom-10 right-10 w-40 h-40 border-b border-r border-white/20 rounded-br-[60px]" />
      </div>
    </div>
  );
};
