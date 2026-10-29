'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from './ImageUploader';
import VariantManager from './VariantManager';
import AttributesManager from './AttributesManager';
import ProductDescriptionRenderer from '@/components/storefront/product/ProductDescriptionRenderer';

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateDynamicLuxuryTemplate({ productName, brandName, categoryName }) {
  const displayName = (productName || '').trim() || 'Signature Luxury Piece';
  const displayBrand = (brandName || '').trim() || 'LUXE Maison';
  const displayCategory = (categoryName || '').trim() || 'Luxury Collection';
  const combined = `${displayName} ${displayCategory}`.toLowerCase();

  if (/(jean|denim|trouser|pant|wide-leg)/.test(combined)) {
    return `## Effortless Couture Silhouette — ${displayName}
Crafted by **${displayBrand}**, the **${displayName}** elevates modern denim into an architectural wardrobe statement. Cut with a flattering high-to-mid rise and a fluid leg profile, it balances structured tailoring with all-day comfort.

## Key Luxury Highlights:
✅ **Sculpted Tailoring**: Contoured waist and hip geometry for an elongated, flattering silhouette
🧵 **Couture-Grade Denim**: Premium heavyweight weave with a soft, breathable interior hand-feel
🎯 **Signature Detailing**: Authentic ${displayBrand} pocket embellishments and precision contrast stitching
🌿 **Artisanal Wash**: Rich, colorfast indigo treatment that retains structure wear after wear
🌟 **Bespoke Hardware**: Custom engraved metallic rivets, button closure, and reinforced belt loops

✨ Pro Tip:
Pair with a tucked silk blouse, knit cardigan, or pointed-toe heels to accentuate the leg-lengthening drape.

💼 Please note:
Turn inside out and wash cold on a gentle cycle or dry clean to preserve the artisanal wash and pocket embellishments.`;
  }

  if (/(heel|shoe|slingback|boot|loafer|pump|sandal|sneaker|footwear)/.test(combined)) {
    return `## Sculptural Elegance in Every Step — ${displayName}
Masterfully designed by **${displayBrand}**, the **${displayName}** unites runway-worthy proportions with artisanal shoemaking. Engineered for poised movement, it transitions effortlessly from daytime refinement to evening galas.

## Key Luxury Highlights:
✅ **Balanced Arch Geometry**: Anatomically engineered heel and arch support for lasting poise and stability
🧵 **Artisanal Upper Finish**: Supple, hand-selected materials paired with a smooth leather-lined interior
🎯 **Precision Fit**: Contoured toe box and secure strap engineering for a custom-tailored feel
🌿 **Cushioned Footbed**: Softened impact core that delivers comfort without sacrificing a sleek profile
🌟 **Maison Finishing**: Signature ${displayBrand} sole detailing and unmistakable couture craftsmanship

✨ Pro Tip:
If you are between half sizes or prefer extra room in the forefoot, we recommend selecting the next size up.

💼 Please note:
Includes a protective dust bag for travel and closet storage. Avoid prolonged exposure to moisture or abrasive surfaces.`;
  }

  if (/(necklace|chain|jewelry|ring|bracelet|earring|pendant|choker|hoop|horsebit)/.test(combined)) {
    return `## Radiant Maison Craftsmanship — ${displayName}
An iconic statement from **${displayBrand}**, the **${displayName}** captures light from every angle. Hand-polished links and sculptural hardware create a timeless focal point that elevates both crisp tailoring and evening ensembles.

## Key Luxury Highlights:
✅ **High-Luster Finish**: Precious metal plating protected by a tarnish-resistant mirror glaze
🧵 **Fluid Articulation**: Hand-assembled links for a balanced, comfortable drape against the skin
🎯 **Secure Engineering**: Precision clasp closure designed for effortless, confident wear
🌿 **Skin-Friendly Build**: Hypoallergenic, nickel-free construction suitable for sensitive skin
🌟 **Hallmark Authenticity**: Discreet ${displayBrand} engraving for unmistakable heritage prestige

✨ Pro Tip:
Wear solo as a statement centerpiece or layer with delicate chains and cuffs for a curated editorial look.

💼 Please note:
Store in its lined presentation pouch away from direct perfumes, lotions, and humidity to maintain mirror brilliance.`;
  }

  if (/(watch|timepiece|chronograph|quartz|automatic|band)/.test(combined)) {
    return `## Precision Horology & Timeless Prestige — ${displayName}
Engineered to the exacting standards of **${displayBrand}**, the **${displayName}** unites horological reliability with refined case architecture for a distinguished presence on the wrist.

## Key Luxury Highlights:
✅ **Calibrated Movement**: High-precision timekeeping engineered for dependable daily performance
🧵 **Crystal & Bezel**: Scratch-resistant crystal face paired with a hand-finished case bezel
🎯 **Ergonomic Wrist Fit**: Contoured lugs and adjustable strap/bracelet for tailored comfort
🌿 **Sealed Protection**: Water-resistant construction guarding against everyday splashes and humidity
🌟 **Signature Dial**: Iconic ${displayBrand} dial markers, crown detailing, and engraved caseback

✨ Pro Tip:
Adjust the clasp micro-settings so the case sits centered on your wrist bone for optimal balance.

💼 Please note:
Delivered in a signature presentation box. Keep away from strong magnetic fields and extreme temperature shocks.`;
  }

  if (/(bag|handbag|tote|crossbody|clutch|purse|hobo|satchel|messenger|bowler)/.test(combined)) {
    return `## Architectural Luxury & Everyday Versatility — ${displayName}
A signature creation by **${displayBrand}**, the **${displayName}** blends structured leatherwork with an intelligently organized interior—transitioning seamlessly from daytime appointments to evening soirées.

## Key Luxury Highlights:
✅ **Sculpted Silhouette**: Engineered to maintain its natural architectural form over years of use
🧵 **Supple Craftsmanship**: Full-bodied exterior paired with a soft protective interior lining
🎯 **Smart Organization**: Thoughtfully proportioned compartments for essentials and small leather goods
🌿 **Artisan Edge Sealing**: Reinforced base corners and hand-painted edges for lasting durability
🌟 **Polished Hardware**: Custom ${displayBrand} metallic accents and versatile carry options

✨ Pro Tip:
Store stuffed with acid-free tissue inside its protective dust bag when not in use to preserve the structured profile.

💼 Please note:
Subtle variations in grain and texture are natural hallmarks of authentic luxury materials.`;
  }

  if (/(hat|cloche|bucket|scarf|scarves|belt|sunglass|eyewear|clip|scrunchie|charm|bandana)/.test(combined)) {
    return `## Finishing Touch of Couture Distinction — ${displayName}
Thoughtfully crafted by **${displayBrand}**, the **${displayName}** brings heritage accessory artistry to your wardrobe—transforming any silhouette with unmistakable Parisian-inspired charm.

## Key Luxury Highlights:
✅ **Sculpted Proportions**: Designed for a comfortable, universally flattering profile
🧵 **Artisanal Embellishments**: Hand-applied accents and premium natural-blend materials
🎯 **Effortless Wearability**: Lightweight construction that stays securely in place throughout the day
🌿 **Breathable Interior**: Refined inner finish engineered for multi-season comfort
🌟 **Couture Detailing**: Signature ${displayBrand} finishing touches for elevated everyday styling

✨ Pro Tip:
Style with a tailored coat, cashmere knitwear, or monochrome separates to let the artisanal details take center stage.

💼 Please note:
Spot clean gently with a soft dry brush or cloth, and store flat or on a form to preserve the original shape.`;
  }

  return `## Refined Sartorial Craftsmanship — ${displayName}
Designed by **${displayBrand}**, the **${displayName}** exemplifies modern luxury in **${displayCategory}**—uniting sumptuous textile quality with an effortlessly flattering cut built for timeless appeal.

## Key Luxury Highlights:
✅ **Tailored Drape**: Flattering silhouette engineered for natural, unrestricted movement
🧵 **Sumptuous Fibers**: Breathable luxury yarns and fabrics with rich tactile depth
🎯 **Precision Construction**: Finely stitched seams, structured trims, and balanced proportions
🌿 **Lasting Quality**: Pilling-resistant and colorfast finish built for wardrobe longevity
🌟 **Maison Signature**: Authentic ${displayBrand} motif, custom hardware, and tonal couture detailing

✨ Pro Tip:
Designed to fit true to size for a classic tailored profile; select one size up if you prefer a relaxed, layered look.

💼 Please note:
Specialist dry clean or gentle cold hand-wash flat dry is recommended to protect the delicate fibers and structure.`;
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

  // Description enhanced editor state
  const [descTab, setDescTab] = useState('write');
  const descTextareaRef = useRef(null);

  function handleInsertFormat(prefix, suffix = '', defaultText = '') {
    const textarea = descTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newDescription =
      description.substring(0, start) + replacement + description.substring(end);
    setDescription(newDescription);
    if (errors.description) setErrors(prev => ({ ...prev, description: null }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  }

  function handleInsertTemplate() {
    const selectedBrandObj = brands.find(b => String(b._id) === String(brand));
    const selectedCategoryObj = categories.find(c => String(c._id) === String(category));

    const template = generateDynamicLuxuryTemplate({
      productName: name,
      brandName: selectedBrandObj?.name || '',
      categoryName: selectedCategoryObj?.name || '',
    });

    if (
      !description.trim() ||
      window.confirm('Replace current description with a tailored luxury description for this product?')
    ) {
      setDescription(template);
      if (errors.description) setErrors(prev => ({ ...prev, description: null }));
    }
  }

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

    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) errs.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
      errs.slug = 'Slug can only contain letters, numbers, and hyphens';
    }

    if (!description.trim()) errs.description = 'Description is required';
    else if (description.length > 10000) errs.description = 'Description cannot exceed 10000 characters';

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
      slug: slug.trim().toLowerCase(),
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
      let res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshRes.ok) {
          res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
      }

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

            {/* Description with Luxury Toolbar & Storefront Preview */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="inline-flex rounded-md p-0.5 bg-gray-100 border border-gray-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setDescTab('write')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        descTab === 'write' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab('preview')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        descTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Storefront Preview
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInsertTemplate}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                  title="Auto-generate a luxury description tailored to the current Product Name, Category, and Brand"
                >
                  <span>✨</span>
                  <span>Generate Luxury Description</span>
                </button>
              </div>

              {descTab === 'write' ? (
                <div>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-gray-50 border border-b-0 border-gray-300 rounded-t-lg text-xs text-gray-600">
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('**', '**', 'Keyword')}
                      className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 font-bold border border-transparent hover:border-gray-200 transition-colors"
                      title="Highlight Keyword (Bold)"
                    >
                      B (Highlight)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('## ', '\n', 'Section Heading')}
                      className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 font-semibold border border-transparent hover:border-gray-200 transition-colors"
                      title="Highlighted H2 Heading"
                    >
                      H2 Heading
                    </button>
                    <span className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('• **Feature**: ', '', 'Detail description')}
                      className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-colors"
                      title="Fancy Bullet Card"
                    >
                      • Fancy Bullet
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('✅ **Highlight**: ', '', 'Benefit description')}
                      className="px-2 py-1 rounded hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-colors"
                      title="Checkmark Feature Card"
                    >
                      ✅ Feature Card
                    </button>
                    <span className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('\n\n✨ Pro Tip:\n', '\n', 'Enter styling or sizing tip...')}
                      className="px-2 py-1 rounded hover:bg-amber-100 hover:text-amber-900 border border-transparent hover:border-amber-200 transition-colors"
                      title="Pro Tip callout box"
                    >
                      ✨ Pro Tip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormat('\n\n💼 Please note:\n', '\n', 'Enter care or packaging note...')}
                      className="px-2 py-1 rounded hover:bg-gray-200 hover:text-gray-900 border border-transparent hover:border-gray-300 transition-colors"
                      title="Please note disclaimer"
                    >
                      💼 Note
                    </button>
                  </div>

                  <textarea
                    ref={descTextareaRef}
                    id="description"
                    rows={8}
                    value={description}
                    maxLength={10000}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                    }}
                    placeholder="Paste your description with headings & bullet points, or click '✨ Generate Luxury Description'..."
                    className={`w-full rounded-b-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 font-mono ${
                      errors.description
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900'
                    }`}
                  />
                </div>
              ) : (
                <div className="w-full min-h-[220px] rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-800">
                  {description && description.trim() ? (
                    <ProductDescriptionRenderer content={description} />
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-400 italic">
                      No description content to preview. Paste your description or click &ldquo;✨ Generate Luxury Description&rdquo;.
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-600">{errors.description}</p>
                ) : (
                  <span className="text-[11px] text-gray-400">
                    Headings (## or lines ending with :) render as highlighted H2s; bullets (•, -, *, ✅) render as fancy luxury cards.
                  </span>
                )}
                <span className="text-[11px] text-gray-400">{description.length}/10000</span>
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
