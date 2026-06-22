import React from 'react';

function ContactHero() {
  return (
    <div 
      className="relative w-full h-[50vh] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-between text-white p-6 md:px-12"
      style={{ 
        backgroundImage: `linear-gradient(rgba(15, 32, 39, 0.7), rgba(44, 62, 80, 0.7)), url('./about-banner-fixed.png')` 
      }}
    >
      {/* Navbar / Header Overlay */}
      <header className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-2xl">📱</div>
          <span className="font-semibold tracking-wide text-lg">Smart Quick Assist</span>
        </div>

        {/* Navigation Links & Cart */}
        <nav className="flex items-center gap-6 text-sm font-medium tracking-wide uppercase">
          <a href="#home" className="hover:text-gray-300 transition-colors">Home</a>
          <a href="#about" className="hover:text-gray-300 transition-colors">About Us</a>
          <a href="#store" className="hover:text-gray-300 transition-colors">Store</a>
          <a href="#faqs" className="hover:text-gray-300 transition-colors">FAQ's</a>
          <a href="#contact" className="border-b-2 border-white pb-1">Contact Us</a>
          
          {/* Cart & User Profile Section */}
          <div className="flex items-center gap-4 ml-2 normal-case border-l border-white/30 pl-6">
            <span className="font-semibold">$0.00</span>
            <div className="relative cursor-pointer">
              <span className="text-xl">🛍️</span>
              <span className="absolute -top-2 -right-2 bg-white text-gray-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-xl cursor-pointer hover:text-gray-300 transition-colors">👤</span>
          </div>
        </nav>
      </header>

      {/* Hero Central Title */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md">
          Contact Us
        </h1>
      </div>

      {/* Empty bottom spacer to keep title perfectly centered vertically */}
      <div className="hidden md:block h-6"></div>
    </div>
  );
}

export default ContactHero;