// app/(admin)/admin/categories/[id]/edit/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import { ObjectId } from "mongoose";
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

async function getDescendantIds(categoryId) {
  const descendants = [];
  const queue = [categoryId.toString()];
  const visited = new Set();

  while (queue.length > 0 && visited.size < 50) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const children = await Category.find({ parentId: currentId })
      .select("_id")
      .lean();
    for (const child of children) {
      descendants.push(child._id.toString());
      queue.push(child._id.toString());
    }
  }

  return descendants;
}

export default async function EditCategoryPage({ params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const category = await Category.findById(id).lean();
  if (!category) {
    notFound();
  }

  // Exclude self + all descendants from parent dropdown
  const descendantIds = await getDescendantIds(id);
  const excludedIds = [id, ...descendantIds];

  const parentCategories = await Category.find({
    _id: { $nin: excludedIds },
  })
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
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
          <path strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="font-medium text-neutral-900">Edit</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Edit Category
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Update &ldquo;{category.name}&rdquo; category details.
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
            action={`/api/admin/categories/${id}`}
            method="PUT"
            successRedirect="/admin/categories"
            defaultValues={category}
            selectOptions={{ parentCategories }}
          />
        </div>
      </div>
    </div>
  );
}