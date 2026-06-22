import React from 'react'
import Link from "next/link";

function Hero() {
  return (
    <div className="relative w-full h-screen flex items-center">
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="px-4 sm:px-6 lg:px-8 pt-32">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Reliable Printers & Smart Printing<br />
            Solutions
          </h1>
          <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl">
            Discover dependable printers and printing supplies designed for home users, businesses, and modern workspaces. Smart Quick Assist makes online printer shopping simple, reliable, and hassle-free.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2364EB] font-bold rounded hover:bg-gray-100 transition">
              Shop Printers
            </Link>
            <Link href="/contact-us" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white/10 transition">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero
