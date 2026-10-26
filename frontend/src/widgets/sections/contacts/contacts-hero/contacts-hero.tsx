import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { AppLink } from '@/shared/ui/app-link';
import { Container } from '@/shared/ui/container';
import { CopyButton } from '@/shared/ui/copy-button';
import { Heading } from '@/shared/ui/heading';
import { Icon } from '@/shared/ui/icon';
import { Section } from '@/shared/ui/section';
import { SectionHeader } from '@/shared/ui/section-header';
import { Text } from '@/shared/ui/text';

type ChannelKind = 'phone' | 'email';

interface ChannelCopy {
  title: string;
  description: string;
}

export interface ContactsHeroSectionProps {
  heading: string;
  eyebrow: string;
  description: string;
  channels: Record<ChannelKind, ChannelCopy> & {
    title: string;
    copy: string;
    copied: string;
  };
  contacts: NavItem[];
}

const HEADING_ID = 'contacts-heading';
const CHANNELS_ID = 'contacts-channels';
const SCHEME = /^(tel:|mailto:)/;

const isChannel = (icon: string): icon is ChannelKind =>
  icon === 'phone' || icon === 'email';

export function ContactsHeroSection({
  heading,
  eyebrow,
  description,
  channels,
  contacts,
}: ContactsHeroSectionProps) {
  const items = contacts.flatMap(item =>
    isChannel(item.icon) ? [{ ...item, copy: channels[item.icon] }] : [],
  );

  return (
    <Section aria-labelledby={HEADING_ID} spacing="standard" flush="top">
      <Container className="fgap-8/16 flex flex-col">
        <SectionHeader
          headingId={HEADING_ID}
          headingLevel="h1"
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          accent
        />

        <div aria-labelledby={CHANNELS_ID}>
          <Heading id={CHANNELS_ID} headingLevel="h2" visibility="hidden">
            {channels.title}
          </Heading>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            {items.map(item => {
              const value = item.href.replace(SCHEME, '');

              return (
                <li
                  key={item.href}
                  className="border-border bg-background hover:border-foreground/40 focus-within:border-foreground/40 duration-(--dur-normal) ease-subtle fp-6/10 relative flex flex-col gap-5 rounded-lg border transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="bg-surface-warm text-foreground flex size-11 items-center justify-center rounded-full"
                  >
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <Text
                      as="span"
                      size="eyebrow"
                      font="secondary"
                      variant="muted"
                    >
                      {item.copy.title}
                    </Text>
                    <AppLink
                      href={item.href}
                      className="focus-visible:after:ring-ring after:absolute after:inset-0 after:rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:after:ring-2"
                    >
                      <Text as="span" size="lead" className="break-all">
                        {item.label}
                      </Text>
                    </AppLink>
                    <Text as="span" size="small" variant="muted">
                      {item.copy.description}
                    </Text>
                  </div>
                  <CopyButton
                    value={value}
                    label={`${channels.copy}: ${item.label}`}
                    copiedLabel={channels.copied}
                    className="absolute right-3 top-3 z-10"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
