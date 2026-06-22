import { Suspense } from 'react';
import AdminSettings from '@/components/admin/Pages/AdminSettings';

export default function SettingsPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminSettings /></Suspense>;
}
