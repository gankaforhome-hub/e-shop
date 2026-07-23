type Money = {
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR';
};

export const formatMoney = (money?: Money): string => {
  if (!money) {
    return '';
  }

  const currencyMap: Record<string, string> = {
    UAH: 'UAH',
    USD: '$',
    EUR: '€',
  };

  const formattedAmount = money.amount.toLocaleString('uk-UA');
  const symbol = currencyMap[money.currency] || money.currency;

  return `${formattedAmount} ${symbol}`;
};
