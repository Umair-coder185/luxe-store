// lib/queries/admin/getBrands.js

import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db/dbConnect";
import Brand from "@/models/Brand";
import { BRANDS } from "@/lib/cache/tags";

async function getBrandsFn({ page = 1, limit = 10, search = "", isActive } = {}) {
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
  const [brands, totalCount] = await Promise.all([
    Brand.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Brand.countDocuments(filter),
  ]);

  return {
    brands,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export function getBrands(params) {
  return unstable_cache(
    () => getBrandsFn(params),
    [`brands-${JSON.stringify(params)}`],
    { tags: [BRANDS] }
  )();
}