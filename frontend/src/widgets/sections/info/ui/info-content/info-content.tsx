import { type InfoSlug } from '@/shared/config/routes';
import { type Locale } from '@/shared/i18n/routing';

import { DeliveryConditionsSection, FaqContentSection } from '../pages';

interface IInfoContentProps {
  infoSlug: InfoSlug;
  lang: Locale;
}

export function InfoContent({ infoSlug, lang }: IInfoContentProps) {
  switch (infoSlug) {
    case 'faq':
      return <FaqContentSection lang={lang} />;

    case 'delivery':
      return <DeliveryConditionsSection lang={lang} />;

    case 'returns':
      return (
        <article>
          <h1>Повернення та обмін</h1>
          <p>Умови повернення товарів протягом 14 днів...</p>
        </article>
      );

    case 'payments':
      return (
        <article>
          <h1>Оплата</h1>
          <p>Способи оплати на сайті...</p>
        </article>
      );

    case 'privacy-policy':
      return (
        <article>
          <h1>Політика конфіденційності</h1>
          <p>Правила обробки персональних даних...</p>
        </article>
      );

    case 'terms-conditions':
      return (
        <article>
          <h1>Умови використання</h1>
          <p>Правила користування сервісом...</p>
        </article>
      );

    case 'cookie-policy':
      return (
        <article>
          <h1>Політика Cookie</h1>
          <p>Інформація про використання файлів cookie...</p>
        </article>
      );

    default:
      return null;
  }
}
