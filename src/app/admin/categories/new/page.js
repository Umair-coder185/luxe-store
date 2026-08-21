// app/(admin)/admin/categories/new/page.js

import Link from "next/link";
import EntityForm from "@/components/admin/shared/EntityForm";
import dbConnect from "@/lib/db/dbConnect";
import Category from "@/models/Category";

const fields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "e.g. Handbags",
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
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of this category...",
    rows: 3,
  },
  {
    name: "parentId",
    label: "Parent Category",
    type: "select",
    placeholder: "None (top-level)",
    options: "parentCategories",
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

export default async function NewCategoryPage() {
  await dbConnect();

  const parentCategories = await Category.find({ parentId: null })
    .select("_id name")
    .sort({ name: 1 })
    .lean();

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
          href="/admin/categories"
          className="text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Categories
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
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Create Category
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Add a new product category to your store.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Category Details
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Basic information about this category.
          </p>
        </div>
        <div className="p-6">
          <EntityForm
            fields={fields}
            action="/api/admin/categories"
            method="POST"
            successRedirect="/admin/categories"
            selectOptions={{ parentCategories }}
          />
        </div>
      </div>
    </div>
  );
}