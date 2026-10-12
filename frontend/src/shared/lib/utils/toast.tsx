import { toast } from 'sonner';

import { Icon } from '@/shared/ui/icon';

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
        className="bg-status-success-fg text-background flex w-screen items-center justify-between px-4 py-3.5 shadow-lg md:px-8"
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
