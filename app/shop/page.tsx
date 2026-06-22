import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopMain from '@/components/shop/ShopMain';

export const metadata: Metadata = {
  title: 'Shop Printers & Printing Supplies - Smart Quick Assist',
  description: 'Browse our full selection of inkjet printers, laser printers, all-in-one printers, and printing supplies. Shop Smart Quick Assist for the best prices with free shipping across North America.',
  alternates: { canonical: 'https://smartquickassist.com/shop' },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopMain />
    </Suspense>
  );
}
