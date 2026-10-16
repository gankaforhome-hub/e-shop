import { Container } from '@/shared/ui/container';
import { QuoteBlock } from '@/shared/ui/quote-block';
import { Section } from '@/shared/ui/section';

interface ManifestoSectionProps {
  quote: string;
  cite: string;
}

/** One-line brand statement between the philosophy and craft blocks. */
export function ManifestoSection({ quote, cite }: ManifestoSectionProps) {
  return (
    <Section spacing="editorial">
      <Container>
        <QuoteBlock quote={quote} cite={cite} align="center" />
      </Container>
    </Section>
  );
}
