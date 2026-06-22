import React from "react";
import { MapPin, Mail, Globe } from "lucide-react";

function FAQContact() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Business Information
          </h2>

          <div className="space-y-8 text-gray-800">
            {/* Business Name & Address */}
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Smart Quick Assist
              </h3>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-red-500 mt-1 flex-shrink-0"
                />

                <div className="space-y-1">
                  <p className="text-lg leading-7">
                    440 Davis Court, Apt 1516
                  </p>
                  <p className="text-lg leading-7">
                    San Francisco, CA 94111, United States
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-blue-600" />
              <a
                href="mailto:support@smartquickassist.com"
                className="text-lg hover:text-blue-600 transition-colors"
              >
                support@smartquickassist.com
              </a>
            </div>

            {/* Website */}
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue-600" />
              <a
                href="https://www.smartquickassist.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-blue-600 transition-colors"
              >
                www.smartquickassist.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQContact;