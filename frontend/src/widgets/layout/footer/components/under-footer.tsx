import { FC } from 'react';

import { cn, getCurrentYear } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import Link from 'next/link';
import { FooterLink } from '../api';

interface IUnderFooterProps {
  className?: string;
  legalLinks: FooterLink[];
}

export const UnderFooter: FC<IUnderFooterProps> = ({
  legalLinks,
  className,
}) => {
  return (
    <Box
      className={cn(
        'border-border-muted text-fg-primary mt-4 flex flex-col items-center gap-4 border-t pt-4 text-sm lg:flex-row-reverse lg:justify-center',
        className,
      )}
    >
      <ul className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {legalLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        &copy; {2024} - {getCurrentYear} Ganka&Home
      </p>
    </Box>
  );
};
