import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Collection from "@/models/Collection";

export function serializeProductCard(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    compareAtPrice: doc.compareAtPrice || null,
    image: doc.images && doc.images.length > 0 ? { url: doc.images[0].url } : null,
    brand: doc.brand && doc.brand.name ? { name: doc.brand.name, slug: doc.brand.slug } : null,
    stock: doc.stock,
    availability: doc.stock > 0 ? "in-stock" : "out-of-stock",
  };
}

export function serializeProductDetail(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    price: doc.price,
    compareAtPrice: doc.compareAtPrice || null,
    images: (doc.images || []).map(img => ({ url: img.url })),
    brand: doc.brand && doc.brand.name ? { name: doc.brand.name, slug: doc.brand.slug } : null,
    category: doc.category && doc.category.name ? { name: doc.category.name, slug: doc.category.slug } : null,
    collections: (doc.collections || []).map(c => ({ name: c.name, slug: c.slug })),
    stock: doc.stock,
    availability: doc.stock > 0 ? "in-stock" : "out-of-stock",
    attributes: doc.attributes ? Object.fromEntries(doc.attributes) : {},
    variants: (doc.variants || []).map(v => ({
      id: v._id ? v._id.toString() : null,
      size: v.size || null,
      color: v.color || null,
      stock: v.stock,
      availability: v.stock > 0 ? "in-stock" : "out-of-stock",
    })),
  };
}

export async function getProducts(params) {
  await dbConnect();
  
  const filter = { isActive: true };
  
  if (params.category) {
    const categoryDoc = await Category.findOne({ slug: params.category, isActive: true }).lean();
    if (!categoryDoc) return { products: [], pagination: { totalItems: 0, totalPages: 0, page: params.page, limit: params.limit, hasPreviousPage: false, hasNextPage: false } };
    filter.category = categoryDoc._id;
  }
  
  if (params.brand) {
    const brandDoc = await Brand.findOne({ slug: params.brand, isActive: true }).lean();
    if (!brandDoc) return { products: [], pagination: { totalItems: 0, totalPages: 0, page: params.page, limit: params.limit, hasPreviousPage: false, hasNextPage: false } };
    filter.brand = brandDoc._id;
  }
  
  if (params.collection) {
    const now = new Date();
    const collectionDoc = await Collection.findOne({ 
      slug: params.collection, 
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] }
      ]
    }).lean();
    if (!collectionDoc) return { products: [], pagination: { totalItems: 0, totalPages: 0, page: params.page, limit: params.limit, hasPreviousPage: false, hasNextPage: false } };
    filter.collections = collectionDoc._id;
  }
  
  if (params.minPrice !== null || params.maxPrice !== null) {
    filter.price = {};
    if (params.minPrice !== null) filter.price.$gte = params.minPrice;
    if (params.maxPrice !== null) filter.price.$lte = params.maxPrice;
  }
  
  if (params.availability === "in-stock") {
    filter.stock = { $gt: 0 };
  }
  
  if (params.q) {
    const escapedQ = params.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escapedQ, $options: "i" };
  }
  
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
      .select("name slug price compareAtPrice images brand stock isActive createdAt")
      .lean(),
    Product.countDocuments(filter)
  ]);
  
  return {
    products: docs.map(serializeProductCard),
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

export async function getProductBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const doc = await Product.findOne({ slug, isActive: true })
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .populate("collections", "name slug")
    .lean();
    
  return serializeProductDetail(doc);
}

export async function getNewArrivals(limit = 8) {
  await dbConnect();
  
  const docs = await Product.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 24))
    .populate("brand", "name slug")
    .select("name slug price compareAtPrice images brand stock isActive createdAt")
    .lean();
    
  return docs.map(serializeProductCard);
}

export async function getRelatedProducts({ currentProductId, categorySlug, limit = 4 }) {
  await dbConnect();
  
  const filter = {
    isActive: true,
    _id: { $ne: currentProductId },
  };
  
  let categoryId = null;
  if (categorySlug) {
    const categoryDoc = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
    if (categoryDoc) {
      categoryId = categoryDoc._id;
      filter.category = categoryId;
    }
  }
  
  const docs = await Product.find(filter)
    .sort({ createdAt: -1 }) // Sort by newest since salesCount is not maintained yet
    .limit(Math.min(limit, 12))
    .populate("brand", "name slug")
    .select("name slug price compareAtPrice images brand stock isActive createdAt")
    .lean();
    
  // If we didn't find enough in the same category, backfill with general products
  if (docs.length < limit && categoryId) {
    const additionalDocs = await Product.find({
      isActive: true,
      _id: { $nin: [currentProductId, ...docs.map(d => d._id)] }
    })
      .sort({ createdAt: -1 })
      .limit(limit - docs.length)
      .populate("brand", "name slug")
      .select("name slug price compareAtPrice images brand stock isActive createdAt")
      .lean();
      
    return [...docs, ...additionalDocs].map(serializeProductCard);
  }
    
  return docs.map(serializeProductCard);
}
