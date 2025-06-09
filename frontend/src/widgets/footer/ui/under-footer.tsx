import { FC } from 'react';

import { cn, getCurrentYear } from '@/shared/lib/utils';
import { UnderFooterT } from '@/shared/types';
import { AppLink } from '@/shared/ui/app-link';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';
import { Text } from '@/shared/ui/text';

interface IUnderFooterProps {
  data: UnderFooterT;
}

export const UnderFooter: FC<IUnderFooterProps> = ({ data }) => {
  const { copyright, logo, services } = data;

  return (
    <Box className="relative">
      <Separator
        size="xs"
        variant="muted"
        className="absolute top-1/2 xl:top-0"
      />
      <Container>
        <Box className="flex max-xl:flex-col xl:items-center xl:py-8">
          <Box
            className={cn(
              'flex items-center max-xl:justify-between max-xl:py-7 xl:contents',
            )}
          >
            <Text className="ftext-4/4.5 leading-0 xl:flex-1">
              <Icon name="copyright" className="-order-1 size-4">
                {copyright.yearStart} - {getCurrentYear} {copyright.TM}
              </Icon>
            </Text>
            <Logo variant={logo.icon} className="h-5.5 ml-auto w-11" />
          </Box>
          <ul className="fgap-6/10 flex max-xl:-order-1 max-xl:justify-center max-xl:py-7 max-sm:flex-wrap xl:flex-1 xl:justify-end">
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
      </Container>
    </Box>
  );
};
