export function validateCatalogParams(params) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(params.limit, 10) || 24));
  
  const sort = ["newest", "price-asc", "price-desc", "name-asc"].includes(params.sort) 
    ? params.sort 
    : "newest";
    
  const q = typeof params.q === "string" && params.q.trim() !== "" ? params.q.trim().substring(0, 100) : null;
  const category = typeof params.category === "string" && params.category.trim() !== "" ? params.category.trim() : null;
  const brand = typeof params.brand === "string" && params.brand.trim() !== "" ? params.brand.trim() : null;
  const collection = typeof params.collection === "string" && params.collection.trim() !== "" ? params.collection.trim() : null;
  const availability = params.availability === "in-stock" ? "in-stock" : null;
  
  let minPrice = parseFloat(params.minPrice);
  let maxPrice = parseFloat(params.maxPrice);
  
  minPrice = !isNaN(minPrice) && minPrice >= 0 ? minPrice : null;
  maxPrice = !isNaN(maxPrice) && maxPrice >= 0 ? maxPrice : null;
  
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    // If invalid range, ignore both safely
    minPrice = null;
    maxPrice = null;
  }
  
  return {
    page,
    limit,
    sort,
    q,
    category,
    brand,
    collection,
    availability,
    minPrice,
    maxPrice,
  };
}
