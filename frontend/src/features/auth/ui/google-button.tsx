import { type AccountDict } from '@/shared/i18n/types';
import { Button } from '@/shared/ui/button';
import { Text } from '@/shared/ui/text';

interface GoogleButtonProps {
  /** `/api/auth/google/start?lang=…`; no button while Google sign-in is not configured */
  href: string | undefined;
  dict: AccountDict;
}

/**
 * "Continue with Google": a full navigation to the start route handler (not a page, so a plain
 * anchor). The API merges it with the account of the same email.
 */
export function GoogleButton({ href, dict }: GoogleButtonProps) {
  if (!href) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="outline">
        <a href={href}>{dict.google.button}</a>
      </Button>
      {/* The Google path records the terms acceptance on a new account */}
      <Text size="small" variant="muted">
        {dict.google.notice}
      </Text>
      <Text size="small" variant="muted" position="center">
        {dict.google.or}
      </Text>
    </div>
  );
}
