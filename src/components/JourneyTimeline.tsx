import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Search, Cpu, Globe } from 'lucide-react';
import { profileConfig } from '../data/profile';

const education = [
  {
    degree: profileConfig.degree + " (" + profileConfig.specialization + ")",
    school: profileConfig.university,
    period: profileConfig.academicDuration,
    location: "Mathura, India",
    description: profileConfig.fullBio
  }
];

export const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section id="journey" ref={containerRef} className="py-24 md:py-40 px-6 md:px-16 bg-black relative overflow-hidden perspective-2000">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-red/5 rounded-full blur-[150px] md:blur-[200px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="mb-16 md:mb-32"
        >
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-brand-red/10 rounded-lg border border-brand-red/20">
               <div className="w-5 h-5 text-brand-red animate-pulse flex items-center justify-center">
                 <Cpu className="w-full h-full" />
               </div>
             </div>
             <span className="text-[10px] md:text-[12px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[1em]">Operational Timeline</span>
          </div>
          <h2 className="text-5xl md:text-[12rem] font-black text-white tracking-tighter uppercase italic leading-none">
            THE <span className="text-brand-red text-transparent bg-clip-text bg-gradient-to-b from-brand-red to-brand-burgundy drop-shadow-[0_0_50px_rgba(229,9,20,0.3)]">JOURNEY</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Central Timeline Path */}
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-[2px] bg-white/5">
             <motion.div 
               style={{ scaleY: pathLength }}
               className="w-full h-full bg-brand-red origin-top shadow-[0_0_15px_#e50914]"
             />
          </div>

          <div className="space-y-24 md:space-y-40">
            {education.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineItem: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="relative pl-8 md:pl-32 group"
    >
      {/* Node Marker */}
      <div className="absolute left-[-5px] md:left-[43px] top-0 flex items-center justify-center">
         <div className="w-3 h-3 bg-black border-2 border-brand-red rounded-full group-hover:scale-[2.5] transition-all duration-500 shadow-[0_0_15px_#e50914] z-20" />
         <div className="absolute w-8 h-8 bg-brand-red/20 rounded-full animate-ping pointer-events-none" />
      </div>
      
      <div className="bg-zinc-900/40 p-8 md:p-16 rounded-3xl border border-white/5 hover:border-brand-red/30 transition-all duration-700 backdrop-blur-3xl relative overflow-hidden group/card shadow-2xl">
        {/* Card HUD Elements */}
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/card:opacity-30 transition-opacity">
           <Search className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-10 left-10 w-2 h-2 bg-brand-red rounded-full animate-pulse" />
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none group-hover/card:text-brand-red transition-colors">
              {item.degree}
            </h3>
            <div className="flex flex-wrap gap-6 text-zinc-500 text-[12px] md:text-sm font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-brand-red" /> {item.school}</span>
              <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-brand-red" /> {item.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 px-6 py-3 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red text-xs md:text-base font-black tracking-[0.4em] uppercase w-fit shadow-[0_0_20px_rgba(229,9,20,0.2)]">
            <Calendar className="w-5 h-5" />
            {item.period}
          </div>
        </div>

        <div className="relative">
           <div className="absolute -left-8 md:-left-16 top-1/2 -translate-y-1/2 w-4 md:w-8 h-[1px] bg-brand-red/30" />
           <p className="text-zinc-400 text-lg md:text-2xl font-light leading-relaxed max-w-4xl italic">
             "{item.description}"
           </p>
        </div>

        {/* Floating Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-brand-red/[0.02] to-transparent h-20 -translate-y-full group-hover/card:translate-y-[1000%] transition-transform duration-[3s] ease-linear" />
      </div>

      {/* Background Icon */}
      <div className="absolute -right-20 top-0 opacity-[0.02] pointer-events-none">
         <Globe className="w-96 h-96 text-white" />
      </div>
    </motion.div>
  );
};
