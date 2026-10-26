'use client';

import { type ComponentProps, Fragment, Suspense } from 'react';

import { useTranslations } from 'next-intl';

import { BREADCRUMB_KEYS } from '@/shared/config/breadcrumbs';
import { createRoute, routes } from '@/shared/config/routes';
import { usePathname } from '@/shared/i18n/navigation';
import { cn } from '@/shared/lib/utils';
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

import { BreadcrumbsSkeleton } from './breadcrumbs-skeleton';
import { BREADCRUMBS_SPACING } from './breadcrumbs-spacing';

type AppLinkHref = ComponentProps<typeof AppLink>['href'];

export interface CustomBreadcrumbItem {
  label: string;
  href: AppLinkHref;
}

interface BreadcrumbsProps {
  lastItemTitle?: string | undefined;
  /**
   * Explicit trail between Home and `lastItemTitle` (may be empty). Omit to
   * build the trail from the pathname.
   */
  items?: CustomBreadcrumbItem[];
  /** Layout only: overrides the default bottom margin per breakpoint. */
  className?: string;
}

const IGNORED_SEGMENTS = new Set(['info']);

/**
 * `usePathname()` suspends while prerendering a route's fallback shell
 * (Cache Components), so the trail streams in behind a same-size skeleton.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
  // Auto trails (/about, /info/faq…) have one item after Home
  const itemsCount = props.items
    ? props.items.length + (props.lastItemTitle ? 1 : 0)
    : 1;

  return (
    <Suspense
      fallback={
        <BreadcrumbsSkeleton
          itemsCount={itemsCount}
          className={props.className}
        />
      }
    >
      <BreadcrumbsTrail {...props} />
    </Suspense>
  );
}

function BreadcrumbsTrail({
  lastItemTitle,
  items,
  className,
}: BreadcrumbsProps) {
  const t = useTranslations('common.navigation');

  const pathname = usePathname();

  const normalizedItems: CustomBreadcrumbItem[] = (() => {
    if (items) {
      return items;
    }

    const segments = pathname.split('/').filter(Boolean);

    // 1. Спочатку відфільтровуємо ігноровані сегменти
    const filteredItems: CustomBreadcrumbItem[] = segments
      .filter(segment => !IGNORED_SEGMENTS.has(segment))
      .map(segment => {
        const originalIndex = segments.indexOf(segment);

        const href = createRoute(
          `/${segments.slice(0, originalIndex + 1).join('/')}`,
        );

        let label = segment;

        if (segment in BREADCRUMB_KEYS) {
          const jsonKey =
            BREADCRUMB_KEYS[segment as keyof typeof BREADCRUMB_KEYS];

          if (t.has(jsonKey)) {
            label = t(jsonKey);
          }
        }

        return { label, href };
      });

    // 2. Безпечно оновлюємо заголовок останнього елемента
    const lastItem = filteredItems[filteredItems.length - 1];
    if (lastItemTitle && lastItem) {
      lastItem.label = lastItemTitle;
    }

    return filteredItems;
  })();

  const hasExplicitCustomItems = items !== undefined;

  return (
    <Container className={cn(BREADCRUMBS_SPACING, className)}>
      <Breadcrumb
        spacing="top"
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
