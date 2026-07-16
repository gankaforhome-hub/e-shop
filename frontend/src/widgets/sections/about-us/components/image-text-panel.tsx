import { Box } from '@/shared/ui/box';
import { Text } from '@/shared/ui/text';
import Image from 'next/image';
import type { ImageTextPanelContent } from '../api';

export function ImageTextPanel({
  image,
  paragraphs,
  imagePosition,
}: ImageTextPanelContent) {
  return (
    <Box className="fgap-4/6 flex flex-col lg:flex-row">
      <Box
        className={`min-h-85 relative aspect-square w-full overflow-hidden rounded-xl shadow-lg ${
          imagePosition === 'right' ? 'lg:order-2' : ''
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          loading="eager"
        />
      </Box>

      <Box
        className={`bg-bg-secondary 2xl:py-30 flex w-full flex-col justify-center gap-4 rounded-xl px-4 py-6 md:px-6 lg:px-5 lg:py-5 xl:px-10 xl:py-10 2xl:gap-8 2xl:px-20 ${
          imagePosition === 'right' ? 'lg:order-1' : ''
        }`}
      >
        {paragraphs.map((paragraph, index) => (
          <Text
            key={index}
            font="secondary"
            size="main"
            className="max-lg:text-wrap"
          >
            {paragraph}
          </Text>
        ))}
      </Box>
    </Box>
  );
}
