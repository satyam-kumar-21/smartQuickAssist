import { Suspense } from 'react';
import AdminDashboard from '@/components/admin/Pages/AdminDashboard';

export default function DashboardPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminDashboard /></Suspense>;
}
