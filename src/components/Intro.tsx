import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Volume2, VolumeX, ShieldCheck, Cpu, Zap, Radio } from 'lucide-react';
import { InfernoBackground } from './InfernoBackground';
import { soundManager } from '../lib/sound';
import { useMediaQuery, usePerformanceTier } from '../hooks/useDevice';
import { profileConfig } from '../data/profile';
import { useScrollLock } from '../hooks/useScrollLock';

export const Intro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useScrollLock(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initProgress, setInitProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [act, setAct] = useState(1);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const tier = usePerformanceTier();
  
  const [fireIntensity, setFireIntensity] = useState(0);
  const [explosionFactor, setExplosionFactor] = useState(0);
  const [emberSpeed, setEmberSpeed] = useState(0.2);
  const [isVoidMode, setIsVoidMode] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsInitializing(false), 800);
      }
      setInitProgress(progress);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const timer = setTimeout(() => setShowSkip(true), 4000);
    
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(portalRef.current, {
          scale: isMobile ? 30 : 20,
          opacity: 1,
          duration: 1.8,
          ease: "power4.in",
          onComplete: () => {
             onComplete();
          }
        });
      }
    });

    gsap.set(".name-letter", { 
      opacity: 0, 
      scale: 8, 
      y: 400, 
      rotateX: 120, 
      rotateY: 45,
      rotateZ: 20,
      filter: "brightness(0) blur(40px)" 
    });
    gsap.set(".legend-reveal", { opacity: 0, scale: 3, y: 100 });
    gsap.set(".role-reveal", { opacity: 0, y: 100, filter: "blur(20px)" });
    gsap.set(flashRef.current, { opacity: 0 });
    gsap.set(portalRef.current, { scale: 0, opacity: 0 });
    gsap.set(".energy-ring", { scale: 0.5, opacity: 0 });

    tl.to({}, { duration: 1 })
    .to(flashRef.current, {
      opacity: 0.4,
      duration: 0.08,
      yoyo: true,
      repeat: 3,
      ease: "rough({ template: none, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
    })
    .to({}, { duration: 1 }); 

    tl.to({}, { 
      duration: 0.1,
      onStart: () => {
        setIsVoidMode(false);
        setAct(2);
        if (!isMuted) soundManager.playImpact();
      }
    })
    .to(flashRef.current, {
      opacity: 1,
      duration: 0.04,
      yoyo: true,
      repeat: 1,
      ease: "power4.in"
    })
    .to({}, {
      duration: 1.2,
      onStart: () => {
        gsap.to({ val: 0 }, {
          val: 1,
          duration: 1,
          ease: "expo.out",
          onUpdate: function() { 
            setFireIntensity(this.targets()[0].val);
            setExplosionFactor(this.targets()[0].val);
          }
        });
        setEmberSpeed(isMobile ? 2.5 : 5.0);
        
        gsap.to(containerRef.current, {
          x: isMobile ? "random(-20, 20)" : "random(-60, 60)",
          y: isMobile ? "random(-20, 20)" : "random(-60, 60)",
          duration: 0.04,
          repeat: 12,
          yoyo: true,
          ease: "none",
          onComplete: () => gsap.to(containerRef.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" })
        });
      }
    });

    tl.to(".kavyansh-letter", {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      filter: "brightness(3) blur(0px)",
      duration: 1.4,
      stagger: {
        amount: 1,
        from: "center"
      },
      ease: "expo.out",
      onStart: () => setAct(3)
    })
    .to(".kavyansh-letter", {
      filter: "brightness(1)",
      duration: 1,
      ease: "power2.inOut"
    }, "-=1")
    .to(".saxena-letter", {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      filter: "brightness(3) blur(0px)",
      duration: 1.4,
      stagger: {
        amount: 1,
        from: "center"
      },
      ease: "expo.out",
    }, "-=0.8")
    .to(".saxena-letter", {
      filter: "brightness(1)",
      duration: 1,
      ease: "power2.inOut"
    }, "-=1")
    .to(".legend-reveal", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.8,
      ease: "expo.out"
    }, "-=1")
    .to(".role-reveal", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.5,
      stagger: 0.2,
      ease: "power4.out"
    }, "-=1.2");

    tl.to({}, {
      duration: 0.1,
      onStart: () => {
        setAct(4);
        setExplosionFactor(2);
        gsap.to(".energy-ring", {
          scale: isMobile ? 1.5 : 2.5,
          opacity: 0.2,
          duration: 2,
          ease: "expo.out"
        });
        gsap.to(".name-letter", {
          textShadow: "0 0 60px #ff4500",
          duration: 2,
          repeat: -1,
          yoyo: true
        });
      }
    })
    .to({}, { duration: 2 });

    return () => {
      tl.kill();
      clearTimeout(timer);
    };
  }, [onComplete, isMobile, isInitializing]);

  const kavyansh = profileConfig.firstName.split("");
  const saxena = profileConfig.lastName.split("");

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center perspective-1000">
      <AnimatePresence>
        {isInitializing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8"
          >
            <div className="w-full max-w-md space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-brand-red/20 rounded-full flex items-center justify-center">
                    <Cpu className="w-10 h-10 md:w-12 md:h-12 text-brand-red animate-pulse" />
                  </div>
                  <motion.div 
                    className="absolute inset-0 border-2 border-brand-red rounded-full"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ borderRightColor: 'transparent', borderLeftColor: 'transparent' }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-brand-red font-black tracking-[0.6em] text-sm md:text-lg uppercase italic">System Initializing</h2>
                  <div className="flex gap-4">
                    <ShieldCheck className="w-4 h-4 text-zinc-600" />
                    <Zap className="w-4 h-4 text-zinc-600" />
                    <Radio className="w-4 h-4 text-zinc-600 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-red shadow-[0_0_15px_#e50914]"
                    initial={{ width: 0 }}
                    animate={{ width: `${initProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest">
                  <span>Deploying Kernel...</span>
                  <span>{Math.round(initProgress)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-1">
                   <div className="text-[7px] text-zinc-600 uppercase font-bold">Performance Tier</div>
                   <div className="text-[10px] text-white font-black uppercase tracking-widest">{tier.toUpperCase()}</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-1">
                   <div className="text-[7px] text-zinc-600 uppercase font-bold">Visual Engine</div>
                   <div className="text-[10px] text-white font-black uppercase tracking-widest">WebGL 2.0</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InfernoBackground 
        isVoidMode={isVoidMode}
        fireIntensity={fireIntensity}
        explosionFactor={explosionFactor}
        emberSpeed={emberSpeed}
        tier={tier}
      />
      
      <div ref={flashRef} className="absolute inset-0 bg-white z-[120] pointer-events-none opacity-0" />

      <div ref={titleGroupRef} className="relative z-20 text-center select-none w-full px-4">
        <div className="energy-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[1000px] h-[400px] md:h-[1000px] rounded-full blur-[80px] md:blur-[150px] pointer-events-none -z-10 bg-brand-red/20 opacity-0" />

        <div className="flex flex-col gap-4 md:gap-14 mb-12 md:mb-24">
          <div className="flex justify-center gap-1 md:gap-10">
            {kavyansh.map((l, i) => (
              <span key={i} className="name-letter kavyansh-letter text-4xl md:text-[200px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-800 italic drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden leading-none">
                {l}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-1 md:gap-10">
            {saxena.map((l, i) => (
              <span key={i} className="name-letter saxena-letter text-4xl md:text-[200px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-800 italic lg:ml-40 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden leading-none">
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="legend-reveal flex items-center justify-center gap-4 md:gap-16 mb-12 md:mb-24">
          <div className="h-[2px] md:h-[4px] w-12 md:w-40 bg-gradient-to-r from-transparent to-brand-red shadow-[0_0_15px_#e50914]" />
          <span className="text-brand-red font-black tracking-[0.4em] md:tracking-[1.4em] text-sm md:text-7xl uppercase italic drop-shadow-[0_0_60px_rgba(229,9,20,0.9)] whitespace-nowrap">
            THE LEGEND
          </span>
          <div className="h-[2px] md:h-[4px] w-12 md:w-40 bg-gradient-to-l from-transparent to-brand-red shadow-[0_0_15px_#e50914]" />
        </div>

        <div className="role-reveal flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12">
           <div className="px-8 py-3 md:px-12 md:py-4 bg-white/5 border border-white/10 rounded-sm backdrop-blur-3xl relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <span className="relative z-10 text-zinc-400 tracking-[0.4em] md:tracking-[0.8em] text-[10px] md:text-xl font-black uppercase font-mono">AI/ML ENGINEER</span>
           </div>
           <div className="w-2 h-2 md:w-4 md:h-4 bg-brand-red rounded-full shadow-[0_0_30px_#e50914] animate-pulse hidden md:block" />
           <div className="px-8 py-3 md:px-12 md:py-4 bg-white/5 border border-white/10 rounded-sm backdrop-blur-3xl relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <span className="relative z-10 text-zinc-400 tracking-[0.4em] md:tracking-[0.8em] text-[10px] md:text-xl font-black uppercase font-mono">FULL-STACK DEVELOPER</span>
           </div>
        </div>
      </div>

      <div ref={portalRef} className="absolute w-60 h-60 md:w-96 md:h-96 rounded-full z-[150] pointer-events-none opacity-0 flex items-center justify-center">
         <div className="absolute inset-0 bg-brand-red rounded-full blur-[100px] md:blur-[180px] shadow-[0_0_200px_#ff4500] animate-pulse" />
         <div className="absolute inset-0 border-[20px] md:border-[40px] border-white/20 rounded-full animate-ping" />
      </div>

      <div className="absolute bottom-8 md:bottom-20 left-0 right-0 px-8 md:px-24 flex justify-between items-center z-[130]">
        <button 
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            soundManager.init();
            soundManager.setMute(nextMuted);
            if (!nextMuted) soundManager.playImpact();
          }}
          className="group flex items-center gap-4 md:gap-6 text-zinc-500 hover:text-white transition-all"
        >
          <div className="p-4 md:p-6 rounded-full border border-white/10 bg-black/60 backdrop-blur-3xl group-hover:border-brand-red/50 transition-colors">
            {isMuted ? <VolumeX className="w-6 h-6 md:w-10 md:h-10" /> : <Volume2 className="w-6 h-6 md:w-10 md:h-10" />}
          </div>
          <div className="flex flex-col items-start hidden sm:flex">
             <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-black group-hover:text-brand-red transition-colors">Audio {isMuted ? 'Off' : 'On'}</span>
             <span className="text-[8px] text-zinc-600 font-mono">CHANNEL // STEREO</span>
          </div>
        </button>

        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              onClick={onComplete}
              className="px-10 py-4 md:px-16 md:py-6 border border-white/10 text-white text-[12px] md:text-[14px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black backdrop-blur-3xl bg-black/60 hover:bg-brand-red/20 hover:border-brand-red transition-all rounded-sm skew-x-[-12deg]"
            >
              <span className="inline-block skew-x-[12deg]">Skip Intro</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-8 md:top-20 left-0 right-0 px-8 md:px-24 flex justify-center gap-3 md:gap-6 z-[130]">
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
              <div className={`h-1 md:h-1.5 w-10 md:w-32 rounded-full transition-all duration-1000 ${act >= i ? 'bg-brand-red shadow-[0_0_20px_#e50914]' : 'bg-white/5'}`} />
              <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest transition-colors ${act >= i ? 'text-brand-red' : 'text-zinc-800'}`}>Act 0{i}</span>
           </div>
         ))}
      </div>
    </div>
  );
};
