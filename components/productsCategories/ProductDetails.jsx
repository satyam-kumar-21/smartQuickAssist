'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import api from "../../lib/api";
import { listProductDetails } from "../../store/actions/productActions";
import { addToCart } from "../../store/actions/cartActions";
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import ProductImage from '../common/ProductImage';
import { ProductDetailSkeleton } from '../common/Skeleton';
import SEO from '../common/SEO';

const ProductDetails = () => {
    const { productSlug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [showReviewLoginMessage, setShowReviewLoginMessage] = useState(false);
    const [showEligibilityMessage, setShowEligibilityMessage] = useState(false);
    const [canReview, setCanReview] = useState(false);

    const productDetails = useSelector((state) => state.productDetails);
    const { loading: detailsLoading, error, product: detailProduct } = productDetails;

    const { allProducts = [] } = useSelector((state) => state.productList);

    // Try to find product from allProducts cache for instant display
    const cachedProduct = allProducts.find(
        (p) => p.slug === productSlug || p._id === productSlug
    );
    // Use cached product immediately, then swap to full details once loaded
    const product = detailProduct && (detailProduct.slug === productSlug || detailProduct._id === productSlug)
        ? detailProduct
        : cachedProduct || detailProduct;
    const loading = !product && detailsLoading;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productList = useSelector((state) => state.productList);
    const { allProducts: allProductsForRelated = [] } = productList;

    // Get related products from allProducts cache
    const relatedProducts = product && product.category
        ? allProductsForRelated.filter(
            (p) => {
                const catName = p.category?.name || '';
                const productCatName = product.category?.name || product.category || '';
                return catName.toLowerCase() === productCatName.toString().toLowerCase() && p._id !== product._id;
            }
        ).slice(0, 8)
        : [];

    const categoryName = (product?.category?.name || product?.category || '').toString().toLowerCase();
    const isInkAndToner = categoryName.includes('ink') && categoryName.includes('toner');

    useEffect(() => {
        const checkEligibility = async () => {
            if (userInfo && product && product._id) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    const { data } = await api.get(`/orders/check-review-eligibility/${product._id}`);
                    setCanReview(data.canReview);
                } catch (error) {
                    setCanReview(false);
                }
            }
        };
        checkEligibility();
    }, [userInfo, product]);

    useEffect(() => {
        if (productSlug) {
            dispatch(listProductDetails(productSlug));
        }
    }, [dispatch, productSlug]);

    // Reset active image when product changes
    useEffect(() => {
        setActiveImage(0);
    }, [productSlug]);

    const addToCartHandler = () => {
        dispatch(addToCart(product.slug || product._id, qty));
        router.push('/cart/');
    };

    const buyNowHandler = () => {
        dispatch(addToCart(product.slug || product._id, qty));
        router.push('/cart/');
    };

    const handleWriteReview = () => {
        if (!userInfo) {
            setShowReviewLoginMessage(true);
            setTimeout(() => setShowReviewLoginMessage(false), 3000);
            return;
        }

        if (!canReview) {
            setShowEligibilityMessage(true);
            setTimeout(() => setShowEligibilityMessage(false), 3000);
            return;
        }

        // Logic to open review form would go here
    };

    if (loading) return <ProductDetailSkeleton />;

    if (error || !product) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="space-y-4 max-w-sm">
                <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
                <p className="text-gray-600 font-medium text-sm">
                    The product you're looking for doesn't exist.
                </p>
            </div>
            <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-[#2364EB] text-white rounded-lg font-semibold hover:bg-[#1a4fb8] transition-colors"
            >
                Back to Home
            </button>
        </div>
    );

    const productImages = product.images && product.images.length > 0
        ? product.images.map(img => img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${img}`)
        : ["/assets/printer.png"];

    return (
        <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32">
            <SEO
                title={product.title}
                description={product.description ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) : `Buy ${product.title} at Smart Quick Assist. Best prices with free shipping.`}
                canonical={`/product/${product.slug}/`}
                type="product"
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery Section */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-50 rounded-xl p-8 flex items-center justify-center">
                            <ProductImage
                                src={productImages[activeImage]}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`aspect-square w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all
                                            ${activeImage === index ? 'border-[#2364EB]' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <ProductImage src={img} alt={`${product.title} ${index}`} className="w-full h-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-8">
                        {/* Badges & Title */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(product.usageCategory) && product.usageCategory.length > 0 && (
                                    product.usageCategory.map((val, idx) => (
                                        <span key={"usage-" + val + idx} className="px-3 py-1 bg-[#2364EB]/10 text-[#2364EB] rounded-full text-xs font-semibold">
                                            {val}
                                        </span>
                                    ))
                                )}
                                {product.countInStock > 0 ? (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Price */}
                        <div>
                            <span className="text-4xl font-bold text-[#2364EB]">
                                ${product.price?.toFixed(2)}
                            </span>
                        </div>

                        {/* Short Details */}
                        {product.shortDetails && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900">Key Highlights</h3>
                                <div
                                    dangerouslySetInnerHTML={{ __html: product.shortDetails }}
                                    className="text-gray-600 text-sm leading-relaxed"
                                />
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="space-y-6">
                            {product.countInStock > 0 && (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-semibold text-gray-900">Quantity:</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setQty(Math.max(1, qty - 1))}
                                            className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        > − </button>
                                        <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                                        <button
                                            onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                            className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
                                        > + </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                                        ${product.countInStock > 0
                                            ? 'bg-[#2364EB] text-white hover:bg-[#1a4fb8]'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <ShoppingCart size={20} />
                                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                {product.countInStock > 0 && (
                                    <button
                                        onClick={buyNowHandler}
                                        className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-semibold"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="flex gap-8 pt-4 border-t border-gray-100">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Truck className="text-[#2364EB]" size={24} />
                                    <span className="text-xs font-semibold text-gray-600">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Shield className="text-[#2364EB]" size={24} />
                                    <span className="text-xs font-semibold text-gray-600">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <RotateCcw className="text-emerald-500" size={24} />
                                    <span className="text-xs font-semibold text-gray-600">Easy Returns</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Specs */}
                        {(product.technology || product.mainFunction || product.wireless || product.shortSpecification) && !isInkAndToner && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Array.isArray(product.technology) && product.technology.length > 0 && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Technology</span>
                                            <span className="text-sm text-gray-900">{product.technology.join(', ')}</span>
                                        </div>
                                    )}
                                    {Array.isArray(product.mainFunction) && product.mainFunction.length > 0 && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Main Function</span>
                                            <span className="text-sm text-gray-900">{product.mainFunction.join(', ')}</span>
                                        </div>
                                    )}
                                    {product.wireless && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Wireless</span>
                                            <span className="text-sm text-gray-900">{product.wireless}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabbed Content */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="flex gap-8 border-b border-gray-200 overflow-x-auto">
                        {["overview", "specifications", "reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 text-sm font-semibold transition-colors relative whitespace-nowrap
                                    ${activeTab === tab ? 'text-[#2364EB] border-b-2 border-[#2364EB]' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="py-8">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="max-w-4xl">
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                                {product.overview && (
                                    <div dangerouslySetInnerHTML={{ __html: product.overview }} className="prose prose-slate max-w-none text-gray-600 mt-6" />
                                )}
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === "specifications" && (
                            <div>
                                {product.technicalSpecification ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.technicalSpecification }} className="prose prose-slate max-w-none text-gray-600" />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Brand', value: product.brand },
                                            { label: 'Color', value: product.color },
                                            { label: 'Width', value: product.width ? `${product.width}"` : null },
                                            { label: 'Height', value: product.height ? `${product.height}"` : null },
                                            { label: 'Depth', value: product.depth ? `${product.depth}"` : null },
                                            { label: 'Screen Size', value: product.screenSize },
                                        ].map(item => (
                                            item.value && (
                                                <div key={item.label} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">{item.label}</span>
                                                    <span className="text-sm text-gray-900">{item.value}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === "reviews" && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                                    <div className="w-full sm:w-auto">
                                        {showReviewLoginMessage && (
                                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold mb-2">
                                                Please login to write a review
                                            </div>
                                        )}
                                        {showEligibilityMessage && (
                                            <div className="p-3 bg-[#2364EB]/10 text-[#2364EB] rounded-lg text-sm font-semibold mb-2">
                                                Please purchase and receive this item to review
                                            </div>
                                        )}
                                        <button
                                            onClick={handleWriteReview}
                                            className="w-full sm:w-auto px-5 py-2.5 border border-[#2364EB] text-[#2364EB] rounded-lg font-semibold hover:bg-[#2364EB] hover:text-white transition-colors"
                                        >
                                            Write a Review
                                        </button>
                                    </div>
                                </div>

                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {product.reviews.map((review, index) => (
                                            <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-gray-900">{review.name}</span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} size={16} className={`${review.rating >= s ? 'fill-[#2364EB] text-[#2364EB]' : 'text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.filter(p => p && p._id !== product._id && p.slug !== (product.slug || productSlug)).slice(0, 4).map((item) => (
                                <Link
                                    href={`/product/${item.slug || item._id}/`}
                                    key={item._id}
                                    className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all block"
                                    onClick={() => window.scrollTo(0, 0)}
                                >
                                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden p-4 flex items-center justify-center">
                                        <ProductImage
                                            src={item.image || (item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${item.images[0]}`) : '/assets/printer.png')}
                                            alt={item.title}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#2364EB] transition-colors">{item.title}</h4>
                                    <span className="text-lg font-bold text-[#2364EB]">${item.price?.toFixed(2)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
