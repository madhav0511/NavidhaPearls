import { useEffect, useLayoutEffect } from 'react';

/**
 * Ensures the viewport is strictly anchored to top (0, 0) on initial load, reload,
 * or page navigation, disabling browser scroll restoration, stripping lingering hashes,
 * and preventing unwanted jumps to lower sections like #collection.
 */
export function useScrollToTopOnMount() {
  // Synchronous pre-paint scroll reset
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Disable browser automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Clean hash if landing with lingering #collection or any hash on load
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 3. Instant scroll to top on all potential scroll containers
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // Post-mount enforcement after fonts, assets, and layouts resolve
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Immediately execute and enforce across subsequent render frames
    resetToTop();
    const rafId1 = requestAnimationFrame(resetToTop);
    const rafId2 = requestAnimationFrame(() => requestAnimationFrame(resetToTop));
    const timer1 = setTimeout(resetToTop, 20);
    const timer2 = setTimeout(resetToTop, 60);
    const timer3 = setTimeout(resetToTop, 150);
    const timer4 = setTimeout(resetToTop, 350);

    // Also handle window load and back-forward cache restoration
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        resetToTop();
      }
    };

    window.addEventListener('load', resetToTop, { once: true });
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('load', resetToTop);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}
