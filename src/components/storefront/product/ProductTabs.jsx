"use client";

import { useState } from "react";
import ProductDescriptionRenderer from "./ProductDescriptionRenderer";

export default function ProductTabs({ description, attributes, variants }) {
  const [activeTab, setActiveTab] = useState("description");

  const hasAttributes = attributes && Object.keys(attributes).length > 0;
  const hasVariants = variants && variants.length > 0;

  // Extract unique sizes and colors if variants exist
  const sizes = hasVariants
    ? Array.from(new Set(variants.map((v) => v.size).filter(Boolean)))
    : [];
  const colors = hasVariants
    ? Array.from(new Set(variants.map((v) => v.color).filter(Boolean)))
    : [];

  const tabs = [
    { id: "description", label: "Description" },
    { id: "additional_info", label: "Additional Information" },
    { id: "delivery", label: "Delivery & Returns" },
    { id: "reviews", label: "Reviews (0)" },
  ];

  return (
    <div className="mt-16 md:mt-24 pt-10 border-t border-neutral-200" id="product-tabs">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-200 overflow-x-auto hide-scrollbar gap-8 md:gap-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm md:text-base tracking-wide font-medium transition-colors relative shrink-0 ${
              activeTab === tab.id
                ? "text-neutral-900 border-b-2 border-neutral-900 font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="py-8 md:py-12">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="animate-fadeIn">
            {description ? (
              <ProductDescriptionRenderer content={description} />
            ) : (
              <p className="text-neutral-500 text-sm italic">No description provided for this product.</p>
            )}
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === "additional_info" && (
          <div className="max-w-3xl animate-fadeIn">
            <dl className="divide-y divide-neutral-100 border-t border-b border-neutral-100 text-sm">
              {sizes.length > 0 && (
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-medium text-neutral-900">Available Sizes / Models</dt>
                  <dd className="sm:col-span-2 text-neutral-600">{sizes.join(", ")}</dd>
                </div>
              )}

              {colors.length > 0 && (
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-medium text-neutral-900">Available Colors</dt>
                  <dd className="sm:col-span-2 text-neutral-600">{colors.join(", ")}</dd>
                </div>
              )}

              {hasAttributes &&
                Object.entries(attributes).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1">
                      <dt className="font-medium text-neutral-900 capitalize">{key}</dt>
                      <dd className="sm:col-span-2 text-neutral-600">{value}</dd>
                    </div>
                  );
                })}

              {!hasAttributes && sizes.length === 0 && colors.length === 0 && (
                <p className="py-4 text-neutral-500 italic text-sm">No additional specifications available.</p>
              )}
            </dl>
          </div>
        )}

        {/* Delivery & Returns Tab */}
        {activeTab === "delivery" && (
          <div className="max-w-3xl space-y-8 animate-fadeIn text-sm text-neutral-600 leading-relaxed">
            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-2">1. Order Processing & Dispatch</h4>
              <p>
                All orders are carefully inspected, hand-packed in protective luxury packaging, and dispatched within 1–3 business days.
                A dispatch confirmation with your private tracking code is issued the moment your parcel leaves our fulfillment center.
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-2">2. Express Worldwide Delivery</h4>
              <p className="mb-3">
                We partner with dedicated courier networks (EMS / DHL Express) to provide end-to-end tracked transit directly to your door:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="font-medium text-neutral-900">Domestic & Regional</span>
                  <span>1 – 3 business days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="font-medium text-neutral-900">United Kingdom & Europe</span>
                  <span>2 – 5 business days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="font-medium text-neutral-900">United States & Canada</span>
                  <span>3 – 7 business days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200/60">
                  <span className="font-medium text-neutral-900">Middle East & Rest of World</span>
                  <span>4 – 8 business days</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-neutral-900 mb-2">3. 14-Day Returns & Exchanges</h4>
              <p>
                If your item doesn&apos;t meet your expectations or doesn&apos;t fit your handbag as desired, we offer a 14-day hassle-free return and exchange policy from the date of delivery.
              </p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="max-w-3xl animate-fadeIn text-sm">
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100 text-center space-y-2">
              <div className="flex justify-center gap-1 text-neutral-300 text-lg">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="font-medium text-neutral-800">There are no customer reviews yet.</p>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Only verified patrons who have purchased this luxury product are invited to submit authenticated reviews.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
