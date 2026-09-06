import { resolvePricingForProduct } from './src/lib/pricing/resolveProductPricing.js';

const now = Date.now();
const future = now + 10000;
const past = now - 10000;

function runCase(name, product, activePromotions, expectedEffective) {
  const result = resolvePricingForProduct(product, activePromotions, now);
  const passed = result.effectivePrice === expectedEffective;
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: Expected ${expectedEffective}, Got ${result.effectivePrice}`);
  if (!passed) console.log(JSON.stringify({ result, product, activePromotions }, null, 2));
}

// Mock active promotions array structure:
// { startsAt, endsAt, targetType, targetId, discountType, discountValue, name, _id }

// Case 1: No promotion
runCase("Case 1 - No Promo", { price: 1000, _id: "1" }, [], 1000);

// Case 2: Percentage
runCase("Case 2 - Percentage", { price: 1000, _id: "1" }, [
  { _id: 'p1', targetType: 'PRODUCT', targetId: '1', discountType: 'PERCENTAGE', discountValue: 15 }
], 850);

// Case 3: Fixed Amount
runCase("Case 3 - Fixed Amount", { price: 1000, _id: "1" }, [
  { _id: 'p1', targetType: 'PRODUCT', targetId: '1', discountType: 'FIXED_AMOUNT', discountValue: 200 }
], 800);

// Case 4: Fixed Discount Above Price
runCase("Case 4 - Above Price", { price: 100, _id: "1" }, [
  { _id: 'p1', targetType: 'PRODUCT', targetId: '1', discountType: 'FIXED_AMOUNT', discountValue: 150 }
], 0);

// Case 5: Multiple Promotions
runCase("Case 5 - Multiple Promos", { price: 1000, _id: "1", brand: "b1", category: "c1" }, [
  { _id: 'p1', targetType: 'BRAND', targetId: 'b1', discountType: 'PERCENTAGE', discountValue: 10 }, // 900
  { _id: 'p2', targetType: 'CATEGORY', targetId: 'c1', discountType: 'PERCENTAGE', discountValue: 20 }, // 800
  { _id: 'p3', targetType: 'PRODUCT', targetId: '1', discountType: 'FIXED_AMOUNT', discountValue: 300 } // 700
], 700);

// Case 6: Scheduled Future Promotion
runCase("Case 6 - Future", { price: 1000, _id: "1" }, [
  { _id: 'p1', targetType: 'PRODUCT', targetId: '1', discountType: 'PERCENTAGE', discountValue: 15, startsAt: future }
], 1000);

// Case 7: Expired Promotion
runCase("Case 7 - Expired", { price: 1000, _id: "1" }, [
  { _id: 'p1', targetType: 'PRODUCT', targetId: '1', discountType: 'PERCENTAGE', discountValue: 15, endsAt: past }
], 1000);

// Case 8: Disabled Promotion
// ActivePromotions is already filtered for isActive=true by the query. 
// We mock this by not passing it.
runCase("Case 8 - Disabled", { price: 1000, _id: "1" }, [], 1000);

// Case 9: Wrong Brand
runCase("Case 9 - Wrong Brand", { price: 1000, _id: "1", brand: "b2" }, [
  { _id: 'p1', targetType: 'BRAND', targetId: 'b1', discountType: 'PERCENTAGE', discountValue: 15 }
], 1000);

// Case 10: Exact Category only
runCase("Case 10 - Wrong Category", { price: 1000, _id: "1", category: "c2" }, [
  { _id: 'p1', targetType: 'CATEGORY', targetId: 'c1', discountType: 'PERCENTAGE', discountValue: 15 }
], 1000);

// Case 11: Collection
runCase("Case 11 - Collection match", { price: 1000, _id: "1", collections: ["col1", "col2"] }, [
  { _id: 'p1', targetType: 'COLLECTION', targetId: 'col2', discountType: 'PERCENTAGE', discountValue: 15 }
], 850);

runCase("Case 11b - Collection mismatch", { price: 1000, _id: "1", collections: ["col1"] }, [
  { _id: 'p1', targetType: 'COLLECTION', targetId: 'col2', discountType: 'PERCENTAGE', discountValue: 15 }
], 1000);
