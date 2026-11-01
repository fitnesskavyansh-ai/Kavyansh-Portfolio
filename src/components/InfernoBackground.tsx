import React, { useRef, useMemo, useEffect, useState, Suspense, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, DepthOfField } from '@react-three/postprocessing';
import { FireShader, LightningShader } from './FireShader';
import { PerformanceTier } from '../hooks/useDevice';

interface InfernoProps {
  fireIntensity?: number;
  explosionFactor?: number;
  emberSpeed?: number;
  lightningFrequency?: number;
  isVoidMode?: boolean;
  tier?: PerformanceTier;
  reducedMotion?: boolean;
  scrollProgress?: any;
}

const FireMesh = memo(({ position, scale, heat = 0.5, intensity = 1.0, explosion = 0.0, mouse, tier = 'high' }: { 
  position: [number, number, number], 
  scale: [number, number, number], 
  heat?: number,
  intensity?: number,
  explosion?: number,
  mouse?: THREE.Vector2,
  tier?: PerformanceTier
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ff4500') },
        uColor2: { value: new THREE.Color('#b9090b') },
        uHeat: { value: heat },
        uIntensity: { value: intensity },
        uExplosion: { value: explosion },
        uMouse: { value: mouse || new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: FireShader.vertexShader,
      fragmentShader: FireShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [heat, intensity, explosion, mouse]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uIntensity.value = intensity;
      material.uniforms.uExplosion.value = explosion;
      if (mouse) {
        material.uniforms.uMouse.value.lerp(mouse, 0.1);
      }
    }
  });

  const segments = tier === 'low' ? 12 : tier === 'medium' ? 24 : 32;

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[1, 1, segments, segments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
});

