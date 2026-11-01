import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MapPin, ChevronRight, Terminal } from 'lucide-react';
import journalData from '../data/journal.json';

export const Journal: React.FC = () => {
  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <section id="journal" className="py-24 md:py-40 px-6 md:px-16 bg-black relative">
       <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 md:mb-32 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 mb-6"
            >
               <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-brand-red" />
               <span className="text-[10px] md:text-[12px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[0.8em]">Recently</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easing }}
              viewport={{ once: true }}
              className="text-4xl md:text-[120px] font-black text-white mb-4 md:mb-6 tracking-tighter uppercase italic leading-[0.8]"
            >
              THE <span className="text-brand-red italic drop-shadow-[0_0_30px_#e5091444]">JOURNAL</span>
            </motion.h2>
          </div>

          <div className="space-y-12 md:space-y-20">
             {journalData.filter(entry => entry.id === 'build-arena').map((entry, i) => (
                <motion.div
                   key={entry.id}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1, duration: 1.2, ease: easing }}
                   viewport={{ once: true, margin: "-100px" }}
                   className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 p-10 md:p-16 bg-zinc-900/30 rounded-3xl md:rounded-[40px] border border-white/5 hover:border-brand-red/20 transition-all overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-brand-red/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
                   
                   <div className="lg:col-span-4 space-y-6">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-brand-red">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm md:text-base font-black uppercase tracking-widest">{entry.date}</span>
                         </div>
                         <div className="flex items-center gap-3 text-zinc-500">
                            <MapPin className="w-5 h-5" />
                            <span className="text-[11px] md:text-sm font-bold uppercase tracking-widest">{entry.location}</span>
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4">
                         {entry.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-black/50 rounded-full border border-white/5 text-[9px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-wider">{tag}</span>
                         ))}
                      </div>

                      <div className="pt-8 hidden lg:block">
                         <div className="flex items-center gap-4 text-zinc-800">
                            <Terminal className="w-4 h-4" />
                            <div className="h-[1px] flex-1 bg-zinc-900" />
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-8 space-y-6 md:space-y-10 relative">
                      <h3 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter group-hover:text-brand-red transition-colors leading-none">{entry.title}</h3>
                      <div className="relative">
                         <div className="absolute top-0 left-0 w-1 h-full bg-brand-red/20" />
                         <p className="text-zinc-400 text-lg md:text-2xl font-light leading-relaxed pl-8 md:pl-12 italic">{entry.story}</p>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                         <button className="group/btn flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white hover:text-brand-red transition-all">
                            Access Full Log 
                            <div className="p-2 border border-white/10 rounded-full group-hover/btn:border-brand-red transition-all">
                               <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                         </button>
                      </div>
                   </div>

                   {/* Background Number */}
                   <div className="absolute -bottom-6 -left-4 md:-bottom-12 md:-left-8 text-[100px] md:text-[200px] font-black text-white/[0.03] italic select-none pointer-events-none leading-none">
                      {(i + 1).toString().padStart(2, '0')}
                   </div>
                </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};
