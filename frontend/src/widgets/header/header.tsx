import { FC } from 'react';

import commonJson from '@/dictionary/common.json';
import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { BurgerIcon } from '@/shared/ui/burger-icon';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';
import { NavigationMenu } from '@/shared/ui/navigation-menu';
import { Separator } from '@/shared/ui/separator';

const common = commonJson;
const navMenu = common.header.navMenu;
// const socialLink = common.header.topBar.socialLink;

interface IHeaderProps {
  className?: string;
}

// type Social = {
//   icon: IconName;
//   title: string;
//   href: string;
//   ariaLabel: string;
// };

export const Header: FC<IHeaderProps> = ({ className }) => {
  return (
    <header>
      <Separator variant="accent" className={cn('border-5', className)} />
      <Container className="fpy-5/10 flex items-center">
        <Box className="flex-1">
          <Button variant="icon">
            <BurgerIcon isOpen={false} />
          </Button>
        </Box>
        {/* <ul className="fgap-4/6 hidden md:flex md:flex-1">
          {socialLink.map(({ icon, href, ariaLabel }) => (
            <li key={icon} className="">
              <Link
                aria-label={ariaLabel}
                href={href}
                className="fw-8/10 fh-8/10 custom-transition hover:bg-icon flex items-center justify-center rounded-full bg-inherit"
              >
                <Icon name={icon} className="fh-4/6 fw-4/6" />
              </Link>
            </li>
          ))}
        </ul> */}
        <Logo />
        <Box className="fgap-5/9 ml-auto flex flex-1 items-center justify-end">
          {/* <Link
            href="/contact-us"
            className="fgap-4/4.5 hidden items-center justify-center xl:inline-flex"
          >
            <Icon name="contactUs" />
            <Text as="span">Contact Us</Text>
          </Link> */}
          <Box className="fgap-5/11 flex">
            {/* <Button size="icon" border="withOutBorder">
              <Icon name="language" />
            </Button>
            <Button size="icon" border="withOutBorder">
              <Icon name="favorite" />
            </Button> */}
            <Button size="icon" border="withOutBorder" className="fgap-1/2">
              <Icon name="cart" className="shrink-0" />
              <span className="text-sm">2</span>
            </Button>
          </Box>
        </Box>
      </Container>
      <Separator className="border" />
      <Container className="fpy-3/4.5">
        <NavigationMenu links={navMenu} />
      </Container>
    </header>
  );
};
