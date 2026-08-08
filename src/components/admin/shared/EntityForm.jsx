'use client';

import { useState, useRef } from 'react';

// ── Slug utility ─────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Main component ───────────────────────────────────────────
export default function EntityForm({
  fields,
  action,
  method = 'POST',
  initialValues = {},
  submitLabel = 'Save',
  onSuccess,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If edit mode + slug doesn't match what auto-generation would produce,
  // it was manually customized — don't silently overwrite it
  const slugEdited = useRef(
    Boolean(
      initialValues.slug &&
      fields.some(
        f => f.type === 'slug' &&
        initialValues.slug !== slugify(initialValues[f.from] || '')
      )
    )
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const next = type === 'checkbox' ? checked : value;

    setValues(prev => {
      const updated = { ...prev, [name]: next };

      const slugField = fields.find(f => f.type === 'slug' && f.from === name);
      if (slugField && !slugEdited.current) {
        updated[slugField.name] = slugify(next);
      }

      return updated;
    });

    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function handleSlugInput(e) {
    slugEdited.current = true;
    handleChange(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Coerce number fields before sending
    const payload = { ...values };
    for (const f of fields) {
      if (f.type === 'number' && payload[f.name] !== '') {
        payload[f.name] = Number(payload[f.name]);
      }
    }

    try {
      const res = await fetch(action, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.details)) {
          const fieldErrors = {};
          for (const d of data.details) fieldErrors[d.field] = d.message;
          setErrors(fieldErrors);
        } else {
          setErrors({ _form: data.error || 'Something went wrong' });
        }
        return;
      }

      onSuccess?.(data);
    } catch {
      setErrors({ _form: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errors._form && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {fields.map(field => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name] ?? field.defaultValue ?? ''}
            error={errors[field.name]}
            onChange={field.type === 'slug' ? handleSlugInput : handleChange}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ── Field renderer ────────────────────────────────────────────

function Field({ field, value, error, onChange }) {
  const { name, label, type, placeholder, options, required } = field;
  const wide = type === 'textarea';
  const labelId = `${name}-label`;

  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label
        id={labelId}
        htmlFor={type !== 'switch' ? name : undefined}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name} name={name} value={value}
          placeholder={placeholder} onChange={onChange} rows={4}
          className={inputCls(error)}
        />
      ) : type === 'select' ? (
        <select
          id={name} name={name} value={value} onChange={onChange}
          className={inputCls(error)}
        >
          <option value="">Select...</option>
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : type === 'switch' ? (
        <Switch name={name} labelId={labelId} checked={!!value} onChange={onChange} />
      ) : (
        <input
          id={name} name={name}
          type={type === 'slug' ? 'text' : type}
          value={value} placeholder={placeholder} onChange={onChange}
          className={inputCls(error)}
        />
      )}

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ── Switch (custom toggle) ────────────────────────────────────

function Switch({ name, labelId, checked, onChange }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked}
      aria-labelledby={labelId}
      onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-gray-900' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}

// ── Shared input styling ──────────────────────────────────────

function inputCls(error) {
  const base = 'block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:border-gray-900';
  return error
    ? `${base} border-red-300 focus:ring-red-500/20 focus:border-red-500`
    : `${base} border-gray-300 focus:ring-gray-900/20`;
}