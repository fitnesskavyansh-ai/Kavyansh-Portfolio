import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, MapPin, Activity, Zap } from 'lucide-react';
import projectsData from '../data/projects.json';
import worldData from '../data/my-world.json';

export const FeaturedHighlights: React.FC = () => {
  const featuredProject = projectsData.find(p => p.featured) || projectsData[0];
  const featuredMemory = worldData.find(w => w.featured) || worldData[0];

  return (
    <section id="featured" className="px-6 md:px-16 py-24 md:py-40 bg-black relative overflow-hidden perspective-2000">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-brand-red/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-16 md:mb-24"
        >
          <div className="p-3 bg-brand-red/10 rounded-lg border border-brand-red/20 shadow-[0_0_20px_rgba(229,9,20,0.2)]">
            <Star className="w-5 h-5 text-brand-red animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] md:text-[12px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[1em]">High-Priority Transmissions</span>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-3 h-3 text-brand-red animate-pulse" />
              <span className="text-[8px] text-brand-red font-mono uppercase tracking-widest">Live Feed Active</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Featured Project */}
          <HighlightCard 
            title={featuredProject.title}
            description={featuredProject.description}
            image={featuredProject.image}
            tag="FEATURED DEPLOYMENT"
            type="project"
            tech={featuredProject.tech.slice(0, 3)}
          />

          {/* Featured Memory */}
          <HighlightCard 
            title={featuredMemory.city}
            description={featuredMemory.caption}
            image={featuredMemory.images[0] || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070'}
            tag="LATEST MEMORY"
            type="memory"
            location={`${featuredMemory.state}, ${featuredMemory.country}`}
          />
        </div>
      </div>
    </section>
  );
};

const HighlightCard: React.FC<{ 
  title: string; 
  description: string; 
  image: string; 
  tag: string; 
  type: 'project' | 'memory';
  tech?: string[];
  location?: string;
}> = ({ title, description, image, tag, type, tech, location }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: type === 'project' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden border border-white/5 bg-zinc-900/40 flex flex-col justify-end p-10 md:p-16 hover:border-brand-red/30 transition-all duration-700 shadow-2xl"
    >
       {/* Background Image with Parallax-like effect */}
       <div 
         className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-20 group-hover:opacity-40" 
         style={{ backgroundImage: `url(${image})` }} 
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
       
       {/* HUD Scanlines */}
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 opacity-40 mix-blend-overlay" />
       
       {/* UI Elements */}
       <div className="relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className={`px-4 py-2 ${type === 'project' ? 'bg-brand-red' : 'bg-zinc-800'} text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] skew-x-[-12deg] inline-block shadow-[0_0_30px_rgba(229,9,20,0.3)]`}>
              <span className="flex items-center gap-2 skew-x-[12deg]">
                <Zap className="w-3 h-3 fill-white" />
                {tag}
              </span>
            </span>
          </motion.div>

          <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-4 md:mb-6 leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">{title}</h3>
          
          {location && (
            <div className="flex items-center gap-3 text-brand-red text-[12px] md:text-[14px] font-black mb-6 uppercase tracking-[0.3em] italic">
               <MapPin className="w-4 h-4 text-brand-red animate-bounce" />
               {location}
            </div>
          )}

          <p className="text-zinc-400 text-lg md:text-2xl font-light max-w-lg mb-8 md:mb-12 line-clamp-3 md:line-clamp-none leading-relaxed">{description}</p>
          
          <div className="flex items-center gap-6 md:gap-10">
             <button className="flex items-center gap-3 text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] text-white hover:text-brand-red transition-all group/btn">
                <span className="border-b border-white/20 group-hover/btn:border-brand-red py-1">Secure Access</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-brand-red transform group-hover/btn:translate-x-2 transition-transform" />
             </button>
             
             {tech && (
                <>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="flex gap-4 md:gap-6 overflow-hidden">
                     {tech.map(t => (
                       <span key={t} className="text-[9px] md:text-[11px] font-black text-zinc-600 uppercase tracking-widest whitespace-nowrap border border-white/5 px-2 py-1 rounded bg-white/5">{t}</span>
                     ))}
                  </div>
                </>
             )}

             {type === 'memory' && (
                <div className="ml-auto hidden sm:flex items-center gap-3 text-zinc-500 text-[10px] font-mono">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   SYNC_COMPLETE
                </div>
             )}
          </div>
       </div>

       {/* Corner Accents */}
       <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/5 group-hover:border-brand-red/20 transition-all duration-700" />
       <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/5 group-hover:border-brand-red/20 transition-all duration-700" />
    </motion.div>
  );
};
