import { FC } from 'react';

import { AppRoutes } from 'src/shared/config';
import { AppLink } from 'src/shared/ui/app-link';
import { Container } from 'src/shared/ui/container';
import { Icon } from 'src/shared/ui/icon';
import { Logo } from 'src/shared/ui/logo';
import { UnderFooter } from './under-footer';

interface IFooterProps {
  className?: string;
}
const shopMenu: { title: string; href: AppRoutes }[] = [
  { title: '', href: '' },
  { title: '', href: '' },
  { title: '', href: '' },
  { title: '', href: '' },
];

export const Footer: FC<IFooterProps> = () => {
  // const { underFooter, nav, customerService, contacts, social, payments } =
  //   footer;

  return (
    <footer>
      <Container className="">
        {/* LOGO */}
        <Logo />
        {/* CONTACT */}
        <address>
          <ul>
            <li>
              <AppLink href="tel:+380635854678">
                <Icon name="phone" />+ 38 (063) 585-46-78
              </AppLink>
            </li>
            <li>
              <AppLink href="mailto:gankaforhome@gmail.com">
                <Icon name="email" />
                gankaforhome@gmail.com
              </AppLink>
            </li>
          </ul>
        </address>
        {/* HELP */}
        {/* SHOP column */}
        <h3 className="mb-5 text-xs font-bold uppercase tracking-widest">
          Shop
        </h3>
        <ul className="space-y-3">
          {[
            { name: 'Collections', href: '/collections' },
            { name: 'All Products', href: '/products' },
            { name: 'Exclusive', href: '/exclusive' },
            { name: 'Releases', href: '/releases' },
          ].map(item => (
            <li key={item.name}>
              <AppLink
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {item.name}
              </AppLink>
            </li>
          ))}
        </ul>
        {/* FOLLOW US */}
        <h3>Follow us</h3>
        {/* PAYMENT METHODS */}
        <h3>Payment</h3>

        {/* SERVICES */}
        <h3>Services</h3>
        <UnderFooter />
      </Container>
    </footer>
  );
};
