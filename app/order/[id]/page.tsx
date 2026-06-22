import { Metadata } from 'next';
import { Suspense } from 'react';
import OrderDetails from '@/components/order/OrderDetails';

export const metadata: Metadata = {
  title: 'Order Details - Smart Quick Assist',
  description: 'View your order details and status at Smart Quick Assist.',
};

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <OrderDetails />
    </Suspense>
  );
}
