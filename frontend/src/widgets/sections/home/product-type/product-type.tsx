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
      <Container className="flex w-full min-w-0 justify-center">
        <Heading
          id="product-type"
          headingLevel="h2"
          variant="section"
          visibility="hidden"
          className="mb-8 md:mb-6 xl:mb-16"
        >
          {title}:
        </Heading>
        <div className="flex min-w-0 justify-center">
          <ProductTypeList categories={categories} />
        </div>
      </Container>
    </Section>
  );
}
