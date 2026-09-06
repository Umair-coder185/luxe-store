import dbConnect from '@/lib/db';
import NavigationMenu from '@/models/NavigationMenu';
import { revalidateTag } from 'next/cache';

export async function createNavigationItem(data) {
  await dbConnect();
  
  // Basic check for valid ObjectIds if CATEGORY_BRANDS is used
  if (data.type === 'MEGA_MENU' && data.sections) {
    data.sections.forEach(section => {
      if (section.sourceType === 'CATEGORY_BRANDS' && section.category === '') {
        section.category = null;
      }
    });
  }

  const navItem = await NavigationMenu.create(data);
  revalidateTag('navigation');
  return { success: true, id: navItem._id.toString() };
}

export async function updateNavigationItem(id, data) {
  await dbConnect();
  
  if (data.type === 'MEGA_MENU' && data.sections) {
    data.sections.forEach(section => {
      if (section.sourceType === 'CATEGORY_BRANDS' && section.category === '') {
        section.category = null;
      }
    });
  }

  const navItem = await NavigationMenu.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!navItem) throw new Error("Navigation item not found");
  
  revalidateTag('navigation');
  return { success: true, id: navItem._id.toString() };
}

export async function deleteNavigationItem(id) {
  await dbConnect();
  const navItem = await NavigationMenu.findByIdAndDelete(id);
  if (!navItem) throw new Error("Navigation item not found");
  
  revalidateTag('navigation');
  return { success: true };
}
