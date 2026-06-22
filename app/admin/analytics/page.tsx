import { Suspense } from 'react';
import AdminAnalytics from '@/components/admin/Pages/AdminAnalytics';

export default function AnalyticsPage() {
  return <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}><AdminAnalytics /></Suspense>;
}
