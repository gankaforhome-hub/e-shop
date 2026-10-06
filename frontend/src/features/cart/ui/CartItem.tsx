'use client';

import { AppMedia } from '@/shared/ui/app-media';

import { useCart } from '../model/cart-context';
import { type CartItem as CartItemType } from '../model/types';

export function CartItemCard({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-6 border-b border-gray-100 py-6 last:border-0">
      {/* Кругла мініатюра з легким фоном та тінню */}
      <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden bg-[#f7f7f7] shadow-sm">
        <AppMedia
          src={item.image}
          alt={item.title}
          fill
          sizes="96px"
          className="object-contain p-1"
        />
      </div>

      {/* Інформація про товар */}
      <div className="flex-1 space-y-2">
        {/* Назва товару з елегантним серіфним шрифтом */}
        <h3 className="font-serif text-lg font-normal leading-snug text-gray-900">
          {item.title}
        </h3>

        {/* Ціна */}
        <p className="text-base font-medium tracking-tight text-gray-900">
          {item.price.toLocaleString('uk-UA')} ₴
        </p>

        {/* Лічильник кількості та кнопка видалення */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-light text-gray-500">Quantity:</span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="p-0.5 text-base font-light leading-none text-gray-500 transition-colors hover:text-black"
                aria-label="Зменшити кількість"
              >
                —
              </button>

              <span className="w-4 text-center font-normal text-gray-900">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="p-0.5 text-base font-light leading-none text-gray-500 transition-colors hover:text-black"
                aria-label="Збільшити кількість"
              >
                +
              </button>
            </div>
          </div>

          {/* Іконка кошика / видалення */}
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="p-1 text-gray-700 transition-colors hover:text-red-600"
            aria-label="Видалити товар"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
