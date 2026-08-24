import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";

export function serializeCollection(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || null,
    image: doc.image && doc.image.url ? { url: doc.image.url } : null,
  };
}

export async function getActiveCollections() {
  await dbConnect();
  
  const now = new Date();
  const docs = await Collection.find({ 
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] }
    ]
  })
    .sort({ createdAt: -1 })
    .lean();
    
  return docs.map(serializeCollection);
}

export async function getCollectionBySlug(slug) {
  if (!slug) return null;
  await dbConnect();
  
  const now = new Date();
  const doc = await Collection.findOne({ 
    slug, 
    isActive: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] }
    ]
  }).lean();
  
  return serializeCollection(doc);
}
