import { cn } from '@/shared/lib/utils';

interface IOverlayProps {
  className?: string;
}

export function Overlay({ className }: IOverlayProps) {
  return (
    <div
      className={cn(
        'custom-transition absolute inset-0 z-0 bg-[linear-gradient(rgba(47,48,58,0.3),rgba(47,48,58,0.3))] transition-opacity',
        className,
      )}
    />
  );
}
//
