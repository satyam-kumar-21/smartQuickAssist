import { Metadata } from 'next';
import { Suspense } from 'react';
import FAQMain from '@/components/faq/FAQMain';

export const metadata: Metadata = {
  title: 'FAQ - Smart Quick Assist | Frequently Asked Questions',
  description: 'Find answers to common questions about shipping, returns, warranties, and printer compatibility at Smart Quick Assist.',
  alternates: { canonical: 'https://smartquickassist.com/faq' },
};

export default function FAQPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <FAQMain />
    </Suspense>
  );
}
