import { Metadata } from 'next';
import TermsAndConditions from '@/components/TermsAndConditions';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Smart Quick Assist',
  description: 'Read the Smart Quick Assist Terms and Conditions for your purchase and use of our website.',
  alternates: { canonical: 'https://smartquickassist.com/terms-and-conditions' },
};

export default function TermsPage() { return <TermsAndConditions />; }
