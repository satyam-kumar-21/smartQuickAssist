import { Metadata } from 'next';
import EULA from '@/components/policies/EULA';

export const metadata: Metadata = {
  title: 'EULA - Smart Quick Assist | End User License Agreement',
  alternates: { canonical: 'https://smartquickassist.com/eula' },
};

export default function EULAPage() { return <EULA />; }
