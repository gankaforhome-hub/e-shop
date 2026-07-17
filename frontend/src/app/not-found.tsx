import { type Metadata } from 'next';

import { NotFoundWidget } from '@/widgets/not-found';

export const metadata: Metadata = {
  title: '404',
  description: 'Something went wrong',
};

export default function NotFound() {
  return (
    <>
      <NotFoundWidget />
    </>
  );
}
