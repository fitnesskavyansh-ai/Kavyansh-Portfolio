/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { CustomCursor } from './components/CustomCursor';
import { Intro } from './components/Intro';
import { ProfileSelection } from './components/ProfileSelection';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { useTouchDevice, usePerformanceMonitor } from './hooks/useDevice';

// Lazy load heavy components
const FeaturedHighlights = lazy(() => import('./components/FeaturedHighlights').then(m => ({ default: m.FeaturedHighlights })));
const ProjectUniverse = lazy(() => import('./components/ProjectUniverse').then(m => ({ default: m.ProjectUniverse })));
const CertificationVault = lazy(() => import('./components/CertificationVault').then(m => ({ default: m.CertificationVault })));
const SkillUniverse = lazy(() => import('./components/SkillUniverse').then(m => ({ default: m.SkillUniverse })));
const JourneyTimeline = lazy(() => import('./components/JourneyTimeline').then(m => ({ default: m.JourneyTimeline })));
const MyWorld = lazy(() => import('./components/MyWorld').then(m => ({ default: m.MyWorld })));
const Journal = lazy(() => import('./components/Journal').then(m => ({ default: m.Journal })));
const BehindTheScenes = lazy(() => import('./components/BehindTheScenes').then(m => ({ default: m.BehindTheScenes })));
const ResumeViewer = lazy(() => import('./components/ResumeViewer').then(m => ({ default: m.ResumeViewer })));
const CommandCenter = lazy(() => import('./components/CommandCenter').then(m => ({ default: m.CommandCenter })));
const ContactSection = lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })));
const Hackathons = lazy(() => import('./components/Hackathons').then(m => ({ default: m.Hackathons })));
const InfernoBackground = lazy(() => import('./components/InfernoBackground').then(m => ({ default: m.InfernoBackground })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

const LoadingSection = () => (
  <div className="w-full h-[50vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-[1px] bg-brand-red/30 animate-pulse" />
      <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-mono italic">Syncing Core...</span>
    </div>
  </div>
);

export default function App() {
  const [stage, setStage] = useState<'intro' | 'profile' | 'main'>('intro');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const isTouch = useTouchDevice();
  const perf = usePerformanceMonitor();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const handleToggle = (e: any) => {
      if (e.detail.state === 'stop') {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    window.addEventListener('lenis-toggle', handleToggle);
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('lenis-toggle', handleToggle);
      lenis.destroy();
    };
  }, [isTouch]);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setStage('profile');
    }

    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setStage('profile');
  };

  const handleProfileSelect = (id: string) => {
    setSelectedProfile(id);
    setStage('main');
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem('hasSeenIntro');
    setStage('intro');
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-red selection:text-white overflow-x-hidden">
      {!isTouch && <CustomCursor />}
      
      <Suspense fallback={null}>
        {stage !== 'intro' && (
          <InfernoBackground 
            scrollProgress={scrollYProgress} 
            tier={perf.tier} 
            reducedMotion={perf.reducedMotion} 
          />
        )}
      </Suspense>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Intro onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {stage === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ProfileSelection onSelect={handleProfileSelect} />
          </motion.div>
        )}

        {stage === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <Navbar />
            
            <div className="relative">
              <Hero onPlayIntro={handleReplayIntro} />
              
              <div className="relative z-10">
                <div className="relative z-20">
                  <Suspense fallback={<LoadingSection />}>
                    <FeaturedHighlights />
                    <ProjectUniverse />
                    <Hackathons />
                    <CertificationVault />
                    <SkillUniverse />
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-red/5 to-transparent pointer-events-none" />
                      <MyWorld />
                      <BehindTheScenes />
                      <Journal />
                    </div>

                    <JourneyTimeline />
                    <ResumeViewer />
                    <ContactSection />
                  </Suspense>
                  
                  <div className="flex justify-center py-12 md:py-20 bg-black/40 backdrop-blur-xl border-t border-white/5">
                    <button 
                      onClick={handleReplayIntro}
                      className="px-6 py-2 border border-white/10 text-white/40 text-[10px] uppercase tracking-widest hover:text-white hover:border-white transition-all"
                    >
                      Replay Opening Credits
                    </button>
                  </div>
                </div>
                
                <Suspense fallback={null}>
                  <CommandCenter />
                  <Footer />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

