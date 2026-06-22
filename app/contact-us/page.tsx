import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactMain from '@/components/contact/ContactMain';

export const metadata: Metadata = {
  title: 'Contact Us - Smart Quick Assist | Get Support',
  description: 'Contact Smart Quick Assist for support, product inquiries, or order assistance. Reach our team by email at support@smartquickassist.com.',
  alternates: { canonical: 'https://smartquickassist.com/contact-us' },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ContactMain />
    </Suspense>
  );
}
