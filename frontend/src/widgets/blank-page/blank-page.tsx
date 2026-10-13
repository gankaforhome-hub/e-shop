'use client';

import { usePathname } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';
import { Text } from '@/shared/ui/text';

interface BlankPageProps {
  className?: string;
}

/** Temporary placeholder for routes that are not implemented yet. */
export function BlankPage({ className }: BlankPageProps) {
  const path = usePathname();
  return (
    <Section className={cn('bg-muted/20 h-full', className)}>
      <Container className="flex flex-col items-center gap-10">
        <AppLink
          href={routes.home}
          className="border-border bg-accent text-action-primary hover:text-action-primary-hover rounded-2xl border p-4 px-10 text-4xl"
        >
          Back
        </AppLink>
        <Text size="none" className="text-2xl">
          Blank Page -
          <span className="text-accent-foreground underline"> {path}</span>
        </Text>
      </Container>
    </Section>
  );
}
