// 'use client';

// import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// import { type Locale } from '@/shared/i18n/routing';
// import { formatMoney } from '@/shared/lib/utils';
// import { Button } from '@/shared/ui/button';
// import { Heading } from '@/shared/ui/heading';

// import { type TProduct } from '../../lib/product-mapper';
// import { type ProductVariantTranslation } from '../../model/types';

// interface ProductInfoSidebarProps {
//   product: TProduct;
//   selectedVariant?: ProductVariantTranslation;
//   label: {
//     collection: string;
//     price: string;
//     sku: string;
//     addToBag: string;
//   };
//   lang: Locale;
// }

// export function ProductInfoSidebar({
//   product,
//   selectedVariant,
//   label,
//   lang,
// }: ProductInfoSidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const currentPrice = selectedVariant?.price ?? { amount: 0, currency: 'UAH' };

//   const handleSelectVariant = (variant: ProductVariantTranslation) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('variant', variant.sku);
//     if (variant.mediaId) {
//       params.set('media', variant.mediaId);
//     }
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   return (
//     <div className="flex flex-col space-y-6">
//       <div>
//         <Heading
//           headingLevel="h1"
//           variant="productPage"
//           className="tracking-tight"
//         >
//           {product.title}
//         </Heading>

//         {product.primaryCollection?.title && (
//           <p className="mt-2 text-sm font-medium md:text-base">
//             {label.collection}:{' '}
//             <span className="text-accent-foreground underline">
//               {product.primaryCollection.title}
//             </span>
//           </p>
//         )}

//         <div className="mt-4 flex items-center gap-3">
//           <span className="text-icon text-lg font-medium md:text-xl">
//             {label.price}:{' '}
//             {formatMoney(
//               {
//                 amount: currentPrice.amount,
//                 currency: currentPrice.currency,
//               },
//               lang,
//             )}
//           </span>
//           {selectedVariant?.compareAtPrice && (
//             <span className="text-sm text-neutral-400 line-through md:text-base">
//               {formatMoney(
//                 {
//                   amount: selectedVariant.compareAtPrice.amount,
//                   currency: selectedVariant.compareAtPrice.currency,
//                 },
//                 lang,
//               )}
//             </span>
//           )}
//         </div>

//         <p className="mt-2">
//           {label.sku}: {selectedVariant?.sku || 'N/A'}
//         </p>
//       </div>

//       {product.variants.length > 1 && (
//         <div className="space-y-3">
//           <label className="text-sm font-medium text-neutral-700">
//             {product.variants[0]?.options[0]?.name || t('selectOption')}:
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {product.variants.map(variant => {
//               const isSelected = variant.id === selectedVariant?.id;
//               const optionLabel = variant.options[0]?.value || variant.sku;

//               return (
//                 <button
//                   key={variant.id}
//                   onClick={() => handleSelectVariant(variant)}
//                   className={`cursor-pointer border px-4 py-2 text-sm font-medium transition-all ${
//                     isSelected
//                       ? 'border-neutral-900 bg-neutral-900 text-white'
//                       : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
//                   }`}
//                 >
//                   {optionLabel}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <Button
//         variant="default"
//         className="w-full bg-[#A33333] py-6 text-base font-medium text-white shadow-none hover:bg-[#8B2B2B]"
//       >
//         {label.addToBag}
//       </Button>
//     </div>
//   );
// }
'use client';

import { useTransition } from 'react';

import { useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from '@/shared/i18n/navigation';
import { type Locale } from '@/shared/i18n/routing';
import { formatMoney } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/ui/heading';

import { type TProduct } from '../../lib/product-mapper';
import { type ProductVariantTranslation } from '../../model/types';

interface ProductInfoSidebarProps {
  product: TProduct;
  selectedVariant?: ProductVariantTranslation;
  label: {
    collection: string;
    price: string;
    sku: string;
    addToBag: string;
  };
  lang: Locale;
}

// export function ProductInfoSidebar({
//   product,
//   selectedVariant,
//   label,
//   lang,
// }: ProductInfoSidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const currentPrice = selectedVariant?.price ?? { amount: 0, currency: 'UAH' };

//   // 1. Групування опцій
//   const optionsGrouped = useMemo(() => {
//     const groups: Record<
//       string,
//       {
//         key: string;
//         values: { valueKey: string; label: string; hex?: string }[];
//       }
//     > = {};

//     product.variants.forEach(variant => {
//       variant.options?.forEach(opt => {
//         const groupName = opt.name || opt.nameKey;
//         if (!groups[groupName]) {
//           groups[groupName] = { key: opt.nameKey, values: [] };
//         }

//         const exists = groups[groupName].values.some(
//           v => v.valueKey === opt.valueKey,
//         );
//         if (!exists) {
//           groups[groupName].values.push({
//             valueKey: opt.valueKey,
//             label: opt.value || opt.valueKey,
//             // якщо колір приходить окремим полем (наприклад opt.hex або opt.color)
//             // hex: (opt as Record<string, unknown>).hex as string | undefined,
//           });
//         }
//       });
//     });

//     return groups;
//   }, [product.variants]);

//   // 1. Хелпер перевірки: чи доступне значення опції З УРАХУВАННЯМ поточного контексту інших опцій
//   const isOptionAvailable = (targetNameKey: string, targetValueKey: string) => {
//     if (!selectedVariant) {
//       return false;
//     }

//     // Формуємо тимчасову мапу, де змінюємо ТІЛЬКИ досліджувану опцію
//     const targetMap: Record<string, string> = {};
//     selectedVariant.options?.forEach(opt => {
//       targetMap[opt.nameKey] = opt.valueKey;
//     });
//     targetMap[targetNameKey] = targetValueKey;

//     // Шукаємо, чи існує такий SKU і чи є він в наявності
//     return product.variants.some(variant => {
//       const matchesAll = Object.entries(targetMap).every(([nKey, vKey]) =>
//         variant.options?.some(o => o.nameKey === nKey && o.valueKey === vKey),
//       );

//       const isInStock = variant.stock
//         ? variant.stock.quantity > 0 || variant.stock.status === 'pre_order'
//         : true;

//       return matchesAll && isInStock;
//     });
//   };

//   // 2. Хендлер перемикання опцій із записом УСІХ параметрів в URL
//   const handleOptionSelect = (
//     optionNameKey: string,
//     targetValueKey: string,
//   ) => {
//     if (!selectedVariant) {
//       return;
//     }

//     // Крок A: Беремо поточний набір обраних опцій (наприклад: { diameter: '20cm', color: 'red' })
//     const nextOptionsMap: Record<string, string> = {};
//     selectedVariant.options?.forEach(opt => {
//       nextOptionsMap[opt.nameKey] = opt.valueKey;
//     });

//     // Крок B: Оновлюємо значення обраної опції
//     nextOptionsMap[optionNameKey] = targetValueKey;

//     // Крок C: Точний пошук варіанта за ВСІМА комбінаціями опцій
//     let nextVariant = product.variants.find(variant =>
//       Object.entries(nextOptionsMap).every(([nKey, vKey]) =>
//         variant.options?.some(o => o.nameKey === nKey && o.valueKey === vKey),
//       ),
//     );

//     // Крок D: Фолбек — якщо для обраного діаметра даного кольору немає,
//     // шукаємо будь-який перший доступний варіант з цим кольором
//     if (!nextVariant) {
//       nextVariant = product.variants.find(v =>
//         v.options?.some(
//           o => o.nameKey === optionNameKey && o.valueKey === targetValueKey,
//         ),
//       );
//     }

//     // Крок E: Синхронізація URL
//     if (nextVariant) {
//       const params = new URLSearchParams(searchParams.toString());

//       // 1. Записуємо ВСІ корисні опції варіанта в URL (колір, діаметр тощо)
//       // nextVariant.options?.forEach(opt => {
//       //   params.set(opt.nameKey, opt.valueKey);
//       // });

//       // 2. Записуємо SKU варіанта
//       if (nextVariant.sku) {
//         params.set('variant', nextVariant.sku);
//       } else {
//         params.delete('variant');
//       }

//       // 3. Записуємо Media ID для галереї
//       // if (nextVariant.mediaId) {
//       //   params.set('media', nextVariant.mediaId);
//       // } else {
//       //   params.delete('media');
//       // }

//       // Виконуємо перехід без скролу
//       router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//     }
//   };
//   return (
//     <div className="flex flex-col space-y-6">
//       <div>
//         <Heading
//           headingLevel="h1"
//           variant="productPage"
//           className="tracking-tight"
//         >
//           {product.title}
//         </Heading>

//         {product.primaryCollection?.title && (
//           <p className="mt-2 text-sm font-medium md:text-base">
//             {label.collection}:{' '}
//             <span className="text-accent-foreground underline">
//               {product.primaryCollection.title}
//             </span>
//           </p>
//         )}

//         <div className="mt-4 flex items-center gap-3">
//           <span className="text-icon text-lg font-medium md:text-xl">
//             {label.price}:{' '}
//             {formatMoney(
//               { amount: currentPrice.amount, currency: currentPrice.currency },
//               lang,
//             )}
//           </span>
//           {selectedVariant?.compareAtPrice && (
//             <span className="text-sm text-neutral-400 line-through md:text-base">
//               {formatMoney(
//                 {
//                   amount: selectedVariant.compareAtPrice.amount,
//                   currency: selectedVariant.compareAtPrice.currency,
//                 },
//                 lang,
//               )}
//             </span>
//           )}
//         </div>

//         <p className="mt-2 text-sm text-neutral-500">
//           {label.sku}: {selectedVariant?.sku || 'N/A'}
//         </p>
//       </div>

//       {/* Опції з підтримкою стану Disabled / Перекреслено */}
//       {product.variants.length > 1 && (
//         <div className="space-y-4">
//           {Object.entries(optionsGrouped).map(([groupTitle, groupData]) => {
//             const isColorGroup =
//               groupData.key === 'color' || groupData.key === 'glaze';

//             return (
//               <div key={groupData.key} className="space-y-2">
//                 <label className="text-sm font-medium capitalize text-neutral-700">
//                   {groupTitle}:
//                 </label>

//                 <div className="flex flex-wrap items-center gap-2.5">
//                   {groupData.values.map(optValue => {
//                     const isSelected = selectedVariant?.options?.some(
//                       o =>
//                         o.nameKey === groupData.key &&
//                         o.valueKey === optValue.valueKey,
//                     );
//                     const isAvailable = isOptionAvailable(
//                       groupData.key,
//                       optValue.valueKey,
//                     );

//                     // 1. КОЛІР (кружечок з диагональною лінією)
//                     if (isColorGroup) {
//                       const colorStyle =
//                         optValue.hex ||
//                         (optValue.valueKey.startsWith('#')
//                           ? optValue.valueKey
//                           : optValue.label);

//                       return (
//                         <div
//                           key={optValue.valueKey}
//                           className="flex flex-col items-center gap-1"
//                         >
//                           <button
//                             type="button"
//                             disabled={!isAvailable}
//                             title={`${optValue.label}${!isAvailable ? ' (Немає в наявності)' : ''}`}
//                             onClick={() =>
//                               handleOptionSelect(
//                                 groupData.key,
//                                 optValue.valueKey,
//                               )
//                             }
//                             className={`relative size-7 rounded-full p-0.5 transition-transform ${
//                               !isAvailable
//                                 ? 'cursor-not-allowed opacity-35'
//                                 : 'cursor-pointer hover:scale-110'
//                             }`}
//                           >
//                             <span
//                               className="relative block size-full overflow-hidden rounded-full border border-black/10 shadow-inner"
//                               style={{ backgroundColor: colorStyle }}
//                             >
//                               {!isAvailable && (
//                                 <span className="absolute inset-0 m-auto h-[1px] w-[140%] -rotate-45 bg-neutral-600" />
//                               )}
//                             </span>
//                             <span className="sr-only">{optValue.label}</span>
//                           </button>

//                           {/* Маленька акуратна точка під обраним кольором */}
//                           <span
//                             className={`size-1 rounded-full bg-neutral-900 transition-all ${
//                               isSelected
//                                 ? 'scale-100 opacity-100'
//                                 : 'scale-0 opacity-0'
//                             }`}
//                           />
//                         </div>
//                       );
//                     }

//                     // 2. ІНШІ ОПЦІЇ (наприклад, Діаметр)
//                     return (
//                       <button
//                         key={optValue.valueKey}
//                         type="button"
//                         disabled={!isAvailable}
//                         onClick={() =>
//                           handleOptionSelect(groupData.key, optValue.valueKey)
//                         }
//                         className={`relative border px-4 py-2 text-sm font-medium transition-all ${
//                           !isAvailable
//                             ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 opacity-60'
//                             : 'cursor-pointer'
//                         } ${
//                           isSelected
//                             ? 'border-neutral-900 bg-neutral-900 text-white'
//                             : isAvailable
//                               ? 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
//                               : ''
//                         }`}
//                       >
//                         {optValue.label}
//                         {!isAvailable && (
//                           <span className="absolute inset-0 m-auto h-px w-full -rotate-12 bg-neutral-400" />
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       <p>
//         {selectedVariant?.stock?.status === 'pre_order' && 'Передзамовлення'}
//       </p>
//       <Button
//         variant="default"
//         disabled={
//           !selectedVariant?.stock?.quantity &&
//           !(selectedVariant?.stock?.status === 'pre_order')
//         }
//         className="w-full bg-[#A33333] py-6 text-base font-medium text-white shadow-none hover:bg-[#8B2B2B] disabled:bg-neutral-300"
//       >
//         {label.addToBag}
//       </Button>
//     </div>
//   );
// }

export function ProductInfoSidebar({
  product,
  selectedVariant,
  label,
  lang,
}: ProductInfoSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPrice = selectedVariant?.price ?? { amount: 0, currency: 'UAH' };

  // 1. Групування унікальних опцій (без зайвих useMemo)
  const optionsGrouped = product.variants.reduce<
    Record<
      string,
      { key: string; values: Map<string, { label: string; hex?: string }> }
    >
  >((acc, variant) => {
    variant.options?.forEach(opt => {
      const groupName = opt.name || opt.nameKey;
      if (!acc[groupName]) {
        acc[groupName] = { key: opt.nameKey, values: new Map() };
      }
      if (!acc[groupName].values.has(opt.valueKey)) {
        acc[groupName].values.set(opt.valueKey, {
          label: opt.value || opt.valueKey,
        });
      }
    });
    return acc;
  }, {});

  // 2. Перевірка доступності комбінації
  const isOptionAvailable = (targetNameKey: string, targetValueKey: string) => {
    if (!selectedVariant) {
      return false;
    }

    return product.variants.some(variant => {
      const matchesTarget = variant.options?.some(
        o => o.nameKey === targetNameKey && o.valueKey === targetValueKey,
      );
      if (!matchesTarget) {
        return false;
      }

      const matchesOthers = selectedVariant.options
        ?.filter(o => o.nameKey !== targetNameKey)
        .every(selectedOpt =>
          variant.options?.some(
            o =>
              o.nameKey === selectedOpt.nameKey &&
              o.valueKey === selectedOpt.valueKey,
          ),
        );

      const isInStock = variant.stock
        ? variant.stock.quantity > 0 || variant.stock.status === 'pre_order'
        : true;

      return matchesOthers && isInStock;
    });
  };

  // 3. Лаконічний та швидкий хендлер вибору
  const handleOptionSelect = (
    optionNameKey: string,
    targetValueKey: string,
  ) => {
    if (!selectedVariant) {
      return;
    }

    const currentOptionsMap = new Map(
      selectedVariant.options?.map(opt => [opt.nameKey, opt.valueKey]),
    );
    currentOptionsMap.set(optionNameKey, targetValueKey);

    // Точний пошук варіанта за всіма обраними опціями
    let nextVariant = product.variants.find(variant =>
      Array.from(currentOptionsMap.entries()).every(([nKey, vKey]) =>
        variant.options?.some(o => o.nameKey === nKey && o.valueKey === vKey),
      ),
    );

    // Фолбек: перший доступний варіант з цією опцією
    if (!nextVariant) {
      nextVariant = product.variants.find(v =>
        v.options?.some(
          o => o.nameKey === optionNameKey && o.valueKey === targetValueKey,
        ),
      );
    }

    if (nextVariant?.sku) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('variant', nextVariant.sku);

      // Використовуємо useTransition для збереження плавності UI при зміні URL
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }
  };

  const isAvailableForPurchase =
    selectedVariant?.stock?.quantity ||
    selectedVariant?.stock?.status === 'pre_order';

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Heading
          headingLevel="h1"
          variant="productPage"
          className="tracking-tight"
        >
          {product.title}
        </Heading>

        {product.primaryCollection?.title && (
          <p className="mt-2 text-sm font-medium md:text-base">
            {label.collection}:{' '}
            <span className="text-accent-foreground underline">
              {product.primaryCollection.title}
            </span>
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span className="text-lg font-medium md:text-xl">
            {label.price}: {formatMoney(currentPrice, lang)}
          </span>
          {selectedVariant?.compareAtPrice && (
            <span className="text-commerce-price-old text-sm line-through md:text-base">
              {formatMoney(selectedVariant.compareAtPrice, lang)}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-neutral-500">
          {label.sku}: {selectedVariant?.sku || 'N/A'}
        </p>
      </div>

      {product.variants.length > 1 && (
        <div className="space-y-4">
          {Object.entries(optionsGrouped).map(([groupTitle, groupData]) => {
            const isColorGroup =
              groupData.key === 'color' || groupData.key === 'glaze';

            return (
              <div key={groupData.key} className="space-y-2">
                <label className="text-sm font-medium capitalize text-neutral-700">
                  {groupTitle}:
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  {Array.from(groupData.values.entries()).map(
                    ([valueKey, optValue]) => {
                      const isSelected = selectedVariant?.options?.some(
                        o =>
                          o.nameKey === groupData.key &&
                          o.valueKey === valueKey,
                      );
                      const isAvailable = isOptionAvailable(
                        groupData.key,
                        valueKey,
                      );

                      if (isColorGroup) {
                        const colorStyle = valueKey.startsWith('#')
                          ? valueKey
                          : optValue.label;

                        return (
                          <div
                            key={valueKey}
                            className="flex flex-col items-center gap-1"
                          >
                            <button
                              type="button"
                              disabled={!isAvailable}
                              title={`${optValue.label}${!isAvailable ? ' (Немає в наявності)' : ''}`}
                              onClick={() =>
                                handleOptionSelect(groupData.key, valueKey)
                              }
                              className={`relative size-7 rounded-full p-0.5 transition-transform ${
                                !isAvailable
                                  ? 'cursor-not-allowed opacity-35'
                                  : 'cursor-pointer hover:scale-110'
                              }`}
                            >
                              <span
                                className="relative block size-full overflow-hidden rounded-full border border-black/10 shadow-inner"
                                style={{ backgroundColor: colorStyle }}
                              >
                                {!isAvailable && (
                                  <span className="absolute inset-0 m-auto h-[1px] w-[140%] -rotate-45 bg-neutral-600" />
                                )}
                              </span>
                              <span className="sr-only">{optValue.label}</span>
                            </button>
                            <span
                              className={`size-1 rounded-full bg-neutral-900 transition-all ${
                                isSelected
                                  ? 'scale-100 opacity-100'
                                  : 'scale-0 opacity-0'
                              }`}
                            />
                          </div>
                        );
                      }

                      return (
                        <button
                          key={valueKey}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() =>
                            handleOptionSelect(groupData.key, valueKey)
                          }
                          className={`relative border px-4 py-2 text-sm font-medium transition-all ${
                            !isAvailable
                              ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 opacity-60'
                              : 'cursor-pointer'
                          } ${
                            isSelected
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                          }`}
                        >
                          {optValue.label}
                          {!isAvailable && (
                            <span className="absolute inset-0 m-auto h-px w-full -rotate-12 bg-neutral-400" />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedVariant?.stock?.status === 'pre_order' && (
        <p className="text-sm font-medium text-amber-700">Передзамовлення</p>
      )}

      <Button
        variant="default"
        disabled={!isAvailableForPurchase}
        className="w-full bg-[#A33333] py-6 text-base font-medium text-white shadow-none hover:bg-[#8B2B2B] disabled:bg-neutral-300"
      >
        {label.addToBag}
      </Button>
    </div>
  );
}
