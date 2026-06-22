'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

interface ImagePreloadContextProps {
  imageStatus: Record<string, 'loading' | 'loaded' | 'error'>;
  allImagesPreloaded: boolean;
  getImageUrl: (product: any) => string | null;
  isImageReady: (product: any) => boolean;
  isImageLoaded: (product: any) => boolean;
}

const ImagePreloadContext = createContext<ImagePreloadContextProps>({
  imageStatus: {},
  allImagesPreloaded: false,
  getImageUrl: () => null,
  isImageReady: () => true,
  isImageLoaded: () => true,
});

export const useImagePreload = () => useContext(ImagePreloadContext);

function resolveImageUrl(product: any) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
  if (product?.image) {
    return product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`;
  }
  if (product?.images && product.images.length > 0) {
    return product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`;
  }
  return null;
}

export const ImagePreloadProvider = ({ children }: { children: React.ReactNode }) => {
  const { allProducts = [], allLoaded } = useSelector((state: any) => state.productList || {});
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});

  useEffect(() => {
    if (!allLoaded || allProducts.length === 0) return;

    let cancelled = false;

    const urls = [...new Set(
      allProducts.map((p: any) => resolveImageUrl(p)).filter(Boolean)
    )] as string[];

    const CONCURRENT = 6;
    let index = 0;

    const loadNext = () => {
      if (cancelled || index >= urls.length) return;
      const url = urls[index++];
      const img = new Image();
      img.onload = () => {
        if (!cancelled) {
          setImageStatus((prev) => ({ ...prev, [url]: 'loaded' }));
        }
        loadNext();
      };
      img.onerror = () => {
        if (!cancelled) {
          setImageStatus((prev) => ({ ...prev, [url]: 'error' }));
        }
        loadNext();
      };
      img.src = url;
    };

    for (let i = 0; i < Math.min(CONCURRENT, urls.length); i++) {
      loadNext();
    }

    return () => { cancelled = true; };
  }, [allLoaded, allProducts]);

  const allImagesPreloaded = useMemo(() => {
    if (!allLoaded || allProducts.length === 0) return false;
    return allProducts.every((product: any) => {
      const url = resolveImageUrl(product);
      if (!url) return true;
      const status = imageStatus[url];
      return status === 'loaded' || status === 'error';
    });
  }, [allLoaded, allProducts, imageStatus]);

  const getImageUrl = useCallback((product: any) => resolveImageUrl(product), []);

  const isImageReady = useCallback(
    (product: any) => {
      const url = resolveImageUrl(product);
      if (!url) return true;
      const status = imageStatus[url];
      return status === 'loaded' || status === 'error';
    },
    [imageStatus]
  );

  const isImageLoaded = useCallback(
    (product: any) => {
      const url = resolveImageUrl(product);
      if (!url) return true;
      return imageStatus[url] === 'loaded';
    },
    [imageStatus]
  );

  return (
    <ImagePreloadContext.Provider value={{ imageStatus, allImagesPreloaded, getImageUrl, isImageReady, isImageLoaded }}>
      {children}
    </ImagePreloadContext.Provider>
  );
};

export default ImagePreloadContext;
