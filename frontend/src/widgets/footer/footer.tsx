import { FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { Box } from '@/shared/ui/box';
import { Container } from '@/shared/ui/container';

interface IFooterProps {
  className?: string;
}

export const Footer: FC<IFooterProps> = ({ className }) => {
  return (
    <footer className={cn('', className)}>
      <Container>
        <Box className="flex h-20 items-center justify-center bg-teal-600">
          <p className="text-6xl font-bold">Footer</p>
        </Box>
      </Container>
    </footer>
  );
};
