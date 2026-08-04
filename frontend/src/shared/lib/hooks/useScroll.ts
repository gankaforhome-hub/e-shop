import { useCallback, useEffect, useRef, useState } from 'react';

export function useScroll(threshold = 30, deltaThreshold = 10) {
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // We use ref to save the current state without closures in the scroll listener
  const stateRef = useRef({
    showSubMenu: true,
    isScrolled: false,
    lastScrollY: 0,
  });

  const ticking = useRef(false);

  useEffect(() => {
    // Initialization when mounting
    const initialY = window.scrollY;
    const initialScrolled = initialY > threshold;

    stateRef.current.lastScrollY = initialY;
    stateRef.current.isScrolled = initialScrolled;
    setIsScrolled(initialScrolled);

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      // 1. Protection against overscroll (i OS bounce)
      if (scrollY < 0 || scrollY > maxScrollY) {
        ticking.current = false;
        return;
      }

      const diff = scrollY - stateRef.current.lastScrollY;

      // 2. Update is Scrolled ONLY if the value has changed
      const nextIsScrolled = scrollY > threshold;
      if (nextIsScrolled !== stateRef.current.isScrolled) {
        stateRef.current.isScrolled = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      // 3. Logic for the very top (< = 10px)
      if (scrollY <= 10) {
        if (!stateRef.current.showSubMenu) {
          stateRef.current.showSubMenu = true;
          setShowSubMenu(true);
        }
        stateRef.current.lastScrollY = scrollY;
        ticking.current = false;
        return;
      }

      // 4. We check the shift delta
      if (Math.abs(diff) >= deltaThreshold) {
        if (diff > 0 && scrollY > threshold) {
          // Movement DOWN -> Hide only if it is currently shown
          if (stateRef.current.showSubMenu) {
            stateRef.current.showSubMenu = false;
            setShowSubMenu(false);
          }
        } else if (diff < 0) {
          // Move UP -> Show only if currently hidden
          if (!stateRef.current.showSubMenu) {
            stateRef.current.showSubMenu = true;
            setShowSubMenu(true);
          }
        }

        stateRef.current.lastScrollY = scrollY;
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        // Optimization for screen FPS
        window.requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, deltaThreshold]);

  // Protected setter with use Callback and stored reference
  const handleSetIsHovered = useCallback((hovered: boolean) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    setIsHovered(hovered);
  }, []);

  const isMenuOpen = showSubMenu || isHovered;

  return {
    isScrolled,
    showSubMenu: isMenuOpen,
    setIsHovered: handleSetIsHovered,
  };
}
