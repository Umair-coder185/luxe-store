import { getNewArrivals, getHomepageHandbags, getHeroSpecialOffers } from "./products";
import { getHomepageCategories } from "./categories";
import { getHomepageBrands } from "./brands";
import { getActiveCollections } from "./collections";

export async function getHomepageData() {
  // Use Promise.all to fetch independent bounded datasets in parallel
  const [newArrivals, categories, collections, handbags, brands, heroOffers] = await Promise.all([
    getNewArrivals(8),
    getHomepageCategories(6),
    getActiveCollections(),
    getHomepageHandbags(4),
    getHomepageBrands(8),
    getHeroSpecialOffers(5)
  ]);
  
  // Note: The schema does not support explicit "Featured" boolean flags.
  // We return active data and the UI can decide how to render it (e.g. slicing the first few).
  // This orchestration keeps the database reads safe and bounded.
  
  return {
    newArrivals,
    categories, // Bounded to 6 categories with latest products
    collections: collections.slice(0, 3), // Bound to 3 for homepage display
    handbags,
    brands,
    heroOffers
  };
}
