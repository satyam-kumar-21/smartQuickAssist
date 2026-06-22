import { Metadata } from 'next';
import { Suspense } from 'react';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'My Profile - Smart Quick Assist',
  description: 'Manage your account, orders, and preferences at Smart Quick Assist.',
};

export default function Profile() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProfilePage />
    </Suspense>
  );
}
