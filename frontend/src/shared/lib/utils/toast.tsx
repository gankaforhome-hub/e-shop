import { toast } from 'sonner';

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
        className="flex w-screen items-center justify-between bg-emerald-600 px-4 py-3.5 text-white shadow-lg md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <svg
            className="h-5 w-5 shrink-0 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-sm font-medium md:text-base">{message}</span>
        </div>

        <button
          onClick={() => toast.dismiss(id)}
          className="rounded-lg p-1 transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={closeLabel}
        >
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ),
    { duration: 4000 },
  );
};
