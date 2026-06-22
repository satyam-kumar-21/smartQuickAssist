import { Suspense } from 'react';
import AdminProducts from '@/components/admin/Pages/AdminProducts';

export default function ProductsPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminProducts /></Suspense>;
}
