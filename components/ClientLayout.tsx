'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin/') || pathname === '/admin';

  return (
    <>
      {!isAdminRoute && <Header />}
      <ScrollToTop />
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
