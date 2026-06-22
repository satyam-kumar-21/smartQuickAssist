import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductDetails from '@/components/productsCategories/ProductDetails';

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }): Promise<Metadata> {
  const { productSlug } = await params;
  return {
    title: `${productSlug.replace(/-/g, ' ')} - Smart Quick Assist`,
    description: `Shop ${productSlug.replace(/-/g, ' ')} at Smart Quick Assist. Great prices with free shipping across North America.`,
  };
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductDetails />
    </Suspense>
  );
}
