import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { AppLink } from '@/shared/ui/app-link';
import { Icon } from '@/shared/ui/icon';
import { Text } from '@/shared/ui/text';

import { SectionConfig } from '../model/types';

type IFooterSectionProps =
  | SectionConfig<'contacts'>
  | SectionConfig<'nav'>
  | SectionConfig<'customerService'>
  | SectionConfig<'social'>
  | SectionConfig<'payments'>;

export const FooterSection: FC<IFooterSectionProps> = props => {
  const { className, items, type, classNameLi } = props;

  return (
    <>
      <ul className={className}>
        {/* contacts */}
        {type === 'contacts' &&
          items.map(item => (
            <li key={item.href} className={cn(classNameLi)}>
              <AppLink href={item.href} className="items-center gap-2">
                <Icon name={item.icon} className="size-4" />
                <Text as="span" className="link">
                  {item.text}
                </Text>
              </AppLink>
            </li>
          ))}
        {/* nav & customerService */}
        {(type === 'nav' || type === 'customerService') &&
          items.map(item => (
            <li key={item.href} className={cn(classNameLi)}>
              <AppLink href={item.href} className="link">
                {item.title}
              </AppLink>
            </li>
          ))}
        {/* social */}
        {type === 'social' &&
          items.map(item => (
            <li key={item.href} className={cn(classNameLi)}>
              <AppLink href={item.href} className="items-center gap-2">
                <Icon name={item.icon} className="size-4" />
                <Text as="span" className="link">
                  {item.title}
                </Text>
              </AppLink>
            </li>
          ))}
        {/* payments */}
        {type === 'payments' &&
          items.map(item => (
            <li
              key={item.icon}
              aria-label={item.ariaLabel}
              className={cn(
                'fw-12/15 fp-1/3 border-border-muted border',
                classNameLi,
              )}
            >
              <Icon
                name={item.icon}
                className="fh-4/6 w-full overflow-visible stroke-none"
              />
            </li>
          ))}
      </ul>
    </>
  );
};
