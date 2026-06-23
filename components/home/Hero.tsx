import React from "react";
import Link from "next/link";

function Hero() {
  return (
    <section className="relative flex items-center min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl pt-24 sm:pt-28 lg:pt-32">
          <h1 className="text-white font-bold leading-tight text-4xl sm:text-5xl lg:text-6xl">
            Reliable Printers & <br className="hidden sm:block" />
            Smart Printing Solutions
          </h1>

          <p className="mt-5 text-white/90 text-base sm:text-lg leading-7 max-w-xl">
            Discover dependable printers and printing supplies designed for
            home users, businesses, and modern workspaces. Smart Quick Assist
            makes online printer shopping simple, reliable, and hassle-free.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#2364EB] font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Shop Printers
            </Link>

            <Link
              href="/contact-us"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#2364EB] transition duration-300"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;