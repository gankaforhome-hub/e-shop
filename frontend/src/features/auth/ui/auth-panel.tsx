import { type ReactNode } from 'react';

import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface AuthPanelProps {
  title: string;
  description?: string | undefined;
  children: ReactNode;
}

/** Narrow centered column shared by the sign-in, sign-up and reset screens. */
export function AuthPanel({ title, description, children }: AuthPanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading headingLevel="h1" variant="document" tone="emphasis">
          {title}
        </Heading>
        {description ? (
          <Text size="small" variant="muted">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </div>
  );
}
