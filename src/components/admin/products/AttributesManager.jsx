'use client';

import { useState, useEffect } from 'react';

export default function AttributesManager({
  attributes = {},
  onChange,
  error,
}) {
  // Convert object { Material: 'Cotton', Care: 'Dry clean' } to [{ key, value, id }]
  const [items, setItems] = useState(() => {
    if (!attributes || typeof attributes !== 'object') return [];
    return Object.entries(attributes).map(([key, value], idx) => ({
      id: `${Date.now()}-${idx}-${Math.random()}`,
      key,
      value: String(value ?? ''),
    }));
  });

  // Sync back to parent object when items change
  function notifyChange(newItems) {
    setItems(newItems);
    const obj = {};
    for (const item of newItems) {
      const k = item.key.trim();
      if (k) {
        obj[k] = item.value.trim();
      }
    }
    onChange(obj);
  }

  function handleAdd() {
    notifyChange([
      ...items,
      {
        id: `${Date.now()}-${Math.random()}`,
        key: '',
        value: '',
      },
    ]);
  }

  function handleUpdate(index, field, val) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: val };
    });
    notifyChange(updated);
  }

  function handleRemove(index) {
    const updated = items.filter((_, i) => i !== index);
    notifyChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Specifications / Attributes
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Key-value properties for display (e.g. Material, Care Instructions, Origin, Fit).
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Add Attribute
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-6 text-center">
          <p className="text-xs text-gray-500 font-medium">
            No specifications added yet.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-900 hover:underline"
          >
            + Add specification
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Attribute (e.g. Material)"
                value={item.key}
                onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                className="w-1/3 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <input
                type="text"
                placeholder="Value (e.g. 100% Cashmere)"
                value={item.value}
                onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Remove attribute"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
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
