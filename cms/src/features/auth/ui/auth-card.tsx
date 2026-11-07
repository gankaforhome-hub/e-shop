import { type ReactNode } from 'react';

import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <Heading headingLevel="h1" variant="card">
          {title}
        </Heading>
        <Text size="sm" variant="muted">
          {description}
        </Text>
      </div>
      {children}
    </Card>
  );
}
