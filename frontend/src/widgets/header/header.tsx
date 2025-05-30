import { FC } from 'react';

import { Box } from '@/shared/ui/box';
import { BurgerIcon } from '@/shared/ui/burger-icon';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { Separator } from '@/shared/ui/separator';

// const common = commonJson;
// const navMenu = common.header.navMenu;
// const socialLink = common.header.topBar.socialLink;

interface IHeaderProps {
  className?: string;
}

export const Header: FC<IHeaderProps> = () => {
  return (
    <header>
      <Separator variant="accent" />
      <Container className="flex items-center py-5">
        <Box className="flex-1">
          <Button variant="icon" size="icon">
            <BurgerIcon isOpen={true} />
          </Button>
        </Box>
        <Logo />
        <Box className="ml-auto flex flex-1 items-center justify-end">
          <Button
            border="withOutBorder"
            className="flex items-center justify-center gap-2 p-1"
          >
            <Icon name="cart" className="fill-none" />
            <span className="text-sm">2</span>
          </Button>
        </Box>
      </Container>
      {/* <Separator className="hidden border md:block" /> */}
    </header>
  );
};