const Lightning = memo(({ frequency = 1.0, reducedMotion = false }: { frequency?: number, reducedMotion?: boolean }) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#e50914') },
      },
      vertexShader: LightningShader.vertexShader,
      fragmentShader: LightningShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const timeScale = reducedMotion ? 0.2 : 1.0;
    material.uniforms.uTime.value = state.clock.elapsedTime * frequency * timeScale;
  });

  return (
    <mesh position={[0, 0, -1]} scale={[15, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
});

const EmberParticles = memo(({ speedFactor = 1.0, intensity = 1.0, tier = 'high', reducedMotion = false }: { speedFactor?: number, intensity?: number, tier?: PerformanceTier, reducedMotion?: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = useMemo(() => {
    let baseCount = 2000; // Reduced from 3000 for baseline performance
    if (reducedMotion) baseCount = 400;
    if (tier === 'low') return Math.floor(baseCount * 0.2); 
    if (tier === 'medium') return Math.floor(baseCount * 0.5);
    return baseCount;
  }, [tier, reducedMotion]);
  
  const [positions, speeds, initialX] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const ix = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sp[i] = 0.2 + Math.random() * 1.5;
      ix[i] = pos[i * 3];
    }
    return [pos, sp, ix];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const movementScale = reducedMotion ? 0.3 : 1.0;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * delta * 2.0 * speedFactor * movementScale;
      pos[i * 3] = initialX[i] + Math.sin(state.clock.elapsedTime * 0.5 + i) * (0.8 * movementScale);
      
      if (pos[i * 3 + 1] > 10) {
        pos[i * 3 + 1] = -10;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={tier === 'low' || reducedMotion ? 0.05 : 0.035} 
        color="#ffcc00" 
        transparent 
        opacity={0.5 * intensity} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});

const VolumetricSmoke = memo(({ intensity = 1.0, tier = 'high', reducedMotion = false }: { intensity?: number, tier?: PerformanceTier, reducedMotion?: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const count = useMemo(() => {
    if (reducedMotion) return 5;
    if (tier === 'low') return 8;
    if (tier === 'medium') return 12;
    return 20;
  }, [tier, reducedMotion]);

  const smokeData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20, -5),
      scale: 8 + Math.random() * 12,
      rotation: Math.random() * Math.PI,
      speed: 0.01 + Math.random() * 0.03,
      offset: Math.random() * 100
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const movementScale = reducedMotion ? 0.2 : 1.0;

    smokeData.forEach((data, i) => {
      const time = state.clock.elapsedTime;
      const rot = data.rotation + time * data.speed * 0.2 * movementScale;
      const x = data.position.x + Math.cos(time * 0.2 + data.offset) * 0.5 * movementScale;
      const y = data.position.y + Math.sin(time * 0.3 + data.offset) * 0.5 * movementScale;
      
      dummy.position.set(x, y, data.position.z);
      dummy.rotation.set(0, 0, rot);
      dummy.scale.set(data.scale, data.scale, 1);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#0a0000" 
        transparent 
        opacity={0.08 * intensity} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
});

export const InfernoBackground: React.FC<InfernoProps> = memo(({ 
  fireIntensity = 1.0, 
  explosionFactor = 0.0,
  emberSpeed = 1.0,
  lightningFrequency = 1.0,
  tier = 'high',
  reducedMotion = false,
  scrollProgress
}) => {
  const [mouse] = useState(() => new THREE.Vector2(0.5, 0.5));
  const [dynamicFireIntensity, setDynamicFireIntensity] = useState(fireIntensity);
  const [dynamicVoidFactor, setDynamicVoidFactor] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse]);

  useEffect(() => {
    if (!scrollProgress) return;
    return scrollProgress.onChange((v: number) => {
      if (v < 0.1) {
        setDynamicFireIntensity(1.0);
        setDynamicVoidFactor(0.2);
      } else if (v < 0.4) {
        const factor = (v - 0.1) / 0.3;
        setDynamicFireIntensity(1.0 - factor * 0.8);
        setDynamicVoidFactor(0.2 + factor * 0.6);
      } else {
        setDynamicFireIntensity(0.2);
        setDynamicVoidFactor(0.8);
      }
      setRotation(v * Math.PI * 0.05);
    });
  }, [scrollProgress]);

  const showPostProcessing = tier !== 'low' && !reducedMotion;

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        dpr={tier === 'low' ? 1 : [1, 2]}
        gl={{ 
          antialias: tier === 'high',
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: false
        }}
      >
        <color attach="background" args={['#000000']} />
        
        <Suspense fallback={null}>
          <group rotation={[0, rotation, 0]}>
            <VolumetricSmoke intensity={dynamicFireIntensity} tier={tier} reducedMotion={reducedMotion} />
            
            {dynamicFireIntensity > 0.4 && tier !== 'low' && !reducedMotion && (
              <Lightning frequency={lightningFrequency} reducedMotion={reducedMotion} />
            )}
            
            <FireMesh position={[0, -4.5, -3]} scale={[35, 12, 1]} heat={0.2} intensity={dynamicFireIntensity} explosion={explosionFactor} mouse={mouse} tier={tier} />
            <FireMesh position={[0, -3.5, -1]} scale={[20, 8, 1]} heat={0.5} intensity={dynamicFireIntensity} explosion={explosionFactor} mouse={mouse} tier={tier} />
            
            <EmberParticles speedFactor={emberSpeed} intensity={dynamicFireIntensity > 0.5 ? 1.0 : 0.4} tier={tier} reducedMotion={reducedMotion} />
          </group>
          
          <mesh position={[0, 0, 4]}>
            <planeGeometry args={[25, 25]} />
            <meshBasicMaterial color="#000000" transparent opacity={dynamicVoidFactor} depthWrite={false} />
          </mesh>

          {showPostProcessing && (
            <EffectComposer multisampling={tier === 'high' ? 4 : 0}>
              <Bloom 
                intensity={1.0} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                mipmapBlur 
              />
              <Noise opacity={0.02} />
              {tier === 'high' && (
                <DepthOfField 
                  focusDistance={0} 
                  focalLength={0.02} 
                  bokehScale={2} 
                />
              )}
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50" />
    </div>
  );
});
