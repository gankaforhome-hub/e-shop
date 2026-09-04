import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/ui/logo';

interface IHeaderLogosProps {
  className?: string;
}

export function HeaderLogos({ className }: IHeaderLogosProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Logo
        aria="gankaforhome"
        variant="logo-icon"
        className="size-8 md:size-12 xl:size-14"
        asLink
      />
      <Logo
        aria="gankaforhome"
        variant="logo-text"
        className="w-50 lg:w-75 h-8 max-[320px]:hidden md:h-12 md:w-60 xl:h-14"
      />
    </div>
  );
}
