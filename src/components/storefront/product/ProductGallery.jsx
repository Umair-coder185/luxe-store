"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, productName }) {
  const safeImages = images && images.length > 0 ? images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Thumbnails (Desktop: Left, Mobile: Bottom) */}
      {safeImages.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 hide-scrollbar w-full md:w-20 lg:w-24 shrink-0">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-[3/4] w-20 md:w-full shrink-0 bg-neutral-50 border-2 transition-colors focus:outline-none focus:border-neutral-900 ${
                selectedIndex === index ? "border-neutral-900" : "border-transparent hover:border-neutral-300"
              }`}
              aria-label={`View image ${index + 1} of ${safeImages.length}`}
              aria-pressed={selectedIndex === index}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 md:order-2 relative aspect-[3/4] w-full bg-neutral-50 overflow-hidden">
        {/* We use priority={true} only for the first selected image on initial load */}
        <Image
          src={safeImages[selectedIndex].url}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          className="object-cover object-center transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
