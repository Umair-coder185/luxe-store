import SortDropdown from "./SortDropdown";
import MobileFilterWrapper from "./MobileFilterWrapper";

export default function CatalogToolbar({ totalItems, currentParams, filterChildren }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-neutral-200 mb-6">
      <div className="text-sm text-neutral-500 mb-4 sm:mb-0">
        {totalItems === 1 ? "1 product" : `${totalItems} products`}
      </div>
      
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
        {filterChildren && (
          <MobileFilterWrapper>
            {filterChildren}
          </MobileFilterWrapper>
        )}
        <SortDropdown currentSort={currentParams.sort} />
      </div>
    </div>
  );
}
