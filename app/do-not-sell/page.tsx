import { Metadata } from 'next';
import DoNotSell from '@/components/policies/DoNotSell';

export const metadata: Metadata = {
  title: 'Do Not Sell My Personal Information - Smart Quick Assist',
  alternates: { canonical: 'https://smartquickassist.com/do-not-sell' },
};

export default function DoNotSellPage() { return <DoNotSell />; }
