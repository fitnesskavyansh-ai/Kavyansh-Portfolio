import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTouchDevice } from '../hooks/useDevice';

export const CustomCursor: React.FC = () => {
  const isTouchDevice = useTouchDevice();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverType, setHoverType] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Optimized spring physics for a high-end mechanical feel
  const springConfig = { damping: 40, stiffness: 600, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const ringConfig = { damping: 30, stiffness: 300, mass: 1 };
  const ringXSpring = useSpring(cursorX, ringConfig);
  const ringYSpring = useSpring(cursorY, ringConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, .cursor-pointer');
      setIsHovering(!!clickable);
      
      if (clickable) {
        if (clickable.tagName === 'A') setHoverType('LINK');
        else if (clickable.tagName === 'BUTTON') setHoverType('COMMAND');
        else setHoverType('POINTER');
      } else {
        setHoverType(null);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference">
      {/* Outer Intelligence Ring */}
      <motion.div
        className="absolute w-16 h-16 border border-white/20 rounded-full"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          rotate: isHovering ? 180 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* HUD Crosshairs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-brand-red/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-brand-red/60" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-brand-red/60" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-brand-red/60" />
        
        {/* Animated Bracket Corners */}
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: isHovering ? -90 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-red" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-brand-red" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-brand-red" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-red" />
        </motion.div>
      </motion.div>

      {/* Center Tactical Dot */}
      <motion.div
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 3 : isHovering ? 0.4 : 1,
          backgroundColor: isHovering ? "#e50914" : "#ffffff",
          boxShadow: isHovering ? "0 0 20px #e50914" : "0 0 10px #ffffff",
        }}
      />

      {/* Target Status Label */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 45, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateY: '-50%',
            }}
            className="absolute whitespace-nowrap"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">LOCKED</span>
              <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">{hoverType}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trail Particles */}
      {[...Array(3)].map((_, i) => (
        <CursorTrail 
          key={i} 
          index={i} 
          x={cursorX} 
          y={cursorY} 
        />
      ))}
    </div>
  );
};

const CursorTrail = ({ index, x, y }: { index: number, x: any, y: any }) => {
  const delay = (index + 1) * 5;
  const px = useSpring(x, { damping: 25 + index * 5, stiffness: 300 - index * 50 });
  const py = useSpring(y, { damping: 25 + index * 5, stiffness: 300 - index * 50 });

  return (
    <motion.div
      className="absolute w-1 h-1 bg-brand-red rounded-full"
      style={{
        x: px,
        y: py,
        translateX: '-50%',
        translateY: '-50%',
        opacity: (0.4 - index * 0.1),
        scale: 1 - index * 0.2,
      }}
    />
  );
};

