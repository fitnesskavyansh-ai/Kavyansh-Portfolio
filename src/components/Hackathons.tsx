import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Text, Html, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Trophy, MapPin, Calendar, Terminal, ShieldAlert, X, ChevronLeft, ChevronRight } from 'lucide-react';
import hackathonsData from '../data/hackathons.json';
import { usePerformanceTier } from '../hooks/useDevice';

const EventPanel = ({ 
  event, 
  position, 
  rotation,
  onSelect,
  isSelected
}: { 
  event: any, 
  position: [number, number, number], 
  rotation: [number, number, number],
  onSelect: (e: any) => void,
  isSelected: boolean
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Floating animation paths
  const floatIntensity = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const floatSpeed = useMemo(() => 1 + Math.random() * 2, []);

  return (
    <Float 
      speed={floatSpeed} 
      rotationIntensity={floatIntensity} 
      floatIntensity={floatIntensity}
      position={position}
      rotation={rotation}
    >
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(event);
        }}
      >
        <planeGeometry args={[4, 2.25]} />
        <meshStandardMaterial 
          transparent 
          opacity={0} 
          side={THREE.DoubleSide}
        />
        
        <Html transform distanceFactor={5} portal={{ current: document.body }}>
          <div 
            className={`w-[450px] aspect-video bg-zinc-900/90 border-2 transition-all duration-700 cursor-pointer overflow-hidden group relative ${
              hovered ? 'border-brand-red scale-105 shadow-[0_0_50px_#e5091488]' : 'border-white/10'
            } ${isSelected ? 'opacity-0' : 'opacity-100'}`}
          >
            {/* Metallic Frame Detail */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <img 
              src={`/assets/${event.category}/${event.folder}/cover.jpg`} 
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-red/20 rounded border border-brand-red/30">
                  <Trophy className="w-4 h-4 text-brand-red shadow-[0_0_10px_#e50914]" />
                </div>
                <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">{event.achievements}</span>
              </div>
              <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-brand-red transition-colors">{event.title}</h4>
            </div>
            
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className="px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-xl text-zinc-400 text-[8px] font-black uppercase tracking-widest skew-x-[-15deg]">
                <span className="inline-block skew-x-[15deg]">{event.date}</span>
              </div>
            </div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

const CameraController = ({ isLocked }: { isLocked: boolean }) => {
  const scroll = useScroll();
  const { camera } = useThree();
  
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),
      new THREE.Vector3(8, 4, -10),
      new THREE.Vector3(-10, -4, -40),
      new THREE.Vector3(12, 2, -70),
      new THREE.Vector3(-8, 6, -100),
      new THREE.Vector3(0, 2, -130),
    ]);
  }, []);

  useFrame((state, delta) => {
    if (isLocked) return;
    
    const offset = scroll.offset;
    const point = curve.getPoint(offset);
    const lookAtPoint = curve.getPoint(Math.min(offset + 0.05, 1));
    
    state.camera.position.lerp(point, 0.05);
    state.camera.lookAt(lookAtPoint);
    
    // Subtle rotation based on mouse
    state.camera.position.x += (state.mouse.x * 2 - state.camera.position.x) * 0.01;
    state.camera.position.y += (-state.mouse.y * 2 - state.camera.position.y) * 0.01;
  });

  return null;
};

const HackathonScene = ({ onSelect, selectedEvent }: { onSelect: (e: any) => void, selectedEvent: any }) => {
  const tier = usePerformanceTier();
  
  const eventPositions = useMemo(() => [
    { pos: [2, 0, 0], rot: [0, -0.2, 0] },
    { pos: [-4, 3, -25], rot: [0.1, 0.3, 0] },
    { pos: [6, -2, -50], rot: [-0.1, -0.2, 0.1] },
    { pos: [-8, 2, -80], rot: [0, 0.4, -0.1] },
    { pos: [4, 5, -110], rot: [0.2, -0.3, 0] },
  ], []);

  return (
    <>
      <Stars radius={150} depth={50} count={tier === 'high' ? 5000 : 2000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 20, 20]} color="#e50914" intensity={200} />
      <pointLight position={[-20, -20, -20]} color="#e50914" intensity={100} />
      
      {hackathonsData.map((event, i) => (
        <EventPanel 
          key={event.id}
          event={event}
          position={eventPositions[i].pos as any}
          rotation={eventPositions[i].rot as any}
          onSelect={onSelect}
          isSelected={selectedEvent?.id === event.id}
        />
      ))}
      
      <CameraController isLocked={!!selectedEvent} />
      <Environment preset="night" />
      
      {/* Volumetric Fog */}
      <fog attach="fog" args={['#000000', 10, 150]} />
    </>
  );
};

