'use client';

import React, { useState } from "react";
import { ShoppingCart, User, X, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/actions/userActions";
import AuthDrawer from "./AuthDrawer";

const Header = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const userLogin = useSelector((state: any) => state.userLogin || {});
  const { userInfo } = userLogin;
  const cart = useSelector((state: any) => state.cart || {});
  const { cartItems = [] } = cart;

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const logoutHandler = () => {
    dispatch(logout() as any);
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const navItem =
    "relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:bg-black after:w-0 after:transition-all after:duration-300 uppercase tracking-wider";

  const getLinkClass = (href: string) => {
    // Check both href and href without trailing slash
    const isActive = pathname === href || pathname === href.replace(/\/$/, '');
    return `${navItem} ${isActive ? "text-white after:w-full" : "hover:text-white/80"}`;
  };

  return (
    <>
      <header className="w-full bg-[#111111]/40 backdrop-blur-sm absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">

          {/* LOGO */}
          <Link href="/" aria-label="Go to homepage" className="flex items-center gap-2">
            <img src="/logo-bgremove-224.png" alt="Smart Quick Assist Logo" width="224" height="54" className="block w-32 h-auto object-contain" style={{ contentVisibility: 'auto' }} />

          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-6 lg:gap-10 text-white font-medium text-[14px]">
            <Link href="/" className={getLinkClass("/")}>Home</Link>
            <Link href="/about/" className={getLinkClass("/about/")}>About Us</Link>
            <Link href="/shop/" className={getLinkClass("/shop/")}>Store</Link>
            <Link href="/faq/" className={getLinkClass("/faq/")}>FAQ's</Link>
            <Link href="/contact-us/" className={getLinkClass("/contact-us/")}>Contact Us</Link>
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4 md:gap-6">

            {hasMounted && (userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-[#2364EB] flex items-center justify-center font-bold text-sm uppercase">
                    {userInfo.firstName?.charAt(0) || userInfo.name?.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">{userInfo.firstName || userInfo.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{userInfo.email}</p>
                    </div>
                    {userInfo.isAdmin ? (
                      <Link
                        href="/admin/dashboard/"
                        className="block px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/profile/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button aria-label="Login or register" className="bg-transparent border-none p-0 cursor-pointer" onClick={() => setAuthOpen(true)}>
                <User size={22} className="text-white" />
              </button>
            ))}

            <div className="relative cursor-pointer flex items-center gap-2">
              <span className="hidden sm:block text-white font-medium">
                {hasMounted
                  ? `$${cartItems
                    .reduce(
                      (acc: number, item: any) => acc + item.price * item.qty,
                      0
                    )
                    .toFixed(2)}`
                  : "$0.00"}
              </span>

              <Link href="/cart/" aria-label="Shopping cart">
                <ShoppingCart size={22} className="text-white" />
              </Link>

              {hasMounted && cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-green-500 text-white px-1.5 rounded-full font-bold">
                  {cartItems.reduce(
                    (acc: number, item: any) => acc + item.qty,
                    0
                  )}
                </span>
              )}
            </div>

            {/* MOBILE MENU ICON */}
            <button
              aria-label="Open menu"
              className="md:hidden cursor-pointer bg-transparent border-none p-0 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="bg-white w-3/4 max-w-xs h-full p-6 relative flex flex-col">
            <button
              aria-label="Close menu"
              className="absolute top-4 right-4 cursor-pointer text-gray-500 bg-transparent border-none p-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col gap-4 mt-8 flex-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-500">Home</Link>
              <Link href="/about/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-500">About Us</Link>
              <Link href="/shop/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-500">Store</Link>
              <Link href="/faq/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-500">FAQ's</Link>
              <Link href="/contact-us/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-500">Contact Us</Link>
            </nav>

            {/* Mobile Profile Section */}
            {hasMounted && (userInfo ? (
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                    {userInfo.firstName?.charAt(0) || userInfo.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{userInfo.firstName || userInfo.name}</p>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {userInfo.isAdmin ? (
                    <Link
                      href="/admin/dashboard/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-3 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50 rounded transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/profile/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logoutHandler();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors text-left font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-auto pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
                >
                  Login / Register
                </button>
              </div>
            ))}
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        </div>
      )}

      {/* AUTH DRAWER */}
      <AuthDrawer isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Header;
