import dbConnect from "@/lib/db";
import Category from "@/models/Category";

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
  
  const docs = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();
    
  return docs.map(serializeCategory);
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const doc = await Category.findOne({ slug, isActive: true }).lean();
  return serializeCategory(doc);
}