import { useScrollLock } from '../hooks/useScrollLock';

export const Hackathons: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Scroll lock
  useScrollLock(!!selectedEvent);

  return (
    <section id="hackathons" className="h-[400vh] bg-black relative">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* HUD Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none pt-24 md:pt-40 pb-12 md:pb-24 px-6 md:px-16 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6"
            >
              <div className="w-1.5 h-16 bg-brand-red shadow-[0_0_20px_#e50914]" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Terminal className="w-4 h-4 text-brand-red" />
                  <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.4em]">Combat Experience</span>
                </div>
                <h2 className="text-4xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                  HACKATHON <span className="text-transparent font-outline-2 text-white">RECAP</span>
                </h2>
              </div>
            </motion.div>
            
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-brand-red/10 border border-brand-red/30 text-brand-red text-[10px] font-black uppercase tracking-widest rounded-lg backdrop-blur-xl">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                Live Connection
              </div>
              <span className="text-[10px] font-mono text-zinc-700">COORD: 45.322 / -12.455</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180 mb-10">
              SCROLL TO NAVIGATE DIGITAL VOID
            </div>
            <div className="max-w-xs text-right">
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest leading-relaxed">
                Navigating through high-intensity 24-48 hour rapid development cycles. Witnessing the evolution of digital architecture in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          <Suspense fallback={null}>
            <Canvas>
              <ScrollControls pages={4} damping={0.2} distance={1}>
                <HackathonScene onSelect={setSelectedEvent} selectedEvent={selectedEvent} />
              </ScrollControls>
            </Canvas>
          </Suspense>
        </div>
      </div>

      {/* Cinematic Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-7xl max-h-[90vh] bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <div className="absolute top-6 right-6 z-50">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-4 bg-brand-red text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_#e50914]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Gallery Side */}
              <div className="w-full md:w-2/3 relative group overflow-hidden bg-black">
                 <img 
                   src={`/assets/${selectedEvent.category}/${selectedEvent.folder}/cover.jpg`} 
                   className="w-full h-full object-cover opacity-70"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070";
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                 
                 <div className="absolute bottom-10 left-10 flex gap-4">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-20 md:w-32 aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-brand-red transition-all cursor-pointer">
                        <img 
                          src={`/assets/${selectedEvent.category}/${selectedEvent.folder}/photo-${i}.jpg`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070";
                          }}
                        />
                     </div>
                   ))}
                 </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/3 p-10 md:p-16 flex flex-col justify-between overflow-y-auto bg-gradient-to-br from-zinc-900 to-black">
                 <div className="space-y-10">
                   <div>
                     <div className="flex items-center gap-3 text-brand-red mb-4">
                       <Terminal className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Report</span>
                     </div>
                     <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4">{selectedEvent.title}</h3>
                     <div className="h-1 w-20 bg-brand-red" />
                   </div>

                   <p className="text-zinc-400 text-lg leading-relaxed font-light">{selectedEvent.description}</p>

                   <div className="grid grid-cols-2 gap-8">
                     <div>
                       <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Location</span>
                       <span className="text-white font-bold">{selectedEvent.location}</span>
                     </div>
                     <div>
                       <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Timestamp</span>
                       <span className="text-white font-bold">{selectedEvent.date}</span>
                     </div>
                   </div>

                   <div>
                     <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-4">The Squad</span>
                     <div className="flex flex-wrap gap-2">
                       {selectedEvent.team.map((m: string) => (
                         <span key={m} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-zinc-300 font-black uppercase tracking-widest">{m}</span>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="pt-10 mt-10 border-t border-white/5 flex items-center gap-4">
                   <div className="p-3 bg-brand-red/10 rounded-xl border border-brand-red/30">
                     <Trophy className="w-6 h-6 text-brand-red" />
                   </div>
                   <span className="text-xl font-black text-white italic uppercase tracking-tighter">{selectedEvent.achievements}</span>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
