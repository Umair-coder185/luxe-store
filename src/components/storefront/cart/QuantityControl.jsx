export default function QuantityControl({ quantity, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center border border-neutral-200 rounded-sm overflow-hidden w-28">
      <button
        onClick={onDecrement}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
      <span className="flex-1 text-center text-sm font-medium text-neutral-900 tabular-nums">
        {quantity}
      </span>
      
      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
}
