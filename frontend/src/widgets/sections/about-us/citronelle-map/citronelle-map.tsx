import { cn } from '@/shared/lib/utils';
import { type Media } from '@/shared/types';
import { AppMedia } from '@/shared/ui/app-media';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';
import { Text } from '@/shared/ui/text';

interface ICitronelleMapSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  addressTitle: string;
  addressText: string;
  mapImage: Media;
  mapEmbedUrl: string;
}

// export function CitronelleMapSection({
//   heading,
//   description,
//   mapImage,
//   mapEmbedUrl,
// }: ICitronelleMapSectionProps) {
//   return (
//     <Section aria-labelledby="citronelle-heading" className="fpb-4/10">
//       <Container>
//         <SectionIntro
//           headingId="citronelle-heading"
//           heading={heading}
//           description={description}
//           textPosition="center"
//         />
//         <div
//           className={cn(
//             'aspect-4/3 shadow-card relative mt-8 w-full sm:aspect-video',
//           )}
//         >
//           {mapEmbedUrl ? (
//             <iframe
//               src={mapEmbedUrl}
//               title="Map of Citronelle restaurant location in Kyiv"
//               className="absolute inset-0 h-full w-full border-0"
//               loading="lazy"
//               allowFullScreen
//               referrerPolicy="no-referrer-when-downgrade"
//             />
//           ) : (
//             <AppMedia
//               src={mapImage.src}
//               alt={mapImage.alt}
//               fill
//               sizes="(min-width: 1024px) 1100px, 90vw"
//               className="object-cover"
//             />
//           )}
//         </div>
//       </Container>
//     </Section>
//   );
// }
export function CitronelleMapSection({
  eyebrow,
  heading = '',
  description = '',
  addressTitle = '',
  addressText = '',
  mapImage,
  mapEmbedUrl,
}: ICitronelleMapSectionProps) {
  return (
    <Section
      aria-labelledby="citronelle-heading"
      spacing="editorial"
      className="fpb-10/24"
    >
      <Container>
        <SectionHeader
          headingId="citronelle-heading"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />
        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-12 md:items-stretch lg:mt-10 xl:mt-16">
          <div
            className={cn(
              'bg-surface-warm fgap-3/4 fpx-6/12 fpy-8/16 flex w-full flex-col justify-center',
              'md:col-span-4 lg:col-span-4',
            )}
          >
            <Heading headingLevel="h3" variant="subsection">
              {addressTitle}
            </Heading>
            <Text size="lead">{addressText}</Text>
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
