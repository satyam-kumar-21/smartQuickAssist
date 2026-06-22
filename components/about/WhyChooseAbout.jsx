import React from "react";
import {
  ClipboardCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Clear Product Information",
    description:
      "Simple and accurate product information to help customers make confident buying decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Product Selection",
    description:
      "Printers and supplies chosen for everyday reliability and performance.",
  },
  {
    icon: ShoppingBag,
    title: "Smooth Shopping Experience",
    description:
      "Simple browsing, secure checkout, and efficient order processing.",
  },
  {
    icon: Truck,
    title: "Fast and Reliable Delivery",
    description:
      "Fast and reliable shipping with secure delivery across the United States and Canada.",
  },
];

function WhyChooseAbout() {
  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Smart Quick Assist
          </h2>

          <h3 className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">
            Simple, Reliable & Customer-Focused
          </h3>

          <p className="mt-5 text-base md:text-lg leading-8 text-gray-600">
            We believe buying a printer should be straightforward and
            stress-free. Every product is selected with a focus on usability,
            efficiency, and dependable performance.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon size={26} className="text-gray-800" />
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xl font-semibold text-gray-900 leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="mt-4 text-[15px] leading-8 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseAbout;