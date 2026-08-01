import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { ContentGridSection } from '../ui';

interface IExclusiveSection {
  className?: string;
}

export function ExclusiveSection({ className }: IExclusiveSection) {
  return (
    <>
      <ContentGridSection
        className={cn(className)}
        heading="Exclusive from Ganka"
        text={
          <Text className="text-text-secondary max-w-[90%] text-sm leading-relaxed md:text-center">
            Ukrainian artist Ganka Tretyak transferred her rich artistic
            experience to the new homeware project Ganka for Home. Ganka for
            Home collections will bring a festive atmosphere and warmth to your
            home...
          </Text>
        }
        firstImage={{
          src: '/images/home/exclusive-plate-with-fruits-on-table.webp',
          alt: 'exclusive-plate-with-fruits-on-table',
        }}
        secondImage={{
          src: '/images/home/exclusive-plate-with-rabbits.webp',
          alt: 'exclusive-plate-with-rabbits',
        }}
        action={
          <Button
            asChild
            variant={'outline'}
            className="fmt-8/16 sm:max-w-75 mx-auto flex"
          >
            <AppLink href={routes.exclusive}>See More</AppLink>
          </Button>
        }
      />
    </>
  );
}
