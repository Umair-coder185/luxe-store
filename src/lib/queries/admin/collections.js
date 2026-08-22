import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function getCollections({ page = 1, limit = 10, search = '' } = {}) {
  await dbConnect();

  const query = {};
  if (search) {
    const safeSearch = escapeRegex(search);
    query.name = { $regex: safeSearch, $options: 'i' };
  }

  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

  const [data, total] = await Promise.all([
    Collection.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.max(1, limit))
      .lean(),
    Collection.countDocuments(query),
  ]);

  return {
    data: data.map(d => ({
      ...d,
      _id: d._id.toString(),
      startDate: d.startDate ? d.startDate.toISOString() : null,
      endDate: d.endDate ? d.endDate.toISOString() : null,
    })),
    total,
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    totalPages: Math.ceil(total / Math.max(1, limit)),
  };
}

export async function getCollectionById(id) {
  await dbConnect();
  const data = await Collection.findById(id).lean();
  if (!data) return null;
  return {
    ...data,
    _id: data._id.toString(),
    startDate: data.startDate ? data.startDate.toISOString() : null,
    endDate: data.endDate ? data.endDate.toISOString() : null,
  };
}
