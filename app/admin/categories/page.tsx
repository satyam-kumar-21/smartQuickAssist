import { Suspense } from 'react';
import AdminCategories from '@/components/admin/Pages/AdminCategories';

export default function CategoriesPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminCategories /></Suspense>;
}
