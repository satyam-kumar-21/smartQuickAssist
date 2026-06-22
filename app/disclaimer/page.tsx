import { Metadata } from 'next';
import Disclaimer from '@/components/privacyPolicy/Disclaimer';

export const metadata: Metadata = {
  title: 'Disclaimer - Smart Quick Assist',
  alternates: { canonical: 'https://smartquickassist.com/disclaimer' },
};

export default function DisclaimerPage() { return <Disclaimer />; }
