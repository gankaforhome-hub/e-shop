import { Container } from '@/shared/ui/container';
import { Section } from '@/shared/ui/section';

import { type ImageTextPanelContent } from '../api';

import { ImageTextPanel } from './image-text-panel';

export function AboutGankaSection(panel: ImageTextPanelContent) {
  return (
    <>
      <Section className="fpb-10/30">
        <Container>
          <ImageTextPanel {...panel} />
        </Container>
      </Section>
    </>
  );
}
