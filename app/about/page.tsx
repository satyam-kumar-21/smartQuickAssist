import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutMain from '@/components/about/AboutMain';

export const metadata: Metadata = {
  title: 'About Us - Smart Quick Assist | Independent Printer Retailer',
  description: 'Learn about Smart Quick Assist, an independent eCommerce retailer based in San Francisco, California. We specialize in printers and printing solutions for home and business use across North America.',
  alternates: { canonical: 'https://smartquickassist.com/about' },
};

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AboutMain />
    </Suspense>
  );
}
