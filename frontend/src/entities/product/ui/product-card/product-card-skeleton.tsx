import { Box } from '@/shared/ui/box';

export const ProductCardSkeleton = () => {
  return (
    <article className="flex h-full animate-pulse flex-col overflow-hidden rounded-lg">
      {/* Квадратне зображення */}
      <Box className="rounded-card aspect-square w-full bg-gray-200" />

      {/* Контент під зображенням */}
      <Box className="flex flex-1 flex-col justify-between gap-1 p-2 pt-2">
        <Box className="flex flex-col gap-1.5">
          {/* Категорія */}
          <Box className="h-3 w-1/3 rounded bg-gray-200" />

          {/* Назва товару (2 рядки для імітації line-clamp-2) */}
          <Box className="space-y-1">
            <Box className="h-4 w-full rounded bg-gray-200" />
            <Box className="h-4 w-3/4 rounded bg-gray-200" />
          </Box>
        </Box>

        {/* Ціна та статус */}
        <Box className="flex items-center justify-between pt-2">
          <Box className="h-4 w-20 rounded bg-gray-200" />
          <Box className="h-4 w-12 rounded-2xl bg-gray-200" />
        </Box>
      </Box>
    </article>
  );
};
