import { type IconName } from '@/shared/types';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';

interface IPaymentBadgesProps {
  heading: string;
  methods: { label: string; icon: IconName }[];
  className?: string;
}

export function PaymentBadges({
  heading,
  methods,
  className = '',
}: IPaymentBadgesProps) {
  return (
    <div className={className}>
      <Heading headingLevel="h2" variant="footer" tone="accent">
        {heading}
      </Heading>
      <ul className="mt-4 flex flex-wrap gap-2">
        {methods.map(method => (
          <li
            key={method.label}
            className="border-border rounded-md border px-4 py-2"
          >
            <Icon
              name={method.icon}
              className="h-9 w-12 stroke-0"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
