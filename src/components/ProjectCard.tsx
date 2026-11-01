import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Play, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTouchDevice } from '../hooks/useDevice';

interface ProjectCardProps {
  project: any;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const isTouch = useTouchDevice();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Rotate values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  // Glare values
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["20%", "80%"]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.4, 0, 0.4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const xPct = (mouseX / width) - 0.5;
      const yPct = (mouseY / height) - 0.5;
      
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isTouch ? 0 : rotateX,
        rotateY: isTouch ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative min-w-[300px] sm:min-w-[450px] md:min-w-[650px] aspect-[16/9] bg-zinc-950 rounded-[32px] overflow-hidden cursor-pointer border border-white/5 hover:border-brand-red/40 transition-colors duration-700 shadow-2xl"
    >
      {/* Glare Effect */}
      {!isTouch && (
        <motion.div 
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)`,
            left: glareX,
            top: glareY,
            opacity: glareOpacity,
          }}
          className="absolute w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        />
      )}

      {/* Image Layer with Parallax */}
      <motion.div 
        style={{
          transform: isTouch ? "none" : "translateZ(-30px) scale(1.05)",
        }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.4] contrast-[1.1] group-hover:grayscale-0 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
      </motion.div>
      
      {/* Content Layer */}
      <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end z-20" style={{ transform: "translateZ(60px)" }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easing }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[2px] w-12 bg-brand-red shadow-[0_0_15px_#e50914]" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-brand-red">Active Sequence // 0{project.id}</span>
          <ShieldCheck className="w-4 h-4 text-brand-red" />
        </motion.div>
        
        <h4 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 uppercase italic tracking-tighter group-hover:text-brand-red transition-colors duration-500 leading-[0.9]">
          {project.title}
        </h4>
        
        <p className="text-zinc-400 text-sm md:text-lg mb-8 md:mb-12 max-w-xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0 font-light">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-10 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-6 group-hover:translate-y-0">
          {project.tech.map((t: string) => (
            <span key={t} className="text-[9px] md:text-[10px] font-black border border-white/10 bg-white/5 px-4 py-1.5 text-zinc-300 uppercase tracking-widest rounded-full backdrop-blur-md">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 translate-y-6 group-hover:translate-y-0">
          <button className="flex items-center gap-4 px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-brand-red hover:text-white transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] group/btn">
            <Play className="w-4 h-4 fill-current group-hover/btn:scale-125 transition-transform" />
            Initialize
          </button>
          <a 
            href={project.links.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-4 border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all rounded-xl backdrop-blur-md active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-white/10 group-hover:border-brand-red/50 transition-all duration-700" />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-white/10 group-hover:border-brand-red/50 transition-all duration-700" />
      
      <div className="absolute top-10 left-10">
        <div className={cn(
          "px-5 py-1.5 text-[10px] md:text-[11px] font-black rounded-lg uppercase tracking-[0.3em] skew-x-[-15deg] border backdrop-blur-xl transition-all duration-700",
          project.status === "Production" 
            ? "bg-green-500/10 text-green-400 border-green-500/30 group-hover:bg-green-500 group-hover:text-white" 
            : "bg-blue-500/10 text-blue-400 border-blue-500/30 group-hover:bg-blue-500 group-hover:text-white"
        )}>
          <span className="inline-block skew-x-[15deg]">{project.status}</span>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
};

