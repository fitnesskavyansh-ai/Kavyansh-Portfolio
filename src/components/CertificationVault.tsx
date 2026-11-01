import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Html, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Search, Award, ShieldCheck, Terminal, Hash, X, ExternalLink, Shield } from 'lucide-react';
import certsDataRaw from '../data/certificates.json';
import { usePerformanceTier } from '../hooks/useDevice';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verificationUrl: string;
  verified: boolean;
  category: string;
  image?: string;
  verifyLink?: string;
}

const certsData = certsDataRaw as Certificate[];

const CertPanel = ({ 
  cert, 
  position, 
  rotation,
  onSelect,
  isSelected
}: { 
  cert: any, 
  position: [number, number, number], 
  rotation: [number, number, number],
  onSelect: (c: any) => void,
  isSelected: boolean
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={1}
      position={position}
      rotation={rotation}
    >
      <mesh 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(cert);
        }}
      >
        <planeGeometry args={[3, 4.2]} />
        <meshStandardMaterial 
          transparent 
          opacity={0} 
        />
        
        <Html transform distanceFactor={5} portal={{ current: document.body }}>
          <div 
            className={`w-[300px] aspect-[1/1.4] bg-gradient-to-br from-zinc-800 to-black border-2 transition-all duration-700 cursor-pointer overflow-hidden group relative ${
              hovered ? 'border-brand-red scale-105 shadow-[0_0_50px_#e5091444]' : 'border-white/10'
            } ${isSelected ? 'opacity-0' : 'opacity-100'}`}
          >
            {/* Futuristic Metallic Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-30" />
            
            <div className="p-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`p-4 bg-black/40 rounded-xl border transition-all duration-500 ${hovered ? 'border-brand-red bg-brand-red/10' : 'border-white/10'}`}>
                  <Award className={`w-10 h-10 transition-colors ${cert.category === 'microsoft' ? 'text-blue-500' : 'text-brand-red'}`} />
                </div>
                {cert.verified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Verified</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-brand-red font-black uppercase tracking-[0.2em] mb-2 block">{cert.issuer}</span>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-brand-red transition-colors">{cert.title}</h4>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-500">ID: {cert.credentialId.slice(0, 8)}</span>
                  <span className="text-[8px] font-mono text-zinc-500">{cert.date}</span>
                </div>
              </div>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-red/40 -translate-y-full group-hover:animate-scan" />
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

const VaultCameraController = ({ isLocked }: { isLocked: boolean }) => {
  const scroll = useScroll();
  const { camera } = useThree();
  
  // Straight hallway path
  const curve = useMemo(() => {
    return new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, -100)
    );
  }, []);

  useFrame((state) => {
    if (isLocked) return;
    
    const offset = scroll.offset;
    const point = curve.getPoint(offset);
    
    state.camera.position.lerp(point, 0.05);
    state.camera.lookAt(0, 0, point.z - 10);
    
    // Parallax
    state.camera.position.x += (state.mouse.x * 3 - state.camera.position.x) * 0.02;
    state.camera.position.y += (-state.mouse.y * 3 - state.camera.position.y) * 0.02;
  });

  return null;
};

const VaultScene = ({ onSelect, selectedCert }: { onSelect: (c: any) => void, selectedCert: any }) => {
  const tier = usePerformanceTier();
  
  const certPositions = useMemo(() => {
    return certsData.map((_, i) => ({
      pos: [(i % 2 === 0 ? -6 : 6), (i % 3 - 1) * 2, -i * 12],
      rot: [0, (i % 2 === 0 ? 0.3 : -0.3), 0]
    }));
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#e50914" intensity={100} />
      <pointLight position={[-10, -10, -10]} color="#00ffff" intensity={50} />
      
      {certsData.map((cert, i) => (
        <CertPanel 
          key={cert.id}
          cert={cert}
          position={certPositions[i].pos as any}
          rotation={certPositions[i].rot as any}
          onSelect={onSelect}
          isSelected={selectedCert?.id === cert.id}
        />
      ))}
      
      <VaultCameraController isLocked={!!selectedCert} />
      <Environment preset="night" />
      <fog attach="fog" args={['#000000', 5, 80]} />
    </>
  );
};

import { useScrollLock } from '../hooks/useScrollLock';

export const CertificationVault: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll lock
  useScrollLock(!!selectedCert);

  const filteredCerts = useMemo(() => {
    return (certsData as Certificate[]).filter(cert => 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <section id="certificates" className="h-[400vh] bg-black relative">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* HUD Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none pt-24 md:pt-40 pb-12 md:pb-24 px-6 md:px-16 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6 md:gap-8">
              <div className="relative">
                <div className="p-4 md:p-6 bg-brand-red rounded-xl md:rounded-2xl shadow-[0_0_40px_#e5091466] relative z-10">
                  <Award className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-brand-red/20 rounded-2xl blur-xl animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 md:mb-4">
                  <Terminal className="w-4 h-4 text-brand-red" />
                  <span className="text-[10px] md:text-[12px] font-black text-brand-red uppercase tracking-[0.4em] md:tracking-[0.8em]">Validated Credentials</span>
                </div>
                <h3 className="text-4xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-none">
                  INTEL <span className="text-transparent font-outline-2 text-white">VAULT</span>
                </h3>
              </div>
            </div>

            <div className="relative w-full md:w-96 group pointer-events-auto hidden lg:block">
              <div className="absolute inset-0 bg-brand-red/5 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-red transition-colors" />
              <input 
                type="text" 
                placeholder="SCAN ARCHIVES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-xl py-4 md:py-5 pl-14 pr-8 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] focus:border-brand-red/50 focus:outline-none transition-all placeholder:text-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
             <div className="flex items-center gap-4 text-zinc-500">
                <div className="p-2 bg-brand-red/10 rounded-lg border border-brand-red/30">
                  <ShieldCheck className="w-4 h-4 text-brand-red" />
                </div>
                <div>
                  <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white">Security Protocol 77-B</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-3 h-3 text-brand-red" />
                    <span className="text-[10px] font-black text-zinc-600 tracking-widest">{filteredCerts.length} ASSETS DEPLOYED</span>
                  </div>
                </div>
             </div>
             
             <div className="max-w-xs text-right hidden md:block">
               <p className="text-zinc-600 text-[9px] uppercase tracking-widest leading-relaxed">
                 Accessing encrypted achievement archives. All credentials verified via neural-link protocol.
               </p>
             </div>
          </div>
        </div>

        {/* 3D Scene or Empty State */}
        <div className="absolute inset-0 z-10">
          {certsData.length > 0 ? (
            <Suspense fallback={null}>
              <Canvas camera={{ fov: 60 }}>
                <ScrollControls pages={Math.max(2, Math.ceil(certsData.length / 2))} damping={0.2} distance={1}>
                  <VaultScene onSelect={setSelectedCert} selectedCert={selectedCert} />
                </ScrollControls>
              </Canvas>
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950/20 backdrop-blur-3xl">
              <div className="flex flex-col items-center gap-12 text-center px-6">
                <div className="relative group">
                   <div className="w-32 h-32 md:w-48 md:h-48 border border-brand-red/20 rounded-full flex items-center justify-center relative z-10 group-hover:border-brand-red/50 transition-colors">
                      <Shield className="w-12 h-12 md:w-20 md:h-20 text-brand-red animate-pulse" />
                   </div>
                   <div className="absolute -inset-4 border border-brand-red/10 rounded-full animate-ping" />
                   <div className="absolute -inset-8 border border-brand-red/5 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-6 max-w-2xl">
                  <h4 className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                    ACHIEVEMENT ARCHIVE <span className="text-brand-red">LOCKED</span>
                  </h4>
                  <p className="text-zinc-500 text-xs md:text-base font-mono uppercase tracking-[0.2em] leading-relaxed">
                    YOUR ACHIEVEMENTS DESERVE THEIR OWN SPOTLIGHT. <br/>
                    WAITING FOR VALIDATED CREDENTIAL UPLOAD...
                  </p>
                  
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-2 h-2 bg-brand-red/30 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Viewer */}
      <AnimatePresence>
        {selectedCert && (
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
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(229,9,20,0.2)]"
            >
              <div className="flex flex-col md:flex-row">
                {/* Certificate Image */}
                <div className="w-full md:w-2/3 bg-black aspect-[1.4/1] md:aspect-auto flex items-center justify-center p-8">
                  <div className="relative w-full h-full border-4 border-white/5 rounded-xl overflow-hidden shadow-2xl group">
                    <img 
                      src={selectedCert.image} 
                      className="w-full h-full object-contain"
                      alt={selectedCert.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2070";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Intel Side */}
                <div className="w-full md:w-1/3 p-10 md:p-12 border-t md:border-t-0 md:border-l border-white/10 bg-gradient-to-br from-zinc-900 to-black">
                   <div className="space-y-10">
                     <div className="flex justify-between items-start">
                       <div className="p-4 bg-brand-red/10 rounded-2xl border border-brand-red/30">
                         <Award className="w-10 h-10 text-brand-red" />
                       </div>
                       <button 
                         onClick={() => setSelectedCert(null)}
                         className="p-3 rounded-xl hover:bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-all"
                       >
                         <X className="w-6 h-6" />
                       </button>
                     </div>

                     <div>
                       <div className="flex items-center gap-3 text-brand-red mb-3">
                         <Shield className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Data</span>
                       </div>
                       <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{selectedCert.title}</h3>
                       <p className="text-brand-red text-sm font-black uppercase tracking-widest">{selectedCert.issuer}</p>
                     </div>

                     <div className="space-y-6">
                        <div>
                          <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Credential UID</span>
                          <span className="text-white font-mono text-xs">{selectedCert.credentialId}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Acquisition Date</span>
                          <span className="text-white font-bold">{selectedCert.date}</span>
                        </div>
                     </div>

                     <a 
                       href={selectedCert.verifyLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-red hover:text-white transition-all group"
                     >
                       Verify Integrity
                       <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                     </a>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

