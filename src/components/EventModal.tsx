import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Shield, Target } from 'lucide-react';

import { useScrollLock } from '../hooks/useScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/5 bg-gradient-to-r from-zinc-900 to-black shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-1.5 md:w-2 h-6 md:h-8 bg-brand-red" />
                <div>
                  <div className="text-[7px] md:text-[10px] font-black text-brand-red uppercase tracking-[0.3em] md:tracking-[0.4em] mb-0.5 md:mb-1">Intelligence Feed</div>
                  <h3 className="text-lg md:text-4xl font-black text-white uppercase italic tracking-tighter truncate max-w-[200px] md:max-w-none">{title}</h3>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-brand-red transition-all border border-white/5 text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
              {children}
            </div>

            <div className="h-1.5 md:h-2 w-full bg-gradient-to-r from-transparent via-brand-red/20 to-transparent shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const EventDetail: React.FC<{ event: any }> = ({ event }) => {
  return (
    <div className="space-y-8 md:space-y-12">
      <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/5 group">
        <img 
          src={`/assets/${event.category}/${event.folder}/cover.jpg`} 
          alt={event.title}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          <div>
            <div className="flex items-center gap-3 text-brand-red mb-4 md:mb-6">
              <Target className="w-4 h-4 md:w-5 md:h-5" />
              <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Mission Log</h4>
            </div>
            <div className="p-6 md:p-8 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-brand-red/50" />
               <p className="text-xl md:text-3xl text-white font-black italic tracking-tight mb-3 md:mb-4 leading-tight">{event.achievements}</p>
               <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light">{event.description}</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 text-brand-red mb-6 md:mb-8">
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
              <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Visual Data</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg md:rounded-xl overflow-hidden bg-zinc-800 border border-white/5">
                  <img 
                    src={`/assets/${event.category}/${event.folder}/photo-${i}.jpg`} 
                    alt={`${event.title} ${i}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="p-6 md:p-8 bg-black/40 border border-white/5 rounded-xl md:rounded-2xl space-y-6 md:space-y-8">
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-brand-red shrink-0 mt-1" />
                <div>
                  <div className="text-[7px] md:text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 md:mb-1">Location</div>
                  <div className="text-white text-sm md:text-base font-bold">{event.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-brand-red shrink-0 mt-1" />
                <div>
                  <div className="text-[7px] md:text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 md:mb-1">Timestamp</div>
                  <div className="text-white text-sm md:text-base font-bold">{event.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-brand-red shrink-0 mt-1" />
                <div>
                  <div className="text-[7px] md:text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 md:mb-1">Squad</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {event.team.map((m: string) => (
                      <span key={m} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-zinc-400 uppercase font-black">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 md:pt-8 border-t border-white/5">
              <div className="flex flex-col items-center gap-3">
                <div className="text-[7px] md:text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] md:tracking-[0.4em]">Verified Integrity</div>
                <div className="w-10 md:w-12 h-0.5 md:h-1 bg-brand-red" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
