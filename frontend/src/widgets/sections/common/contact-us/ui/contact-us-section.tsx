import { type ReactNode } from 'react';

import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { ContactUsBlock, type IContactUsBlockProps } from './contact-us-block';

interface IContactUsSectionProps extends IContactUsBlockProps {
  sectionIntro?: {
    title: string;
    description: string;
  };
  /**
   * Custom opener per touchpoint (Contacts help prompt, wholesale…). Replaces
   * `sectionIntro`; must render a heading with `id={headingId}`.
   */
  header?: ReactNode;
  headingId?: string;
}

export const ContactUsSection = ({
  sectionIntro,
  header,
  contactUsForm,
  social,
  headingId = 'contact-us-form',
}: IContactUsSectionProps) => {
  if (header) {
    return (
      <Section aria-labelledby={headingId}>
        <Container className="fgap-8/14 flex flex-col">
          {header}
          <ContactUsBlock contactUsForm={contactUsForm} social={social} />
        </Container>
      </Section>
    );
  }

  return (
    <Section aria-labelledby={headingId}>
      <Container>
        {sectionIntro ? (
          <SectionIntro
            heading={sectionIntro.title}
            headingId={headingId}
            description={sectionIntro.description}
          />
        ) : (
          <Heading id={headingId} headingLevel="h2" visibility="hidden">
            {contactUsForm.title}
          </Heading>
        )}

        <ContactUsBlock contactUsForm={contactUsForm} social={social} />
      </Container>
    </Section>
  );
};
