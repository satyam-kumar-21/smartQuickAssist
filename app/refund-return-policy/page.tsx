import { Metadata } from 'next';
import RefundReturnPolicy from '@/components/privacyPolicy/RefundReturnPolicy';

export const metadata: Metadata = {
  title: 'Refund & Return Policy - Smart Quick Assist',
  description: 'Learn about our 30-day refund and return policy at Smart Quick Assist.',
  alternates: { canonical: 'https://smartquickassist.com/refund-return-policy' },
};

export default function RefundPage() { return <RefundReturnPolicy />; }
