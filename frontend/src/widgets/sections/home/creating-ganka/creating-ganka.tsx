import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface ICreatingGankaSection {
  title: string;
  subtitle: string;
  teaser: string;
  collection: string;
  slug: string;
  releaseDate: string;
  images: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
  btnSeeMore: string;
  className?: string;
}

export function CreatingGankaSection({
  title = '',
  subtitle = '',
  teaser = '',
  collection = '',
  slug = '',
  releaseDate = '',
  images,
  btnSeeMore = '',
  className,
}: ICreatingGankaSection) {
  return (
    <>
      <Section className={cn(className)} aria-labelledby="creating-ganka">
        <Container>
          <Heading
            id="creating-ganka"
            headingLevel="h2"
            variant="section"
            position="center"
          >
            {title}
          </Heading>

          <div
            className={cn(
              'grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-1 xl:grid-cols-3',
            )}
          >
            <ImageGridItem
              image={{
                src: images.left.src || '',
                alt: images.left.alt || '',
              }}
              aspect="aspect-square"
              items={3}
              className="h-full w-full"
            />

            <div
              className={cn(
                'bg-muted flex h-full min-h-80 w-full flex-col items-center justify-center p-6 text-center md:aspect-auto md:p-10',
              )}
            >
              <div className="flex max-w-[90%] flex-col items-center justify-center gap-4">
                <Text className="text-base font-normal leading-snug sm:text-lg lg:text-xl">
                  {subtitle}
                </Text>

                <Text className="text-sm leading-snug sm:text-base">
                  {teaser}:{' '}
                  <span className="text-accent-foreground font-medium">
                    {collection}
                  </span>
                </Text>
                <Text className="text-sm leading-snug sm:text-base">
                  {releaseDate}
                </Text>
              </div>

              <Button asChild className="max-md:min-w-50 mt-10">
                <AppLink
                  href={slug ? routes.collection(slug) : routes.collections}
                >
                  {btnSeeMore}
                </AppLink>
              </Button>
            </div>

            <ImageGridItem
              image={{
                src: images.right.src || '',
                alt: images.right.alt || '',
              }}
              aspect="aspect-square md:aspect-auto"
              items={3}
              className="h-full w-full md:hidden xl:block"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
