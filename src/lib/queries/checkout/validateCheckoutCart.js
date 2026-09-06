import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { resolvePricingForProducts } from '@/lib/pricing/resolveProductPricing';

export async function validateCheckoutCart(cartItems) {
  await dbConnect();
  
  const productIds = [...new Set(cartItems.map((item) => item.productId))];
  
  // Lean query for performance, selecting fields needed for checkout and pricing resolution
  const products = await Product.find({ _id: { $in: productIds } })
    .select('_id name slug price compareAtPrice images isActive stock variants brand category collections')
    .lean();

  // 1. Resolve authoritative pricing using central resolver
  const pricedProducts = await resolvePricingForProducts(products);

  const productMap = new Map(pricedProducts.map((p) => [p._id.toString(), p]));
  
  const result = {
    isValid: true,
    items: [],
    subtotal: 0,
    errors: [],
  };

  for (const item of cartItems) {
    const { productId, variantId, quantity } = item;
    const product = productMap.get(productId);
    
    // Normalize image URL
    const imageUrl = product?.images?.[0]?.url || null;

    // Default line item structure
    const lineItem = {
      productId,
      variantId,
      name: product ? product.name : "Unknown Product",
      slug: product ? product.slug : "",
      image: imageUrl,
      price: product ? (product.pricing?.effectivePrice ?? product.price) : 0, // Fallback safety
      basePrice: product ? product.price : 0,
      effectivePrice: product ? (product.pricing?.effectivePrice ?? product.price) : 0,
      hasPromotion: product ? (product.pricing?.hasPromotion || false) : false,
      promotion: product ? (product.pricing?.promotion || null) : null,
      quantity,
      size: null,
      color: null,
      error: null,
      lineTotal: 0,
    };

    if (!product) {
      lineItem.error = 'product_unavailable';
      result.isValid = false;
      result.errors.push({ productId, variantId, type: 'product_unavailable', message: 'Product is no longer available' });
      result.items.push(lineItem);
      continue;
    }

    if (!product.isActive) {
      lineItem.error = 'product_inactive';
      result.isValid = false;
      result.errors.push({ productId, variantId, type: 'product_inactive', message: 'Product is no longer active' });
      result.items.push(lineItem);
      continue;
    }

    let authoritativeStock = product.stock;

    if (variantId) {
      const variant = product.variants?.find((v) => v._id.toString() === variantId);
      if (!variant) {
        lineItem.error = 'invalid_variant_id';
        result.isValid = false;
        result.errors.push({ productId, variantId, type: 'invalid_variant_id', message: 'Selected variant is not available' });
        result.items.push(lineItem);
        continue;
      }
      authoritativeStock = variant.stock;
      lineItem.size = variant.size || null;
      lineItem.color = variant.color || null;
    } else {
      if (product.variants && product.variants.length > 0) {
        lineItem.error = 'variant_required';
        result.isValid = false;
        result.errors.push({ productId, variantId, type: 'variant_required', message: 'A variant must be selected for this product' });
        result.items.push(lineItem);
        continue;
      }
    }

    if (authoritativeStock === 0) {
      lineItem.error = 'out_of_stock';
      result.isValid = false;
      result.errors.push({ productId, variantId, type: 'out_of_stock', message: 'Item is out of stock' });
      result.items.push(lineItem);
      continue;
    }

    if (quantity > authoritativeStock) {
      lineItem.error = 'insufficient_stock';
      result.isValid = false;
      result.errors.push({ productId, variantId, type: 'insufficient_stock', message: `Only ${authoritativeStock} available` });
      result.items.push(lineItem);
      continue;
    }

    // Line item is valid
    lineItem.lineTotal = lineItem.effectivePrice * lineItem.quantity;
    result.subtotal += lineItem.lineTotal;
    result.items.push(lineItem);
  }

  return result;
}
