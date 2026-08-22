import mongoose from 'mongoose';

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function validateProductData(data) {
  const errors = [];
  const payload = { ...data };

  // Name
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (payload.name.length > 150) {
    errors.push({ field: 'name', message: 'Name cannot exceed 150 characters' });
  }

  // Slug
  if (!payload.slug || typeof payload.slug !== 'string' || payload.slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(payload.slug)) {
    errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });
  }

  // Description
  if (!payload.description || typeof payload.description !== 'string' || payload.description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (payload.description.length > 2000) {
    errors.push({ field: 'description', message: 'Description cannot exceed 2000 characters' });
  }

  // Price
  if (typeof payload.price !== 'number' || isNaN(payload.price) || payload.price < 0) {
    errors.push({ field: 'price', message: 'Price must be a valid non-negative number' });
  }

  // Compare at price
  if (payload.compareAtPrice !== undefined && payload.compareAtPrice !== null && payload.compareAtPrice !== '') {
    const comparePrice = Number(payload.compareAtPrice);
    if (isNaN(comparePrice) || comparePrice < 0) {
      errors.push({ field: 'compareAtPrice', message: 'Compare at price must be a valid non-negative number' });
    } else if (payload.price !== undefined && comparePrice <= payload.price) {
      errors.push({ field: 'compareAtPrice', message: 'Compare at price must be strictly greater than the current price' });
    }
    payload.compareAtPrice = comparePrice;
  } else {
    payload.compareAtPrice = null; // Normalize empty
  }

  // Category
  if (!payload.category || !isObjectId(payload.category)) {
    errors.push({ field: 'category', message: 'Valid Category is required' });
  }

  // Brand
  if (!payload.brand || !isObjectId(payload.brand)) {
    errors.push({ field: 'brand', message: 'Valid Brand is required' });
  }

  // Collections
  if (payload.collections && !Array.isArray(payload.collections)) {
    errors.push({ field: 'collections', message: 'Collections must be an array' });
  } else if (payload.collections) {
    for (const id of payload.collections) {
      if (!isObjectId(id)) {
        errors.push({ field: 'collections', message: 'Invalid Collection ID provided' });
        break;
      }
    }
  } else {
    payload.collections = [];
  }

  // Images
  if (!payload.images || !Array.isArray(payload.images) || payload.images.length === 0) {
    errors.push({ field: 'images', message: 'At least one image is required' });
  } else if (payload.images.length > 3) {
    errors.push({ field: 'images', message: 'Maximum 3 images allowed' });
  } else {
    for (const img of payload.images) {
      if (!img.url || !img.publicId || typeof img.url !== 'string' || typeof img.publicId !== 'string') {
        errors.push({ field: 'images', message: 'Each image must have a valid url and publicId' });
        break;
      }
    }
  }

  // Stock
  if (typeof payload.stock !== 'number' || isNaN(payload.stock) || payload.stock < 0) {
    errors.push({ field: 'stock', message: 'Stock must be a valid non-negative number' });
  }

  // isActive
  payload.isActive = payload.isActive === true || payload.isActive === 'true';

  // Attributes
  if (payload.attributes) {
    if (typeof payload.attributes !== 'object' || Array.isArray(payload.attributes)) {
      errors.push({ field: 'attributes', message: 'Attributes must be a valid key-value object' });
    }
  }

  // Variants
  if (payload.variants && Array.isArray(payload.variants)) {
    const skuSet = new Set();
    for (const variant of payload.variants) {
      if (variant.sku) {
        if (skuSet.has(variant.sku)) {
          errors.push({ field: 'variants', message: `Duplicate variant SKU detected: ${variant.sku}` });
          break;
        }
        skuSet.add(variant.sku);
      }

      const vStock = Number(variant.stock);
      if (isNaN(vStock) || vStock < 0) {
        errors.push({ field: 'variants', message: 'Variant stock must be a non-negative number' });
        break;
      }
    }
  } else {
    payload.variants = [];
  }

  return { errors, payload };
}
