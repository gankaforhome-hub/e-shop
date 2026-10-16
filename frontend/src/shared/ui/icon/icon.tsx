import type { ComponentType, ReactNode, SVGProps } from 'react';

import {
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  AtSign,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copyright,
  Download,
  Ellipsis,
  FileText,
  Gift,
  Globe,
  Heart,
  ListFilter,
  House,
  MapPin,
  Menu,
  Minus,
  Pause,
  PhoneCall,
  Play,
  Plus,
  Search,
  ShoppingCart,
  Slash,
  SlidersHorizontal,
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
  SpinnerIcon,
  TelegramIcon,
  VisaIcon,
} from './custom-icon';

export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> | LucideProps
>;

// `satisfies` guarantees at compile time that every IconName has a component.
export const ICON_MAP = {
  'shopping-cart': ShoppingCart,
  search: Search,
  user: UserPen,
  language: Globe,
  menu: Menu,
  favorite: Heart,
  close: X,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  filter: ListFilter,
  sliders: SlidersHorizontal,
  sort: ArrowUpDown,
  x: X,
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
  download: Download,
  'file-text': FileText,
  plus: Plus,
  minus: Minus,
  check: Check,
  email: AtSign,
  home: House,
  ellipsis: Ellipsis,
  'breadcrumb-separator': Slash,
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
  spinner: SpinnerIcon,
} satisfies Record<IconName, IconComponent>;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  children?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: number | string;
  className?: string;
  classNameContainer?: string;
}

export function Icon({
  name,
  className,
  classNameContainer,
  iconPosition = 'right',
  children,
  size,
  ...props
}: IconProps) {
  const SvgIcon: IconComponent = ICON_MAP[name];

  const renderIcon = () => (
    <SvgIcon
      {...(size ? { width: size, height: size } : {})}
      className={cn(
        'duration-(--dur-normal) inline-block shrink-0 text-inherit transition-all',
        className,
      )}
      {...props}
    />
  );

  if (children) {
    return (
      <span
        className={cn(
          'font-caption inline-flex min-w-0 items-center gap-1 whitespace-nowrap',
          classNameContainer,
        )}
      >
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </span>
    );
  }

  return renderIcon();
}
