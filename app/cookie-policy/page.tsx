import { Metadata } from 'next';
import CookiePolicy from '@/components/privacyPolicy/CookiePolicy';

export const metadata: Metadata = {
  title: 'Cookie Policy - Smart Quick Assist',
  alternates: { canonical: 'https://smartquickassist.com/cookie-policy' },
};

export default function CookiePolicyPage() { return <CookiePolicy />; }
