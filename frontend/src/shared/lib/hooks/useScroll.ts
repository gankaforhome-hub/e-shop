'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollOptions {
  threshold?: number;
  deltaThreshold?: number;
}

export function useScroll({
  threshold = 30,
  deltaThreshold = 5,
}: UseScrollOptions = {}) {
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Єдине джерело правди для мутабельного стану в анімаційних кадрах
  const stateRef = useRef({
    showSubMenu: true,
    isScrolled: false,
    lastScrollY: 0,
  });

  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Встановлюємо початковий scrollY після монтування на клієнті
    stateRef.current.lastScrollY = window.scrollY;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      // Ігноруємо "гумовий" скрол на iOS (bounce effect)
      if (scrollY < 0 || scrollY > maxScrollY) {
        rafId.current = null;
        return;
      }

      const diff = scrollY - stateRef.current.lastScrollY;
      const nextIsScrolled = scrollY > threshold;

      // Оновлюємо стан isScrolled
      if (nextIsScrolled !== stateRef.current.isScrolled) {
        stateRef.current.isScrolled = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      // Зона у самій горі сторінки (0..10px) — завжди показуємо меню
      if (scrollY <= 10) {
        if (!stateRef.current.showSubMenu) {
          stateRef.current.showSubMenu = true;
          setShowSubMenu(true);
        }
        stateRef.current.lastScrollY = scrollY;
        rafId.current = null;
        return;
      }

      // Перевіряємо поріг дельти для приховування / показу
      if (Math.abs(diff) >= deltaThreshold) {
        if (diff > 0 && scrollY > threshold) {
          // Скрол ВНИЗ -> Ховаємо
          if (stateRef.current.showSubMenu) {
            stateRef.current.showSubMenu = false;
            setShowSubMenu(false);
          }
        } else if (diff < 0) {
          // Скрол ВГОРУ -> Показуємо
          if (!stateRef.current.showSubMenu) {
            stateRef.current.showSubMenu = true;
            setShowSubMenu(true);
          }
        }

        stateRef.current.lastScrollY = scrollY;
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
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, [threshold, deltaThreshold]);

  const handleSetIsHovered = useCallback((hovered: boolean) => {
    // Безпечна перевірка середовища та пристрою
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }
    setIsHovered(hovered);
  }, []);

  return {
    isScrolled,
    showSubMenu: showSubMenu || isHovered,
    setIsHovered: handleSetIsHovered,
  };
}
