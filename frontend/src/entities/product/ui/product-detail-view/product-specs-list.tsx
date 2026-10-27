import { Text } from '@/shared/ui/text';

import { type ProductSpec } from '../../lib/product-specs';

interface ProductSpecsListProps {
  specs: ProductSpec[];
}

/** Plain key-value list in neutral ink (muted name · value), sentence case, no panel or rules. */
export function ProductSpecsList({ specs }: ProductSpecsListProps) {
  if (specs.length === 0) {
    return null;
  }

  return (
    <dl className="flex flex-col gap-2">
      {specs.map(spec => (
        <div
          key={spec.key}
          className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-baseline gap-4"
        >
          <Text as="dt" variant="muted" size="document">
            {spec.name}
          </Text>
          <Text as="dd" size="document">
            {spec.value}
          </Text>
        </div>
      ))}
    </dl>
  );
}
