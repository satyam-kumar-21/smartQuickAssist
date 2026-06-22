import { Metadata } from 'next';
import ReturnExchangePolicy from '@/components/privacyPolicy/ReturnExchangePolicy';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy - Smart Quick Assist',
  alternates: { canonical: 'https://smartquickassist.com/return-exchange-policy' },
};

export default function ReturnExchangePage() { return <ReturnExchangePolicy />; }
