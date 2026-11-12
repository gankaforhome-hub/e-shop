import { type ReactNode } from 'react';

/** Entry pages without the sidebar: public ones plus the key step after the password. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      {children}
    </main>
  );
}
