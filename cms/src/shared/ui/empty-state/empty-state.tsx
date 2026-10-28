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
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center md:py-20">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-foreground">
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
