import { getCurrentCustomer } from '@/entities/customer/server';
import { type AccountDict } from '@/shared/i18n/types';

import { SignInForm } from './sign-in-form';
import { VerifyEmailNotice } from './verify-email-notice';

interface VerifyEmailGateProps {
  dict: AccountDict;
}

/**
 * The confirmation link works only in the session of its own account, so a mailbox owner can
 * never confirm an account someone else created with that address. Signed out → sign in here
 * (the URL and its `#token` stay), then the page confirms. Reads cookies: render in `<Suspense>`.
 */
export async function VerifyEmailGate({ dict }: VerifyEmailGateProps) {
  const customer = await getCurrentCustomer();

  return customer ? (
    <VerifyEmailNotice dict={dict} />
  ) : (
    <SignInForm dict={dict} stay />
  );
}
