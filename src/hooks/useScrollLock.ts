import { useEffect } from 'react';

/**
 * Robust scroll lock hook that handles background scrolling
 * during modal states and synchronizes with smooth scrolling.
 */
/**
 * Robust scroll lock hook that freezes body scrolling
 * during modal states and synchronizes with Lenis.
 */
export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      // Capture current scroll position
      const scrollY = window.scrollY;
      
      // Store original styles to restore later
      const originalOverflow = document.body.style.overflow;
      const originalHeight = document.body.style.height;
      const originalTouchAction = document.body.style.touchAction;

      // Apply robust lock
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none'; // Prevents mobile touch scroll
      
      // Dispatch event for Lenis in App.tsx to pause
      window.dispatchEvent(new CustomEvent('lenis-toggle', { detail: { state: 'stop' } }));

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
        document.body.style.touchAction = originalTouchAction;
        
        // Ensure scroll position is maintained (some browsers reset on overflow change)
        window.scrollTo(0, scrollY);
        
        // Dispatch event for Lenis in App.tsx to resume
        window.dispatchEvent(new CustomEvent('lenis-toggle', { detail: { state: 'start' } }));
      };
    }
  }, [lock]);
};
