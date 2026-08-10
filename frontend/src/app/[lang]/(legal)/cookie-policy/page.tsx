import { BlankPage } from '@/widgets/blank-page';

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  console.log('🚀 ~ CookiePolicyPage ~ lang:', lang);
  return (
    <>
      <BlankPage />
    </>
  );
}
