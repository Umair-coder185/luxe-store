import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function getBrands({ page = 1, limit = 10, search = '' } = {}) {
  await dbConnect();

  const query = {};
  if (search) {
    const safeSearch = escapeRegex(search);
    query.name = { $regex: safeSearch, $options: 'i' };
  }

  const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

  const [data, total] = await Promise.all([
    Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Math.max(1, limit))
      .lean(),
    Brand.countDocuments(query),
  ]);

  return {
    data: data.map(d => ({ ...d, _id: d._id.toString() })),
    total,
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    totalPages: Math.ceil(total / Math.max(1, limit)),
  };
}

export async function getBrandById(id) {
  await dbConnect();
  const data = await Brand.findById(id).lean();
  if (!data) return null;
  return { ...data, _id: data._id.toString() };
}
