import { CollectionCard, getCollectionsPage } from '@/entities/collection';
import { CatalogFeed } from '@/features/catalog-pagination';
import { routes } from '@/shared/config/routes';
import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { parsePage } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

import {
  collectionsBatchGapClassName,
  collectionsGridClassName,
} from './collections-grid-layout';
import { CollectionsGridSkeleton } from './collections-skeleton';

/** Raw request query; only `?page=` is read. */
export type CollectionsSearchParams = Record<
  string,
  string | string[] | undefined
>;

interface ICollectionsSectionProps {
  lang: Locale;
  /** Request-time query; awaited inside the Suspense boundary. */
  searchParams: Promise<CollectionsSearchParams>;
}

/**
 * All collections, paginated like the catalog (`?page=`, 12 per page) with
 * "Load more", a progress line counting collections and numbered links.
 */
export async function CollectionsSection({
  lang,
  searchParams,
}: ICollectionsSectionProps) {
  const { page } = await searchParams;
  const [{ collections: collectionsDict }, { data, meta }] = await Promise.all([
    getDictionary(['collections'], lang),
    getCollectionsPage({ lang, page: parsePage(page) }),
  ]);

  return (
    <Section>
      <Container>
        <Heading headingLevel="h1" variant="pageHeader" visibility="hidden">
          {collectionsDict.collectionsHero.pageTitle}
        </Heading>
        {meta.total === 0 ? (
          // No collections yet, or the API is down (the DAL serves `[]`)
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Heading headingLevel="h2" variant="section">
              {collectionsDict.emptyState.title}
            </Heading>
            <Text as="p">{collectionsDict.emptyState.description}</Text>
            <Button asChild>
              <AppLink href={routes.products()}>
                {collectionsDict.emptyState.cta}
              </AppLink>
            </Button>
          </div>
        ) : (
          <CatalogFeed
            unit="collections"
            page={meta.page}
            total={meta.total}
            pageSize={meta.limit}
            pageHrefs={Array.from({ length: meta.totalPages }, (_, index) =>
              routes.collectionsPage(index + 1),
            )}
            queryKey={routes.collections}
            listClassName={collectionsBatchGapClassName}
            skeleton={
              // Size of the next batch; 0 on the last page (no "Load more")
              <CollectionsGridSkeleton
                count={Math.max(
                  0,
                  Math.min(meta.limit, meta.total - meta.page * meta.limit),
                )}
              />
            }
          >
            <ul className={collectionsGridClassName}>
              {data.map(collection => (
                <li key={collection.id}>
                  <CollectionCard collection={collection} />
                </li>
              ))}
            </ul>
          </CatalogFeed>
        )}
      </Container>
    </Section>
  );
}
