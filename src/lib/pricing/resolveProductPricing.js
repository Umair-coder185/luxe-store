import { unstable_cache } from 'next/cache';
import dbConnect from '@/lib/db';
import Promotion from '@/models/Promotion';

/**
 * Fetch all currently eligible promotions with a time-bound cache (e.g. 60 seconds)
 * to ensure scheduled activations/expirations don't remain stale indefinitely.
 * Also invalidated by the 'promotions' tag on Admin mutations.
 */
const getActivePromotions = unstable_cache(
  async () => {
    await dbConnect();
    
    // We fetch promotions that are active, and have valid start/end bounds.
    // Notice we do NOT filter by 'now' in the database query if we cache it,
    // because 'now' changes. Instead, we fetch all active promotions that 
    // MIGHT be valid (e.g. active=true), and filter exactly by 'now' during resolution.
    const promotions = await Promotion.find({ isActive: true }).lean();
    
    return promotions.map(p => ({
      ...p,
      _id: p._id.toString(),
      targetId: p.targetId.toString(),
      startsAt: p.startsAt ? p.startsAt.getTime() : null,
      endsAt: p.endsAt ? p.endsAt.getTime() : null,
      discountValue: Number(p.discountValue)
    }));
  },
  ['active-promotions'],
  { tags: ['promotions'], revalidate: 60 }
);

/**
 * Calculates the effective price given a base price and a promotion.
 */
function calculateDiscount(basePrice, promotion) {
  if (promotion.discountType === 'PERCENTAGE') {
    const discountAmount = (basePrice * promotion.discountValue) / 100;
    return Math.max(0, basePrice - discountAmount);
  } else if (promotion.discountType === 'FIXED_AMOUNT') {
    return Math.max(0, basePrice - promotion.discountValue);
  }
  return basePrice;
}

/**
 * Resolves the lowest possible price for a single product from a batch of active promotions.
 */
export function resolvePricingForProduct(product, activePromotions, nowTimestamp = Date.now()) {
  const basePrice = Number(product.price);
  
  if (!activePromotions || activePromotions.length === 0) {
    return {
      basePrice,
      effectivePrice: basePrice,
      hasPromotion: false,
      promotion: null
    };
  }

  // Filter promotions that are active AT THIS EXACT MOMENT
  const currentlyValid = activePromotions.filter(p => {
    if (p.startsAt && p.startsAt > nowTimestamp) return false;
    if (p.endsAt && p.endsAt < nowTimestamp) return false;
    
    // Check target eligibility
    if (p.targetType === 'PRODUCT' && p.targetId === product._id?.toString()) return true;
    if (p.targetType === 'BRAND' && p.targetId === product.brand?.toString()) return true;
    if (p.targetType === 'CATEGORY' && p.targetId === product.category?.toString()) return true;
    if (p.targetType === 'COLLECTION' && Array.isArray(product.collections) && product.collections.some(c => c.toString() === p.targetId)) return true;
    
    // Wait, in serialized docs, product._id is often already string, product.category can be string or ObjectId or populated object.
    // Let's handle populated objects vs plain IDs safely:
    const prodId = typeof product._id === 'object' ? product._id.toString() : product._id;
    const prodBrand = product.brand && typeof product.brand === 'object' ? product.brand._id?.toString() : product.brand?.toString();
    const prodCategory = product.category && typeof product.category === 'object' ? product.category._id?.toString() : product.category?.toString();
    
    if (p.targetType === 'PRODUCT' && p.targetId === prodId) return true;
    if (p.targetType === 'BRAND' && p.targetId === prodBrand) return true;
    if (p.targetType === 'CATEGORY' && p.targetId === prodCategory) return true;
    if (p.targetType === 'COLLECTION' && Array.isArray(product.collections)) {
      return product.collections.some(c => {
        const colId = typeof c === 'object' ? c._id?.toString() : c.toString();
        return colId === p.targetId;
      });
    }
    
    return false;
  });

  if (currentlyValid.length === 0) {
    return {
      basePrice,
      effectivePrice: basePrice,
      hasPromotion: false,
      promotion: null
    };
  }

  // Find the best discount
  let bestEffectivePrice = basePrice;
  let bestPromotion = null;

  for (const promo of currentlyValid) {
    const discountedPrice = calculateDiscount(basePrice, promo);
    
    // BEST DISCOUNT WINS
    // Tie-breaker: earliest startsAt, then ID string comparison
    if (discountedPrice < bestEffectivePrice) {
      bestEffectivePrice = discountedPrice;
      bestPromotion = promo;
    } else if (discountedPrice === bestEffectivePrice && bestPromotion) {
      // Tie breaker logic
      const promoStart = promo.startsAt || 0;
      const bestStart = bestPromotion.startsAt || 0;
      if (promoStart < bestStart) {
        bestPromotion = promo;
      } else if (promoStart === bestStart) {
        if (promo._id < bestPromotion._id) {
          bestPromotion = promo;
        }
      }
    }
  }

  // Rounding correctly for monetary display
  const roundedEffectivePrice = Number(bestEffectivePrice.toFixed(2));

  if (!bestPromotion || roundedEffectivePrice >= basePrice) {
    return {
      basePrice,
      effectivePrice: basePrice,
      hasPromotion: false,
      promotion: null
    };
  }

  return {
    basePrice,
    effectivePrice: roundedEffectivePrice,
    hasPromotion: true,
    promotion: {
      id: bestPromotion._id,
      name: bestPromotion.name,
      discountType: bestPromotion.discountType,
      discountValue: bestPromotion.discountValue
    }
  };
}

/**
 * Resolves pricing for a batch of products efficiently.
 */
export async function resolvePricingForProducts(products) {
  if (!products || products.length === 0) return products;
  
  const activePromotions = await getActivePromotions();
  const now = Date.now();

  return products.map(product => {
    const pricing = resolvePricingForProduct(product, activePromotions, now);
    
    // We embed the pricing DTO directly into the product to avoid changing the entire Storefront architecture
    return {
      ...product,
      pricing
    };
  });
}

/**
 * Resolves pricing for a single product efficiently.
 */
export async function resolvePricingForSingleProduct(product) {
  if (!product) return null;
  const activePromotions = await getActivePromotions();
  const pricing = resolvePricingForProduct(product, activePromotions, Date.now());
  return { ...product, pricing };
}
