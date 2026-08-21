// app/(admin)/admin/brands/new/page.js

import Link from "next/link";
import EntityForm from "@/components/admin/shared/EntityForm";

const fields = [
  {
    name: "name",
    label: "Brand Name",
    type: "text",
    placeholder: "e.g. Louis Vuitton",
    required: true,
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    placeholder: "auto-generated-from-name",
    slugSource: "name",
  },
  {
    name: "website",
    label: "Website",
    type: "text",
    placeholder: "https://www.louisvuitton.com",
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    placeholder: "e.g. France",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of this brand...",
    rows: 3,
  },
  {
    name: "sortOrder",
    label: "Sort Order",
    type: "number",
    placeholder: "0",
    helpText: "Lower numbers appear first",
  },
  {
    name: "isActive",
    label: "Active",
    type: "switch",
    defaultValue: true,
  },
];

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href="/admin"
          className="text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Dashboard
        </Link>
        <svg
          className="h-3.5 w-3.5 text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <Link
          href="/admin/brands"
          className="text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Brands
        </Link>
        <svg
          className="h-3.5 w-3.5 text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-neutral-900">New</span>
      </nav>

      {/* Header */}
      <div>
        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
          Catalog
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
          Add Brand
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Create a new brand for your product catalog.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Brand Details
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Basic information about this brand.
          </p>
        </div>
        <div className="p-6">
          <EntityForm
            fields={fields}
            action="/api/admin/brands"
            method="POST"
            successRedirect="/admin/brands"
          />
        </div>
      </div>
    </div>
  );
}