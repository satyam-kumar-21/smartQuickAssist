import React from "react";
import Link from "next/link";
import { MapPin, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <>
      {/* Disclaimer Banner */}
      <div className="bg-black py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-white text-sm">
          <strong>Disclaimer:</strong> Smart Quick Assist is an independent retailer and is not affiliated with or authorized by any printer manufacturer unless explicitly stated. All trademarks and brand names belong to their respective owners.
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#2b2a2a] text-white pt-12 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <img
                src="/logo-bgremove-224.png"
                alt="Smart Quick Assist Logo"
                width="224"
                height="54"
                className="block w-36 h-auto mb-4 object-contain"
                loading="lazy"
              />
              <p className="text-gray-300 leading-relaxed mb-4">
                Smart Quick Assist offers reliable printers, wireless printing solutions, and printing supplies for home and office use. We focus on simple shopping, dependable products, free shipping, and helpful customer guidance for users across the United States and Canada.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
                <li><Link href="/about/" className="text-gray-300 hover:text-white transition">About Us</Link></li>
                <li><Link href="/shop/" className="text-gray-300 hover:text-white transition">Store</Link></li>
                <li><Link href="/faq/" className="text-gray-300 hover:text-white transition">FAQ's</Link></li>
                <li><Link href="/blogs/" className="text-gray-300 hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact-us/" className="text-gray-300 hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Important Links</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy-policy/" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions/" className="text-gray-300 hover:text-white transition">Terms and Conditions</Link></li>
                <li><Link href="/refund-return-policy/" className="text-gray-300 hover:text-white transition">Return and Refund Policy</Link></li>
                <li><Link href="/shipping-policy/" className="text-gray-300 hover:text-white transition">Shipping Policy</Link></li>
                <li><Link href="/cookie-policy/" className="text-gray-300 hover:text-white transition">Cookie Policy</Link></li>
                <li><Link href="/disclaimer/" className="text-gray-300 hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Quick Contact */}
            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Quick Contact</h3>
              <div className="space-y-5 text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="mt-1 flex-shrink-0 text-[#2364EB]" />
                  <p>440 Davis Court, Apt 1516, San Francisco, CA 94111</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="flex-shrink-0 text-[#2364EB]" />
                  <a href="mailto:support@smartquickassist.com" className="text-gray-300 hover:text-white transition">support@smartquickassist.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} className="flex-shrink-0 text-[#2364EB]" />
                  <a href="https://www.smartquickassist.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">www.smartquickassist.com</a>
                </div>

                {/* Payment Logos */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <div className="bg-white rounded px-2 py-1">
                    <span className="text-black font-bold text-xs">PayPal</span>
                  </div>
                  <div className="bg-[#003087] rounded px-2 py-1">
                    <span className="text-white font-bold text-xs">VISA</span>
                  </div>
                  <div className="bg-[#EB001B] rounded px-2 py-1">
                    <span className="text-white font-bold text-xs">MC</span>
                  </div>
                  <div className="bg-[#FF6600] rounded px-2 py-1">
                    <span className="text-white font-bold text-xs">DISCOVER</span>
                  </div>
                  <div className="bg-[#006FD6] rounded px-2 py-1">
                    <span className="text-white font-bold text-xs">AMEX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
      <div className="bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white">
            Copyright © 2026 Smart Quick Assist
          </p>
          <p className="text-white">
            Powered by Smart Quick Assist
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
