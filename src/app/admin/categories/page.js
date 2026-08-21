// app/(admin)/admin/categories/page.js

import Link from "next/link";
import EntityTable from "@/components/admin/shared/EntityTable";
import { getCategories } from "@/lib/queries/admin/getCategories";

const PAGE_SIZE = 10;

const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (row) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">{row.name}</p>
        <p className="truncate text-xs text-neutral-400">/{row.slug}</p>
      </div>
    ),
  },
  {
    key: "parent",
    label: "Parent",
    render: (row) =>
      row.parentId?.name ? (
        <span className="text-sm text-neutral-600">{row.parentId.name}</span>
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

export default async function CategoriesPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const isActive = searchParams?.isActive;
  const parentId = searchParams?.parentId;

  const { categories, totalCount } = await getCategories({
    page,
    limit: PAGE_SIZE,
    search,
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
    parentId: parentId || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Categories</h1>
          <p className="text-sm text-neutral-500">
            {totalCount} {totalCount === 1 ? "category" : "categories"}
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50"
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
          New Category
        </Link>
      </div>

      <EntityTable
        columns={columns}
        data={categories}
        totalCount={totalCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        apiBase="/api/admin/categories"
        editBasePath="/admin/categories"
        searchPlaceholder="Search categories..."
        searchValue={search}
      />
    </div>
  );
}