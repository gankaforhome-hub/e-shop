// 'use client';

import { CategoryCard, type CategoryDTO } from '@/entities/category';
import { ScrollableContainer } from '@/shared/ui/scrollable-container';

interface ProductTypeListProps {
  categories: CategoryDTO[];
}

export function ProductTypeList({ categories }: ProductTypeListProps) {
  return (
    <ScrollableContainer indicatorType="dots" as="ul">
      {categories.map(item => (
        <li
          key={item.id}
          className="flex w-[calc((100%-24px)/3)] shrink-0 snap-start justify-center sm:w-auto"
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
