import dbConnect from '@/lib/db';
import Promotion from '@/models/Promotion';
import Product from '@/models/Product';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import { revalidateTag } from 'next/cache';

async function validateTargetExistence(targetType, targetId) {
  let exists = false;
  switch (targetType) {
    case 'PRODUCT':
      exists = await Product.exists({ _id: targetId });
      break;
    case 'BRAND':
      exists = await Brand.exists({ _id: targetId });
      break;
    case 'CATEGORY':
      exists = await Category.exists({ _id: targetId });
      break;
    case 'COLLECTION':
      exists = await Collection.exists({ _id: targetId });
      break;
  }
  if (!exists) {
    throw new Error(`The selected ${targetType.toLowerCase()} target does not exist.`);
  }
}

export async function createPromotion(data) {
  await dbConnect();
  await validateTargetExistence(data.targetType, data.targetId);

  const promotion = await Promotion.create(data);
  revalidateTag('promotions');
  return { success: true, id: promotion._id.toString() };
}

export async function updatePromotion(id, data) {
  await dbConnect();
  await validateTargetExistence(data.targetType, data.targetId);

  const promotion = await Promotion.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!promotion) throw new Error("Promotion not found");
  
  revalidateTag('promotions');
  return { success: true, id: promotion._id.toString() };
}

export async function deletePromotion(id) {
  await dbConnect();
  const promotion = await Promotion.findByIdAndDelete(id);
  if (!promotion) throw new Error("Promotion not found");
  
  revalidateTag('promotions');
  return { success: true };
}
