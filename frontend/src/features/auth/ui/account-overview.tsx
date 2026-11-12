import { getLocale } from 'next-intl/server';

import { type Customer } from '@/entities/customer';
import { getCurrentCustomer } from '@/entities/customer/server';
import { routes } from '@/shared/config/routes';
import { redirect } from '@/shared/i18n/navigation';
import { type AccountDict } from '@/shared/i18n/types';
import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

import { ResendVerificationButton, SignOutButton } from './account-actions';
import { ProfileForm } from './profile-form';

interface AccountOverviewProps {
  dict: AccountDict;
}

const toProfileValues = (customer: Customer) => ({
  firstName: customer.firstName ?? '',
  lastName: customer.lastName ?? '',
  phone: customer.phone ?? '',
  marketingConsent: customer.marketingConsent,
});

/**
 * The signed-in customer: email (with the confirmation state) and the editable profile.
 * Without a session → sign in; without both names (Google gave none) → complete the profile.
 * Reads cookies: render in `<Suspense>`.
 */
export async function AccountOverview({ dict }: AccountOverviewProps) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return redirect({ href: routes.signIn, locale: await getLocale() });
  }
  if (!customer.isProfileComplete) {
    return redirect({
      href: routes.accountComplete,
      locale: await getLocale(),
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <dl className="grid gap-4 sm:grid-cols-[max-content_1fr] sm:gap-x-8">
        <dt>
          <Text as="span" size="small" variant="muted">
            {dict.account.email}
          </Text>
        </dt>
        <dd className="flex flex-col gap-1">
          <Text as="span">{customer.email}</Text>
          <Text
            as="span"
            size="small"
            variant={customer.emailVerified ? 'success' : 'muted'}
          >
            {customer.emailVerified
              ? dict.account.verified
              : dict.account.notVerified}
          </Text>
          {customer.emailVerified ? null : (
            <ResendVerificationButton dict={dict} />
          )}
        </dd>
      </dl>
      <section
        className="flex flex-col gap-4"
        aria-labelledby="profile-heading"
      >
        <Heading id="profile-heading" headingLevel="h2" variant="subsection">
          {dict.profile.editTitle}
        </Heading>
        <ProfileForm
          dict={dict}
          mode="edit"
          defaultValues={toProfileValues(customer)}
        />
      </section>
      <div>
        <SignOutButton label={dict.account.signOut} />
      </div>
    </div>
  );
}

/** One-time step after a Google sign-in without a full name; prefilled with what Google gave. */
export async function CompleteProfile({ dict }: AccountOverviewProps) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return redirect({ href: routes.signIn, locale: await getLocale() });
  }
  if (customer.isProfileComplete) {
    return redirect({ href: routes.account, locale: await getLocale() });
  }

  return (
    <ProfileForm
      dict={dict}
      mode="complete"
      defaultValues={toProfileValues(customer)}
    />
  );
}

/** Same height as the overview, while the session is read. */
export function AccountOverviewSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden>
      <div className="bg-muted h-24 rounded-md" />
      <div className="bg-muted h-11 w-28 rounded-md" />
    </div>
  );
}
