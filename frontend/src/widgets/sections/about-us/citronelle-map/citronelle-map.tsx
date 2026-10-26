import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';
import { Text } from '@/shared/ui/text';

interface ICitronelleMapSectionProps {
  heading: string;
  description: string;
  addressTitle: string;
  addressText: string;
  mapImage: Media;
  mapEmbedUrl: string;
}

export function CitronelleMapSection({
  heading = '',
  description = '',
  addressTitle = '',
  addressText = '',
  mapImage,
  mapEmbedUrl,
}: ICitronelleMapSectionProps) {
  return (
    <Section aria-labelledby="citronelle-heading" className="fpb-4/10 py-8">
      <Container>
        <SectionIntro
          headingId="citronelle-heading"
          heading={heading}
          description={description}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-stretch">
          <div
            className={cn(
              'bg-muted 2xl:py-30 flex w-full flex-col justify-center gap-4 px-4 py-6 md:px-6 lg:px-5 lg:py-5 xl:px-10 xl:py-10 2xl:gap-8 2xl:px-20',
              'md:col-span-4 lg:col-span-4',
            )}
          >
            <Heading
              headingLevel="h3"
              variant="textPanel"
              className="font-semibold"
            >
              {addressTitle}:
            </Heading>
            <Text className="leading-relaxed">{addressText}</Text>
          </div>

          <div className="shadow-card min-h-87.5 relative w-full md:col-span-8 lg:col-span-8">
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="Map of Citronelle restaurant location in Kyiv"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : mapImage ? (
              <AppMedia
                src={mapImage.src}
                alt={mapImage.alt}
                fill
                sizes="(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
