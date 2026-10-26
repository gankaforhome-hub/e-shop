import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

interface IOurStorySectionProps {
  heading: string;
  description: string;
  image: Media;
}

export function OurStorySection({
  heading,
  description,
  image,
}: IOurStorySectionProps) {
  return (
    <Section aria-labelledby="our-story-heading">
      <Container>
        <SectionIntro
          headingId="our-story-heading"
          heading={heading}
          description={description}
        />
        <div className="shadow-card 2xl:aspect-1754/988 relative aspect-square sm:aspect-video">
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
