"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortDropdown({ currentSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    // Reset page to 1 on sort change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="sort" className="text-sm text-neutral-500">Sort by</label>
      <select 
        id="sort" 
        value={currentSort || "newest"}
        onChange={handleSortChange}
        className="text-sm border-b border-neutral-300 py-1 pr-6 focus:outline-none focus:border-neutral-900 bg-transparent cursor-pointer"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A–Z</option>
      </select>
    </div>
  );
}
