import LandingPage from '@/components/LandingPage';
import { getLandingContent } from '@/lib/cms';
import type { LandingContent } from '@/lib/cms';

export default function Landing({ content }: { content: LandingContent }) {
  return <LandingPage content={content} />;
}

export async function getStaticProps() {
  const content = await getLandingContent();
  return { props: { content } };
}

