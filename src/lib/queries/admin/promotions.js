import dbConnect from '@/lib/db';
import Promotion from '@/models/Promotion';

// Ensure models are registered for dynamic populate
import '@/models/Product';
import '@/models/Brand';
import '@/models/Category';
import '@/models/Collection';

export async function getPromotions({ page = 1, limit = 10, search = '' } = {}) {
  await dbConnect();
  
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const [promotions, total] = await Promise.all([
    Promotion.find(query)
      .populate('targetId', 'name') // We assume Product, Brand, Category, Collection all have a 'name' field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Promotion.countDocuments(query)
  ]);

  const serialized = promotions.map(p => ({
    ...p,
    _id: p._id.toString(),
    targetId: p.targetId ? {
      _id: p.targetId._id.toString(),
      name: p.targetId.name
    } : null,
    startsAt: p.startsAt ? p.startsAt.toISOString() : null,
    endsAt: p.endsAt ? p.endsAt.toISOString() : null,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  }));

  return {
    data: serialized,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getPromotion(id) {
  await dbConnect();
  const p = await Promotion.findById(id).lean();
  if (!p) return null;
  
  return {
    ...p,
    _id: p._id.toString(),
    targetId: p.targetId.toString(),
    startsAt: p.startsAt ? p.startsAt.toISOString() : null,
    endsAt: p.endsAt ? p.endsAt.toISOString() : null,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  };
}

export function getPromotionStatus(promotion, now = new Date()) {
  if (!promotion.isActive) return 'Disabled';
  
  const start = promotion.startsAt ? new Date(promotion.startsAt) : null;
  const end = promotion.endsAt ? new Date(promotion.endsAt) : null;

  if (start && start > now) return 'Scheduled';
  if (end && end < now) return 'Expired';
  
  return 'Active';
}
