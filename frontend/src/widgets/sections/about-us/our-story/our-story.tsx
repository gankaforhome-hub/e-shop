import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';

interface OurStorySectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  image: Media;
}

export function OurStorySection({
  eyebrow,
  heading,
  description,
  image,
}: OurStorySectionProps) {
  return (
    <Section spacing="editorial" aria-labelledby="our-story-heading">
      <Container>
        <SectionHeader
          headingId="our-story-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />
        <div className="2xl:aspect-1754/988 relative mt-4 aspect-square sm:aspect-video md:mt-8 lg:mt-10 xl:mt-16">
          <AppMedia
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 1100px, 90vw"
            className="object-cover"
          />
        </div>
      </Container>
    </Section>
  );
}
