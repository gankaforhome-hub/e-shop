import { type Locale } from '@/shared/i18n/routing';

type Money = {
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR';
};

export const formatMoney = (money?: Money, lang?: Locale): string => {
  if (!money) {
    return '';
  }

  const currencyMap: Record<Money['currency'], string> = {
    UAH: lang === 'uk' ? '₴' : '₴',
    USD: '$',
    EUR: '€',
  };

  const formattedAmount = money.amount.toLocaleString(
    lang === 'uk' ? 'uk-UA' : 'en-US',
  );

  const symbol = currencyMap[money.currency];

  return `${formattedAmount} ${symbol}`;
};
