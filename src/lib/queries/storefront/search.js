import { getProducts } from "./products";

export async function searchProducts(params) {
  // If no search query is provided, return empty
  if (!params.q) {
    return {
      products: [],
      pagination: { 
        page: params.page, 
        limit: params.limit, 
        totalItems: 0, 
        totalPages: 0, 
        hasPreviousPage: false, 
        hasNextPage: false 
      }
    };
  }
  
  // Delegate to the main getProducts logic which already implements regex safety and pagination
  return getProducts(params);
}
