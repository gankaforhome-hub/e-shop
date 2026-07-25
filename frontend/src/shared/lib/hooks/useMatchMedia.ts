import { useMediaQuery } from 'react-responsive';

export const useMatchMedia = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1279px)',
  });

  const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });

  const isSM = useMediaQuery({ query: '(min-width: 640px)' });
  const isMD = useMediaQuery({ query: '(min-width: 768px)' });
  const isLG = useMediaQuery({ query: '(min-width: 1024px)' });
  const isXL = useMediaQuery({ query: '(min-width: 1280px)' });
  const is2XL = useMediaQuery({ query: '(min-width: 1366px)' });
  const is3XL = useMediaQuery({ query: '(min-width: 1440px)' });

  const obj = {
    isMobile,
    isTablet,
    isDesktop,
    isSM,
    isMD,
    isLG,
    isXL,
    is2XL,
    is3XL,
  };
  return obj;
};
