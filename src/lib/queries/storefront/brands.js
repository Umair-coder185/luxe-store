import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

export function serializeBrand(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || null,
    logo: doc.logo && doc.logo.url ? { url: doc.logo.url } : null,
  };
}

export async function getBrands() {
  await dbConnect();

  // Only show brands that contain real (non-seed) active products
  let activeBrandIds = await Product.distinct("brand", {
    isActive: true,
    "images.0.url": { $not: /picsum\.photos/i },
  });

  // Fallback if all products in DB are seed products
  if (!activeBrandIds || activeBrandIds.length === 0) {
    activeBrandIds = await Product.distinct("brand", { isActive: true });
  }

  const docs = await Brand.find({
    isActive: true,
    _id: { $in: activeBrandIds },
  })
    .sort({ name: 1 })
    .lean();

  return docs.map(serializeBrand);
}

export async function getHomepageBrands(limit = 8) {
  await dbConnect();

  const [activeBrands, latestByBrand] = await Promise.all([
    Brand.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
    Product.aggregate([
      {
        $match: {
          isActive: true,
          "images.0.url": { $not: /picsum\.photos/i },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$brand",
          latestProductAt: { $first: "$createdAt" },
        },
      },
      { $sort: { latestProductAt: -1 } },
    ]),
  ]);

  const brandMap = new Map(
    activeBrands.map((b) => [b._id.toString(), b])
  );

  const result = [];
  const usedIds = new Set();

  for (const entry of latestByBrand) {
    if (!entry._id) continue;
    const brandId = entry._id.toString();
    const brandDoc = brandMap.get(brandId);
    if (!brandDoc || usedIds.has(brandId)) continue;

    result.push(serializeBrand(brandDoc));
    usedIds.add(brandId);

    if (result.length >= limit) break;
  }

  return result;
}

export async function getBrandBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const doc = await Brand.findOne({ slug, isActive: true }).lean();
  return serializeBrand(doc);
}
