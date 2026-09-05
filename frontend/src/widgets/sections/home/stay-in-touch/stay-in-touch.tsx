import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { ImageGridItem } from '@/shared/ui/image-grid-item';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface IStayInTouchSection {
  title: string;
  brandSubtitle: string;
  description: string;
  btnSeeMore: string;
  images: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
  className?: string;
}
export function StayInTouchSection({
  title,
  brandSubtitle,
  description,
  btnSeeMore,
  images,
  className,
}: IStayInTouchSection) {
  return (
    <Section className={cn(className)} aria-labelledby="stay-in-touch">
      <Container>
        <Heading
          id="stay-in-touch"
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
            aspect="aspect-343/331 md:h-full"
            items={3}
          />
          <div
            className={cn(
              'bg-muted flex h-full min-h-80 flex-col items-center justify-center p-6 md:aspect-auto xl:p-10',
              'max-sm:w-full',
            )}
          >
            <div className="flex max-w-[90%] flex-col items-center gap-4">
              <Text
                variant="accent"
                className="text-center font-semibold uppercase leading-tight tracking-widest"
              >
                {brandSubtitle}
              </Text>
              <Text className="text-justify indent-8 text-sm leading-relaxed max-lg:indent-4 lg:text-base">
                {description}
              </Text>
            </div>

            <Button asChild className="max-md:min-w-50 mt-6">
              <AppLink href={routes.contacts}>{btnSeeMore}</AppLink>
            </Button>
          </div>
          <ImageGridItem
            image={{
              src: images.right.src || '',
              alt: images.right.alt || '',
            }}
            aspect="aspect-343/331 md:h-full"
            items={3}
            className="md:hidden xl:block"
          />
        </div>
      </Container>
    </Section>
  );
}
