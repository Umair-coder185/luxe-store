"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ActiveFilters({ currentParams, categories = [], brands = [], hideCategory = false, hideBrand = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    const keysToClear = ["minPrice", "maxPrice", "availability"];
    if (!hideCategory) keysToClear.push("category");
    if (!hideBrand) keysToClear.push("brand");
    
    keysToClear.forEach(k => params.delete(k));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  let activeKeys = ["minPrice", "maxPrice", "availability"];
  if (!hideCategory) activeKeys.push("category");
  if (!hideBrand) activeKeys.push("brand");
  
  const activeCount = activeKeys.filter(k => currentParams[k] !== null).length;

  if (activeCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-neutral-500 mr-2">Active filters:</span>
      
      {!hideCategory && currentParams.category && (
        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-xs font-medium text-neutral-900">
          Category: {categories.find(c => c.slug === currentParams.category)?.name || currentParams.category}
          <button onClick={() => removeFilter("category")} className="ml-2 text-neutral-500 hover:text-neutral-900 focus:outline-none" aria-label="Remove category filter">&times;</button>
        </span>
      )}
      
      {!hideBrand && currentParams.brand && (
        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-xs font-medium text-neutral-900">
          Brand: {brands.find(b => b.slug === currentParams.brand)?.name || currentParams.brand}
          <button onClick={() => removeFilter("brand")} className="ml-2 text-neutral-500 hover:text-neutral-900 focus:outline-none" aria-label="Remove brand filter">&times;</button>
        </span>
      )}

      {(currentParams.minPrice !== null || currentParams.maxPrice !== null) && (
        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-xs font-medium text-neutral-900">
          Price: {currentParams.minPrice !== null ? `$${currentParams.minPrice}` : "$0"} - {currentParams.maxPrice !== null ? `$${currentParams.maxPrice}` : "Any"}
          <button onClick={() => removeFilter("price")} className="ml-2 text-neutral-500 hover:text-neutral-900 focus:outline-none" aria-label="Remove price filter">&times;</button>
        </span>
      )}

      {currentParams.availability && (
        <span className="inline-flex items-center px-3 py-1 bg-neutral-100 text-xs font-medium text-neutral-900">
          In Stock
          <button onClick={() => removeFilter("availability")} className="ml-2 text-neutral-500 hover:text-neutral-900 focus:outline-none" aria-label="Remove availability filter">&times;</button>
        </span>
      )}

      <button onClick={clearAll} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline underline-offset-4 ml-2">
        Clear All
      </button>
    </div>
  );
}
