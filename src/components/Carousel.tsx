import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Target, Cpu, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface CarouselProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ title, children, id }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <div id={id} className="relative group/carousel">
      <div className="px-6 md:px-16 flex items-center justify-between mb-8 md:mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 md:gap-6"
        >
          <div className="p-3 md:p-4 bg-brand-red/10 rounded-xl border border-brand-red/20 shadow-[0_0_20px_#e5091422] group-hover/carousel:border-brand-red/50 transition-all">
            <Target className="w-5 h-5 md:w-7 md:h-7 text-brand-red" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-3 h-3 text-zinc-700" />
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Sector Data</span>
            </div>
            <h3 className="text-xl md:text-4xl font-black text-white tracking-[0.1em] uppercase italic group-hover/carousel:text-brand-red transition-colors duration-500">
              {title}
            </h3>
          </div>
        </motion.div>
        
        <div className="flex gap-4 relative z-20">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-white transition-all rounded-2xl ${!canScrollLeft ? 'opacity-20 cursor-not-allowed' : 'hover:border-brand-red hover:bg-brand-red text-white shadow-[0_0_30px_#e5091444] active:scale-90'}`}
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl border border-white/5 text-white transition-all rounded-2xl ${!canScrollRight ? 'opacity-20 cursor-not-allowed' : 'hover:border-brand-red hover:bg-brand-red text-white shadow-[0_0_30px_#e5091444] active:scale-90'}`}
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar py-12 px-6 md:px-16 snap-x snap-mandatory touch-pan-x"
          style={{ perspective: "2000px" }}
        >
          {React.Children.map(children, (child, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9, rotateY: 15, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
              transition={{ delay: i * 0.05, duration: 1, ease: easing }}
              viewport={{ once: true, margin: "-100px" }}
              className="snap-center shrink-0"
            >
              {child}
            </motion.div>
          ))}
        </div>

        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10 opacity-60" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10 opacity-60" />
      </div>
      
      {/* HUD Footer */}
      <div className="px-6 md:px-16 mt-6 flex items-center gap-6">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-brand-red/50 via-zinc-800 to-transparent" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-brand-red rounded-full" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

