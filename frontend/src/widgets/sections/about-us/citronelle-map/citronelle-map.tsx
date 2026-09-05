import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

interface ICitronelleMapSectionProps {
  heading: string;
  description: string;
  mapImage: Media;
  mapEmbedUrl: string;
}

export function CitronelleMapSection({
  heading,
  description,
  mapImage,
  mapEmbedUrl,
}: ICitronelleMapSectionProps) {
  return (
    <Section aria-labelledby="citronelle-heading" className="fpb-4/10">
      <Container>
        <SectionIntro
          headingId="citronelle-heading"
          heading={heading}
          description={description}
          textPosition="center"
        />
        <div
          className={cn(
            'aspect-4/3 shadow-card relative mt-8 w-full sm:aspect-video',
          )}
        >
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title="Map of Citronelle restaurant location in Kyiv"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <AppMedia
              src={mapImage.src}
              alt={mapImage.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 90vw"
              className="object-cover"
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
