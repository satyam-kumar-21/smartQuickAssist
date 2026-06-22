import { Metadata } from 'next';
import { Suspense } from 'react';
import Checkout from '@/components/Checkout';

export const metadata: Metadata = {
  title: 'Checkout - Smart Quick Assist',
  description: 'Complete your order at Smart Quick Assist. Secure checkout with multiple payment options.',
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <Checkout />
    </Suspense>
  );
}
