import Image from 'next/image';
import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface IExampleCardProps {
  classNameName?: string;
}

export const ExampleCard: FC<IExampleCardProps> = ({ className }) => {
  const showDesc = true;
  const description = true;
  const showButton = true;
  const sAppLink = cn('custom-transition w-full transition-opacity');

  return (
    <Section className="">
      <Container>
        {/* <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="hover:scale-y-120 group relative w-[250px] overflow-hidden border border-transparent bg-white transition-all duration-300 hover:scale-x-110 hover:border-black"
            >
              <div className="relative h-[250px] w-full overflow-hidden group-hover:-translate-y-10">
                <Image
                  src="/images/products/1/product1.webp"
                  alt="Product"
                  fill
                  className="group-hover:scale-70 h-full w-full object-cover transition-transform duration-300"
                />
              </div>

              <div className="p-3 text-center text-sm font-medium">
                Adam & Eva
              </div>

              <div className="absolute bottom-0 left-0 z-10 w-full translate-y-full bg-white bg-opacity-95 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mb-2 text-sm">
                  Garika T1 Ring in Yellow Gold with Platter, 2.5 mm Wide
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">$2,350</span>
                  <button className="bg-black px-4 py-2 text-sm text-white">
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>*/}
        {/* grid-cols-1 gap-4 md:grid-cols-4 */}
        <div
          className={cn(
            'relative',
            // 'grid grid-cols-1 gap-4 bg-amber-400 md:grid-cols-4',
            'card-set-4/4 items-center justify-center',
          )}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div
              key={i}
              className="card-item group-hover:z-100 group-hover:shadow-2xl/30 h-75 w-75 max-xl:h-50 max-xl:w-50 group relative flex flex-col items-center justify-center border group-hover:shadow-indigo-500/50"
            >
              <div
                className={cn(
                  'h-75 w-75 max-xl:h-50 max-xl:w-50 group-hover:shadow-2xl/30 relative inset-0 z-10 flex aspect-square translate-y-0 items-center justify-center bg-white opacity-100 duration-500 group-hover:-translate-y-14',
                  'flex-1 grow-0',
                )}
              >
                <Image
                  src="/images/products/1/product1.webp"
                  alt="Product Image"
                  width={400}
                  height={225}
                  className="h-auto w-full overflow-hidden object-contain object-center"
                />
              </div>

              <div
                className={cn(
                  '-translate-y-50 relative z-50 flex h-0 flex-col items-center justify-center p-0 opacity-0 duration-500 group-hover:z-50 group-hover:-translate-y-0 group-hover:opacity-100',
                )}
              >
                <div className="group-hover:shadow-3xl bg-white p-2">
                  <h3 className="">
                    <AppLink
                      href="/"
                      className="h-full w-full after:absolute after:inset-0"
                    >
                      Заголовок
                    </AppLink>
                  </h3>
                  <p className="">
                    Це приклад опису карточки. Він може бути коротким або
                    довгим.
                  </p>
                  <button className="">Кнопка</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div
              key={i}
              className={cn(
                "shadow-xs duration-500', 'group-hover:z-100 group-hover:bg-bg group flex flex-col items-center justify-center border transition-all",
                'overflow:hidden hover:overflow-y-visible',
              )}
            >
              <Box
                className={cn(
                  'relative z-10 flex items-center justify-center p-10 transition-transform duration-500',
                  'bg-bg-secondary',
                  hideDesc ? `` : '',
                )}
              >
                <Box className={cn('bg-bg-secondary')}>
                  <Image
                    src="/images/products/1/product1.webp"
                    alt="Product Image"
                    width={400}
                    height={225}
                    className="h-auto w-full overflow-hidden object-contain object-center"
                  />{' '}
                  <Text
                    as="span"
                    className={cn(
                      'bg-bg leading-0 absolute left-3 top-3 z-50 px-2.5 py-1 text-sm capitalize tracking-wide',
                    )}
                  >
                    popular
                  </Text>
                  <Button
                    variant="icon"
                    size="icon"
                    className="absolute right-3 top-3 z-50"
                  >
                    <Icon name="favorite" className="size-5" />
                  </Button>
                </Box>
              </Box>

              <Box
                className={cn(
                  'relative flex w-full flex-col items-center justify-center pt-8 transition-all duration-500',
                  hideDesc
                    ? `flex-0 flex p-0 opacity-0 group-hover:z-50 group-hover:px-5 group-hover:opacity-100`
                    : '',
                )}
              >
                <AppLink
                  href={routes.product('product.slug')}
                  className={sAppLink}
                >
                  <Heading
                    headingLevel="h3"
                    variant="card"
                    className={cn('items-start')}
                  >
                    Adam
                  </Heading>
                </AppLink>

                <AppLink
                  href={routes.product('product.slug')}
                  className={cn(sAppLink, 'h-full shrink')}
                >
                  <Text
                    className={cn(
                      'mb-6 mt-4 opacity-65',
                      'line-clamp-2 text-ellipsis',
                    )}
                  >
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Exercitationem, voluptas.
                  </Text>
                </AppLink>

                <Button
                  variant="secondary"
                  className={cn(
                    'mt-auto flex w-full items-center justify-between outline',
                  )}
                >
                  <Text as="span" variant="inherit">
                    $ 2330
                  </Text>
                  <Text as="span" variant="inherit">
                    addToBag
                  </Text>
                </Button>
              </Box>
            </div>
          ))}
        </div> */}
        {/* bold <div className="grid w-full max-w-[1620px] grid-cols-1 items-center justify-center gap-2.5 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div
              key={i}
              className="border-colorsblack group flex flex-1 flex-col items-center justify-center gap-5 border-none bg-rose-600 shadow-none transition-all duration-300 hover:border hover:border-solid hover:p-[15px]"
            >
              <div className="bg-greygrey-3 relative flex h-[397.5px] w-full flex-col items-center justify-center p-0">
                {true && (
                  <span className="bg-colorswhite text-colorsblack font-proxima-nova-body-14-px-regular absolute left-5 top-5 h-6 rounded-none border border-solid border-[#e7e7e7] px-[7px] py-0">
                    Most Popular
                  </span>
                )}
                <Image
                  className="h-80 w-80 object-cover"
                  src="/images/products/1/product1.webp"
                  alt="Product Image"
                  width={400}
                  height={225}
                />
                <span className="absolute right-5 top-5 h-6 w-6">***</span>
              </div>

              <div className="flex min-h-[120px] w-full flex-col items-center justify-center">
                <div
                  className={`flex w-full flex-col items-center justify-center gap-[15px] transition-all duration-300 ${showDesc ? 'opacity-0 group-hover:opacity-100' : ''}`}
                >
                  <h3 className="font-proxima-nova-body-17px-regular-default text-colorsblack mt-[-1.00px] w-full text-center">
                    Adam&Eva
                  </h3>

                  <div
                    className={`flex w-full flex-col items-start justify-center gap-[15px] ${showDesc ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}
                  >
                    {true && (
                      <p className="font-proxima-nova-body-16px-regular-paragraph-140 text-colorsblack w-full overflow-hidden text-ellipsis opacity-65 [-webkit-box-orient:vertical] [-webkit-line-clamp:1] [display:-webkit-box]">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Obcaecati, et.
                      </p>
                    )}

                    {true && (
                      <div className="bg-colorsblack flex h-[55px] w-full items-center justify-between px-[25px] py-0">
                        <span className="font-proxima-nova-body-17px-regular-default text-colorswhite">
                          2223
                        </span>
                        <span className="font-proxima-nova-body-17px-regular-default text-colorswhite text-center">
                          Select to Size
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>*/}
      </Container>
    </Section>
  );
};
