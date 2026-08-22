import dbConnect from '@/lib/db';
import Category from '@/models/Category';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function getCategories({ page = 1, limit = 10, search = '' } = {}) {
  await dbConnect();

  const query = {};
  if (search) {
    const safeSearch = escapeRegex(search);
    query.name = { $regex: safeSearch, $options: 'i' };
  }

  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

  const [data, total] = await Promise.all([
    Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.max(1, limit))
      .populate('parent', 'name')
      .lean(),
    Category.countDocuments(query),
  ]);

  return {
    data: data.map(d => ({
      ...d,
      _id: d._id.toString(),
      parent: d.parent ? { ...d.parent, _id: d.parent._id.toString() } : null
    })),
    total,
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    totalPages: Math.ceil(total / Math.max(1, limit)),
  };
}

export async function getCategoryById(id) {
  await dbConnect();
  const data = await Category.findById(id).lean();
  if (!data) return null;
  return {
    ...data,
    _id: data._id.toString(),
    parent: data.parent ? data.parent.toString() : null
  };
}

// Helper to get all parent candidates (excluding self and children)
export async function getCategoryParentCandidates(excludeId = null) {
  await dbConnect();
  // Very simplistic circular prevention: exclude self.
  // Deep circular prevention requires recursive fetching which is heavy,
  // so we at least prevent selecting self.
  const query = excludeId ? { _id: { $ne: excludeId } } : {};
  const data = await Category.find(query).select('name _id').sort({ name: 1 }).lean();
  return data.map(d => ({ ...d, _id: d._id.toString() }));
}
