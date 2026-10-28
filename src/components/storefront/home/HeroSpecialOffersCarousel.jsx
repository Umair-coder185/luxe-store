"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const priceFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export default function HeroSpecialOffersCarousel({ offers = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = offers.length;

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [slideCount, isPaused, nextSlide]);

  if (!offers || offers.length === 0) {
    return (
      <section className="relative h-[75vh] flex items-center justify-center bg-white border-b border-neutral-200 overflow-hidden">
        <div className="text-center space-y-4 z-10 px-4 relative">
          <h1 className="text-7xl md:text-9xl font-logo tracking-wide text-[#b38b36]">
            Luxe Edit
          </h1>
          <p className="text-lg md:text-xl font-light text-neutral-600 max-w-lg mx-auto">
            Discover the new season collection. Refined, effortless, and premium.
          </p>
          <div className="pt-6">
            <Link
              href="/products"
              className="inline-block px-10 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200 text-sm font-medium tracking-wide shadow-lg"
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeOffer = offers[currentIndex] || offers[0];
  const hasPromo = activeOffer.pricing?.hasPromotion;
  const currentPrice = hasPromo
    ? activeOffer.pricing.effectivePrice
    : activeOffer.price;
  const originalPrice = hasPromo
    ? activeOffer.pricing.basePrice
    : activeOffer.compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;
  const promoName =
    activeOffer.pricing?.promotion?.name ||
    (hasDiscount ? `Special Offer • Save ${discountPercent}%` : "Featured Privilege Offer");

  return (
    <section
      className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-white via-[#fcfbf9] to-[#f5f0e6] text-neutral-900 border-b border-neutral-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Warm Gold Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

      {/* Highlighted Side Floating Prev/Next Buttons (Desktop) */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden xl:flex fixed-none absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-neutral-900 text-white border-2 border-[#d4af37] shadow-xl items-center justify-center hover:bg-[#b38b36] hover:border-neutral-900 hover:scale-110 transition-all duration-200 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden xl:flex fixed-none absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-neutral-900 text-white border-2 border-[#d4af37] shadow-xl items-center justify-center hover:bg-[#b38b36] hover:border-neutral-900 hover:scale-110 transition-all duration-200 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Main Carousel Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Offer Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#b38b36]/40 bg-[#b38b36]/10">
              <span className="w-2 h-2 rounded-full bg-[#b38b36] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#8c6920]">
                {promoName}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-xs tracking-[0.28em] uppercase text-neutral-500">
                {activeOffer.brand?.name && (
                  <span className="text-[#9a7422] font-bold">
                    {activeOffer.brand.name}
                  </span>
                )}
                {activeOffer.brand?.name && activeOffer.category?.name && (
                  <span className="text-neutral-300">•</span>
                )}
                {activeOffer.category?.name && (
                  <span className="font-medium text-neutral-600">
                    {activeOffer.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-neutral-950 leading-[1.12]">
                {activeOffer.name}
              </h1>
            </div>

            {activeOffer.shortDescription && (
              <p className="text-sm sm:text-base text-neutral-600 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed line-clamp-2">
                {activeOffer.shortDescription}
              </p>
            )}

            {/* Luxury Price Presentation */}
            <div className="pt-2 flex flex-wrap items-baseline justify-center lg:justify-start gap-4">
              <span className="text-3xl sm:text-4xl font-serif font-semibold text-neutral-950">
                {priceFormatter.format(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base sm:text-lg text-neutral-400 line-through">
                    {priceFormatter.format(originalPrice)}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-red-600 text-white rounded-sm shadow-sm">
                    -{discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={`/products/${activeOffer.slug}`}
                className="px-9 py-4 bg-neutral-950 text-white font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase hover:bg-[#b38b36] transition-colors shadow-lg"
              >
                Shop This Offer
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase"
              >
                Explore All
              </Link>
            </div>
          </div>

          {/* Right Column: Crisp White Luxury Product Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <Link
              href={`/products/${activeOffer.slug}`}
              className="group relative w-full max-w-md aspect-[4/5] rounded-2xl border-2 border-[#d4af37]/40 bg-white p-6 flex items-center justify-center overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]"
            >
              {/* Inner Gold Frame */}
              <div className="absolute inset-3 border border-[#d4af37]/25 rounded-xl pointer-events-none group-hover:border-[#b38b36] transition-colors duration-500" />

              {activeOffer.image?.url ? (
                <Image
                  key={activeOffer.id}
                  src={activeOffer.image.url}
                  alt={activeOffer.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="text-neutral-400 text-sm tracking-widest uppercase">
                  LUXE Exclusive
                </div>
              )}

              {/* Top Badge */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <span className="px-3 py-1 bg-neutral-950 text-[#f3dc99] text-[10px] font-semibold tracking-[0.22em] uppercase shadow-sm">
                  Spotlight Offer
                </span>
                {hasDiscount && (
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-wider shadow-sm">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Bottom Caption inside Frame */}
              <div className="absolute bottom-5 left-6 right-6 px-4 py-2.5 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-lg flex items-center justify-between text-xs tracking-widest uppercase text-neutral-900 shadow-sm">
                <span className="font-semibold truncate pr-4">
                  {activeOffer.brand?.name || "LUXE Maison"}
                </span>
                <span className="text-[#9a7422] font-bold group-hover:translate-x-1 transition-transform shrink-0">
                  View Item &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Highlighted Carousel Navigation Bar */}
        {slideCount > 1 && (
          <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
            {/* Slide Counter & Highlighted Dots */}
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-md bg-neutral-900 text-[#f3dc99] text-xs font-mono font-bold tracking-widest">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(slideCount).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2.5">
                {offers.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${item.name}`}
                    className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? "w-12 bg-[#b38b36] shadow-md ring-2 ring-[#b38b36]/30"
                        : "w-3 bg-neutral-300 hover:bg-neutral-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Highlighted Prev / Next Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous offer"
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white border-2 border-[#d4af37] font-semibold text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-[#b38b36] hover:border-neutral-900 shadow-md transition-all cursor-pointer"
              >
                <span>&larr;</span>
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next offer"
                className="px-5 py-2.5 rounded-full bg-[#b38b36] text-white border-2 border-neutral-900 font-semibold text-xs tracking-widest uppercase flex items-center gap-2 hover:bg-neutral-900 hover:border-[#d4af37] shadow-md transition-all cursor-pointer"
              >
                <span>Next</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
