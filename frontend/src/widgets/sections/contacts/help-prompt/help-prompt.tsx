import { type AppRoutes } from '@/shared/config/routes';
import { AppLink } from '@/shared/ui/app-link';
import { Button } from '@/shared/ui/button';
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
      <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
        <AppLink href={href} prefetch>
          {linkLabel}
        </AppLink>
      </Button>
    </div>
  );
}
