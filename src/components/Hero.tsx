import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Download, ShieldCheck, Zap, Crosshair } from 'lucide-react';
import { profileConfig } from '../data/profile';

export const Hero: React.FC<{ onPlayIntro: () => void }> = ({ onPlayIntro }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { damping: 25, stiffness: 150 };
  const floatY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), springConfig);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const easing: any = [0.16, 1, 0.3, 1];

  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textTranslateX = useTransform(mouseX, (v) => v * 0.5);
  const textTranslateY = useTransform(mouseY, (v) => v * 0.5);
  const cardRotateX = useTransform(mouseY, (v) => -v * 0.5);
  const cardRotateY = useTransform(mouseX, (v) => v * 0.5);

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen w-full flex items-center px-6 md:px-16 pt-32 pb-24 md:pt-40 md:pb-40 overflow-hidden perspective-2000">
      <motion.div 
        style={{ opacity, x: textTranslateX, y: textTranslateY }}
        className="relative z-20 w-full flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16"
      >
        <div className="w-full lg:w-3/5 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: easing }}
          >
            <div className="flex flex-col md:flex-row items-center lg:justify-start gap-4 md:gap-8 mb-8 md:mb-10">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 1, ease: easing }}
                 className="flex items-center gap-3 bg-brand-red px-4 py-1.5 text-[9px] md:text-[11px] font-black tracking-widest text-white uppercase rounded-sm skew-x-[-15deg] shadow-[0_0_25px_#e5091466]"
               >
                 <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 skew-x-[15deg]" />
                 <span className="skew-x-[15deg]">LEGENDARY CLASS</span>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8, duration: 1 }}
                 className="flex items-center gap-2 text-zinc-500 text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase"
               >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  STABLE SIGNAL // 01
               </motion.div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[130px] font-black mb-6 md:mb-8 tracking-tighter leading-[0.85] text-white uppercase italic">
              <motion.span 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1.2, ease: easing }}
                className="block drop-shadow-2xl"
              >
                {profileConfig.firstName}
              </motion.span>
              <motion.span 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: easing }}
                className="block ml-0 lg:ml-24 text-brand-red drop-shadow-[0_0_50px_#e5091488]"
              >
                {profileConfig.lastName}
              </motion.span>
            </h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, ease: easing }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-xs md:text-xl text-zinc-400 font-bold mb-10 md:mb-14"
            >
              <div className="flex items-center gap-2 md:gap-3 group cursor-default">
                 <Crosshair className="w-5 h-5 md:w-6 md:h-6 text-brand-red group-hover:rotate-90 transition-transform duration-500" />
                 <span className="text-white uppercase tracking-wider">AI/ML ENGINEER</span>
              </div>
              <span className="opacity-20 hidden md:inline">/</span>
              <div className="flex items-center gap-2 md:gap-3 group cursor-default">
                 <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-red group-hover:scale-125 transition-transform duration-500" />
                 <span className="text-white uppercase tracking-wider">FULL-STACK DEVELOPER</span>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="text-base md:text-2xl text-zinc-400 mb-10 md:mb-14 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0 border-l-2 md:border-l-4 border-brand-red/30 pl-6 md:pl-8 py-1"
            >
              {profileConfig.shortBio}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1, ease: easing }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8"
            >
              <button 
                onClick={onPlayIntro}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-4 px-10 md:px-14 py-4 md:py-5 bg-white text-black font-black uppercase tracking-[0.2em] transition-all hover:bg-brand-red hover:text-white hover:scale-105 active:scale-95 shadow-xl hover:shadow-[0_0_30px_#e5091466]"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                <span className="text-[10px] md:text-xs">Replay Prologue</span>
              </button>
              
              <a 
                href={profileConfig.resumePath} 
                download
                className="w-full sm:w-auto group relative flex items-center justify-center gap-4 px-10 md:px-14 py-4 md:py-5 bg-zinc-900/50 backdrop-blur-xl text-white font-black uppercase tracking-[0.2em] border border-white/10 transition-all hover:border-brand-red hover:bg-brand-red/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-brand-red transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 opacity-10" />
                <Download className="w-5 h-5 md:w-6 md:h-6 text-brand-red" />
                <span className="text-[10px] md:text-xs">Intel Download</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end">
          <motion.div
            style={{ y: floatY, rotateX: cardRotateX, rotateY: cardRotateY }}
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 2, ease: easing, delay: 0.5 }}
            className="relative w-full max-w-[320px] aspect-[4/5] md:max-w-[450px] md:h-[650px] group perspective-1000"
          >
            <div className="absolute -inset-4 bg-gradient-to-t from-brand-red/30 via-transparent to-transparent opacity-40 rounded-2xl md:rounded-3xl blur-2xl" />
            
            <div className="relative h-full w-full border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 bg-zinc-950">
               <img 
                 src="/assets/aistudio/IMG_2194_97506b60.PNG" 
                 alt={profileConfig.fullName}
                 className="w-full h-full object-cover contrast-[1.1] brightness-[0.9] transition-all duration-1000 group-hover:scale-110"
                 style={{
                   maskImage: 'radial-gradient(circle at 50% 40%, black 50%, transparent 85%)',
                   WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 50%, transparent 85%)'
                 }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
               <div className="absolute inset-0 bg-brand-red/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               
               {/* Scanning Line Effect */}
               <div className="absolute top-0 left-0 w-full h-1 bg-brand-red/50 shadow-[0_0_15px_#e50914] animate-scan pointer-events-none" />
               
               {/* Identity HUD */}
               <div className="absolute bottom-10 left-10 right-10 z-30 flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                   <span className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase">Subject ID: KS-99</span>
                 </div>
                 <div className="h-[1px] w-full bg-gradient-to-r from-brand-red/50 to-transparent" />
                 <span className="text-xl font-black text-white italic tracking-widest uppercase">PROGENITOR</span>
               </div>
            </div>

            <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-12 md:w-16 h-12 md:h-16 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-brand-red rounded-tl-lg shadow-[0_0_20px_#e5091466]" />
            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-12 md:w-16 h-12 md:h-16 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-brand-red rounded-br-lg shadow-[0_0_20px_#e5091466]" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
