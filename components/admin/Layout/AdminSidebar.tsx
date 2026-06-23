'use client';

import React from 'react';
import {
    LayoutDashboard, Package, Layers, ShoppingBag, Users,
    MessageSquare, BarChart3, Settings, LogOut, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/actions/userActions';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        dispatch(logout() as any);
        router.push('/admin/login/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard/', icon: <LayoutDashboard size={20} /> },
        { name: 'Categories', path: '/admin/categories/', icon: <Layers size={20} /> },
        { name: 'Products', path: '/admin/products/', icon: <Package size={20} /> },
        { name: 'Customers', path: '/admin/customers/', icon: <Users size={20} /> },
        { name: 'Orders', path: '/admin/orders/', icon: <ShoppingBag size={20} /> },
        { name: 'Customer Chat', path: '/admin/chat/', icon: <MessageSquare size={20} /> },
        { name: 'Analytics', path: '/admin/analytics/', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/admin/settings/', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100 shrink-0">
                    <div className="flex-1 flex items-center justify-start">
                        <img src="/logo-bgremove.png" alt="Smart Quick Assist" className="h-12 w-auto object-contain max-w-[180px]" />
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || pathname === item.path.replace(/\/$/, '');
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
