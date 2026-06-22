'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../store/actions/productActions';
import { useImagePreload } from '../../lib/ImagePreloadContext';
import ProductImage from '../common/ProductImage';

const ITEMS_PER_PAGE = 12;

const ShopMain = ({ initialFilters = {} }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || '');
  const [selectedUsageCategory, setSelectedUsageCategory] = useState(
    initialFilters?.usageCategory ? [initialFilters.usageCategory] : []
  );
  const [selectedTechnology, setSelectedTechnology] = useState(initialFilters?.technology || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { getImageUrl: getProductImageUrl } = useImagePreload();
  const productList = useSelector((state) => state.productList);
  const { allProducts = [], allLoading: loading, allError: error, allLoaded } = productList;

  const categories = useMemo(() => {
    const cats = new Set();
    allProducts.forEach((p) => {
      if (p.category?.name) cats.add(p.category.name);
    });
    return Array.from(cats).sort();
  }, [allProducts]);

  const usageCategories = useMemo(() => {
    const cats = new Set();
    allProducts.forEach((p) => {
      if (Array.isArray(p.usageCategory)) {
        p.usageCategory.forEach((c) => cats.add(c));
      } else if (p.usageCategory) {
        cats.add(p.usageCategory);
      }
    });
    return Array.from(cats).sort();
  }, [allProducts]);

  const technologies = useMemo(() => {
    const techs = new Set();
    allProducts.forEach((p) => {
      if (Array.isArray(p.technology)) {
        p.technology.forEach((t) => techs.add(t));
      } else if (p.technology) {
        techs.add(p.technology);
      }
    });
    return Array.from(techs).sort();
  }, [allProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!allLoaded) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allLoaded]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedUsageCategory,
    selectedTechnology,
    priceRange,
    sortBy,
  ]);

  const getFilteredProducts = () => {
    let filtered = allProducts;

    if (debouncedSearchTerm) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category?.name === selectedCategory
      );
    }

    if (selectedUsageCategory.length > 0) {
      filtered = filtered.filter((p) => {
        const pUsage = Array.isArray(p.usageCategory) ? p.usageCategory : [p.usageCategory];
        return selectedUsageCategory.some((cat) => pUsage.includes(cat));
      });
    }

    if (selectedTechnology) {
      filtered = filtered.filter((p) => {
        const pTech = Array.isArray(p.technology) ? p.technology : [p.technology];
        return pTech.includes(selectedTechnology);
      });
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Deep copy array to safely sort without mutating state directly
    const sortedResult = [...filtered];
    if (sortBy === 'lowToHigh') {
      sortedResult.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      sortedResult.sort((a, b) => b.price - a.price);
    }

    return sortedResult;
  };

  const productsToShow = getFilteredProducts();
  const totalPages = Math.ceil(productsToShow.length / ITEMS_PER_PAGE);
  const paginatedProducts = productsToShow.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    selectedUsageCategory.length > 0 ||
    selectedTechnology ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedUsageCategory([]);
    setSelectedTechnology('');
    setPriceRange([0, 1000]);
    setSortBy('');
    setCurrentPage(1);
  };

  const handleUsageCategoryChange = (cat) => {
    setSelectedUsageCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Reusable Sidebar Content Fragment
  const FilterSidebarContent = () => (
    <>
      {/* Search Bar */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            <Search size={16} />
          </button>
        </div>
      </form>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full mb-6 text-sm text-blue-600 hover:text-blue-700 font-medium text-left"
        >
          Clear all filters
        </button>
      )}

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-gray-900 font-semibold text-sm mb-3">Filter by Price</h3>
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full accent-blue-600"
          />
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="text-xs text-gray-600 mt-2">
          Price: ${priceRange[0]} — ${priceRange[1]}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-gray-900 font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left text-sm ${
              selectedCategory === '' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.category?.name === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left text-sm flex justify-between items-center ${
                  selectedCategory === cat ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="truncate mr-2">{cat}</span>
                <span className="text-gray-400 text-xs shrink-0">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Usage Categories */}
      {usageCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Usage Categories</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {usageCategories.map((cat) => {
              const count = allProducts.filter((p) => {
                const pUsage = Array.isArray(p.usageCategory) ? p.usageCategory : [p.usageCategory];
                return pUsage.includes(cat);
              }).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleUsageCategoryChange(cat)}
                  className={`w-full text-left text-sm flex justify-between items-center ${
                    selectedUsageCategory.includes(cat)
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span className="truncate mr-2">{cat}</span>
                  <span className="text-gray-400 text-xs shrink-0">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Technologies</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedTechnology('')}
              className={`w-full text-left text-sm ${
                selectedTechnology === '' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              All Technologies
            </button>
            {technologies.map((tech) => {
              const count = allProducts.filter((p) => {
                const pTech = Array.isArray(p.technology) ? p.technology : [p.technology];
                return pTech.includes(tech);
              }).length;
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTechnology(tech)}
                  className={`w-full text-left text-sm flex justify-between items-center ${
                    selectedTechnology === tech ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span className="truncate mr-2">{tech}</span>
                  <span className="text-gray-400 text-xs shrink-0">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 lg:py-12">
        
        {/* Mobile Filter Control Drawer Backdrop & Container */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative ml-0 mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters By</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebarContent />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Permanent Desktop Left Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-lg border border-gray-100 shadow-sm h-fit sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Filters</h2>
            <FilterSidebarContent />
          </div>

          {/* Right Main Store Side */}
          <div className="lg:col-span-3">
            
            {/* Top Responsive Control Action Bar */}
            <div className="flex items-center justify-between gap-4 mb-5 bg-white p-3 rounded-lg border border-gray-200 shadow-sm lg:shadow-none lg:bg-transparent lg:p-0 lg:border-none">
              
              {/* Left Action: Toggle button on Mobile, Breadcrumb on Desktop */}
              <div>
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="inline-flex lg:hidden items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-semibold text-gray-700 transition"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </button>
                
                <div className="hidden lg:block text-sm text-gray-600">
                  <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                    Home
                  </Link>
                  {' / '}
                  <span className="text-gray-800 font-medium">Store</span>
                </div>
              </div>

              {/* Right Action: Dropdown element */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs text-gray-500">
                  Showing {productsToShow.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, productsToShow.length)} of {productsToShow.length}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
                >
                  <option value="">Default sorting</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Mobile Result Count Label */}
            <div className="block sm:hidden text-xs text-gray-500 mb-4 px-1">
              Showing {productsToShow.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
              {Math.min(currentPage * ITEMS_PER_PAGE, productsToShow.length)} of {productsToShow.length} results
            </div>

            {/* Loading Grid */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded shadow border border-gray-200 overflow-hidden animate-pulse"
                  >
                    <div className="bg-gray-200 aspect-square"></div>
                    <div className="p-3 sm:p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error Template */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-8 text-center">
                <p className="text-red-700 font-semibold text-lg">Error loading products</p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
              </div>
            )}

            {/* Render Flow Layer */}
            {!loading && !error && (
              <>
                {productsToShow.length > 0 ? (
                  /* grid-cols-2 for mobile views, lg:grid-cols-3 for large views */
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-12">
                    {paginatedProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug || product._id}/`}
                        className="group bg-white rounded shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div className="relative bg-gray-50 aspect-square overflow-hidden flex items-center justify-center p-2 sm:p-4">
                          <ProductImage
                            src={getProductImageUrl(product) || '/assets/printer.png'}
                            alt={product.title}
                            width="300"
                            height="300"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 min-h-[2rem]">
                              {product.title}
                            </h3>
                            {product.category?.name && (
                              <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 truncate">
                                {product.category.name}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-sm sm:text-lg text-gray-900 block mt-1">
                            ${product.price?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500 text-sm mb-5 px-4">Try adjusting your filters to find what you're looking for.</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-5 py-2 text-sm rounded font-medium hover:bg-blue-700 transition"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && productsToShow.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopMain;