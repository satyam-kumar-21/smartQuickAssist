'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2, Loader2, Package, Calendar, ChevronRight } from 'lucide-react';
import { getUserDetails, updateUserProfile } from '../../store/actions/userActions';
import { listMyOrders } from '../../store/actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../../store/constants/userConstants';
import HelpSupport from './HelpSupport';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'orders'
    const [showConfirmation, setShowConfirmation] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success, loading: updateLoading } = userUpdateProfile;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    useEffect(() => {
        if (!userInfo) {
            router.push('/');
        } else if (userInfo.isAdmin) {
            router.push('/admin/dashboard/');
        } else {
            if (!user || !user.firstName || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            } else {
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
            }
        }
    }, [dispatch, router, userInfo, user, success]);

    useEffect(() => {
        if (success) {
            setShowConfirmation(true);
            const timer = setTimeout(() => {
                setShowConfirmation(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const submitHandler = (e) => {
        e.preventDefault();
        setMessage(null);
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(updateUserProfile({ id: user._id, firstName, lastName, email, password }));
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'settings'
                                ? 'bg-[#2364EB] text-white'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'orders'
                                ? 'bg-[#2364EB] text-white'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        Order History
                    </button>
                    <button
                        onClick={() => setActiveTab('help')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'help'
                                ? 'bg-[#2364EB] text-white'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        Help & Support
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* User Info Card */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-[#2364EB] rounded-full flex items-center justify-center mb-4 text-white">
                                    <span className="text-2xl font-bold uppercase">{user?.firstName?.charAt(0) || user?.name?.charAt(0)}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span className="flex items-center gap-2"><Package size={16} className="text-[#2364EB]" /> Orders</span>
                                    <span className="font-bold text-gray-900">{orders?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {activeTab === 'settings' ? (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                                <form onSubmit={submitHandler} className="space-y-6">
                                    {message && (
                                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={18} />
                                            {message}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Profile Updated Successfully
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">First Name</label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 block mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 block mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Password</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900 block mb-2">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900 block mb-2">Confirm Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2364EB]/20 focus:border-[#2364EB] outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading || updateLoading}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2364EB] text-white rounded-lg font-semibold hover:bg-[#1a4fb8] transition-all disabled:opacity-50"
                                        >
                                            {updateLoading || loading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : activeTab === 'orders' ? (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
                                {loadingOrders ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-[#2364EB] mb-4" size={40} />
                                        <p className="text-gray-600">Fetching your orders...</p>
                                    </div>
                                ) : errorOrders ? (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                        <AlertCircle size={20} />
                                        {errorOrders}
                                    </div>
                                ) : orders && orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                                            <Package className="text-gray-400" size={32} />
                                        </div>
                                        <h3 className="text-gray-900 font-bold text-lg">No orders found</h3>
                                        <p className="text-gray-600 mb-6">Looks like you haven't placed any orders yet.</p>
                                        <Link
                                            href="/shop/"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2364EB] text-white rounded-lg font-semibold hover:bg-[#1a4fb8] transition-all"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="pb-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                                                    <th className="pb-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                                    <th className="pb-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                                                    <th className="pb-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                                    <th className="pb-4 pt-2 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {orders && orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-white transition-colors">
                                                        <td className="py-4 font-mono text-sm text-gray-700">#{order._id.substring(18)}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                                <Calendar size={14} />
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                                                        <td className="py-4">
                                                            {order.isPaid ? (
                                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Paid</span>
                                                            ) : (
                                                                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">Failed</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <Link
                                                                href={`/order/${order._id}`}
                                                                className="inline-flex items-center gap-1 text-sm font-bold text-[#2364EB] hover:text-[#1a4fb8] transition-colors"
                                                            >
                                                                Details
                                                                <ChevronRight size={16} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'help' ? (
                            <HelpSupport />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
