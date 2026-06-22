"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    category: "General Information",
    questions: [
      {
        question: "What is Smart Quick Assist?",
        answer:
          "Smart Quick Assist is an independent online retailer specializing in printers and printing supplies. We serve customers across the United States and Canada with a focus on reliable products, transparent pricing, and a simple shopping experience.",
      },
      {
        question: "Are you a marketplace or multi-seller platform?",
        answer:
          "No. We operate as a single, independent retailer. All products are sourced through verified distribution channels and managed directly by us.",
      },
      {
        question: "Are you affiliated with printer brands or manufacturers?",
        answer:
          `No. Smart Quick Assist is an independent retailer and is not affiliated with, authorized by, or an official partner of any printer brand or manufacturer unless explicitly stated.

All brand names, logos, and trademarks belong to their respective owners.`,
      },
    ],
  },
  {
    category: "Orders & Payments",
    questions: [
      {
        question: "How do I place an order?",
        answer:
          "Browse products, select the item you need, and proceed to checkout. The process is secure and straightforward.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept standard online payment methods, including major credit and debit cards. Available options are shown at checkout.",
      },
      {
        question: "Can I cancel or modify my order?",
        answer:
          "If your order has not yet been processed or shipped, you may request changes by contacting our support team as soon as possible.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes. We offer free shipping across the United States and Canada.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times vary by location. Estimated timelines are provided during checkout and via order tracking.",
      },
      {
        question: "Will I receive tracking information?",
        answer:
          "Yes. Once your order is shipped, you will receive tracking details so you can monitor its progress.",
      },
    ],
  },

  {
    category: "Products & Availability",
    questions: [
      {
        question: "What products do you offer?",
        answer:
          `
We offer:

Home Printers
Office Printers
Inkjet Printers
Laser Printers
Ink & Toner Supplies`,
      },
      {
        question: "Are your products genuine?",
        answer:
          "Yes. All products are sourced through verified and trusted distribution channels.",
      },
      {
        question: "Do printers include ink or toner?",
        answer:
          "Most printers include starter cartridges. Please check the product description for exact details.",
      },

      {
        question: "Do you sell replacement ink and toner?",
        answer:
          "Yes. We offer compatible ink and toner supplies for ongoing use.",
      },
    ],
  },



  {
    category: "Support & Assistance (Important)",
    questions: [
      {
        question: "Do you provide product support?",
        answer:
          `Yes. We provide general support and guidance to help our customers with:

Printer setup
Troubleshooting
Driver installation and updates
Offline and connectivity issues`,
      },
      {
        question: "Is your support an official manufacturer service?",
        answer:
          "No. Our support is independent guidance only and is not affiliated with or a substitute for manufacturer support services.",
      },
      {
        question: "Where can I find official manufacturer support?",
        answer:
          "For product-specific issues, warranty claims, or advanced technical assistance, we recommend visiting the official website of the printer brand or contacting the manufacturer directly.",
      },

      {
        question: "Do you sell replacement Does your support affect my product warranty?ink and toner?",
        answer:
          "No. Our guidance is general in nature and does not replace or interfere with manufacturer warranty terms. Warranty-related services are handled directly by the product manufacturer.",
      },
    ],
  },



  {
    category: "Warranty & Returns",
    questions: [
      {
        question: "Do your products come with a warranty?",
        answer:
          "Yes. All products are backed by a manufacturer warranty, as provided by the respective brand.",
      },
      {
        question: "Who handles warranty claims?",
        answer:
          "Warranty claims are handled directly by the manufacturer, not by Smart Quick Assist.",
      },
      {
        question: "What if I receive a damaged or defective product?",
        answer:
          "If your order arrives damaged or defective, please contact us promptly. We will assist you with the next steps in accordance with our policies.",
      },

      {
        question: "Can I return a product?",
        answer:
          "Return eligibility depends on our return policy. Please refer to the Return Policy page or contact support for assistance.",
      },
    ],
  },

];

function FAQContent() {
  const [openIndex, setOpenIndex] = useState("1-0");

  return (
    <section className="bg-[#f5f5f5] pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="max-w-6xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions (FAQs)
          </h2>
        </div>

        <div className="space-y-14">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Category Heading */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
                {section.category}
              </h3>

              <div className="border border-gray-300 bg-white rounded-sm overflow-hidden">
                {section.questions.map((item, questionIndex) => {
                  const id = `${sectionIndex}-${questionIndex}`;
                  const isOpen = openIndex === id;

                  return (
                    <div
                      key={id}
                      className="border-b border-gray-300 last:border-b-0"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? "" : id)}
                        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        {isOpen ? (
                          <Minus
                            size={16}
                            className="text-gray-900 flex-shrink-0"
                          />
                        ) : (
                          <Plus
                            size={16}
                            className="text-gray-900 flex-shrink-0"
                          />
                        )}

                        <span className="text-[15px] md:text-base font-medium text-gray-900">
                          {item.question}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="bg-[#fafafa] border-t border-gray-200 px-4 py-5">
                          <p className="text-[14px] md:text-[15px] leading-7 text-gray-600">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQContent;