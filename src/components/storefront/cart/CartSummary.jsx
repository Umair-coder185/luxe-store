export default function CartSummary({ subtotal, itemCount }) {
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  return (
    <div className="bg-neutral-50 p-6 sm:p-8">
      <h2 className="text-lg font-medium text-neutral-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-base text-neutral-600">
          <span>Subtotal {itemCount > 0 ? `(${itemCount} item${itemCount > 1 ? 's' : ''})` : ""}</span>
          <span>{formattedSubtotal}</span>
        </div>
        
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 mb-2">
            Shipping and taxes are calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
