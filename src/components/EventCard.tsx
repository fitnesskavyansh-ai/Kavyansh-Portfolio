import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trophy, Crosshair } from 'lucide-react';
import { Modal, EventDetail } from './EventModal';
import { useTouchDevice } from '../hooks/useDevice';
import { cn } from '../lib/utils';

interface EventCardProps {
  event: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isTouch = useTouchDevice();

  return (
    <>
      <motion.div 
        onClick={() => setIsModalOpen(true)}
        className="group relative min-w-[280px] sm:min-w-[400px] md:min-w-[500px] aspect-[16/9] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-red/50 transition-all duration-500"
      >
        <img 
          src={`/assets/${event.category}/${event.folder}/cover.jpg`} 
          alt={event.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop`;
          }}
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity",
          isTouch ? "opacity-80" : "opacity-60 group-hover:opacity-80"
        )} />

        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
          <div className={cn(
            "flex justify-between items-start transition-all",
            isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <div className="flex items-center gap-2 bg-brand-red/90 px-2 py-0.5 md:px-3 md:py-1 rounded-sm">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">{event.achievements}</span>
            </div>
            <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-brand-red animate-pulse" />
          </div>

          <div>
            <div className={cn(
              "flex items-center gap-2 md:gap-3 text-brand-red text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 transition-transform duration-500",
              isTouch ? "translate-y-0" : "translate-y-4 group-hover:translate-y-0"
            )}>
              <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {event.location}
            </div>
            <h4 className={cn(
              "text-xl md:text-4xl font-black text-white uppercase italic tracking-tighter transition-transform duration-500 delay-75",
              isTouch ? "translate-y-0" : "translate-y-4 group-hover:translate-y-0"
            )}>
              {event.title}
            </h4>
            <div className={cn(
              "text-[8px] md:text-[10px] text-zinc-500 font-mono mt-2 transition-opacity delay-200 uppercase tracking-widest",
              isTouch ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              Date: {event.date}
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/10 group-hover:border-brand-red transition-all" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/10 group-hover:border-brand-red transition-all" />
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={event.title}
      >
        <EventDetail event={event} />
      </Modal>
    </>
  );
};
