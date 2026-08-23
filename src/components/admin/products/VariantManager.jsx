'use client';

import { useMemo } from 'react';

export default function VariantManager({
  variants = [],
  onChange,
  error: externalError,
}) {
  // Find duplicate SKUs across variants
  const duplicateSkus = useMemo(() => {
    const skuCounts = {};
    const duplicates = new Set();

    variants.forEach(v => {
      const sku = (v.sku || '').trim().toUpperCase();
      if (sku) {
        skuCounts[sku] = (skuCounts[sku] || 0) + 1;
        if (skuCounts[sku] > 1) {
          duplicates.add(sku);
        }
      }
    });

    return duplicates;
  }, [variants]);

  const totalVariantStock = useMemo(() => {
    return variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);
  }, [variants]);

  function handleAddVariant() {
    onChange([
      ...variants,
      {
        size: '',
        color: '',
        sku: '',
        stock: 0,
      },
    ]);
  }

  function handleUpdateVariant(index, field, value) {
    const updated = variants.map((v, i) => {
      if (i !== index) return v;
      return {
        ...v,
        [field]: field === 'stock' ? Math.max(0, parseInt(value, 10) || 0) : value,
      };
    });
    onChange(updated);
  }

  function handleRemoveVariant(index) {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Variants
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Add options like size and color. Total product stock will be automatically calculated from variant stocks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Add Variant
        </button>
      </div>

      {externalError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {externalError}
        </div>
      )}

      {duplicateSkus.size > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertIcon className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Duplicate SKU detected: <strong>{[...duplicateSkus].join(', ')}</strong>. Every variant SKU must be unique.
          </span>
        </div>
      )}

      {variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            No variants configured. Product will use standard standalone stock.
          </p>
          <button
            type="button"
            onClick={handleAddVariant}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
          >
            + Add first variant
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2.5">Size</th>
                  <th className="px-3 py-2.5">Color</th>
                  <th className="px-3 py-2.5">SKU</th>
                  <th className="px-3 py-2.5 w-28">Stock</th>
                  <th className="px-3 py-2.5 text-right w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {variants.map((variant, index) => {
                  const skuTrimmed = (variant.sku || '').trim().toUpperCase();
                  const isDuplicateSku = skuTrimmed && duplicateSkus.has(skuTrimmed);

                  return (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="e.g. S, M, 42"
                          value={variant.size || ''}
                          onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="e.g. Black, Navy"
                          value={variant.color || ''}
                          onChange={(e) => handleUpdateVariant(index, 'color', e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div>
                          <input
                            type="text"
                            placeholder="e.g. LUX-BLK-S"
                            value={variant.sku || ''}
                            onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                            className={`w-full rounded-md border px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 ${
                              isDuplicateSku
                                ? 'border-red-400 focus:ring-red-500 bg-red-50/40 text-red-900'
                                : 'border-gray-200 focus:ring-gray-900'
                            }`}
                          />
                          {isDuplicateSku && (
                            <p className="text-[10px] text-red-600 mt-0.5">Duplicate SKU</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={variant.stock ?? 0}
                          onChange={(e) => handleUpdateVariant(index, 'stock', e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove variant"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-gray-600">
            <span>
              Total Variants: <strong>{variants.length}</strong>
            </span>
            <span>
              Combined Variant Stock: <strong>{totalVariantStock} units</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
