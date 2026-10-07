'use client';

export default function AdminHeader({ user, onMenuToggle }) {
  const initials = user?.firstName?.[0] ?? 'A';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 lg:px-8 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      {/* Left — hamburger (mobile only) */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Right — user info + logout */}
      <div className="flex items-center gap-5 ml-auto">
        <span className="hidden text-sm font-semibold text-slate-700 sm:block">
          {user?.firstName} {user?.lastName}
        </span>

        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-md shadow-indigo-200">
          {initials}
        </div>

        <form action="/api/auth/logout" method="POST" className="flex items-center border-l border-gray-200/50 pl-5 ml-2">
          <button
            type="submit"
            className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}