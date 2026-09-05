import { getCategories } from '@/entities/category';
import { type Locale } from '@/shared/i18n/routing';
import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

import { ProductTypeList } from '../../category';

interface IProductTypeSectionProps {
  title: string;
  lang: Locale;
}

export async function ProductTypeSection({
  title,
  lang,
}: IProductTypeSectionProps) {
  const categories = await getCategories(lang);
  return (
    <Section className="md:pt-15 pt-10 xl:pt-12" aria-labelledby="product-type">
      <Container className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
        <Heading
          id="product-type"
          headingLevel="h2"
          variant="section"
          position="center"
          className="shrink-0 lg:basis-1/3 lg:whitespace-nowrap lg:text-3xl"
        >
          {title}:
        </Heading>
        <div className="w-full min-w-0 flex-1">
          <ProductTypeList categories={categories} />
        </div>
      </Container>
    </Section>
  );
}
