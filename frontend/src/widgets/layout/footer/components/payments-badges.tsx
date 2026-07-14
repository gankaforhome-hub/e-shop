import { IconName } from '@/shared/types';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { FC } from 'react';

interface IPaymentBadges {
  methods: { label: string; icon: IconName }[];
  className?: string;
}

export const PaymentBadges: FC<IPaymentBadges> = ({
  methods,
  className = '',
}) => {
  return (
    <div className={className}>
      <Heading headingLevel="h3" variant="footer" tone="accent">
        Payment Methods
      </Heading>
      <ul className="mt-4 flex flex-wrap gap-2">
        {methods.map(method => (
          <li
            key={method.label}
            className="border-border-muted rounded-md border px-4 py-2"
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
};
