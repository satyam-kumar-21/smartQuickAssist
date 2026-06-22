import { Metadata } from 'next';
import { Suspense } from 'react';
import ReturnsAndExchanges from '@/components/order/ReturnsAndExchanges';

export const metadata: Metadata = {
  title: 'Returns & Exchanges - Smart Quick Assist',
  description: 'Submit a return or exchange request at Smart Quick Assist. Easy 30-day returns policy.',
  alternates: { canonical: 'https://smartquickassist.com/returns-exchanges' },
};

export default function ReturnsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ReturnsAndExchanges />
    </Suspense>
  );
}
