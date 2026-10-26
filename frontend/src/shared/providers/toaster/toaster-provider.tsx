'use client';

import { type CSSProperties } from 'react';

import { Toaster } from 'sonner';

interface ToasterProviderProps {
  containerAriaLabel?: string;
}

// Full-bleed top region: notices render as edge-to-edge banners, so the
// default 356px column and 24px offsets are dropped
const TOASTER_STYLE: CSSProperties & { '--width': string } = {
  '--width': '100%',
};

export const ToasterProvider = ({
  containerAriaLabel = 'Notifications',
}: ToasterProviderProps) => {
  return (
    <Toaster
      position="top-center"
      offset={0}
      mobileOffset={0}
      style={TOASTER_STYLE}
      toastOptions={{
        unstyled: true,
        className: 'w-full flex justify-center pointer-events-auto',
      }}
      containerAriaLabel={containerAriaLabel}
    />
  );
};
