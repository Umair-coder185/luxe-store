import dbConnect from "@/lib/db";
import Promotion from "@/models/Promotion";
import Product from "@/models/Product";
import { resolvePricingForProducts } from "@/lib/pricing/resolveProductPricing";
import { serializeProductCard } from "@/lib/queries/storefront/products";

export async function getHotDeals(params) {
  await dbConnect();
  
  // 1. Fetch currently active promotions
  const now = new Date();
  const activePromotions = await Promotion.find({
    isActive: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $exists: false } }, { endsAt: { $gte: now } }] }
    ]
  }).lean();

  if (activePromotions.length === 0) {
    return {
      products: [],
      pagination: {
        page: params.page,
        limit: params.limit,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    };
  }

  // 2. Build Candidate Product Query based on targets
  const productIds = [];
  const brandIds = [];
  const categoryIds = [];
  const collectionIds = [];

  for (const promo of activePromotions) {
    if (promo.targetType === 'PRODUCT') productIds.push(promo.targetId);
    if (promo.targetType === 'BRAND') brandIds.push(promo.targetId);
    if (promo.targetType === 'CATEGORY') categoryIds.push(promo.targetId);
    if (promo.targetType === 'COLLECTION') collectionIds.push(promo.targetId);
  }

  const orConditions = [];
  if (productIds.length > 0) orConditions.push({ _id: { $in: productIds } });
  if (brandIds.length > 0) orConditions.push({ brand: { $in: brandIds } });
  if (categoryIds.length > 0) orConditions.push({ category: { $in: categoryIds } });
  if (collectionIds.length > 0) orConditions.push({ collections: { $in: collectionIds } });

  const filter = { isActive: true, $or: orConditions };

  // Allow standard sorting
  let sortObj = { createdAt: -1 };
  if (params.sort === "price-asc") sortObj = { price: 1, _id: 1 };
  else if (params.sort === "price-desc") sortObj = { price: -1, _id: 1 };
  else if (params.sort === "name-asc") sortObj = { name: 1, _id: 1 };

  const skip = (params.page - 1) * params.limit;

  const [docs, totalItems] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(params.limit)
      .populate("brand", "name slug")
      .select("name slug price compareAtPrice images brand category collections stock isActive createdAt")
      .lean(),
    Product.countDocuments(filter)
  ]);

  // 3. Resolve actual pricing (to confirm eligibility and deduplicate any overlapping promos via Best Discount Wins)
  const pricedDocs = await resolvePricingForProducts(docs);

  return {
    products: pricedDocs.map(serializeProductCard),
    pagination: {
      page: params.page,
      limit: params.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / params.limit),
      hasPreviousPage: params.page > 1,
      hasNextPage: params.page * params.limit < totalItems,
    }
  };
}
