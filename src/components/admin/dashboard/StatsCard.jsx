export default function StatsCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
      {Icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}