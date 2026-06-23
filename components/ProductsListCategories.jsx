'use client';

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../store/actions/productActions";
import Link from "next/link";
import ProductImage from "./common/ProductImage";
import { useImagePreload } from "../lib/ImagePreloadContext";

const ProductsListCategories = ({ title, description, filters = {} }) => {
  const dispatch = useDispatch();
  const { getImageUrl } = useImagePreload();
  
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, allProducts = [], allLoaded } = productList;

  // Only fetch from API if allProducts isn't loaded yet
  useEffect(() => {
    if (!allLoaded) {
      dispatch(listProducts('', filters.category || '', 1, '', filters.brand || '', filters.technology || '', filters.usageCategory || [], '', filters.wireless || '', filters.mainFunction || []));
    }
  }, [dispatch, JSON.stringify(filters), allLoaded]);

  // Filter products based on the provided filters
  const sourceProducts = allLoaded
    ? allProducts.filter((p) => {
        // Category filter
        if (filters.category) {
          const catName = p.category?.name || '';
          if (catName.toLowerCase() !== filters.category.toLowerCase()) {
            return false;
          }
        }
        
        // Usage Category filter (array)
        if (filters.usageCategory && filters.usageCategory.length > 0) {
          const pUsage = Array.isArray(p.usageCategory) ? p.usageCategory : [p.usageCategory];
          const hasUsage = filters.usageCategory.some(cat => 
            pUsage.includes(cat) || pUsage.some(u => u?.toLowerCase() === cat?.toLowerCase())
          );
          if (!hasUsage) return false;
        }
        
        // Brand filter
        if (filters.brand) {
          if (p.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
            return false;
          }
        }
        
        // Technology filter
        if (filters.technology) {
          const pTech = Array.isArray(p.technology) ? p.technology : [p.technology];
          const hasTech = pTech.includes(filters.technology) || pTech.some(t => t?.toLowerCase() === filters.technology?.toLowerCase());
          if (!hasTech) return false;
        }
        
        // Wireless filter
        if (filters.wireless) {
          if (p.wireless?.toString()?.toLowerCase() !== filters.wireless.toLowerCase()) {
            return false;
          }
        }
        
        // Main Function filter (array)
        if (filters.mainFunction && filters.mainFunction.length > 0) {
          const pMainFn = Array.isArray(p.mainFunction) ? p.mainFunction : [p.mainFunction];
          const hasMainFn = filters.mainFunction.some(fn => 
            pMainFn.includes(fn) || pMainFn.some(f => f?.toLowerCase() === fn?.toLowerCase())
          );
          if (!hasMainFn) return false;
        }
        
        return true;
      })
    : (Array.isArray(products) ? products : []);

  const displayProducts = sourceProducts.slice(0, 12);
  
  const formattedProducts = displayProducts.map((product) => ({
    ...product,
    image: product.image
      ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${product.image}`)
      : (product.images && product.images.length > 0
        ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${product.images[0]}`)
        : "/assets/printer.png"),
    link: `/product/${product.slug || product._id}/`
  }));

  if (error && !allLoaded) return <div className="py-20 text-center font-black uppercase text-[10px] tracking-[0.3em] text-red-500">{error}</div>;

  return (
    <div className="w-full bg-white border-t border-b border-gray-200 py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
      {/* Heading and Description */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{description}</p>
          )}
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#2364EB] text-[#2364EB] text-sm font-semibold rounded hover:bg-[#2364EB] hover:text-white transition-colors"
          >
            EXPLORE ALL PRODUCTS →
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {formattedProducts.map((product) => {
          const inStock = product.countInStock > 0;
          return (
            <Link
              key={product._id || product.slug}
              href={product.link || `/product/${product.slug}/`}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image Container */}
              <div className="relative bg-gray-50 w-full aspect-square overflow-hidden flex items-center justify-center">
                <ProductImage
                  src={getImageUrl(product) || '/assets/printer.png'}
                  alt={product.title}
                  width="300"
                  height="300"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-4"
                />

                {/* Stock Badge */}
                {!inStock && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                {/* Category */}
                {product.category && (
                  <p className="text-xs text-gray-500 mb-2">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-[#2364EB]">
                    ${product.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default ProductsListCategories;
