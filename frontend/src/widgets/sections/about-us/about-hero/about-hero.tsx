import { type AboutHeroContent } from '@/shared/content/about-us';
import { Container } from '@/shared/ui/container';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

export function AboutHeroSection({
  heading,
  description,
  panel,
}: AboutHeroContent) {
  return (
    <>
      <Section aria-labelledby="about-ganka-heading">
        <Container>
          <SectionIntro
            heading={heading}
            description={description}
            headingId="about-ganka-heading"
            textPosition="center"
          />
          <ImageTextPanel {...panel} className="fmt-4/16" />
        </Container>
      </Section>
    </>
  );
}
