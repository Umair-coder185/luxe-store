'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from './ImageUploader';
import VariantManager from './VariantManager';
import AttributesManager from './AttributesManager';

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductForm({
  mode = 'create',
  productId,
  initialData = {},
  brands = [],
  categories = [],
  collections = [],
}) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState(initialData.name || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price !== undefined ? String(initialData.price) : '');
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData.compareAtPrice !== undefined && initialData.compareAtPrice !== null
      ? String(initialData.compareAtPrice)
      : ''
  );
  const [brand, setBrand] = useState(initialData.brand || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [selectedCollections, setSelectedCollections] = useState(
    Array.isArray(initialData.collections) ? initialData.collections : []
  );
  const [stock, setStock] = useState(initialData.stock !== undefined ? String(initialData.stock) : '0');
  const [isActive, setIsActive] = useState(initialData.isActive !== undefined ? initialData.isActive : true);
  const [images, setImages] = useState(Array.isArray(initialData.images) ? initialData.images : []);
  const [variants, setVariants] = useState(Array.isArray(initialData.variants) ? initialData.variants : []);
  const [attributes, setAttributes] = useState(
    initialData.attributes && typeof initialData.attributes === 'object'
      ? initialData.attributes
      : {}
  );

  // Track images newly uploaded in this session for unsaved cleanup
  const newlyUploadedPublicIdsRef = useRef(new Set());

  // Slug auto-generation state
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    mode === 'edit' || (initialData.slug && initialData.slug !== slugify(initialData.name || ''))
  );

  // Submission & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Derived stock when variants exist
  const hasVariants = variants.length > 0;
  const derivedStock = useMemo(() => {
    return variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);
  }, [variants]);

  // Handle Name change & Slug auto-generation
  function handleNameChange(e) {
    const newName = e.target.value;
    setName(newName);

    if (errors.name) {
      setErrors(prev => ({ ...prev, name: null }));
    }

    if (!isSlugManuallyEdited && mode === 'create') {
      const generatedSlug = slugify(newName);
      setSlug(generatedSlug);
      if (errors.slug) {
        setErrors(prev => ({ ...prev, slug: null }));
      }
    }
  }

  // Handle Slug change
  function handleSlugChange(e) {
    setIsSlugManuallyEdited(true);
    const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setSlug(sanitized);
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: null }));
    }
  }

  // Track newly uploaded images
  function handleImageUploaded(publicId) {
    newlyUploadedPublicIdsRef.current.add(publicId);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: null }));
    }
  }

  // Handle image removal with unsaved cleanup
  async function handleImageRemoved(publicId) {
    // If the image was uploaded in this session and unsaved, immediately clean up from Cloudinary
    if (newlyUploadedPublicIdsRef.current.has(publicId)) {
      newlyUploadedPublicIdsRef.current.delete(publicId);
      try {
        await fetch('/api/admin/media/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        });
      } catch (err) {
        console.error('[ProductForm] Failed to clean up removed image from Cloudinary:', err);
      }
    }
  }

  function handleCollectionToggle(colId) {
    setSelectedCollections(prev =>
      prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
    );
  }

  // Client Validation before submit
  function validateForm() {
    const errs = {};

    if (!name.trim()) errs.name = 'Product name is required';
    else if (name.length > 150) errs.name = 'Product name cannot exceed 150 characters';

    if (!slug.trim()) errs.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(slug)) {
      errs.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!description.trim()) errs.description = 'Description is required';
    else if (description.length > 2000) errs.description = 'Description cannot exceed 2000 characters';

    const numPrice = Number(price);
    if (price === '' || isNaN(numPrice) || numPrice < 0) {
      errs.price = 'Valid non-negative price is required';
    }

    if (compareAtPrice !== '' && compareAtPrice !== null) {
      const numCompare = Number(compareAtPrice);
      if (isNaN(numCompare) || numCompare < 0) {
        errs.compareAtPrice = 'Compare-at price must be a valid number';
      } else if (!isNaN(numPrice) && numCompare <= numPrice) {
        errs.compareAtPrice = 'Compare-at price must be greater than current price';
      }
    }

    if (!category) errs.category = 'Category is required';
    if (!brand) errs.brand = 'Brand is required';

    if (!images || images.length === 0) {
      errs.images = 'At least one product image is required';
    } else if (images.length > 3) {
      errs.images = 'Maximum 3 images allowed';
    }

    if (!hasVariants) {
      const numStock = Number(stock);
      if (stock === '' || isNaN(numStock) || numStock < 0) {
        errs.stock = 'Stock must be a non-negative number';
      }
    } else {
      const skuSet = new Set();
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const vSku = (v.sku || '').trim().toUpperCase();
        if (vSku) {
          if (skuSet.has(vSku)) {
            errs.variants = `Duplicate variant SKU: "${v.sku}". SKUs must be unique.`;
            break;
          }
          skuSet.add(vSku);
        }
        if (Number(v.stock) < 0 || isNaN(Number(v.stock))) {
          errs.variants = 'Variant stock must be non-negative';
          break;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice !== '' ? Number(compareAtPrice) : null,
      brand,
      category,
      collections: selectedCollections,
      stock: hasVariants ? derivedStock : Math.max(0, parseInt(stock, 10) || 0),
      isActive,
      images,
      variants,
      attributes,
    };

    const endpoint = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.details)) {
          const fieldErrs = {};
          data.details.forEach(d => {
            fieldErrs[d.field] = d.message;
          });
          setErrors(fieldErrs);
          setServerError('Please fix the highlighted validation errors.');
        } else {
          setServerError(data.error || 'Failed to save product');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Success: clear newlyUploadedPublicIdsRef so we don't accidentally delete saved images
      newlyUploadedPublicIdsRef.current.clear();
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error('[ProductForm] Submit error:', err);
      setServerError('A network error occurred while saving the product. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/products" className="hover:text-gray-900 transition-colors">
              &larr; Products
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {mode === 'create' ? 'New Product' : 'Edit Product'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'create' ? 'Add New Product' : `Edit "${initialData.name || 'Product'}"`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4 animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : mode === 'create' ? (
              'Create Product'
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </div>

      {/* Global Server / Form Error */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2">
            <AlertIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Action Failed</p>
              <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="text-red-500 hover:text-red-700 font-bold text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General, Media, Pricing, Inventory & Variants, Attributes (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              General Information
            </h2>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                maxLength={150}
                onChange={handleNameChange}
                placeholder="e.g. Silk Evening Dress"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.name ? (
                  <p className="text-xs text-red-600">{errors.name}</p>
                ) : (
                  <span />
                )}
                <span className="text-[11px] text-gray-400">{name.length}/150</span>
              </div>
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {mode === 'create' && !isSlugManuallyEdited
                    ? '(Auto-generated from name)'
                    : '(Customized)'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-xs">
                  /products/
                </div>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="silk-evening-dress"
                  className={`w-full rounded-lg border pl-22 pr-3.5 py-2.5 text-sm text-gray-900 font-mono text-xs focus:outline-none focus:ring-2 ${
                    errors.slug
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                  }`}
                />
              </div>
              {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                maxLength={2000}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                }}
                placeholder="Describe the product materials, craftsmanship, fitting..."
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-600">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className="text-[11px] text-gray-400">{description.length}/2000</span>
              </div>
            </div>
          </div>

          {/* Media Upload Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <ImageUploader
              images={images}
              onChange={setImages}
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
              error={errors.images}
            />
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Pricing & Standalone Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">$</span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors(prev => ({ ...prev, price: null }));
                    }}
                    placeholder="0.00"
                    className={`w-full rounded-lg border pl-8 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                      errors.price
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                    }`}
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
              </div>

              {/* Compare At Price */}
              <div>
                <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Compare-at Price ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">$</span>
                  <input
                    id="compareAtPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => {
                      setCompareAtPrice(e.target.value);
                      if (errors.compareAtPrice) setErrors(prev => ({ ...prev, compareAtPrice: null }));
                    }}
                    placeholder="Original price for discount badge"
                    className={`w-full rounded-lg border pl-8 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                      errors.compareAtPrice
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                    }`}
                  />
                </div>
                {errors.compareAtPrice && (
                  <p className="mt-1 text-xs text-red-600">{errors.compareAtPrice}</p>
                )}
              </div>
            </div>

            {/* Standalone Stock (locked if variants exist) */}
            <div className="pt-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1.5">
                Total Stock Units <span className="text-red-500">*</span>
              </label>
              {hasVariants ? (
                <div>
                  <input
                    id="stock"
                    type="number"
                    disabled
                    value={derivedStock}
                    className="w-full rounded-lg border border-gray-200 bg-gray-100/80 px-3.5 py-2.5 text-sm text-gray-600 font-semibold cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-xs text-blue-600 font-medium flex items-center gap-1">
                    <InfoIcon className="w-3.5 h-3.5" />
                    Locked: Stock is automatically calculated from the sum of all variant stocks ({derivedStock} units).
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (errors.stock) setErrors(prev => ({ ...prev, stock: null }));
                    }}
                    placeholder="e.g. 50"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                      errors.stock
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                    }`}
                  />
                  {errors.stock ? (
                    <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Standalone stock for products without variants.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <VariantManager
              variants={variants}
              onChange={setVariants}
              error={errors.variants}
            />
          </div>

          {/* Attributes / Specifications Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <AttributesManager
              attributes={attributes}
              onChange={setAttributes}
              error={errors.attributes}
            />
          </div>
        </div>

        {/* Right Column: Taxonomy, Organization, Status (1 col) */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Status & Visibility
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Active Listing</p>
                <p className="text-xs text-gray-500">Visible to customers on the storefront</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(prev => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Organization & Classification Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Organization
            </h2>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 bg-white ${
                  errors.category
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                }`}
              >
                <option value="">Select a Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  if (errors.brand) setErrors(prev => ({ ...prev, brand: null }));
                }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 bg-white ${
                  errors.brand
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                }`}
              >
                <option value="">Select a Brand</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.brand && <p className="mt-1 text-xs text-red-600">{errors.brand}</p>}
            </div>

            {/* Collections Multi-Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Collections
              </label>
              {collections.length === 0 ? (
                <p className="text-xs text-gray-400">No active collections found.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  {collections.map(col => {
                    const isChecked = selectedCollections.includes(col._id);
                    return (
                      <label
                        key={col._id}
                        className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCollectionToggle(col._id)}
                          className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4"
                        />
                        <span>{col.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Publish Card */}
          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
              Save Actions
            </h3>
            <p className="text-xs text-gray-400">
              Ensure all required fields (*), at least one image, valid category and brand are configured before publishing.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4 animate-spin text-gray-900" />
                  <span>Processing...</span>
                </>
              ) : mode === 'create' ? (
                'Publish Product'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Spinner(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function InfoIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
