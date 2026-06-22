'use client';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../../store/actions/productActions';
import { fetchCartFromDB } from '../../store/actions/cartActions';
import Hero from "./Hero";
import ProductsListCategories from "../ProductsListCategories";

import WhyChooseUs from "./WhyChooseUs";
import ProductGrid from "../productsCategories/ProductGrid";

const HomeMain = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');
    const dispatch = useDispatch();

    const { allProducts = [], allLoading, allLoaded } = useSelector((state: any) => state.productList || {});
    const { userInfo } = useSelector((state: any) => state.userLogin || {});
    
    const homePrintersFilters = useMemo(() => ({ usageCategory: ['Home'] }), []);
    const officePrintersFilters = useMemo(() => ({ usageCategory: ['Office'] }), []);
    const inkjetPrintersFilters = useMemo(() => ({ technology: 'Inkjet' }), []);
    const laserPrintersFilters = useMemo(() => ({ technology: 'Laser' }), []);

    // Prefetch all products on mount
    useEffect(() => {
        if (!allLoaded) {
            dispatch(fetchAllProducts() as any);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // Restore cart from DB if user is logged in
    useEffect(() => {
        if (userInfo?.token) {
            dispatch(fetchCartFromDB() as any);
        }
    }, [dispatch, userInfo?.token]);

    // Filter from all products cache for instant search
    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return allProducts.filter((p: any) =>
            p.title?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
    }, [searchQuery, allProducts]);

    if (searchQuery) {
        return (
            <div className="min-h-screen bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search Results for "{searchQuery}"</h1>
                    {(!allLoaded || allLoading) && allProducts.length === 0 ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : searchResults.length > 0 ? (
                        <ProductGrid products={searchResults} />
                    ) : (
                        <div className="text-center py-12">No products found for "{searchQuery}"</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Fixed Background for Home Route */}
            <div 
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat" 
                style={{ backgroundImage: 'url(/hero-banner-home-fixed.png)' }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="relative z-0">
                <Hero />
                
                <ProductsListCategories 
                  title="Home Printers" 
                  description="Compact and easy-to-use printers perfect for schoolwork, photos, and everyday documents." 
                  filters={homePrintersFilters} 
                />

                <ProductsListCategories 
                  title="Office Printers" 
                  description="Reliable printers and MFPs built for productivity in modern workspaces." 
                  filters={officePrintersFilters} 
                />

                <ProductsListCategories 
                  title="Inkjet Printers" 
                  description="High-quality inkjet printers for photos, documents, and everyday printing needs." 
                  filters={inkjetPrintersFilters} 
                />

                <ProductsListCategories 
                  title="Laser Printers" 
                  description="Fast, efficient laser printers perfect for high-volume office use." 
                  filters={laserPrintersFilters} 
                />
                
          
               
            </div>

            <WhyChooseUs />
        </>
    );
};

export default HomeMain;
