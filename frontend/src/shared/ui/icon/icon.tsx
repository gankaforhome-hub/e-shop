import type { ComponentType, ReactNode, SVGProps } from 'react';

import {
  ChevronDown,
  ChevronLeft,
  Copyright,
  Gift,
  Globe,
  Heart,
  MapPin,
  Menu,
  Minus,
  Pause,
  PhoneCall,
  Play,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  UserPen,
  Volume,
  VolumeX,
  X,
  type LucideProps,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { type IconName } from '@/shared/types';

import {
  ApplepayIcon,
  FacebookIcon,
  GooglepayIcon,
  InstagramIcon,
  LiqpayIcon,
  LogoIcon,
  LogoTextIcon,
  MasterCardIcon,
  PaypalIcon,
  TelegramIcon,
  VisaIcon,
} from './custom-icon';

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> | LucideProps
>;

// Жорстка типізація: гарантує, що для КОЖНОГО IconName є реальний компонент
export const ICON_MAP: Partial<Record<IconName, IconComponent>> = {
  'shopping-cart': ShoppingCart,
  search: Search,
  user: UserPen,
  language: Globe,
  menu: Menu,
  favorite: Heart,
  close: X,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  mute: VolumeX,
  volume: Volume,
  pause: Pause,
  play: Play,
  phone: PhoneCall,
  location: MapPin,
  'delete-cart': Trash2,
  copyright: Copyright,
  delivery: Truck,
  gift: Gift,
  plus: Plus,
  minus: Minus,
  liqpay: LiqpayIcon,
  mastercard: MasterCardIcon,
  paypal: PaypalIcon,
  visa: VisaIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  applepay: ApplepayIcon,
  googlepay: GooglepayIcon,
  'logo-icon': LogoIcon,
  'logo-text': LogoTextIcon,
};

export interface IIconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  children?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: number | string;
  className?: string;
  childClassName?: string;
}

export function Icon({
  name,
  className,
  childClassName,
  iconPosition = 'right',
  children,
  size,
  ...props
}: IIconProps) {
  const SvgIcon = ICON_MAP[name];

  if (!SvgIcon) {
    return null;
  }

  const renderIcon = () => (
    <SvgIcon
      {...(size ? { width: size, height: size } : {})}
      className={cn(
        'duration-(--dur-normal) inline-block shrink-0 transition-all',
        className,
      )}
      {...props}
    />
  );

  // 1. Рендер, якщо Є children (з обгорткою)
  if (children) {
    return (
      <span
        className={cn(
          'font-caption inline-flex min-w-0 items-center gap-1 whitespace-nowrap',
          childClassName,
        )}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </span>
    );
  }

  // 2. РЕНДЕР ЗА ЗАМОВЧУВАННЯМ (якщо children НЕМАЄ) — ВИПРАВЛЕНО!
  return renderIcon();
}
