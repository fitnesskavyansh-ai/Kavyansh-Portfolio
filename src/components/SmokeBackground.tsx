import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SmokeParticles = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;
      const scale = 2 + Math.random() * 5;
      const rotation = Math.random() * Math.PI;
      const speed = 0.1 + Math.random() * 0.3;
      temp.push({ x, y, z, scale, rotation, speed });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.children.forEach((child, i) => {
      child.rotation.z += particles[i].speed * 0.01;
      child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
    });
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, 0, p.rotation]}>
          <planeGeometry args={[p.scale, p.scale]} />
          <meshBasicMaterial 
            color="#b9090b" 
            transparent 
            opacity={0.05} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export const SmokeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <SmokeParticles />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
    </div>
  );
};
