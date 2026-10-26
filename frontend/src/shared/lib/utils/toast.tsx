import { toast } from 'sonner';

import { Container } from '@/shared/ui/container';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { mergeStyleTailwindAndObjectStyle as cn } from './style-merge';

interface ShowNoticeParams {
  message: string;
  tone: 'success' | 'error';
  closeLabel?: string;
}

/**
 * Full-width status banner pinned to the top edge for form feedback: tinted
 * status surface, status-coloured accent line, content aligned to the page
 * `Container`. Errors use `role="alert"` and stay longer.
 */
export const showNotice = ({
  message,
  tone,
  closeLabel = 'Close',
}: ShowNoticeParams) => {
  const isError = tone === 'error';

  toast.custom(
    id => (
      <div
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
        className={cn(
          'text-foreground-emphasis w-full border-b-2 shadow-md',
          isError
            ? 'bg-status-error-bg border-status-error-fg'
            : 'bg-status-success-bg border-status-success-icon',
        )}
      >
        <Container className="flex items-center gap-3 py-3.5 md:py-4">
          <Icon
            name={isError ? 'alert' : 'check'}
            className={cn(
              'size-5 shrink-0',
              isError ? 'text-status-error-fg' : 'text-status-success-icon',
            )}
            aria-hidden="true"
          />
          <Text as="span" variant="inherit" className="flex-1 font-medium">
            {message}
          </Text>
          <button
            type="button"
            onClick={() => toast.dismiss(id)}
            className="text-foreground hover:text-foreground-emphasis hover:bg-foreground/5 focus-visible:ring-ring duration-(--dur-normal) shrink-0 rounded-md p-1.5 outline-none transition-colors focus-visible:ring-2"
            aria-label={closeLabel}
          >
            <Icon name="close" className="size-5" aria-hidden="true" />
          </button>
        </Container>
      </div>
    ),
    { duration: isError ? 8000 : 5000 },
  );
};

interface ShowSuccessBannerParams {
  message: string;
  closeLabel?: string;
}

export const showSuccessBanner = ({
  message,
  closeLabel = 'Close',
}: ShowSuccessBannerParams) => {
  toast.custom(
    id => (
      <div
        role="status"
        aria-live="polite"
        className="bg-status-success-fg text-background flex w-full items-center justify-between px-4 py-3.5 shadow-lg md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Icon
            name="check"
            className="size-5 shrink-0 stroke-[2.5]"
            aria-hidden="true"
          />
          <span className="text-sm font-medium md:text-base">{message}</span>
        </div>

        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          className="hover:bg-background/15 focus-visible:ring-background duration-(--dur-normal) rounded-lg p-1 outline-none transition-colors focus-visible:ring-2"
          aria-label={closeLabel}
        >
          <Icon name="close" className="size-5" aria-hidden="true" />
        </button>
      </div>
    ),
    { duration: 4000 },
  );
};
