export default function StatsCard({ label, value, icon: Icon, colorTheme = "indigo" }) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
    blue: "bg-blue-500/10 text-blue-600 border-blue-100",
    purple: "bg-purple-500/10 text-purple-600 border-purple-100",
    amber: "bg-amber-500/10 text-amber-600 border-amber-100",
    rose: "bg-rose-500/10 text-rose-600 border-rose-100",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    cyan: "bg-cyan-500/10 text-cyan-600 border-cyan-100",
  };

  const themeClasses = colorMap[colorTheme] || colorMap.indigo;

  return (
    <div className="group flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-200">
      {Icon && (
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${themeClasses}`}>
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-800 tracking-tight truncate group-hover:text-black transition-colors">{value}</p>
      </div>
    </div>
  );
}