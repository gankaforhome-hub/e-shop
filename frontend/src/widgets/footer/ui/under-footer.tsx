import { FC } from 'react';

import { cn, getCurrentYear } from '@/shared/lib/utils';
import { UnderFooterT } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { type AppRoutes } from 'src/shared/config';

interface IUnderFooterProps {
  className?: string;
  data?: UnderFooterT;
}

const services: { title: string; href: AppRoutes }[] = [
  {
    title: 'Terms & Conditions',
    href: '/terms-conditions',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    title: 'Files Cookie',
    href: '/cookie-policy',
  },
];

export const UnderFooter: FC<IUnderFooterProps> = ({ data, className }) => {
  return (
    <Box className={cn(className)}>
      <p>
        &copy {2024} - {getCurrentYear} Ganka&Home
      </p>
      <ul className="">
        {services.map(({ title, href }) => (
          <li key={href} className="link link-gradient">
            <AppLink
              href={href}
              className="ftext-4/4.5 leading-0 tracking-wide"
            >
              {title}
            </AppLink>
          </li>
        ))}
      </ul>
    </Box>
  );
};
