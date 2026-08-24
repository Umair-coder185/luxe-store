export default function CatalogEmptyState({ isSearch, query }) {
  return (
    <div className="py-24 text-center px-4">
      <h2 className="text-2xl font-light text-neutral-900 mb-4">
        {isSearch ? "No Results Found" : "No Products Found"}
      </h2>
      <p className="text-neutral-500 max-w-md mx-auto mb-8">
        {isSearch 
          ? (query ? `We couldn't find any products matching "${query}". Try checking your spelling or using more general terms.` : "Please enter a search term.")
          : "We couldn't find any products matching your current filters. Try adjusting them or clearing all filters to see more."}
      </p>
      {isSearch ? (
        <a href="/products" className="inline-block px-6 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors">
          Shop All Products
        </a>
      ) : (
        <a href="/products" className="inline-block px-6 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors">
          Clear All Filters
        </a>
      )}
    </div>
  );
}
