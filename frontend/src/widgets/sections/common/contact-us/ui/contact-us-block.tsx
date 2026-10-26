import { LeadForm, type LeadFormId } from '@/features/contact-us';
import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { SocialLinks } from '@/widgets/layout/ui';

export interface IContactUsBlockProps {
  /** Identifies this placement in submitted leads. */
  formId: LeadFormId;
  contactUsForm: {
    image: {
      src: string;
      alt: string;
    };
    title: string;
    formTitle?: string;
    btnLetsTalk: string;
    label: {
      email: string;
      phoneNumber: string;
      comment: string;
    };
  };
  social: NavItem[];
}

export const ContactUsBlock = ({
  formId,
  contactUsForm,
  social,
}: IContactUsBlockProps) => {
  const { image, formTitle, label, btnLetsTalk } = contactUsForm;

  return (
    // Stacked below md; from md image and form sit side by side and stretch
    // to the same row height. The photo is contained on its own studio
    // backdrop, so the plate is never cropped whatever the box shape
    <ImageTextPanel
      imagePosition="left"
      image={image}
      padding="form"
      imageSizes="(min-width: 768px) 50vw, 100vw"
      className="md:flex-row"
      imageContainerClassName="bg-surface-photo md:aspect-auto md:min-w-0 md:basis-1/2"
      imageClassName="object-contain"
      textClassName="md:min-w-0 md:basis-1/2"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center">
        <LeadForm
          formId={formId}
          formTitle={formTitle}
          label={label}
          btnLetsTalk={btnLetsTalk}
        />
        <SocialLinks
          variant="contactUsForm"
          links={social}
          className="mt-6 lg:mt-8"
        />
      </div>
    </ImageTextPanel>
  );
};
