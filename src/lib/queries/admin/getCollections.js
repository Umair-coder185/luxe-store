// lib/queries/admin/getCollections.js

import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db/dbConnect";
import Collection from "@/models/Collection";
import { COLLECTIONS } from "@/lib/cache/tags";

async function getCollectionsFn({ page = 1, limit = 10, search = "", isActive } = {}) {
  await dbConnect();

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (page - 1) * limit;
  const [collections, totalCount] = await Promise.all([
    Collection.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Collection.countDocuments(filter),
  ]);

  return {
    collections,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export function getCollections(params) {
  return unstable_cache(
    () => getCollectionsFn(params),
    [`collections-${JSON.stringify(params)}`],
    { tags: [COLLECTIONS] }
  )();
}