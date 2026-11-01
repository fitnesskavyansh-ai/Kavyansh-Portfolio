import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Linkedin, Github, Terminal } from 'lucide-react';
import { profileConfig } from '../data/profile';

export const ContactSection: React.FC = () => {
  const easing: any = [0.16, 1, 0.3, 1];
  const { githubUrl, linkedinUrl, email } = profileConfig;

  return (
    <section id="contact" className="py-24 md:py-40 bg-black relative overflow-hidden">
      {/* Background HUD Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white" />
         <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: easing }}
            viewport={{ once: true }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
               <div className="w-10 h-[1px] bg-brand-red" />
               <span className="text-[10px] md:text-[11px] font-black text-brand-red uppercase tracking-[0.6em]">Communication Array</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-[100px] font-black text-white mb-8 md:mb-12 tracking-tighter uppercase italic leading-[0.8]">
              INITIATE <span className="text-brand-red italic drop-shadow-[0_0_30px_#e5091444]">CONTACT</span>
            </h2>
            
            <p className="text-zinc-500 text-lg md:text-2xl mb-12 md:mb-16 font-light leading-relaxed max-w-lg italic">
              System is ready for new transmissions. Whether you have a quest for me or just want to synchronize, my channels are open.
            </p>

            <div className="space-y-10">
              <motion.a 
                href={`mailto:${email}`} 
                className="flex items-center gap-6 group w-fit"
                whileHover={{ x: 10 }}
              >
                <div className="p-4 md:p-5 bg-zinc-900 rounded-2xl border border-white/5 group-hover:border-brand-red/50 group-hover:shadow-[0_0_20px_#e5091422] transition-all">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-brand-red" />
                </div>
                <div>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-black mb-1">Direct Signal</div>
                  <div className="text-white text-lg md:text-2xl font-bold group-hover:text-brand-red transition-colors">{email}</div>
                </div>
              </motion.a>

              <div className="flex gap-4 md:gap-6">
                {[
                  { icon: Linkedin, href: linkedinUrl, label: "LinkedIn" },
                  { icon: Github, href: githubUrl, label: "GitHub" }
                ].map((social, i) => {
                  const isPlaceholder = social.href.includes("ADD_MY_");
                  if (isPlaceholder) return null;

                  return (
                    <motion.a 
                      key={i} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: easing }}
                      className="p-4 md:p-5 bg-zinc-900 rounded-2xl border border-white/5 hover:border-brand-red/40 transition-all text-zinc-500 hover:text-white hover:shadow-[0_0_20px_#e5091422] group"
                    >
                      <social.icon className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: easing }}
            viewport={{ once: true }}
            className="p-10 md:p-16 bg-zinc-900/30 rounded-[40px] border border-white/5 backdrop-blur-3xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <Terminal className="w-12 h-12 text-white" />
            </div>

            <form className="space-y-6 md:space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black ml-1">Identity Provider</label>
                  <input 
                    type="text" 
                    placeholder="ENTER NAME..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 md:py-6 text-white text-sm md:text-lg focus:outline-none focus:border-brand-red focus:bg-black/60 transition-all placeholder:text-zinc-800"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black ml-1">Frequency Range</label>
                  <input 
                    type="email" 
                    placeholder="ENTER EMAIL..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 md:py-6 text-white text-sm md:text-lg focus:outline-none focus:border-brand-red focus:bg-black/60 transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black ml-1">Payload Content</label>
                <textarea 
                  rows={4}
                  placeholder="TRANSMIT MESSAGE..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 md:py-6 text-white text-sm md:text-lg focus:outline-none focus:border-brand-red focus:bg-black/60 transition-all resize-none placeholder:text-zinc-800"
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative flex items-center justify-center gap-4 py-5 md:py-7 bg-brand-red text-white font-black uppercase tracking-[0.4em] rounded-2xl overflow-hidden transition-all shadow-[0_0_40px_#e5091466]"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                <Send className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] md:text-sm relative z-10">Initiate Uplink</span>
              </motion.button>
            </form>
            
            {/* Scanned Background Detail */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-20" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
