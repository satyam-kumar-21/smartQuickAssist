import React from "react";

function WhatWeOffer() {
  return (
    <section className="bg-[#cfc9c9] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            {/* Blue Line */}
            <div className="w-20 h-1 bg-blue-600 rounded-full mb-8"></div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              What We Offer
            </h2>

            <div className="space-y-8 text-gray-700 leading-9 text-[17px]">
              <p>
                We provide a focused range of printing solutions designed to
                support different printing requirements.
              </p>

              <p>
                <span className="font-semibold text-gray-900">
                  Home Printers:
                </span>{" "}
                Compact and easy-to-use printers for documents, schoolwork, and
                everyday personal printing.
              </p>

              <p>
                <span className="font-semibold text-gray-900">
                  Office Printers:
                </span>{" "}
                Reliable printers built for productivity, business workflows,
                and regular office use.
              </p>

              <p>
                <span className="font-semibold text-gray-900">
                  Inkjet Printers:
                </span>{" "}
                High-quality color printing solutions ideal for photos,
                graphics, and detailed prints.
              </p>

              <p>
                <span className="font-semibold text-gray-900">
                  Laser Printers:
                </span>{" "}
                Fast and efficient printers designed for professional documents
                and high-volume printing tasks.
              </p>

              <p>
                <span className="font-semibold text-gray-900">
                  Ink & Toner:
                </span>{" "}
                Reliable replacement ink and toner supplies designed for
                consistent print quality and long-term performance.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/what-we-offer.webp"
                alt="What We Offer"
                className="w-full h-[350px] md:h-[500px] lg:h-[650px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;