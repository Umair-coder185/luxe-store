import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";

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
  
  const docs = await Brand.find({ isActive: true })
    .sort({ name: 1 })
    .lean();
    
  return docs.map(serializeBrand);
}

export async function getBrandBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const doc = await Brand.findOne({ slug, isActive: true }).lean();
  return serializeBrand(doc);
}
