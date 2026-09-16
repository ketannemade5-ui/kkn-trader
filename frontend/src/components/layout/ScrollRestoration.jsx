import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Memory cache for scroll positions during the active session
const scrollPositions = new Map();

// Helper to get route key (includes pathname and query params)
const getRouteKey = (location) => `${location.pathname}${location.search}`;

export const ScrollRestoration = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevKeyRef = useRef(getRouteKey(location));
  const isRestoringRef = useRef(false);

  // Disable browser's automatic intrusive scroll restoration so we have full smooth control
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record scroll position for the active route
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentKey = getRouteKey(location);
          const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
          scrollPositions.set(currentKey, scrollY);
          try {
            sessionStorage.setItem(`kkn_scroll_${currentKey}`, scrollY.toString());
          } catch (e) {}
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Restore scroll position when route changes
  useLayoutEffect(() => {
    const currentKey = getRouteKey(location);
    prevKeyRef.current = currentKey;

    // Handle hash links (e.g. #faq, #overview)
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Check memory map or sessionStorage for saved scroll position
    let targetY = scrollPositions.get(currentKey);
    if (targetY === undefined) {
      try {
        const saved = sessionStorage.getItem(`kkn_scroll_${currentKey}`);
        if (saved !== null) {
          targetY = parseFloat(saved);
          scrollPositions.set(currentKey, targetY);
        }
      } catch (e) {}
    }

    isRestoringRef.current = true;

    if (targetY !== undefined && targetY > 0) {
      // Restore previous scroll position instantly without visual jumping
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });

      // Secondary check for pages with asynchronously loaded data / charts / cards
      const rafId = window.requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        setTimeout(() => {
          // If document height changed after initial render, adjust to target
          if (Math.abs((window.scrollY || 0) - targetY) > 5) {
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          }
          isRestoringRef.current = false;
        }, 50);
      });

      return () => {
        window.cancelAnimationFrame(rafId);
        isRestoringRef.current = false;
      };
    } else {
      // First visit to this route: start at top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const timer = setTimeout(() => {
        isRestoringRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};
