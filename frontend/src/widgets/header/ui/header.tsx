import { FC } from 'react';

import rawJson from '@/dictionary/common.json';
import { CommonPage } from '@/shared/types';
import { Box } from '@/shared/ui/box';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';

import { MobileMenu } from './mobile-menu';

const common = rawJson as CommonPage;
const header = common.header;

interface IHeaderProps {
  className?: string;
  data?: typeof header;
}

export const Header: FC<IHeaderProps> = () => {
  const { topBar, navMenu } = header;
  return (
    <header className="h-(--h-mob-header) pointer-events-auto relative z-50">
      <Separator size="md" variant="accent" />
      <Container className="flex items-center py-6">
        <Box className="flex flex-1">
          <MobileMenu navMenu={navMenu} topBar={topBar} />
        </Box>
        <Logo className="" />
        <Box className="flex flex-1 justify-end">
          <Button className="flex items-center justify-center gap-2 fill-none p-1">
            <Icon name="cart" className="fw-4 fh-4" />
            <span className="text-sm">2</span>
          </Button>
        </Box>
      </Container>
      <Separator size="xs" variant="muted" />
    </header>
  );
};
