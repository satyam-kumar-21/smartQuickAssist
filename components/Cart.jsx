'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import { removeFromCart, addToCart } from "../store/actions/cartActions";
import AuthDrawer from "./AuthDrawer";
import { ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductImage from './common/ProductImage';

const Cart = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [hasMounted, setHasMounted] = useState(false);

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { userInfo } = useSelector((state) => state.userLogin);

    const [showAuth, setShowAuth] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalItems = useMemo(() => 
        cartItems.reduce((acc, item) => acc + item.qty, 0), 
        [cartItems]
    );

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    // After login from AuthDrawer, proceed to checkout
    useEffect(() => {
        if (showAuth && userInfo) {
            setShowAuth(false);
            setShowLoginPrompt(false);
            router.push('/checkout/');
        }
    }, [userInfo, showAuth]);

    const checkoutHandler = () => {
        if (!userInfo) {
            setShowLoginPrompt(true);
            setShowAuth(true);
            return;
        }
        router.push('/checkout/');
    };

    return (
        <div className="w-full min-h-screen py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        You have {hasMounted ? totalItems : 0} item(s) in your cart
                    </p>
                </div>

                {!hasMounted ? (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#2364EB] rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8">Ready to start printing? Explore our premium hardware collection.</p>
                        <Link href="/shop" className="inline-block px-8 py-3 bg-[#2364EB] text-white rounded-lg font-semibold hover:bg-[#1a4fb8] transition-colors">
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT : Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.product} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                        <ProductImage
                                            src={item.image ? (item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${item.image}`) : '/assets/printer.png'}
                                            alt={item.title || 'Product image'}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/product/${item.slug}/`} className="font-semibold text-gray-900 hover:text-[#2364EB] transition-colors">
                                                {item.title}
                                            </Link>
                                            <p className="text-emerald-600 text-sm font-semibold mt-1">In Stock</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => dispatch(addToCart(item.product, Math.max(1, item.qty - 1)))}
                                                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                                    >−</button>
                                                    <span className="px-3 text-sm font-semibold text-gray-900">{item.qty}</span>
                                                    <button
                                                        onClick={() => dispatch(addToCart(item.product, Math.min(item.countInStock, item.qty + 1)))}
                                                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                                                <button
                                                    onClick={() => removeFromCartHandler(item.product)}
                                                    className="text-gray-400 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT : Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-[#2364EB]">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Taxes and shipping calculated at checkout</p>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-4">
                                    {showLoginPrompt && !userInfo && (
                                        <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200">
                                            Please login to proceed to checkout
                                        </div>
                                    )}
                                    <button
                                        onClick={checkoutHandler}
                                        className="w-full bg-[#2364EB] text-white py-3 rounded-lg font-semibold hover:bg-[#1a4fb8] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShieldCheck size={20} />
                                        Proceed to Checkout
                                    </button>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-center gap-3 opacity-70">
                                            {/* VISA */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 24 24">
                                                <rect x="2" y="6" width="20" height="12" rx="2" fill="#1A1F71" />
                                                <line x1="2" y1="11" x2="22" y2="11" stroke="white" strokeWidth="1" />
                                                <text x="12" y="16" textAnchor="middle" fontSize="5" fill="white">VISA</text>
                                            </svg>

                                            {/* MASTERCARD */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 24 24">
                                                <rect x="2" y="6" width="20" height="12" rx="2" fill="#000" />
                                                <circle cx="10" cy="12" r="3" fill="#EB001B" />
                                                <circle cx="14" cy="12" r="3" fill="#F79E1B" />
                                            </svg>

                                            {/* AMEX */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 24 24">
                                                <rect x="2" y="6" width="20" height="12" rx="2" fill="#2E77BB" />
                                                <text x="12" y="15" textAnchor="middle" fontSize="4" fill="white">AMEX</text>
                                            </svg>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center mt-2">Secure Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AuthDrawer isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
};

export default Cart;
