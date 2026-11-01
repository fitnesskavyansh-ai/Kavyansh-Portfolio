import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Code2, Database, Globe, Cloud, Terminal, ChevronRight } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Html, Text, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import skillsData from '../data/skills.json';
import { usePerformanceTier, PerformanceTier } from '../hooks/useDevice';

const categoryIcons: Record<string, any> = {
  "Programming": Code2,
  "Frontend": Globe,
  "Backend": Cpu,
  "AI & ML": Zap,
  "Database": Database,
  "Cloud & Tools": Cloud
};

const SkillPlanet = ({ 
  name, 
  icon: Icon, 
  index, 
  total, 
  active, 
  onClick, 
  radius,
  tier
}: { 
  name: string, 
  icon: any, 
  index: number, 
  total: number, 
  active: boolean, 
  onClick: () => void,
  radius: number,
  tier: PerformanceTier
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Orbit logic
  const speed = 0.2 + (index * 0.05);
  const initialAngle = (index / total) * Math.PI * 2;
  
  useFrame((state) => {
    if (orbitRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      orbitRef.current.rotation.y = t + initialAngle;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  const segments = tier === 'low' ? 16 : tier === 'medium' ? 24 : 32;

  return (
    <group ref={orbitRef}>
      <group position={[radius, 0, 0]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh 
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <sphereGeometry args={[active ? 0.6 : 0.4, segments, segments]} />
            <MeshDistortMaterial 
              color={active ? "#e50914" : hovered ? "#ffffff" : "#333333"}
              speed={active ? 3 : 1}
              distort={active ? 0.4 : 0.2}
              metalness={0.8}
              roughness={0.2}
              emissive={active ? "#e50914" : "#000000"}
              emissiveIntensity={active ? 1.5 : 0}
            />
          </mesh>

          {/* Label */}
          <Html position={[0, active ? 1 : 0.8, 0]} center distanceFactor={10}>
            <div className={`pointer-events-none transition-all duration-300 flex flex-col items-center ${active || hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${active ? 'bg-brand-red border-white text-white' : 'bg-black/80 border-white/20 text-zinc-400'}`}>
                {name}
              </div>
              <div className={`w-0.5 h-4 ${active ? 'bg-brand-red' : 'bg-white/20'}`} />
            </div>
          </Html>
        </Float>
      </group>
    </group>
  );
};

const SkillCore = ({ tier }: { tier: PerformanceTier }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  const segments = tier === 'low' ? 32 : tier === 'medium' ? 48 : 64;

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, segments, segments]} />
        <MeshDistortMaterial 
          color="#e50914"
          speed={4}
          distort={0.3}
          metalness={1}
          roughness={0.1}
          emissive="#e50914"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight color="#e50914" intensity={tier === 'low' ? 10 : 20} distance={10} />
      
      {/* Central Glow */}
      <Sphere args={[1.5, Math.floor(segments/2), Math.floor(segments/2)]}>
        <meshBasicMaterial color="#e50914" transparent opacity={0.1} wireframe />
      </Sphere>
    </group>
  );
};

const Scene = ({ activeCategory, setActiveCategory, tier }: { activeCategory: string | null, setActiveCategory: (c: string) => void, tier: PerformanceTier }) => {
  const categories = Object.keys(skillsData);
  const isMobile = window.innerWidth < 768;
  const orbitRadius = isMobile ? 3.5 : 5.5;
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} />
      <pointLight position={[-10, -10, -10]} intensity={5} color="#e50914" />
      
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
      >
        <group ref={sceneRef} scale={isMobile ? 0.8 : 1}>
          <SkillCore tier={tier} />
          
          {categories.map((cat, i) => (
            <SkillPlanet 
              key={cat}
              name={cat}
              icon={categoryIcons[cat]}
              index={i}
              total={categories.length}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              radius={orbitRadius}
              tier={tier}
            />
          ))}

          {/* Orbit Rings */}
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, tier === 'low' ? 32 : 64]} />
              <meshBasicMaterial color="#e50914" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </PresentationControls>

      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
      <Environment preset="city" />
    </>
  );
};

export const SkillUniverse: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(Object.keys(skillsData)[0]);
  const tier = usePerformanceTier();

  return (
    <section id="skills" className="py-24 md:py-40 px-6 md:px-16 bg-black relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5091422_1px,transparent_1px),linear-gradient(to_bottom,#e5091422_1px,transparent_1px)] [background-size:40px_40px] md:[background-size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-4">
               <Terminal className="w-4 h-4 md:w-5 md:h-5 text-brand-red" />
               <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.6em] md:tracking-[0.8em]">Knowledge Base</span>
            </div>
            <h2 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter uppercase italic leading-none">
              THE <span className="text-brand-red font-outline-2 text-transparent">ARMORY</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md max-w-full">
            {Object.keys(skillsData).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-[8px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category 
                  ? "bg-brand-red text-white shadow-[0_0_15px_#e5091455]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 md:space-y-12"
              >
                <div>
                  <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="p-4 md:p-6 bg-brand-red/10 rounded-xl md:rounded-2xl border border-brand-red/30 shadow-[inset_0_0_20px_#e5091422]">
                      {activeCategory && React.createElement(categoryIcons[activeCategory] || Code2, { className: "w-8 h-8 md:w-12 md:h-12 text-brand-red" })}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-1 md:mb-2">{activeCategory}</h3>
                      <div className="h-1 w-16 md:w-24 bg-brand-red" />
                    </div>
                  </div>
                  <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-md">
                    Weaponizing current-gen <span className="text-white font-bold">{activeCategory?.toLowerCase()}</span> technologies to build indestructible digital infrastructures.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {(skillsData as any)[activeCategory!].map((skill: string, i: number) => (
                    <motion.div 
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 10 }}
                      className="p-4 md:p-6 bg-zinc-900/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/5 hover:border-brand-red/50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-red transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                      <div className="flex items-center justify-between">
                        <span className="relative z-10 text-[10px] md:text-sm font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest">{skill}</span>
                        <ChevronRight className="w-4 h-4 text-brand-red opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7 h-[400px] md:h-[700px] relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5091411_0%,transparent_70%)] pointer-events-none" />
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <Scene activeCategory={activeCategory} setActiveCategory={setActiveCategory} tier={tier} />
              </Canvas>
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

