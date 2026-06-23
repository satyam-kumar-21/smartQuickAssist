'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { saveShippingAddress } from '../store/actions/cartActions';
import api from '../lib/api';
import { Loader2, ShieldCheck, Trash2, CreditCard } from 'lucide-react';
import ProductImage from './common/ProductImage';

const Checkout = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const cart = useSelector((state) => state.cart);
    const { cartItems, shippingAddress } = cart;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [clover, setClover] = useState(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || 'US');
    const [province, setProvince] = useState(shippingAddress?.state || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');

    useEffect(() => {
        // Prevent execution on server during build phase
        if (typeof window === 'undefined') return;

        const mountCloverElements = () => {
            setTimeout(() => {
                const numberEl = document.getElementById('card-number');
                const dateEl = document.getElementById('card-date');
                const cvvEl = document.getElementById('card-cvv');
                const zipEl = document.getElementById('card-postal-code');

                // Check if containers exist and are empty
                if (numberEl && !numberEl.hasChildNodes() && window.Clover) {
                    const cloverInstance = new window.Clover(process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY);
                    const elements = cloverInstance.elements();

                    const styles = {
                        body: {
                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontSize: '14px',
                            color: '#111827',
                            fontWeight: '500',
                            margin: '0',
                            padding: '0',
                            width: '100%'
                        },
                        input: {
                            padding: '0',
                            margin: '0',
                            width: '100%'
                        }
                    };

                    const cardNumber = elements.create('CARD_NUMBER', { styles });
                    const cardDate = elements.create('CARD_DATE', { styles });
                    const cardCvv = elements.create('CARD_CVV', { styles });
                    const cardPostalCode = elements.create('CARD_POSTAL_CODE', { styles });

                    cardNumber.mount('#card-number');
                    cardDate.mount('#card-date');
                    cardCvv.mount('#card-cvv');
                    cardPostalCode.mount('#card-postal-code');

                    setClover(cloverInstance);
                }
            }, 100);
        };

        if (!userInfo || cartItems.length === 0) {
            router.push('/cart/');
        } else if (step === 2) {
            if (window.Clover) {
                mountCloverElements();
                return;
            }

            let script = document.getElementById('clover-sdk');
            if (!script) {
                script = document.createElement('script');
                script.id = 'clover-sdk';
                script.src = 'https://checkout.clover.com/sdk.js';
                script.defer = true;
                document.body.appendChild(script);
            }

            script.addEventListener('load', mountCloverElements, { once: true });
        }
    }, [userInfo, cartItems, step, router]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const total = subtotal;

    const submitShippingHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country, state: province, phone }));
        setStep(2);
    };

    const removeFromCartHandler = (id) => {
        dispatch(require('../store/actions/cartActions').removeFromCart(id));
    };

    const initPayment = async () => {
        try {
            setLoading(true);

            if (!clover) {
                alert('Clover not initialized');
                setLoading(false);
                return;
            }

            const result = await clover.createToken();
            if (result.errors) {
                 alert('Payment Error: ' + Object.values(result.errors).join(', '));
                 setLoading(false);
                 return;
            }
            if (!result.token) {
                 alert('Failed to create payment token. Please check your card details.');
                 setLoading(false);
                 return;
            }

            const orderData = {
                orderItems: cartItems,
                shippingAddress: { 
                    address, 
                    city, 
                    postalCode, 
                    country, 
                    phone, 
                    state: province,
                    shippingMethod: 'Free Shipping'
                },
                paymentMethod: 'Clover',
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: total,
            };

            const { data: createdOrder } = await api.post('/orders', orderData);

            await api.post('/orders/clover/pay', {
                amount: total,
                orderId: createdOrder._id,
                source: result.token
            });

            router.push('/');

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Clover payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT : Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Shipping */}
                        {step === 1 && (
                            <form onSubmit={submitShippingHandler} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 block mb-2">Street Address</label>
                                        <input 
                                            type="text" 
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)} 
                                            required 
                                            placeholder="123 Main St" 
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">City</label>
                                            <input 
                                                type="text" 
                                                value={city} 
                                                onChange={(e) => setCity(e.target.value)} 
                                                required 
                                                placeholder="New York" 
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">State/Province</label>
                                            <input 
                                                type="text" 
                                                value={province} 
                                                onChange={(e) => setProvince(e.target.value)} 
                                                required 
                                                placeholder="NY" 
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Postal Code</label>
                                            <input 
                                                type="text" 
                                                value={postalCode} 
                                                onChange={(e) => setPostalCode(e.target.value)} 
                                                required 
                                                placeholder="10001" 
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Country</label>
                                            <select 
                                                value={country} 
                                                onChange={(e) => setCountry(e.target.value)} 
                                                required 
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                            >
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Phone Number</label>
                                            <input 
                                                type="text" 
                                                value={phone} 
                                                onChange={(e) => setPhone(e.target.value)} 
                                                required 
                                                placeholder="+1 (555) 000-0000" 
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-[#2364EB] text-white py-3 rounded-lg font-semibold hover:bg-[#1a4fb8] transition-colors flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                                    <button 
                                        onClick={() => setStep(1)} 
                                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Edit Shipping
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 block mb-2">Card Number</label>
                                        <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#2364EB]/20 focus-within:border-[#2364EB] transition-all">
                                            <div id="card-number" className="w-full h-[22px]"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Expiry</label>
                                            <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#2364EB]/20 focus-within:border-[#2364EB] transition-all">
                                                <div id="card-date" className="w-full h-[22px]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">CVV</label>
                                            <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#2364EB]/20 focus-within:border-[#2364EB] transition-all">
                                                <div id="card-cvv" className="w-full h-[22px]"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Zip Code</label>
                                            <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-[#2364EB]/20 focus-within:border-[#2364EB] transition-all">
                                                <div id="card-postal-code" className="w-full h-[22px]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="terms" 
                                            checked={agreeToTerms} 
                                            onChange={(e) => setAgreeToTerms(e.target.checked)} 
                                            className="w-5 h-5 mt-0.5 accent-[#2364EB] cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-[#2364EB]" 
                                        />
                                        <label htmlFor="terms" className="text-sm leading-relaxed text-gray-700">
                                            By placing your order, you confirm that you have read and agree to our <a href="/terms-and-conditions/" target="_blank" className="text-[#2364EB] hover:text-[#1a4fb8] underline font-semibold">Terms & Conditions</a> and understand how your personal information is collected and used as described in our <a href="/privacy-policy/" target="_blank" className="text-[#2364EB] hover:text-[#1a4fb8] underline font-semibold">Privacy Policy</a>.
                                        </label>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            onClick={initPayment} 
                                            disabled={loading || !agreeToTerms} 
                                            className="w-full bg-[#2364EB] text-white py-3 rounded-lg font-semibold hover:bg-[#1a4fb8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 size={20} className="animate-spin" /> : <><ShieldCheck size={20} /> Pay ${total.toFixed(2)}</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT : Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                            {/* Cart Items in Summary */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="flex gap-3">
                                        <div className="w-16 h-16 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                                            <ProductImage
                                                src={item.image ? (item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${item.image}`) : '/assets/printer.png'}
                                                alt={item.title || 'Product image'}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</p>
                                                <p className="text-xs text-gray-600 mt-1">Qty: {item.qty}</p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-emerald-600">Free</span>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-[#2364EB]">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
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
        </div>
    );
};

export default Checkout;
