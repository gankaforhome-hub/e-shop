import { Heading } from '../heading';
import { Icon, type IconName } from '../icon';
import { Text } from '../text';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card bg-[radial-gradient(ellipse_at_top,var(--brand-subtle),transparent_60%)] px-6 py-14 text-center shadow-card md:py-20">
      <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-brand-subtle text-brand ring-8 ring-brand-subtle/50">
        <Icon name={icon} className="size-6" />
      </span>
      <Heading headingLevel="h2" variant="card">
        {title}
      </Heading>
      <Text size="sm" variant="muted" className="max-w-md">
        {description}
      </Text>
    </div>
  );
}
