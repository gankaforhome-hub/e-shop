import { use100vh } from 'react-div-100vh';

export const useScrollLock = () => {
  const height = use100vh();

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.maxHeight = `${height}px`;
  };

  const unlockScroll = () => {
    document.body.style.overflow = '';
  };

  return { lockScroll, unlockScroll };
};
