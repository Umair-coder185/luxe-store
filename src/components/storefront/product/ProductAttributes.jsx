export default function ProductAttributes({ attributes }) {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-neutral-200">
      <h3 className="text-lg font-medium text-neutral-900 mb-6">Details</h3>
      <dl className="space-y-4 text-sm">
        {Object.entries(attributes).map(([key, value]) => {
          if (!value) return null;
          return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-neutral-100 pb-4">
              <dt className="font-medium text-neutral-900 capitalize">{key}</dt>
              <dd className="sm:col-span-2 text-neutral-600">{value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
