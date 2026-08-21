// app/(admin)/admin/brands/page.js

import Link from "next/link";
import EntityTable from "@/components/admin/shared/EntityTable";
import { getBrands } from "@/lib/queries/admin/getBrands";

const PAGE_SIZE = 10;

const columns = [
  {
    key: "name",
    label: "Brand",
    sortable: true,
    render: (row) => (
      <div className="flex min-w-0 items-center gap-3">
        {row.logo ? (
          <img
            src={row.logo}
            alt={row.name}
            className="h-9 w-9 flex-shrink-0 rounded-lg border border-neutral-100 object-contain bg-white p-1"
          />
        ) : (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold uppercase text-neutral-400">
            {row.name?.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">{row.name}</p>
          <p className="truncate text-xs text-neutral-400">/{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "country",
    label: "Country",
    render: (row) =>
      row.country ? (
        <span className="text-sm text-neutral-600">{row.country}</span>
      ) : (
        <span className="text-sm text-neutral-300">—</span>
      ),
  },
  {
    key: "isActive",
    label: "Status",
    render: (row) => (
      <span
        className={
          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
          (row.isActive
            ? "bg-emerald-50 text-emerald-700"
            : "bg-neutral-100 text-neutral-500")
        }
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "sortOrder",
    label: "Order",
    render: (row) => (
      <span className="text-sm tabular-nums text-neutral-600">
        {row.sortOrder}
      </span>
    ),
  },
];

export default async function BrandsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const isActive = searchParams?.isActive;

  const { brands, totalCount } = await getBrands({
    page,
    limit: PAGE_SIZE,
    search,
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
            Catalog
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
            Brands
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage the brands available in your store.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add Brand
        </Link>
      </div>

      {/* Table */}
      <EntityTable
        columns={columns}
        data={brands}
        totalCount={totalCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        apiBase="/api/admin/brands"
        editBasePath="/admin/brands"
        searchPlaceholder="Search brands..."
        searchValue={search}
      />
    </div>
  );
}