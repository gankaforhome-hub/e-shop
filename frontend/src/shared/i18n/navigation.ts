import { type ComponentProps } from 'react';

import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type I18nHref = ComponentProps<typeof Link>['href'];
