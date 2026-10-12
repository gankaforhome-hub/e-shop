import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

/** Mirrors ProductDetailView: 7/5 grid, square gallery + thumbnail rail, sidebar. */
export function ProductDetailSkeleton() {
  return (
    <Section>
      <Container>
        <div className="grid animate-pulse grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex w-full min-w-0 flex-col gap-3 lg:col-span-7 lg:flex-row">
            <Skeleton className="aspect-square w-full rounded-none lg:order-2 lg:flex-1" />
            <div className="hidden shrink-0 flex-col gap-3 lg:order-1 lg:flex lg:w-20">
              <Skeleton className="size-20 rounded-none" />
              <Skeleton className="size-20 rounded-none" />
              <Skeleton className="size-20 rounded-none" />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-3/4 lg:h-9" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-2 h-7 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex gap-2.5">
              <Skeleton className="h-9 w-20 rounded-none" />
              <Skeleton className="h-9 w-20 rounded-none" />
            </div>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="mt-4 h-40 w-full" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
