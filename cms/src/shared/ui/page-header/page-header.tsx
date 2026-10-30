import { Heading } from '../heading';
import { Text } from '../text';

interface PageHeaderProps {
  /** Block name above the title, e.g. "Catalog". */
  eyebrow?: string;
  title: string;
  description?: string;
}

/** The page's single `h1` with its context. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-1.5 border-b border-border pb-6 md:pb-8">
      {eyebrow && (
        <Text size="eyebrow" variant="brand">
          {eyebrow}
        </Text>
      )}
      <Heading headingLevel="h1">{title}</Heading>
      {description && (
        <Text size="lead" variant="muted" className="max-w-2xl leading-relaxed">
          {description}
        </Text>
      )}
    </header>
  );
}
