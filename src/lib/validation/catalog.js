import mongoose from 'mongoose';

export function validateBrand(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });
  }

  if (data.description && typeof data.description === 'string' && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
}

export function validateCategory(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });
  }

  if (data.description && typeof data.description === 'string' && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (data.parent && data.parent !== '') {
    if (!mongoose.Types.ObjectId.isValid(data.parent)) {
      errors.push({ field: 'parent', message: 'Invalid parent category ID' });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
}

export function validateCollection(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });
  }

  if (data.description && typeof data.description === 'string' && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (data.startDate && isNaN(Date.parse(data.startDate))) {
    errors.push({ field: 'startDate', message: 'Invalid start date' });
  }

  if (data.endDate && isNaN(Date.parse(data.endDate))) {
    errors.push({ field: 'endDate', message: 'Invalid end date' });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
}
