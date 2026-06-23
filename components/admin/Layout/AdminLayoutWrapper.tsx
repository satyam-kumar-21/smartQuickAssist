'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, logout } from '@/store/actions/userActions';
import AdminSidebar from './AdminSidebar';
import {
    Bell, User, LogOut, Settings, Menu, X, Clock, Lock, Save, Shield
} from 'lucide-react';

interface AdminLayoutWrapperProps {
    children: React.ReactNode;
}

const AdminLayoutWrapper: React.FC<AdminLayoutWrapperProps> = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const userLogin = useSelector((state: any) => state.userLogin || {});
    const { userInfo } = userLogin;

    // Auth Check
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            router.push('/admin/login/');
        }
    }, [userInfo, router]);

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileMode, setProfileMode] = useState<'details' | 'edit' | 'password'>('details');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const userUpdateProfile = useSelector((state: any) => state.userUpdateProfile || {});
    const { success: updateSuccess, loading: updateLoading } = userUpdateProfile;

    useEffect(() => {
        if (userInfo) {
            setFirstName(userInfo.firstName || userInfo.name?.split(' ')[0] || '');
            setLastName(userInfo.lastName || userInfo.name?.split(' ').slice(1).join(' ') || '');
            setEmail(userInfo.email || '');
        }
    }, [userInfo]);

    useEffect(() => {
        if (updateSuccess) {
            setProfileMode('details');
            setMessage(null);
            setPassword('');
            setConfirmPassword('');
        }
    }, [updateSuccess]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (profileMode === 'password') {
            if (password !== confirmPassword) { setMessage('Passwords do not match'); return; }
            dispatch(updateUserProfile({ id: userInfo._id, password }) as any);
        } else {
            dispatch(updateUserProfile({ id: userInfo._id, firstName, lastName, email }) as any);
        }
    };

    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const { data: chats } = await api.get(`/chats`);
            const unreadChats = chats.filter((c: any) => c.unreadCount > 0);
            const { data: ordersData } = await api.get(`/orders?limit=10&page=1`);
            const recentOrders = ordersData.orders || [];
            const newOrders = recentOrders.filter((o: any) => o.status === 'Processing' || o.status === 'Pending');
            const chatNotifs = unreadChats.map((c: any) => ({
                id: `chat-${c._id}`, type: 'chat',
                message: `New message from ${c.user?.name || 'User'}`,
                dateObject: new Date(c.updatedAt), path: '/admin/chat/', read: false
            }));
            const orderNotifs = newOrders.map((o: any) => ({
                id: `order-${o._id}`, type: 'order',
                message: `New Order #${o._id.substring(0, 6)}...`,
                dateObject: new Date(o.createdAt), path: '/admin/orders/', read: false
            }));
            setNotifications([...chatNotifs, ...orderNotifs].sort((a, b) => b.dateObject - a.dateObject));
        } catch { /* silent */ }
    };

    useEffect(() => {
        if (userInfo?.isAdmin) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [userInfo]);

    const handleLogout = () => {
        dispatch(logout() as any);
        router.push('/admin/login');
    };

    if (!userInfo || !userInfo.isAdmin) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 relative">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            <Clock size={14} />
                            <span className="text-xs font-semibold font-mono">
                                {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <p className="text-center text-slate-400 text-sm py-6">No new notifications</p>
                                        ) : notifications.map(notif => (
                                            <div key={notif.id} onClick={() => { router.push(notif.path); setIsNotifOpen(false); }}
                                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 flex gap-3 bg-blue-50/30">
                                                <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-blue-500" />
                                                <p className="text-sm text-slate-700">{notif.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                                    {userInfo.firstName?.charAt(0) || userInfo.name?.charAt(0)}
                                </div>
                                <span className="hidden sm:block text-xs font-bold text-slate-700">{userInfo.firstName || userInfo.name}</span>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 text-center">
                                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 uppercase">
                                            {userInfo.firstName?.charAt(0) || userInfo.name?.charAt(0)}
                                        </div>
                                        <h4 className="font-bold text-slate-900 truncate">{userInfo.name}</h4>
                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Administrator</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button onClick={() => { setIsProfileOpen(false); setIsProfileModalOpen(true); setProfileMode('details'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                                            <User size={16} /> Manage Profile
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </main>
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden m-4">
                        <div className="bg-slate-900 px-6 py-8 text-white relative">
                            <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white/20 uppercase">
                                    {userInfo.firstName?.charAt(0) || userInfo.name?.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                                <p className="text-slate-400 text-sm mt-1">{userInfo.email}</p>
                                <span className="mt-4 px-4 py-1.5 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-widest">
                                    Super Administrator
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            {message && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{message}</div>}
                            {profileMode === 'details' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => setProfileMode('edit')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                                            <Settings size={18} /> Manage Profile
                                        </button>
                                        <button onClick={() => setProfileMode('password')} className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                                            <Lock size={18} /> Change Password
                                        </button>
                                        <button onClick={() => setIsProfileModalOpen(false)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">Close</button>
                                    </div>
                                </div>
                            )}
                            {profileMode === 'edit' && (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">First Name</label>
                                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700" required /></div>
                                        <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Last Name</label>
                                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700" required /></div>
                                    </div>
                                    <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-slate-700" required /></div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setProfileMode('details')} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
                                        <button type="submit" disabled={updateLoading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                                            {updateLoading ? 'Updating...' : <><Save size={18} /> Update</>}
                                        </button>
                                    </div>
                                </form>
                            )}
                            {profileMode === 'password' && (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">New Password</label>
                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700" placeholder="••••••••" required /></div>
                                    <div><label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Confirm Password</label>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700" placeholder="••••••••" required /></div>
                                    <div className="flex gap-3 pt-4">
                                        <button type="button" onClick={() => setProfileMode('details')} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold">Cancel</button>
                                        <button type="submit" disabled={updateLoading} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            {updateLoading ? 'Updating...' : <><Lock size={18} /> Update Password</>}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayoutWrapper;
