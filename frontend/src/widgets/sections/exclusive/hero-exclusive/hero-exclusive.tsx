import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface IExclusiveHeroProps {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
}

export const HeroExclusive = ({
  title,
  description,
  image,
}: IExclusiveHeroProps) => {
  return (
    <Section aria-labelledby="hero-exclusive">
      <Container>
        <Heading
          id="hero-exclusive"
          headingLevel="h2"
          variant="section"
          visibility="hidden"
          className="mb-8 md:mb-6 xl:mb-16"
        >
          {title}
        </Heading>

        <div className="grid grid-cols-1 gap-6 md:relative md:grid-cols-1 md:gap-0">
          <div className="aspect-4/3 relative w-full overflow-hidden md:aspect-video">
            <AppMedia
              src={image.src || ''}
              alt={image.alt || ''}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1200px"
              className="object-cover object-[100%_center] sm:object-[80%_center] md:object-center"
            />
          </div>

          <div className="md:absolute md:left-[14%] md:top-[70%] md:w-[38%] md:-translate-y-1/2 max-lg:md:left-[10%] max-lg:md:w-[42%]">
            <Text
              size="none"
              className="md:text-foreground text-base md:text-sm md:leading-tight lg:text-base lg:leading-normal xl:text-xl"
            >
              {description}
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
};
