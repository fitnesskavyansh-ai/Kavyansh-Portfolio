import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapPin, Globe, ChevronRight, X, ZoomIn, Calendar, Navigation, Search } from 'lucide-react';
import worldData from '../data/my-world.json';
import { ImmersiveWorld } from './ImmersiveWorld';
import { useScrollLock } from '../hooks/useScrollLock';

export const MyWorld: React.FC = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="my-world" ref={containerRef} className="py-24 md:py-40 px-6 md:px-16 bg-black relative overflow-hidden perspective-2000">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-brand-red/5 rounded-full blur-[150px] md:blur-[250px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-burgundy/5 rounded-full blur-[150px] md:blur-[200px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div style={{ opacity }} className="mb-16 md:mb-28 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
             <div className="p-2 bg-brand-red/10 rounded-lg border border-brand-red/20">
               <Globe className="w-5 h-5 text-brand-red animate-spin-slow" />
             </div>
             <span className="text-[10px] md:text-[12px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[1em]">PLACES I'VE BEEN</span>
          </div>
          <h2 className="text-5xl md:text-[10rem] font-black text-white mb-6 md:mb-8 tracking-tighter uppercase italic leading-none">
            MY <span className="text-brand-red text-transparent bg-clip-text bg-gradient-to-b from-brand-red to-brand-burgundy drop-shadow-[0_0_50px_rgba(229,9,20,0.3)]">WORLD</span>
          </h2>
          <p className="text-zinc-500 max-w-3xl text-lg md:text-2xl font-light leading-relaxed mx-auto lg:mx-0">
            A high-fidelity record of global synchronization across multiple continental nodes and strategic visitations.
          </p>
        </motion.div>

        {/* 3D Perspective Grid */}
        <motion.div 
          style={{ rotateX }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {worldData.map((album, i) => (
            <WorldCard 
              key={album.id} 
              album={album} 
              index={i} 
              onClick={() => setSelectedAlbum(album)} 
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <ImmersiveWorld 
            location={selectedAlbum} 
            onClose={() => setSelectedAlbum(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const WorldCard: React.FC<{ album: any; index: number; onClick: () => void }> = ({ album, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: index % 2 === 0 ? 10 : -10 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group relative aspect-[3/4] bg-zinc-900/40 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-red/40 transition-all duration-700 shadow-2xl hover:shadow-brand-red/10"
    >
      <img 
        src={album.images[0] || `https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop`} 
        alt={album.city}
        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100"
      />
      
      {/* Scanline HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 opacity-30 group-hover:opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
      
      {/* Floating Corner Accents */}
      <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-white/10 group-hover:border-brand-red transition-all duration-500 z-30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-white/10 group-hover:border-brand-red transition-all duration-500 z-30" />

      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-30">
        <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
          <span className="px-4 py-2 bg-brand-red text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] skew-x-[-12deg] inline-block shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            <span className="inline-block skew-x-[12deg]">{album.category}</span>
          </span>
        </div>
        
        <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none group-hover:text-brand-red transition-colors">{album.city}</h3>
        
        <div className="flex items-center gap-3 text-zinc-400 text-[11px] md:text-[13px] font-bold mb-6 uppercase tracking-[0.2em]">
           <MapPin className="w-4 h-4 text-brand-red" />
           {album.state}, {album.country}
        </div>

        <div className="h-[1px] w-0 group-hover:w-full bg-brand-red/50 transition-all duration-700 mb-6" />

        <button className="flex items-center gap-3 text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] group-hover:translate-x-2 transition-all">
           Synchronize <ChevronRight className="w-4 h-4 text-brand-red" />
        </button>
      </div>
    </motion.div>
  );
};

const WorldGallery: React.FC<{ album: any }> = ({ album }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useScrollLock(!!activeImage);

  return (
    <div className="space-y-12 md:space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
         <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-brand-red/10 rounded-full">
                  <Calendar className="w-6 h-6 text-brand-red" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Entry Date</div>
                  <div className="text-xl md:text-2xl text-white font-black italic">{album.date}</div>
               </div>
            </div>
            <p className="text-3xl md:text-5xl text-white font-black italic tracking-tighter leading-tight drop-shadow-2xl">{album.caption}</p>
            <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">{album.description}</p>
         </div>

         <div className="p-8 md:p-12 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.05),transparent)]" />
            
            <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-5">
                  <Navigation className="w-8 h-8 text-brand-red animate-pulse" />
                  <div>
                     <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Coordinates</div>
                     <div className="text-white font-mono text-lg md:text-2xl tracking-tighter">{album.coordinates.join(" // ")}</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</div>
                  <div className="text-green-500 text-sm md:text-base font-black uppercase tracking-widest animate-pulse">LINK ACTIVE</div>
               </div>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Signal Strength</div>
                  <div className="flex gap-1">
                     {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-4 w-1.5 rounded-full ${i <= 4 ? 'bg-brand-red' : 'bg-zinc-800'}`} />)}
                  </div>
               </div>
               <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-[9px] font-bold text-zinc-600 uppercase mb-1">Encryption</div>
                  <div className="text-xs text-white font-mono uppercase">AES-256-GCM</div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {album.images.length > 0 ? album.images.map((img: string, i: number) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveImage(img)}
            className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in bg-zinc-900 group relative border border-white/5 hover:border-brand-red/50 transition-all duration-500 shadow-xl"
          >
            <img src={img} alt={`${album.city} ${i}`} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <ZoomIn className="w-10 h-10 text-white scale-50 group-hover:scale-100 transition-transform duration-500" />
            </div>
            
            {/* HUD element on each photo */}
            <div className="absolute top-4 left-4 p-1.5 bg-black/60 backdrop-blur-md rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="text-[8px] font-black text-white uppercase tracking-tighter">REF: {album.city.substring(0,3).toUpperCase()}-{i.toString().padStart(3,'0')}</div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-24 md:py-40 text-center border-2 border-dashed border-white/5 rounded-3xl bg-zinc-900/20">
             <Search className="w-12 h-12 text-zinc-800 mx-auto mb-6 animate-pulse" />
             <span className="text-zinc-600 text-sm md:text-lg font-black uppercase tracking-[0.6em]">No visual data detected in this node.</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeImage && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-16">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveImage(null)}
               className="absolute inset-0 bg-black/98 backdrop-blur-[40px]"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
               animate={{ opacity: 1, scale: 1, rotateX: 0 }}
               exit={{ opacity: 0, scale: 0.8, rotateX: -20 }}
               className="relative max-w-7xl max-h-full aspect-auto z-[610] group perspective-1000"
             >
                <div className="absolute -inset-4 bg-brand-red/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <img src={activeImage} className="max-h-[80vh] md:max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10" alt="Full Resolution" />
                
                <div className="absolute -top-16 left-0 right-0 flex justify-between items-center px-4">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-brand-red rounded-full animate-ping" />
                      <span className="text-white font-black text-sm tracking-widest uppercase italic">HIGH_RES_PREVIEW</span>
                   </div>
                   <button 
                     onClick={() => setActiveImage(null)}
                     className="p-3 bg-white/5 hover:bg-brand-red text-white transition-all rounded-full backdrop-blur-xl border border-white/10"
                   >
                      <X className="w-6 h-6" />
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
