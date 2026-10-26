"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, productName }) {
  const safeImages = images && images.length > 0 ? images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full bg-neutral-100 flex items-center justify-center rounded-xl border border-neutral-200">
        <span className="text-neutral-400 text-sm">No Image Available</span>
      </div>
    );
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-5">
      {/* Thumbnails (Desktop: Vertical Left, Mobile: Horizontal Bottom) */}
      {safeImages.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-20 lg:w-24 shrink-0 max-h-[600px]">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-[3/4] w-18 md:w-full shrink-0 bg-neutral-50 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                selectedIndex === index
                  ? "border-neutral-900 ring-1 ring-neutral-900 shadow-xs"
                  : "border-transparent opacity-75 hover:opacity-100 hover:border-neutral-300"
              }`}
              aria-label={`View image ${index + 1} of ${safeImages.length}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 72px, 96px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Viewport */}
      <div className="order-1 md:order-2 relative aspect-[3/4] w-full bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200/80 group">
        <Image
          src={safeImages[selectedIndex].url}
          alt={`${productName} - View ${selectedIndex + 1}`}
          fill
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 45vw"
          className="object-cover object-center transition-all duration-500 group-hover:scale-[1.02]"
        />

        {/* Counter Badge */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide rounded-full pointer-events-none">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Next / Prev Navigation Buttons (Desktop on Hover) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
