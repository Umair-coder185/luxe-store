"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function ProductFilters({ categories, brands, currentParams, hideCategory = false, hideBrand = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const [priceMin, setPriceMin] = useState(currentParams.minPrice || "");
  const [priceMax, setPriceMax] = useState(currentParams.maxPrice || "");

  const applyPrice = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (priceMin) params.set("minPrice", priceMin);
    else params.delete("minPrice");
    if (priceMax) params.set("maxPrice", priceMax);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      {!hideCategory && categories && categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-900 tracking-wide uppercase mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map(cat => {
              const isActive = currentParams.category === cat.slug;
              return (
                <div key={cat.id} className="flex items-center">
                  <button 
                    onClick={() => updateFilter("category", isActive ? null : cat.slug)}
                    className={`text-sm ${isActive ? "text-neutral-900 font-medium" : "text-neutral-500 hover:text-neutral-900"}`}
                  >
                    {cat.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      {!hideBrand && brands && brands.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-900 tracking-wide uppercase mb-4">Brands</h3>
          <div className="space-y-3">
            {brands.map(brand => {
              const isActive = currentParams.brand === brand.slug;
              return (
                <div key={brand.id} className="flex items-center">
                  <button 
                    onClick={() => updateFilter("brand", isActive ? null : brand.slug)}
                    className={`text-sm ${isActive ? "text-neutral-900 font-medium" : "text-neutral-500 hover:text-neutral-900"}`}
                  >
                    {brand.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 tracking-wide uppercase mb-4">Price</h3>
        <form onSubmit={applyPrice} className="flex items-center space-x-2">
          <input 
            type="number" 
            min="0"
            placeholder="Min" 
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full text-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900 bg-transparent"
          />
          <span className="text-neutral-400">-</span>
          <input 
            type="number" 
            min="0"
            placeholder="Max" 
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full text-sm border border-neutral-300 px-3 py-2 focus:outline-none focus:border-neutral-900 bg-transparent"
          />
          <button type="submit" className="bg-neutral-900 text-white px-3 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors">
            Go
          </button>
        </form>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 tracking-wide uppercase mb-4">Availability</h3>
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="in-stock"
            checked={currentParams.availability === "in-stock"}
            onChange={(e) => updateFilter("availability", e.target.checked ? "in-stock" : null)}
            className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <label htmlFor="in-stock" className="text-sm text-neutral-600 cursor-pointer">In Stock</label>
        </div>
      </div>
    </div>
  );
}
