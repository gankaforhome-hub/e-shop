'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

interface IBlankPageProps {
  className?: string;
}

export function BlankPage({ className }: IBlankPageProps) {
  const path = usePathname();
  return (
    <Section className={cn('bg-muted/20 h-full', className)}>
      <Container>
        <div className="mb-10 flex justify-center">
          <Link
            href="/"
            className="rounded-2xl border bg-amber-200 p-4 px-10 text-4xl text-rose-500 hover:text-red-800"
          >
            Back
          </Link>
        </div>
        <div>
          <p className="red text-2xl">
            Blank Page -<span className="text-teal-900 underline"> {path}</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}
