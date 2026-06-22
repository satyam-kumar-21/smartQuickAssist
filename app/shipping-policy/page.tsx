import { Metadata } from 'next';
import ShippingPolicy from '@/components/privacyPolicy/ShippingPolicy';

export const metadata: Metadata = {
  title: 'Shipping Policy - Smart Quick Assist',
  alternates: { canonical: 'https://smartquickassist.com/shipping-policy' },
};

export default function ShippingPolicyPage() { return <ShippingPolicy />; }
