import { type AppRoutes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { SectionHeader } from '@/shared/ui/section-header';

export interface HelpPromptProps {
  headingId: string;
  eyebrow?: string;
  heading: string;
  description: string;
  linkLabel: string;
  href: AppRoutes;
}

export function HelpPrompt({
  headingId,
  eyebrow,
  heading,
  description,
  linkLabel,
  href,
}: HelpPromptProps) {
  return (
    <div className="fgap-5/8 flex flex-col items-center">
      <SectionHeader
        headingId={headingId}
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        accent
      />
      <Button
        asChild
        variant="outline"
        className="min-h-11 w-full gap-2 sm:w-auto"
      >
        <AppLink href={href} prefetch>
          {linkLabel}
          <Icon name="arrow-up-right" className="size-4" aria-hidden />
        </AppLink>
      </Button>
    </div>
  );
}
