"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, totalPages, hasPreviousPage, hasNextPage } = pagination;

  if (totalPages <= 1) return null;

  const navigateTo = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="flex items-center space-x-2" aria-label="Product pagination">
      <button
        disabled={!hasPreviousPage}
        onClick={() => navigateTo(page - 1)}
        className="px-4 py-2 text-sm border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
      >
        Previous
      </button>
      
      <span className="px-4 py-2 text-sm text-neutral-900" aria-current="page">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={!hasNextPage}
        onClick={() => navigateTo(page + 1)}
        className="px-4 py-2 text-sm border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
      >
        Next
      </button>
    </nav>
  );
}
