import { Suspense } from 'react';
import AdminOrders from '@/components/admin/Pages/AdminOrders';

export default function OrdersPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminOrders /></Suspense>;
}
