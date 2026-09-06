'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PromotionForm({ mode = 'create', initialData = {}, products = [], brands = [], categories = [], collections = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    discountType: initialData.discountType || 'PERCENTAGE',
    discountValue: initialData.discountValue || '',
    targetType: initialData.targetType || 'PRODUCT',
    targetId: initialData.targetId || '',
    startsAt: initialData.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : '',
    endsAt: initialData.endsAt ? new Date(initialData.endsAt).toISOString().slice(0, 16) : '',
    isActive: initialData.isActive !== undefined ? initialData.isActive : false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // When target type changes, reset the targetId
    if (name === 'targetType') {
      setFormData(prev => ({
        ...prev,
        targetType: value,
        targetId: ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' ? `/api/admin/promotions/${initialData._id}` : '/api/admin/promotions';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.details && Array.isArray(json.details)) {
          throw new Error(json.details.map(d => d.message).join(', '));
        }
        throw new Error(json.error || 'Failed to save promotion');
      }

      router.push('/admin/promotions');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderTargetOptions = () => {
    switch (formData.targetType) {
      case 'PRODUCT':
        return products.map(p => <option key={p._id} value={p._id}>{p.name} {p.price ? `($${p.price})` : ''}</option>);
      case 'BRAND':
        return brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>);
      case 'CATEGORY':
        return categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>);
      case 'COLLECTION':
        return collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>);
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          <p className="font-semibold mb-1">Could not save promotion</p>
          <p>{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Promotion Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Promotion Name <span className="text-red-500">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g. Summer Sale 2026"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Internal or customer-facing description..."
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Discount</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type <span className="text-red-500">*</span></label>
            <select
              id="discountType"
              name="discountType"
              required
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Discount Value <span className="text-red-500">*</span></label>
            <div className="relative">
              {formData.discountType === 'FIXED_AMOUNT' && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>}
              <input
                id="discountValue"
                name="discountValue"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.discountValue}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${formData.discountType === 'FIXED_AMOUNT' ? 'pl-8' : ''}`}
                placeholder="0.00"
              />
              {formData.discountType === 'PERCENTAGE' && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.discountType === 'PERCENTAGE' ? 'Enter a value between 0.01 and 100.' : 'Enter a monetary amount.'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Target Scope</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="targetType" className="block text-sm font-medium text-gray-700">Target Type <span className="text-red-500">*</span></label>
            <select
              id="targetType"
              name="targetType"
              required
              value={formData.targetType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="PRODUCT">Single Product</option>
              <option value="BRAND">Entire Brand</option>
              <option value="CATEGORY">Entire Category</option>
              <option value="COLLECTION">Entire Collection</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="targetId" className="block text-sm font-medium text-gray-700">Select Target <span className="text-red-500">*</span></label>
            <select
              id="targetId"
              name="targetId"
              required
              value={formData.targetId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">-- Choose {formData.targetType.toLowerCase()} --</option>
              {renderTargetOptions()}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Schedule & Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              value={formData.startsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700">End Date & Time</label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              value={formData.endsAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-2 md:col-span-2 flex items-center gap-2 mt-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Promotion is Enabled</label>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Saving...' : mode === 'edit' ? 'Update Promotion' : 'Create Promotion'}
        </button>
      </div>
    </form>
  );
}
