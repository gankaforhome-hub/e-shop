'use client';

import { Toaster } from 'sonner';

interface ToasterProviderProps {
  containerAriaLabel?: string;
}

export const ToasterProvider = ({
  containerAriaLabel = 'Notifications',
}: ToasterProviderProps) => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        unstyled: true,
        className: 'w-full flex justify-center pointer-events-auto',
      }}
      containerAriaLabel={containerAriaLabel}
    />
  );
};
