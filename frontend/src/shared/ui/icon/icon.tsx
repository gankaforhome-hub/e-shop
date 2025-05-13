import { FC, SVGProps } from 'react';

import Four from '@/shared/icons/four.svg';
import LogoFull from '@/shared/icons/logo/logo_full_ganka_for_home.svg';
import LogoMin from '@/shared/icons/logo/logo_min_ganka_for_home.svg';
import Cart from '@/shared/icons/shop/cart.svg';
import ContactUs from '@/shared/icons/shop/contact-us.svg';
import Delivery from '@/shared/icons/shop/delivery.svg';
import Favorite from '@/shared/icons/shop/favorite.svg';
import Gift from '@/shared/icons/shop/gift.svg';
import Language from '@/shared/icons/shop/language.svg';
import Plus from '@/shared/icons/shop/plus.svg';
import Facebook from '@/shared/icons/social/facebook.svg';
import Instagram from '@/shared/icons/social/instagram.svg';
import Map from '@/shared/icons/social/location.svg';
import Phone from '@/shared/icons/social/phone.svg';
import Telegram from '@/shared/icons/social/telegram.svg';
import { cn } from '@/shared/lib/utils';
import { CommonIcon, LogoIcon, SocialIcon } from '@/shared/types/icon';

const icons = {
  logoFull: LogoFull,
  logoMin: LogoMin,
  map: Map,
  instagram: Instagram,
  facebook: Facebook,
  telegram: Telegram,
  phone: Phone,
  four: Four,
  contactUs: ContactUs,
  cart: Cart,
  delivery: Delivery,
  favorite: Favorite,
  gift: Gift,
  language: Language,
  plus: Plus,
};

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: CommonIcon | LogoIcon | SocialIcon;
  className?: string;
}

export const Icon: FC<IIconProps> = ({ name, className = '', ...props }) => {
  const SvgIcon = icons[name];

  return (
    <SvgIcon
      className={cn(
        'stroke-icon fw-4/6 fh-4/6 shrink-0 overflow-visible fill-none',
        className,
      )}
      {...props}
    />
  );
};
