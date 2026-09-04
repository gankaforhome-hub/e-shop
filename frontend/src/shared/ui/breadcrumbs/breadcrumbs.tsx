'use client';

import { type ComponentProps, Fragment } from 'react';

import { useTranslations } from 'next-intl';

import { BREADCRUMB_KEYS } from '@/shared/config/breadcrumbs';
import { createRoute, routes } from '@/shared/config/routes';
import { usePathname } from '@/shared/i18n/navigation';
import { AppLink } from '@/shared/ui/app-link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';

type AppLinkHref = ComponentProps<typeof AppLink>['href'];

export interface CustomBreadcrumbItem {
  label: string;
  href: AppLinkHref;
}

interface BreadcrumbsProps {
  lastItemTitle?: string;
  items?: CustomBreadcrumbItem[];
}

export function Breadcrumbs({ lastItemTitle, items }: BreadcrumbsProps) {
  const t = useTranslations('common.navigation');

  const pathname = usePathname();

  const normalizedItems: CustomBreadcrumbItem[] = (() => {
    if (items && items.length > 0) {
      return items;
    }

    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => {
      const href = createRoute(`/${segments.slice(0, index + 1).join('/')}`);
      const isLast = index === segments.length - 1;

      let label = segment;

      if (isLast && lastItemTitle) {
        label = lastItemTitle;
      } else if (segment in BREADCRUMB_KEYS) {
        const jsonKey =
          BREADCRUMB_KEYS[segment as keyof typeof BREADCRUMB_KEYS];

        if (t.has(jsonKey)) {
          label = t(jsonKey);
        }
      }

      return { label, href };
    });
  })();

  const hasExplicitCustomItems = Boolean(items && items.length > 0);

  return (
    <Container className="pb-4 pt-2 md:pb-8 md:pt-4 xl:pb-16 xl:pt-8">
      <Breadcrumb
        className="text-foreground"
        aria-label={t('aria.breadcrumbs.ariaLabel')}
      >
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <AppLink
                href={routes.home}
                className="text-action-primary flex items-baseline"
              >
                <Icon
                  name="home"
                  iconPosition="left"
                  className="text-foreground size-4"
                >
                  {t('main.home')}
                </Icon>
              </AppLink>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {normalizedItems.map((item, index) => {
            const isLast =
              !hasExplicitCustomItems && index === normalizedItems.length - 1;

            return (
              <Fragment key={String(item.href)}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <AppLink href={item.href}>{item.label}</AppLink>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}

          {hasExplicitCustomItems && lastItemTitle && (
            <Fragment>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="tracking-wider">
                  {lastItemTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </Container>
  );
}
