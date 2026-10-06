import { cn } from '@/shared/lib/utils';
import { Text } from '@/shared/ui/text';

import { ContentGridSection } from '../ui';

interface IGiftPackingSection {
  title: string;
  description: string;
  images: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
  className?: string;
}

export function GiftPackingSection({
  title,
  description,
  images,
  className,
}: IGiftPackingSection) {
  return (
    <>
      <ContentGridSection
        ariaLabelledbySection="gift-packing"
        className={cn(className)}
        heading={title}
        text={
          <Text className="mx-auto px-4 md:max-w-[95%] lg:max-w-full">
            {description}
          </Text>
        }
        firstImage={{
          src: images.left.src || '',
          alt: images.left.alt || '',
        }}
        secondImage={{
          src: images.right.src || '',
          alt: images.right.alt || '',
        }}
      />
    </>
  );
}
