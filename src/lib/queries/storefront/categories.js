import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export function serializeCategory(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || null,
    image: doc.image && doc.image.url ? { url: doc.image.url } : null,
  };
}

export async function getCategories() {
  await dbConnect();

  // Only show categories that contain real (non-seed) active products
  let activeCategoryIds = await Product.distinct("category", {
    isActive: true,
    "images.0.url": { $not: /picsum\.photos/i },
  });

  // Fallback if all products in DB are seed products
  if (!activeCategoryIds || activeCategoryIds.length === 0) {
    activeCategoryIds = await Product.distinct("category", { isActive: true });
  }

  const docs = await Category.find({
    isActive: true,
    _id: { $in: activeCategoryIds },
  })
    .sort({ name: 1 })
    .lean();

  // Deduplicate by lowercase name so duplicate seeded names (e.g. "Handbags") don't repeat
  const seenNames = new Set();
  const uniqueDocs = [];
  for (const doc of docs) {
    const key = doc.name.trim().toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);
    uniqueDocs.push(doc);
  }

  return uniqueDocs.map(serializeCategory);
}

export async function getHomepageCategories(limit = 6, excludeNewArrivalCount = 8) {
  await dbConnect();

  const [activeCategories, recentProducts] = await Promise.all([
    Category.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
    Product.find({
      isActive: true,
      "images.0.url": { $not: /picsum\.photos/i },
    })
      .sort({ createdAt: -1 })
      .limit(500)
      .select("_id category images createdAt")
      .lean(),
  ]);

  const categoryMap = new Map(
    activeCategories.map((cat) => [cat._id.toString(), cat])
  );

  // Track the top N New Arrivals (and their primary cover images) so
  // "Shop by Category" prefers a different product/photo than "New Arrivals".
  const newArrivalDocs = recentProducts.slice(0, excludeNewArrivalCount);
  const newArrivalIds = new Set(newArrivalDocs.map((p) => p._id.toString()));
  const newArrivalPrimaryUrls = new Set(
    newArrivalDocs.map((p) => p.images?.[0]?.url).filter(Boolean)
  );

  // Group products by category while preserving category order by newest product
  const orderedCategoryIds = [];
  const productsByCategory = new Map();

  for (const product of recentProducts) {
    if (!product.category) continue;
    const catId = product.category.toString();
    if (!categoryMap.has(catId)) continue;

    if (!productsByCategory.has(catId)) {
      productsByCategory.set(catId, []);
      orderedCategoryIds.push(catId);
    }
    productsByCategory.get(catId).push(product);
  }

  const result = [];
  const usedIds = new Set();
  const usedNames = new Set();

  for (const catId of orderedCategoryIds) {
    const catDoc = categoryMap.get(catId);
    if (!catDoc || usedIds.has(catId)) continue;

    const nameKey = catDoc.name.trim().toLowerCase();
    if (usedNames.has(nameKey)) continue;

    const serialized = serializeCategory(catDoc);

    if (!serialized.image) {
      const catProducts = productsByCategory.get(catId) || [];

      // 1. Prefer a product in this category that is NOT in New Arrivals
      const nonNewArrivalProduct = catProducts.find(
        (p) =>
          !newArrivalIds.has(p._id.toString()) &&
          p.images?.[0]?.url &&
          !newArrivalPrimaryUrls.has(p.images[0].url)
      );

      if (nonNewArrivalProduct?.images?.[0]?.url) {
        serialized.image = { url: nonNewArrivalProduct.images[0].url };
      } else if (catProducts[0]?.images?.[1]?.url) {
        // 2. If all products in this category are in New Arrivals, prefer the 2nd image
        serialized.image = { url: catProducts[0].images[1].url };
      } else if (catProducts[0]?.images?.[0]?.url) {
        // 3. Final product fallback: 1st image of newest product in category
        serialized.image = { url: catProducts[0].images[0].url };
      }
    }

    result.push(serialized);
    usedIds.add(catId);
    usedNames.add(nameKey);

    if (result.length >= limit) break;
  }

  return result;
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const doc = await Category.findOne({ slug, isActive: true }).lean();
  return serializeCategory(doc);
}
