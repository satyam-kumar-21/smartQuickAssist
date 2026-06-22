import { Metadata } from 'next';
import { Suspense } from 'react';
import HomeMain from '@/components/home/HomeMain';

export const metadata: Metadata = {
  title: 'Smart Quick Assist - Buy Printers & Printing Supplies Online | Free Shipping | 2026',
  description: 'Shop Smart Quick Assist for high-quality printers, ink cartridges, and toner at affordable prices. Inkjet, laser, and all-in-one printers for home and office. Free shipping across North America.',
  alternates: { canonical: 'https://smartquickassist.com/' },
};

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeMain />
    </Suspense>
  );
}
