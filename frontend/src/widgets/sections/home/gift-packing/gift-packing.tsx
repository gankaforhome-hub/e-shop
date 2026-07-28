import { cn } from '@/shared/lib/utils';
import { Text } from '@/shared/ui/text';

import { ContentGridSection } from '../ui';

interface IGiftPackingSection {
  className?: string;
}

export function GiftPackingSection({ className }: IGiftPackingSection) {
  return (
    <>
      <ContentGridSection
        className={cn(className)}
        heading="Gift Packing"
        text={
          <Text className="text-text-secondary max-w-[90%] text-sm leading-relaxed">
            Ukrainian artist Ganka Tretyak transferred her rich artistic
            experience to the new homeware project Ganka for Home. Ganka for
            Home collections will bring a festive atmosphere and warmth to your
            home...
          </Text>
        }
        firstImage={{
          src: '/images/home/gift-red-package-with-plate.webp',
          alt: 'gift-red-package-with-plate',
        }}
        secondImage={{
          src: '/images/home/gift-black-package.webp',
          alt: 'gift-black-package',
        }}
      />
    </>
  );
}
