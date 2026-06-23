import React from "react";

function ShippingPolicy() {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shipping Policy
          </h1>

          <div className="text-gray-600 mb-10 space-y-1">
            <p>
              <strong>Effective Date:</strong> May 23, 2026
            </p>
            <p>
              <strong>Last Updated:</strong> May 23, 2026
            </p>
          </div>

          <div className="space-y-10 text-gray-700 text-[15px] md:text-base leading-8">
            <div>
              <p>
                Smart Quick Assist is committed to providing reliable and timely
                delivery for all orders. This Shipping Policy explains how
                orders are processed, shipped, and delivered across the United
                States and Canada.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Shipping Locations
              </h2>

              <p>We currently ship to:</p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>United States</li>
                <li>Canada</li>
              </ul>

              <p className="mt-4">
                At this time, we do not offer international shipping outside
                these regions.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Free Shipping
              </h2>

              <p>
                We offer free standard shipping on all eligible orders across
                the United States and Canada.
              </p>

              <p className="mt-4">
                No hidden shipping charges are added during checkout unless
                otherwise stated.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Order Processing
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Orders are typically processed within 1–3 business days after
                  payment confirmation.
                </li>
                <li>
                  Orders are not processed on weekends or public holidays.
                </li>
                <li>
                  Processing times may vary during peak periods or due to
                  product availability.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Delivery Time
              </h2>

              <p>Estimated delivery timelines generally range between:</p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>3–7 business days after shipment.</li>
              </ul>

              <p className="mt-4">
                Delivery times may vary depending on:
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Shipping destination.</li>
                <li>Carrier operations.</li>
                <li>Weather conditions or unforeseen delays.</li>
              </ul>

              <p className="mt-4">
                Delivery estimates are not guaranteed.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Order Tracking
              </h2>

              <p>
                Once your order has been shipped, tracking information will be
                sent via email so you can monitor delivery progress.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Shipping Partners
              </h2>

              <p>
                We work with reliable shipping carriers and logistics providers
                to ensure secure and timely delivery of orders.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Delays & Exceptions
              </h2>

              <p>Shipping delays may occur due to:</p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Weather conditions.</li>
                <li>Carrier service interruptions.</li>
                <li>Incorrect shipping details.</li>
                <li>High seasonal demand.</li>
              </ul>

              <p className="mt-4">
                Smart Quick Assist is not responsible for delays caused by
                third-party carriers or circumstances beyond our control.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Incorrect Shipping Information
              </h2>

              <p>
                Customers are responsible for providing accurate billing and
                shipping details during checkout.
              </p>

              <p className="mt-4">
                If incorrect or incomplete information is provided:
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Delivery delays may occur.</li>
                <li>
                  Additional shipping charges may apply for reshipment.
                </li>
              </ul>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Damaged or Lost Shipments
              </h2>

              <p>
                If your order arrives damaged or appears lost during transit,
                please contact us promptly at:
              </p>

              <p className="mt-4 font-semibold">
                📧 support@smartquickassist.com
              </p>

              <p className="mt-4">
                We will review the issue and assist with the next steps in
                accordance with our policies.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Independent Retailer Notice
              </h2>

              <p>
                Smart Quick Assist operates as an independent retailer and is
                not affiliated with or authorized by any printer manufacturer
                unless explicitly stated.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Policy
              </h2>

              <p>
                We may update this Shipping Policy from time to time. Updated
                versions will be posted on this page with a revised effective
                date.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Information
              </h2>

              <p className="mb-5">
                If you have questions regarding shipping or delivery, please
                contact us:
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="font-semibold text-lg mb-2">
                  Smart Quick Assist
                </p>

                <p>440 Davis Court, Apt 1516</p>
                <p>San Francisco, CA 94111, United States</p>

                <p className="mt-4">
                  📧 <strong>Email:</strong> support@smartquickassist.com
                </p>

                <p className="mt-2">
                  🌐 <strong>Website:</strong> www.smartquickassist.com
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ShippingPolicy;