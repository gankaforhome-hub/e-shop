import Image from 'next/image';
import { ImageAsset } from '../api';

export default function MobileGallerySlider(images: ImageAsset[]) {
  return (
    <>
      <div className="relative w-full">
        {/* На мобілці: flex, дозволяємо горизонтальний скрол, приховуємо скролбар, вмикаємо snap.
        З екрана sm: перетворюємо назад на grid у 4 колонки.
      */}
        <ul
          role="list"
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 sm:grid sm:snap-none sm:grid-cols-4 sm:gap-6 sm:overflow-x-visible"
        >
          {images.map((item, index) => {
            const isVideo = item.src.endsWith('.mp4');

            return (
              <li
                key={item.src}
                className="sm:shrink-1 relative aspect-square w-[80%] shrink-0 snap-center overflow-hidden rounded-xl shadow-lg sm:w-auto sm:snap-align-none"
              >
                {isVideo ? (
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    autoPlay
                    loop
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt || `Slide ${index}`}
                    fill
                    sizes="(min-width: 640px) 22vw, 80vw"
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                    loading="eager"
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Крапочки-індикатори (показуємо тільки на мобільних) */}
        <div className="mt-2 flex justify-center gap-1.5 sm:hidden">
          {images.map((_, index) => (
            <span
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-neutral-300 last:bg-neutral-800"
              /* Для активної крапки в чистому CSS краще написати невеликий JS-стейт, 
               або залишити це для Swiper/Embla, якщо потрібна точна синхронізація */
            />
          ))}
        </div>
      </div>
    </>
  );
}
