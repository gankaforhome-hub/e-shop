/** The signed-in storefront customer, as the account page shows it. */
export type Customer = {
  id: string;
  email: string;
  /** E.164, e.g. +380671234567 */
  phone: string | null;
  /** Soft verification: the account works without it */
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  /** Opted in to news and offers */
  marketingConsent: boolean;
  /** Both names are known (Google may send none: the customer completes them once) */
  isProfileComplete: boolean;
};
