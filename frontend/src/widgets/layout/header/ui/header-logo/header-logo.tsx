import { cn } from '@/shared/lib/utils';
import { Logo } from '@/shared/ui/logo';

interface IHeaderLogosProps {
  className?: string;
}

export function HeaderLogos({ className }: IHeaderLogosProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full items-center gap-4 justify-self-center',
        className,
      )}
    >
      <Logo
        aria="gankaforhome"
        variant="logo-icon"
        className="h-8 w-8 md:h-11 md:w-11 lg:h-12 lg:w-12"
        asLink
      />
      <Logo
        aria="gankaforhome"
        variant="logo-text"
        className="w-50 lg:w-75 h-12 max-[320px]:hidden md:h-11 md:w-60 lg:h-12"
      />
    </div>
  );
}
