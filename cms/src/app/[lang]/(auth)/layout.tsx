import { type ReactNode } from 'react';

/** Public entry pages: no sidebar, no session. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      {children}
    </main>
  );
}
