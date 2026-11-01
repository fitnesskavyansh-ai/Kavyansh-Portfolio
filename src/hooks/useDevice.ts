import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface PerformanceStats {
  tier: PerformanceTier;
  reducedMotion: boolean;
  isGPUAccelerated: boolean;
}

export function usePerformanceMonitor(): PerformanceStats {
  const [stats, setStats] = useState<PerformanceStats>({
    tier: 'high',
    reducedMotion: false,
    isGPUAccelerated: true
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Basic GPU Detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let tier: PerformanceTier = 'high';
    let isGPUAccelerated = true;

    if (!gl) {
      tier = 'low';
      isGPUAccelerated = false;
    } else {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        
        // Basic tiering logic based on renderer strings
        const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
        const isIntegrated = /intel|iris|hd graphics|mesa/i.test(renderer);
        const isLowEnd = /mali|adreno|powervr/i.test(renderer);

        if (isMobile || isLowEnd) {
          tier = 'low';
        } else if (isIntegrated) {
          tier = 'medium';
        } else {
          tier = 'high';
        }
      }
    }

    // Force low tier if reduced motion is preferred
    if (reducedMotion) {
      tier = 'low';
    }

    setStats({ tier, reducedMotion, isGPUAccelerated });
  }, []);

  return stats;
}

// Deprecated: use usePerformanceMonitor instead
export function usePerformanceTier(): PerformanceTier {
  return usePerformanceMonitor().tier;
}
