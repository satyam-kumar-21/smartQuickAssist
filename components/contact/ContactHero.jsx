import React from 'react';

function ContactHero() {
  return (
    <div 
      className="relative w-full h-[50vh] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col justify-center text-white p-6 md:px-12"
      style={{ 
        backgroundImage: `linear-gradient(rgba(15, 32, 39, 0.7), rgba(44, 62, 80, 0.7)), url('/about-banner-fixed.png')` 
      }}
    >
      {/* Hero Central Title */}
      <div className="flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-md text-center">
          Contact Us
        </h1>
      </div>
    </div>
  );
}

export default ContactHero;