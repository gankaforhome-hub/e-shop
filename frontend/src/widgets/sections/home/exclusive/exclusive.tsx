import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

import { ContentGridSection } from '../ui';

interface IExclusiveSection {
  title: string;
  description: string;
  btnSeeMore: string;
  images: {
    left: { src: string; alt: string };
    right: { src: string; alt: string };
  };
  className?: string;
}

export async function ExclusiveSection({
  title = '',
  description = '',
  btnSeeMore = '',
  images,
  className,
}: IExclusiveSection) {
  return (
    <>
      <ContentGridSection
        ariaLabelledbySection="exclusive"
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
        action={
          <Button
            asChild
            variant={'outline'}
            className="sm:max-w-75 mx-auto mt-8 flex md:mt-4 xl:mt-16"
          >
            <AppLink href={routes.exclusive}>{btnSeeMore}</AppLink>
          </Button>
        }
      />
    </>
  );
}
