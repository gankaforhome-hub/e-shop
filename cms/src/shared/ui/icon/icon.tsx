import { type ComponentType, type SVGProps } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  ChartLine,
  Check,
  CircleUserRound,
  FileChartColumn,
  Files,
  FolderTree,
  GalleryHorizontalEnd,
  Inbox,
  Languages,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  Library,
  Megaphone,
  Menu,
  Moon,
  Newspaper,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  SquareStack,
  Store,
  Sun,
  Tags,
  Warehouse,
  X,
  type LucideProps,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { LogoIcon } from './custom-icon';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> | LucideProps>;

/** The only Lucide import point of the CMS; names describe purpose, not shape. */
export const ICON_MAP = {
  logo: LogoIcon,

  // README blocks
  content: LayoutTemplate,
  catalog: Store,
  overview: LayoutGrid,

  // Content
  pages: Files,
  blog: Newspaper,
  banners: GalleryHorizontalEnd,
  marketing: Megaphone,
  forms: Inbox,

  // Catalog
  products: Package,
  inventory: Warehouse,
  collections: Library,
  categories: FolderTree,
  attributes: Tags,

  // Operations
  dashboard: LayoutDashboard,
  analytics: ChartLine,
  orders: ShoppingBag,
  reports: FileChartColumn,

  // System
  settings: Settings,
  account: CircleUserRound,
  section: SquareStack,

  // Interface
  menu: Menu,
  close: X,
  'sidebar-collapse': PanelLeftClose,
  'sidebar-expand': PanelLeftOpen,
  sun: Sun,
  moon: Moon,
  language: Languages,
  check: Check,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof ICON_MAP;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

/** Decorative by default (`aria-hidden`): label the interactive parent instead. */
export function Icon({ name, className, ...props }: IconProps) {
  const SvgIcon: IconComponent = ICON_MAP[name];

  return (
    <SvgIcon
      aria-hidden
      focusable="false"
      className={cn('size-4 shrink-0', className)}
      {...props}
    />
  );
}
