import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Zap, ChevronUp } from 'lucide-react';
import { profileConfig } from '../data/profile';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black py-24 md:py-40 px-6 md:px-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-red/5 rounded-full blur-[150px] md:blur-[200px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-32 relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 md:gap-24">
          <div className="max-w-xl w-full">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <div className="w-12 h-12 bg-brand-red flex items-center justify-center skew-x-[-12deg] shadow-[0_0_30px_#e5091466]">
                <Zap className="w-7 h-7 text-white skew-x-[12deg] fill-current" />
              </div>
              <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{profileConfig.firstName} <span className="text-brand-red">{profileConfig.lastName}</span></h2>
            </div>
            <p className="text-zinc-500 font-light mb-10 md:mb-14 leading-relaxed text-lg md:text-2xl italic border-l-2 border-brand-red/20 pl-8">
              {profileConfig.headline}. <br/>
              Architecting intelligent systems and legendary digital experiences. 
              Built for performance. Designed for impact.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Github, href: profileConfig.githubUrl, color: "hover:text-white" },
                { icon: Linkedin, href: profileConfig.linkedinUrl, color: "hover:text-blue-500" },
                { icon: Mail, href: `mailto:${profileConfig.email}`, color: "hover:text-brand-red" }
              ].map((social, i) => {
                const isPlaceholder = social.href.includes("ADD_MY_");
                if (isPlaceholder) return null;

                return (
                  <motion.a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.1 }}
                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900 rounded-2xl border border-white/5 transition-all text-zinc-500 ${social.color} hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]`}
                  >
                    <social.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24 w-full lg:w-auto">
            <div>
              <h4 className="text-white font-black mb-8 md:mb-10 text-[10px] md:text-[12px] uppercase tracking-[0.4em] flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                 Directory
              </h4>
              <ul className="space-y-4 md:space-y-6 text-[11px] md:text-sm font-bold text-zinc-600 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors block w-fit">Mainframe</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors block w-fit">Armory</a></li>
                <li><a href="#hackathons" className="hover:text-white transition-colors block w-fit">Archives</a></li>
                <li><a href="#journey" className="hover:text-white transition-colors block w-fit">Codex</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors block w-fit">Transmission</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-8 md:mb-10 text-[10px] md:text-[12px] uppercase tracking-[0.4em] flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                 Protocols
              </h4>
              <ul className="space-y-4 md:space-y-6 text-[11px] md:text-sm font-bold text-zinc-600 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors block w-fit">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors block w-fit">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors block w-fit">Terms</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1 flex justify-end sm:block">
              <motion.button 
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center gap-1 bg-white text-black hover:bg-brand-red hover:text-white transition-all rounded-[24px] group shadow-2xl"
              >
                <ChevronUp className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
             <div className="text-[10px] md:text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em]">
               © 2024 {profileConfig.fullName.toUpperCase()} // THE SERIES
             </div>
             <div className="text-[8px] text-zinc-800 uppercase tracking-[0.3em]">Built with React + Three.js + Framer Motion</div>
          </div>
          
          <div className="flex items-center gap-6 px-8 py-3 bg-zinc-900/50 rounded-full border border-white/5">
            <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
              System: Operational
            </div>
            <div className="w-[1px] h-4 bg-white/10" />
            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
              Encrypted Session
            </div>
          </div>

          <div className="text-[10px] md:text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em]">
            DESIGNED BY <span className="text-white italic">THE LEGEND</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
