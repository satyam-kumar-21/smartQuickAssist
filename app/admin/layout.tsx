'use client';

import { usePathname } from 'next/navigation';
import AdminLayoutWrapper from '@/components/admin/Layout/AdminLayoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap login page with AdminLayoutWrapper
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return <>{children}</>;
  }
  
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
