'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NavigationForm({ categories, initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(
    initialData || {
      label: '',
      href: '',
      type: 'LINK',
      order: 0,
      isVisible: true,
      sections: [],
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        { label: '', sourceType: 'CATEGORY_BRANDS', category: '', links: [] },
      ],
    });
  };

  const removeSection = (index) => {
    const newSections = [...formData.sections];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const newSections = [...formData.sections];
    newSections[index][name] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const addStaticLink = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].links.push({ label: '', href: '' });
    setFormData({ ...formData, sections: newSections });
  };

  const removeStaticLink = (sectionIndex, linkIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].links.splice(linkIndex, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const handleStaticLinkChange = (sectionIndex, linkIndex, e) => {
    const { name, value } = e.target;
    const newSections = [...formData.sections];
    newSections[sectionIndex].links[linkIndex][name] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/admin/navigation/${initialData._id}` : '/api/admin/navigation';
      const method = initialData ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        order: Number(formData.order)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save navigation item');
      }

      router.push('/admin/navigation');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Helper to build hierarchy display for category selector
  const buildCategoryHierarchy = (catId, cats) => {
    const cat = cats.find(c => c._id === catId);
    if (!cat) return '';
    if (cat.parent) {
      return buildCategoryHierarchy(cat.parent, cats) + ' > ' + cat.name;
    }
    return cat.name;
  };

  const categoryOptions = categories.map(c => ({
    id: c._id,
    path: buildCategoryHierarchy(c._id, categories)
  })).sort((a, b) => a.path.localeCompare(b.path));

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label (Required)</label>
          <input
            id="label"
            name="label"
            type="text"
            required
            value={formData.label}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g. WOMEN"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Item Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="LINK">Standard Link</option>
            <option value="MEGA_MENU">Mega Menu</option>
          </select>
        </div>

        {formData.type === 'LINK' && (
          <div className="space-y-2">
            <label htmlFor="href" className="block text-sm font-medium text-gray-700">URL Path (Required)</label>
            <input
              id="href"
              name="href"
              type="text"
              required={formData.type === 'LINK'}
              value={formData.href || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g. /women"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input
            id="order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-2 md:col-span-2 flex items-center gap-2 mt-4">
          <input
            id="isVisible"
            name="isVisible"
            type="checkbox"
            checked={formData.isVisible}
            onChange={handleChange}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">Visible to Customers</label>
        </div>
      </div>

      {formData.type === 'MEGA_MENU' && (
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Mega Menu Sections</h3>
              <p className="text-sm text-gray-500">Configure the columns that appear when hovering over this item.</p>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Section {sectionIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Section
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Section Title</label>
                    <input
                      name="label"
                      type="text"
                      required
                      value={section.label}
                      onChange={(e) => handleSectionChange(sectionIndex, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="e.g. WOMEN'S HANDBAG BRANDS"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Source Type</label>
                    <select
                      name="sourceType"
                      value={section.sourceType}
                      onChange={(e) => handleSectionChange(sectionIndex, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="CATEGORY_BRANDS">Dynamic Brands for Category</option>
                      <option value="STATIC_LINKS">Static Links</option>
                    </select>
                  </div>
                </div>

                {section.sourceType === 'CATEGORY_BRANDS' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Target Category</label>
                    <select
                      name="category"
                      required
                      value={section.category || ''}
                      onChange={(e) => handleSectionChange(sectionIndex, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">Select Category...</option>
                      {categoryOptions.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.path}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Brands will be automatically derived from active products in this category.</p>
                  </div>
                )}

                {section.sourceType === 'STATIC_LINKS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Links</label>
                      <button
                        type="button"
                        onClick={() => addStaticLink(sectionIndex)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Link
                      </button>
                    </div>
                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          name="label"
                          required
                          value={link.label}
                          onChange={(e) => handleStaticLinkChange(sectionIndex, linkIndex, e)}
                          placeholder="Label (e.g. NEW ARRIVALS)"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          name="href"
                          required
                          value={link.href}
                          onChange={(e) => handleStaticLinkChange(sectionIndex, linkIndex, e)}
                          placeholder="Path (e.g. /new-arrivals)"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeStaticLink(sectionIndex, linkIndex)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {formData.sections.length === 0 && (
              <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-xl border-dashed">
                <p className="text-sm text-gray-500">No sections added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

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
          {loading ? 'Saving...' : initialData ? 'Update Menu Item' : 'Create Menu Item'}
        </button>
      </div>
    </form>
  );
}
