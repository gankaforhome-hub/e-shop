import { Heading } from '@/shared/ui/heading';
import { Text } from '@/shared/ui/text';

interface SectionIntroProps {
  heading: string;
  paragraph: string;
  headingId: string;
}

export function SectionIntro({
  heading,
  paragraph,
  headingId,
}: SectionIntroProps) {
  return (
    <>
      <Heading
        headingLevel="h2"
        variant="section"
        position="center"
        className="fmb-4/6"
        id={headingId}
      >
        {heading}
      </Heading>
      <Text position="center" font="secondary">
        {paragraph}
      </Text>
    </>
  );
}
