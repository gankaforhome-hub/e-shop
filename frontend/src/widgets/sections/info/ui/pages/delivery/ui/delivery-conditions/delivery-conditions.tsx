import { getDictionary } from '@/shared/i18n/get-dictionary';
import { type Locale } from '@/shared/i18n/routing';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';

interface IDeliveryConditionSectionProps {
  lang: Locale;
}

export async function DeliveryConditionsSection({
  lang,
}: IDeliveryConditionSectionProps) {
  const { delivery } = await getDictionary(['delivery'], lang);

  return (
    <Section spacing="none" aria-labelledby="delivery-conditions">
      <Heading
        id="delivery-conditions"
        headingLevel="h1"
        variant="pageHeader"
        position="center"
        className="mb-4"
      >
        {delivery.pageTitle}
      </Heading>
      <div className="font-caption text-foreground space-y-4 text-sm font-normal leading-relaxed sm:space-y-5 sm:text-base md:text-lg">
        <p>{delivery.freeDeliveryInfo}</p>

        <ul className="space-y-3 pl-1 sm:space-y-4 sm:pl-2">
          {delivery.options.map(option => (
            <li
              key={option.id}
              className="relative pl-4 before:absolute before:left-0 before:top-0 before:content-['–']"
            >
              <span>{option.text}</span>
              {option.note && <p className="mt-2">{option.note}</p>}
            </li>
          ))}
        </ul>

        <p className="pt-2 sm:pt-4">{delivery.paymentAndTimingInfo}</p>
      </div>
    </Section>
  );
}
