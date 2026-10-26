import { type ReactNode } from 'react';

import { Container } from '@/shared/ui/container';
import { Heading } from '@/shared/ui/heading';
import { Section, type SectionProps } from '@/shared/ui/section';
import { SectionIntro } from '@/shared/ui/section-intro';

import { ContactUsBlock, type IContactUsBlockProps } from './contact-us-block';

interface IContactUsSectionProps extends IContactUsBlockProps {
  sectionIntro?: {
    title: string;
    description: string;
  };
  header?: ReactNode;
  headingId?: string;
  /** Vertical rhythm of the wrapping `Section` (its default when omitted). */
  spacing?: SectionProps['spacing'];
}

export const ContactUsSection = ({
  sectionIntro,
  header,
  contactUsForm,
  social,
  headingId = 'contact-us-form',
  spacing,
}: IContactUsSectionProps) => {
  if (header) {
    return (
      <Section aria-labelledby={headingId} spacing={spacing}>
        <Container className="fgap-8/14 flex flex-col">
          {header}
          <ContactUsBlock contactUsForm={contactUsForm} social={social} />
        </Container>
      </Section>
    );
  }

  return (
    <Section aria-labelledby={headingId} spacing={spacing}>
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
