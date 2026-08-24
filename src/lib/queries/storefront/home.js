import { getNewArrivals } from "./products";
import { getCategories } from "./categories";
import { getActiveCollections } from "./collections";

export async function getHomepageData() {
  // Use Promise.all to fetch independent bounded datasets in parallel
  const [newArrivals, categories, collections] = await Promise.all([
    getNewArrivals(8),
    getCategories(),
    getActiveCollections()
  ]);
  
  // Note: The schema does not support explicit "Featured" boolean flags.
  // We return active data and the UI can decide how to render it (e.g. slicing the first few).
  // This orchestration keeps the database reads safe and bounded.
  
  return {
    newArrivals,
    categories: categories.slice(0, 6), // Bound to 6 for homepage display
    collections: collections.slice(0, 3) // Bound to 3 for homepage display
  };
}
