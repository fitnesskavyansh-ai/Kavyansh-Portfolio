import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Terminal, Cpu, Users, History } from 'lucide-react';

const categories = [
  { id: 'setup', title: 'Tactical Setup', icon: Terminal, folder: 'setup' },
  { id: 'dev', title: 'Logic Forge', icon: Cpu, folder: 'dev' },
  { id: 'team', title: 'Operational Squad', icon: Users, folder: 'team' },
  { id: 'history', title: 'Legacy Logs', icon: History, folder: 'history' }
];

export const BehindTheScenes: React.FC = () => {
  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <section id="bts" className="py-24 md:py-40 px-6 md:px-16 bg-black relative">
       <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] [background-size:50px_50px] md:[background-size:100px_100px]" />

       <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-24 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 md:gap-4 mb-6"
            >
               <Camera className="w-5 h-5 md:w-6 md:h-6 text-brand-red" />
               <span className="text-[10px] md:text-[12px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[0.8em]">Surveillance Data</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: easing }}
              className="text-4xl md:text-9xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase italic"
            >
              BEHIND THE <span className="text-brand-red italic drop-shadow-[0_0_30px_#e5091444]">SCENES</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
             {categories.map((cat, i) => (
               <motion.div
                 key={cat.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1, duration: 1, ease: easing }}
                 viewport={{ once: true }}
                 className="group relative h-[350px] md:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 bg-zinc-900/50 hover:border-brand-red/40 transition-all cursor-pointer shadow-2xl"
               >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale group-hover:scale-110 group-hover:grayscale-0 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between z-10">
                     <div className="p-4 md:p-5 bg-black/40 border border-white/10 rounded-2xl w-fit group-hover:border-brand-red/50 transition-all group-hover:scale-110">
                        <cat.icon className="w-8 h-8 md:w-12 md:h-12 text-brand-red" />
                     </div>
                     <div>
                        <div className="text-[9px] md:text-[11px] font-black text-brand-red uppercase tracking-widest mb-2 md:mb-3">Tactical Archive // 0{i+1}</div>
                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-3 md:mb-5 group-hover:text-brand-red transition-colors">{cat.title}</h3>
                        <p className="text-zinc-500 text-sm md:text-base font-light max-w-md hidden sm:block leading-relaxed">Accessing raw data from {cat.title.toLowerCase()} operations. Synchronizing high-fidelity visual logs for mission debrief.</p>
                     </div>
                  </div>

                  {/* Scanning Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-red/40 shadow-[0_0_15px_#e50914] -translate-y-full group-hover:animate-scan pointer-events-none" />
                  
                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
};
