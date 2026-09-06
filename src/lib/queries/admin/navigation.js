import dbConnect from '@/lib/db';
import NavigationMenu from '@/models/NavigationMenu';

export async function getAdminNavigation() {
  await dbConnect();
  const items = await NavigationMenu.find().sort({ order: 1 }).lean();
  
  return items.map(item => ({
    ...item,
    _id: item._id.toString(),
    sections: item.sections?.map(sec => ({
      ...sec,
      _id: sec._id?.toString(),
      category: sec.category?.toString() || null,
      links: sec.links?.map(link => ({
        ...link,
        _id: link._id?.toString()
      })) || []
    })) || []
  }));
}

export async function getAdminNavigationItem(id) {
  await dbConnect();
  const item = await NavigationMenu.findById(id).lean();
  if (!item) return null;
  
  return {
    ...item,
    _id: item._id.toString(),
    sections: item.sections?.map(sec => ({
      ...sec,
      _id: sec._id?.toString(),
      category: sec.category?.toString() || null,
      links: sec.links?.map(link => ({
        ...link,
        _id: link._id?.toString()
      })) || []
    })) || []
  };
}
