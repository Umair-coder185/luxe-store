// app/(admin)/admin/collections/[id]/edit/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import { ObjectId } from "mongoose";
import EntityForm from "@/components/admin/shared/EntityForm";
import dbConnect from "@/lib/db/dbConnect";
import Collection from "@/models/Collection";

const fields = [
  {
    name: "name",
    label: "Collection Name",
    type: "text",
    placeholder: "e.g. Summer 2025",
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
    placeholder: "Describe what this collection is about...",
    rows: 3,
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    helpText: "When this collection becomes visible",
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    helpText: "Leave empty for ongoing collections",
  },
  {
    name: "sortOrder",
    label: "Sort Order",
    type: "number",
    placeholder: "0",
    helpText: "Lower numbers appear first",
  },
  {
    name: "featured",
    label: "Featured",
    type: "switch",
    defaultValue: false,
    helpText: "Show on the storefront homepage",
  },
  {
    name: "isActive",
    label: "Active",
    type: "switch",
    defaultValue: true,
  },
];

export default async function EditCollectionPage({ params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  const collection = await Collection.findById(id).lean();
  if (!collection) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
          href="/admin/collections"
          className="text-neutral-400 transition-colors hover:text-neutral-600"
        >
          Collections
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
        <span className="font-medium text-neutral-900">Edit</span>
      </nav>

      <div>
        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
          Merchandising
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
          Edit Collection
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Update &ldquo;{collection.name}&rdquo; collection details.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Collection Details
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Basic information and scheduling.
          </p>
        </div>
        <div className="p-6">
          <EntityForm
            fields={fields}
            action={`/api/admin/collections/${id}`}
            method="PUT"
            successRedirect="/admin/collections"
            defaultValues={collection}
          />
        </div>
      </div>
    </div>
  );
}