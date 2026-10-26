// 'use client';

import { CategoryCard, type CategoryDTO } from '@/entities/category';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';

interface ProductTypeListProps {
  categories: CategoryDTO[];
  className?: string;
}

export function ProductTypeList({
  categories,
  className,
}: ProductTypeListProps) {
  return (
    <ScrollableContainer
      indicatorType="dots"
      as="ul"
      // Below sm ~3.5 items per view: 3 full gaps (3 × 12px) + 3.5 widths;
      // min-w-20 keeps the 80px circle inside its item on 320px screens
      gapClassName="gap-3 md:gap-4 lg:gap-8 xl:gap-10 2xl:gap-12"
      // The scroller clips both axes (overflow-x forces overflow-y): room for
      // the card's hover scale + shadow, cancelled by negative margins so the
      // list keeps its box; scroll-px keeps snap points where they were
      scrollClassName="-mx-3 -my-2 w-[calc(100%+1.5rem)] scroll-px-3 px-3 py-4"
      className={className}
    >
      {categories.map(item => (
        <li
          key={item.id}
          className="flex w-[calc((100%-36px)/3.5)] min-w-20 shrink-0 snap-start justify-center sm:w-auto"
        >
          <CategoryCard
            slug={item.slug}
            title={item.title}
            image={item.image}
          />
        </li>
      ))}
    </ScrollableContainer>
  );
}
