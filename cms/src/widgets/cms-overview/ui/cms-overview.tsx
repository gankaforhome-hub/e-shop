import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/entities/user/server';
import { getNavBlocks } from '@/features/navigation';
import { routes } from '@/shared/config';
import { AppLink } from '@/shared/ui/app-link';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { Text } from '@/shared/ui/text';

/** CMS home (overview): one card per README block the user can access, with its sections. */
export async function CmsOverview() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);
  // Every block but the overview itself, which only links back here
  const blocks = getNavBlocks(user.role).flatMap(block => {
    const items = block.items.filter(item => item.href !== routes.home);

    return items.length > 0 ? [{ ...block, items }] : [];
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={t('sections.overview.home.title')}
        description={t('sections.overview.home.description')}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blocks.map(block => {
          const headingId = `block-${block.id}`;

          return (
            <Card
              key={block.id}
              role="region"
              aria-labelledby={headingId}
              className="min-w-0"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-brand">
                  <Icon name={block.icon} className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <Heading headingLevel="h2" variant="card" id={headingId}>
                    {t(`nav.groups.${block.id}.label`)}
                  </Heading>
                  <Text size="sm" variant="muted">
                    {t(`nav.groups.${block.id}.description`)}
                  </Text>
                </div>
              </div>
              <ul className="-mx-2 flex flex-col">
                {block.items.map(item => (
                  <li key={item.section}>
                    <AppLink
                      href={item.href}
                      className="group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground transition-colors duration-(--dur-fast) hover:bg-accent hover:text-foreground-emphasis"
                    >
                      <Icon
                        name={item.icon}
                        className="text-muted-foreground transition-colors duration-(--dur-fast) group-hover:text-brand"
                      />
                      <span className="flex-1 truncate">
                        {t(`sections.${item.section}.title`)}
                      </span>
                      <Icon
                        name="arrow-right"
                        className="-translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-(--dur-fast) group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
