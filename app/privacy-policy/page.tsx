import { Metadata } from 'next';
import PrivacyPolicy from '@/components/privacyPolicy/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy - Smart Quick Assist',
  description: 'Read the Smart Quick Assist Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://smartquickassist.com/privacy-policy' },
};

export default function PrivacyPage() { return <PrivacyPolicy />; }
