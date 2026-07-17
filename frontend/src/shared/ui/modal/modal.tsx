import { motion } from 'framer-motion';
import { Nunito_Sans, Tinos } from 'next/font/google';
import {
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useScrollLock } from '@/shared/lib/hooks/useScrollLock';
import { cn } from '@/shared/lib/utils';

const tinos = Tinos({
  variable: '--font-tinos',
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
});

interface IModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  backDropClassName?: string;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleBackdropClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export const Modal: FC<IModalProps> = ({
  className,
  backDropClassName,
  handleKeyDown,
  handleBackdropClick,
  children,
}) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);
  const { lockScroll, unlockScroll } = useScrollLock();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ref.current = document.querySelector('#modal-root'); // setModalRoot(el);
      setMounted(true);
    }
    // ref.current = document.querySelector('#modal-root');
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    lockScroll();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
    };
  }, [unlockScroll, handleKeyDown, lockScroll]);

  return mounted && ref.current
    ? createPortal(
        <>
          <motion.div
            className={cn(
              `${tinos.variable} ${nunitoSans.variable} fixed inset-0 z-[100] flex h-[100vh] w-[100vw] items-start justify-center overflow-y-scroll bg-neutral-500/40 pb-24 opacity-100 backdrop-blur transition-transform md:items-start md:pt-12`,
              backDropClassName,
            )}
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(`bg-bg transition-transform`, className)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </>,
        ref.current,
      )
    : null;
};
