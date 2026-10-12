'use client';

import { useEffect, useRef } from 'react';

export function useHeaderRef() {
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY < 0 || scrollY > maxScrollY) {
        rafId.current = null;
        return;
      }

      const diff = scrollY - lastScrollY.current;

      // Оновлюємо стан скролу
      if (scrollY > 30) {
        el.setAttribute('data-scrolled', 'true');
      } else {
        el.setAttribute('data-scrolled', 'false');
      }

      // Логіка показу / приховування нижнього ряду
      if (scrollY <= 10) {
        el.setAttribute('data-show-submenu', 'true');
      } else if (Math.abs(diff) >= 5) {
        if (diff > 0 && scrollY > 30) {
          // Скрол ВНИЗ -> примусово ховаємо
          el.setAttribute('data-show-submenu', 'false');
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        } else if (diff < 0) {
          // Скрол ВГОРУ -> показуємо
          el.setAttribute('data-show-submenu', 'true');
        }
        lastScrollY.current = scrollY;
      }

      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = window.requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return headerRef;
}
