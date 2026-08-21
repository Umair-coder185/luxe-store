// app/(admin)/admin/collections/page.js

import Link from "next/link";
import EntityTable from "@/components/admin/shared/EntityTable";
import { getCollections } from "@/lib/queries/admin/getCollections";

const PAGE_SIZE = 10;

const columns = [
  {
    key: "name",
    label: "Collection",
    sortable: true,
    render: (row) => (
      <div className="flex min-w-0 items-center gap-3">
        {row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="h-10 w-14 flex-shrink-0 rounded-lg border border-neutral-100 object-cover bg-neutral-50"
          />
        ) : (
          <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-medium text-neutral-400">
            No img
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-neutral-900">{row.name}</p>
            {row.featured && (
              <span className="inline-flex rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                Featured
              </span>
            )}
          </div>
          <p className="truncate text-xs text-neutral-400">/{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "dates",
    label: "Schedule",
    render: (row) => {
      if (!row.startDate && !row.endDate) {
        return <span className="text-sm text-neutral-300">—</span>;
      }
      const start = row.startDate
        ? new Date(row.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "…";
      const end = row.endDate
        ? new Date(row.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Ongoing";
      return (
        <span className="text-sm text-neutral-600">
          {start} — {end}
        </span>
      );
    },
  },
  {
    key: "isActive",
    label: "Status",
    render: (row) => {
      const now = new Date();
      const ended = row.endDate && new Date(row.endDate) < now;
      const scheduled = row.startDate && new Date(row.startDate) > now;
      const label = ended ? "Ended" : scheduled ? "Scheduled" : row.isActive ? "Active" : "Inactive";
      const color = ended
        ? "bg-neutral-100 text-neutral-500"
        : scheduled
        ? "bg-blue-50 text-blue-600"
        : row.isActive
        ? "bg-emerald-50 text-emerald-700"
        : "bg-neutral-100 text-neutral-500";
      return (
        <span className={"inline-flex rounded-full px-2 py-0.5 text-xs font-medium " + color}>
          {label}
        </span>
      );
    },
  },
  {
    key: "sortOrder",
    label: "Order",
    render: (row) => (
      <span className="text-sm tabular-nums text-neutral-600">{row.sortOrder}</span>
    ),
  },
];

export default async function CollectionsPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || "";
  const isActive = searchParams?.isActive;

  const { collections, totalCount } = await getCollections({
    page,
    limit: PAGE_SIZE,
    search,
    isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
            Merchandising
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
            Collections
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Curate product groupings for campaigns and seasons.
          </p>
        </div>

        <Link
          href="/admin/collections/new"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Collection
        </Link>
      </div>

      <EntityTable
        columns={columns}
        data={collections}
        totalCount={totalCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        apiBase="/api/admin/collections"
        editBasePath="/admin/collections"
        searchPlaceholder="Search collections..."
        searchValue={search}
      />
    </div>
  );
}