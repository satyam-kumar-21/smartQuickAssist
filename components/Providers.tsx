'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/store/store';
import { ImagePreloadProvider } from '@/lib/ImagePreloadContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ImagePreloadProvider>
                {children}
            </ImagePreloadProvider>
        </Provider>
    );
}
