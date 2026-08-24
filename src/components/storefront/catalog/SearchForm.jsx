"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl w-full mb-12 flex items-center border-b border-neutral-300 pb-2 mx-auto">
      <input 
        type="text" 
        name="q"
        aria-label="Search query"
        value={query} 
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for products..." 
        className="w-full text-lg bg-transparent focus:outline-none text-neutral-900"
        autoFocus
      />
      <button type="submit" className="text-neutral-500 hover:text-neutral-900 ml-4 focus:outline-none" aria-label="Submit search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}
