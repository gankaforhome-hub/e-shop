import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

/** Mirrors ProductDetailView: 6/6 grid from md, 7/5 from lg, square gallery + 1/5.5 thumbnail rail, sidebar. */
export function ProductDetailSkeleton() {
  return (
    <Section>
      <Container>
        <div className="lg:fgapc-0/45 grid animate-pulse grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex w-full min-w-0 flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,5.5fr)] lg:gap-6 xl:gap-8">
            <Skeleton className="aspect-square w-full rounded-none lg:order-2" />
            <div className="hidden min-w-0 flex-col gap-3 lg:order-1 lg:flex">
              <Skeleton className="aspect-square w-full rounded-none" />
              <Skeleton className="aspect-square w-full rounded-none" />
              <Skeleton className="aspect-square w-full rounded-none" />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-8 w-3/4 lg:h-9" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-2 h-7 w-1/3 md:mt-3" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2.5">
                <Skeleton className="h-9 w-12 rounded-none md:h-10 md:w-16" />
                <Skeleton className="h-9 w-12 rounded-none md:h-10 md:w-16" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Skeleton className="xl:h-18 h-14 min-w-0 flex-1 md:h-16" />
              <Skeleton className="xl:size-18 size-14 shrink-0 md:size-16" />
            </div>
            <Skeleton className="mt-4 h-40 w-full md:mt-6 lg:mt-8" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
