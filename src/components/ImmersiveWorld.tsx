import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Stars, 
  Float, 
  Html, 
  Text,
  OrbitControls,
  useTexture,
  Center
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { X, MapPin, Navigation, Calendar, Target, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { usePerformanceTier } from '../hooks/useDevice';

import { useScrollLock } from '../hooks/useScrollLock';

interface LocationData {
  id: string;
  city: string;
  state: string;
  country: string;
  date: string;
  caption: string;
  description: string;
  category: string;
  coordinates: [number, number];
  images: string[];
}

interface ImmersiveWorldProps {
  location: LocationData | null;
  onClose: () => void;
}

const PhotoFrame = ({ url, position, rotation, index, onSelect }: { 
  url: string; 
  position: [number, number, number]; 
  rotation: [number, number, number];
  index: number;
  onSelect: (url: string) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Subtle movement
    meshRef.current.position.y += Math.sin(time * 0.5 + index) * 0.001;
    meshRef.current.rotation.z = Math.sin(time * 0.3 + index) * 0.02;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(url)}
    >
      <planeGeometry args={[3, 4]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        opacity={hovered ? 1 : 0.8}
        roughness={0.2}
        metalness={0.8}
      />
      
      {/* HUD Frame for each photo */}
      <Html transform distanceFactor={8} position={[0, 0, 0.05]}>
        <div className={cn(
          "w-[300px] h-[400px] border-2 transition-all duration-500 flex flex-col justify-between p-4 pointer-events-none",
          hovered ? "border-brand-red shadow-[0_0_50px_rgba(229,9,20,0.5)] scale-105" : "border-white/10"
        )}>
          <div className="flex justify-between">
            <div className="w-4 h-4 border-t-2 border-l-2 border-brand-red opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">SCAN_DATA_{index}</div>
          </div>
          <div className="flex justify-end">
            <div className="w-4 h-4 border-b-2 border-r-2 border-brand-red opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Html>
    </mesh>
  );
};

const ExperienceScene = ({ location, onPhotoSelect }: { 
  location: LocationData; 
  onPhotoSelect: (url: string) => void;
}) => {
  const { camera } = useThree();
  const [revealed, setRevealed] = useState(false);
  const tier = usePerformanceTier();

  useEffect(() => {
    // Cinematic travel sequence
    const tl = gsap.timeline();
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 12,
      duration: 3,
      ease: "power3.inOut",
      onComplete: () => setRevealed(true)
    });
  }, [location, camera]);

  return (
    <>
      <Stars 
        radius={150} 
        depth={50} 
        count={tier === 'high' ? 6000 : 2000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 20]} intensity={200} color="#e50914" />
      <pointLight position={[-20, -20, -20]} intensity={100} color="#333" />
      
      {/* Floating Photo Group with entrance animation */}
      <group position={[0, 0, -5]}>
        {location.images.map((img, i) => {
          const angle = (i / location.images.length) * Math.PI * 2;
          const radius = 9;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (i - 2) * 2.5;
          
          return (
            <PhotoFrame 
              key={i}
              url={img}
              position={[x, y, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
              index={i}
              onSelect={onPhotoSelect}
            />
          );
        })}
      </group>

      {/* Atmospheric Particles */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <group>
           {[...Array(tier === 'high' ? 20 : 10)].map((_, i) => (
             <mesh key={i} position={[(Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*30]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#e50914" transparent opacity={0.3} />
             </mesh>
           ))}
        </group>
      </Float>

      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        maxDistance={25}
        minDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
};

export const ImmersiveWorld: React.FC<ImmersiveWorldProps> = ({ location, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll lock
  useScrollLock(!!location);

  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black overflow-hidden flex flex-col md:flex-row"
    >
      {/* Immersive 3D View */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ExperienceScene location={location} onPhotoSelect={setSelectedImage} />
          </Suspense>
        </Canvas>
      </div>

      {/* Cinematic HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 p-6 md:p-16 flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <motion.div 
             initial={{ x: -100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.5, duration: 1 }}
             className="flex items-center gap-6"
           >
              <div className="w-2 h-20 bg-brand-red shadow-[0_0_30px_#e50914]" />
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <Target className="w-4 h-4 text-brand-red animate-pulse" />
                    <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.4em]">Strategic Visitation Node</span>
                 </div>
                 <h2 className="text-4xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-2">
                    {location.city} <br />
                    <span className="text-brand-red font-outline-2 text-transparent">{location.country}</span>
                 </h2>
              </div>
           </motion.div>

           <button 
             onClick={onClose}
             className="pointer-events-auto p-4 bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-full text-white hover:bg-brand-red transition-all group shadow-2xl"
           >
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
           </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180 hidden md:block">
              EXPLORING DIGITAL CONTINUUM // 360° MODE
           </div>
           
           {/* Premium Location Panel (Bottom Right) */}
           <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.8, duration: 1 }}
             className="pointer-events-auto w-full md:w-[450px] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
           >
              {/* Decorative Accent Lines */}
              <div className="absolute top-0 right-0 w-32 h-[1px] bg-brand-red/30" />
              <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-brand-red/30" />
              <div className="absolute top-0 right-0 w-[1px] h-32 bg-brand-red/30" />
              <div className="absolute bottom-0 left-0 w-[1px] h-32 bg-brand-red/30" />

              <div className="relative z-10 space-y-10">
                 <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{location.id === 'build-arena-noida' ? 'MICROSOFT OFFICE' : location.city.toUpperCase()}</h3>
                        <p className="text-brand-red text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em]">{location.city.toUpperCase()}, {location.state.toUpperCase()}</p>
                     </div>
                    <div className="p-3 bg-brand-red/10 rounded-xl border border-brand-red/20">
                       <Navigation className="w-6 h-6 text-brand-red animate-pulse" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">MISSION PARAMETER</div>
                    <div className="text-xl md:text-2xl text-white font-black italic tracking-tight">{location.caption}</div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> TIMESTAMP
                       </div>
                       <div className="text-white font-black text-sm uppercase">{location.date}</div>
                    </div>
                    <div className="space-y-2">
                       <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3 h-3" /> STATUS
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">EVENT LOCATION</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">GLOBAL COORDINATES</div>
                    <div className="text-3xl md:text-5xl font-black text-white tracking-tighter italic leading-none">
                       {location.coordinates[0]} <span className="text-brand-red font-light">//</span> {location.coordinates[1]}
                    </div>
                 </div>
              </div>

              {/* Animated Reticle Effect */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 pointer-events-none">
                 <div className="w-full h-full border-2 border-brand-red rounded-full animate-spin-slow flex items-center justify-center">
                    <div className="w-3/4 h-[1px] bg-brand-red" />
                    <div className="h-3/4 w-[1px] bg-brand-red" />
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Full-screen Photo Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/98 flex items-center justify-center p-6 md:p-16"
          >
            <motion.div 
              initial={{ scale: 0.8, rotateX: 20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, rotateX: -20 }}
              className="relative max-w-7xl max-h-full"
            >
              <img 
                src={selectedImage} 
                className="max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(229,9,20,0.3)] border border-white/10" 
                alt="High Resolution View" 
              />
              
              <div className="absolute -top-16 left-0 right-0 flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-brand-red rounded-full animate-ping" />
                  <span className="text-white font-black text-sm tracking-widest uppercase italic">PHOTOGRAPHIC_DATA_SOURCE</span>
                </div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="p-4 bg-white/5 hover:bg-brand-red text-white transition-all rounded-full backdrop-blur-xl border border-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute top-1/2 -left-20 -translate-y-1/2">
                 <button 
                   onClick={() => {
                     const idx = location.images.indexOf(selectedImage);
                     setSelectedImage(location.images[(idx - 1 + location.images.length) % location.images.length]);
                   }}
                   className="p-6 bg-white/5 hover:bg-brand-red text-white rounded-full transition-all"
                 >
                    <Navigation className="w-8 h-8 -rotate-90" />
                 </button>
              </div>

              <div className="absolute top-1/2 -right-20 -translate-y-1/2">
                 <button 
                   onClick={() => {
                     const idx = location.images.indexOf(selectedImage);
                     setSelectedImage(location.images[(idx + 1) % location.images.length]);
                   }}
                   className="p-6 bg-white/5 hover:bg-brand-red text-white rounded-full transition-all"
                 >
                    <Navigation className="w-8 h-8 rotate-90" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
