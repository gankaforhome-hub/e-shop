import { ContactUsForm } from '@/features/contact-us/ui/contact-us-form';
import { type NavItem } from '@/shared/i18n/schemas/common.schema';
import { ImageTextPanel } from '@/shared/ui/image-text-panel';
import { SocialLinks } from '@/widgets/layout/ui';

export interface IContactUsBlockProps {
  contactUsForm: {
    image: {
      src: string;
      alt: string;
    };
    title: string;
    formTitle: string;
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
  contactUsForm,
  social,
}: IContactUsBlockProps) => {
  const { image, formTitle, label, btnLetsTalk } = contactUsForm;

  return (
    <ImageTextPanel
      imagePosition="left"
      image={image}
      surface="warm"
      zoom={false}
      textClassName="max-lg:bg-background"
    >
      <div className="flex w-full flex-col items-center px-4 lg:px-10">
        <ContactUsForm
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
