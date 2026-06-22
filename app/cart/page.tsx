import { Metadata } from 'next';
import { Suspense } from 'react';
import Cart from '@/components/Cart';

export const metadata: Metadata = {
  title: 'Shopping Cart - Smart Quick Assist',
  description: 'Review your shopping cart and proceed to checkout at Smart Quick Assist.',
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <Cart />
    </Suspense>
  );
}
