import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminLogin from '@/components/admin/Auth/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Login - Smart Quick Assist',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <AdminLogin />
    </Suspense>
  );
}
