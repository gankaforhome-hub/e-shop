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
  formId,
  contactUsForm,
  social,
  headingId = 'contact-us-form',
  spacing,
}: IContactUsSectionProps) => {
  if (header) {
    return (
      <Section aria-labelledby={headingId} spacing={spacing}>
        {/* One gap owns header → form spacing (former fgap-8/14 + the
            panel's mt-4/md:mt-8; same 48px / 88px end values) */}
        <Container className="fgap-12/22 flex flex-col">
          {header}
          <ContactUsBlock
            formId={formId}
            contactUsForm={contactUsForm}
            social={social}
          />
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

        <ContactUsBlock
          className={sectionIntro ? undefined : 'mt-4 md:mt-8'}
          formId={formId}
          contactUsForm={contactUsForm}
          social={social}
        />
      </Container>
    </Section>
  );
};
