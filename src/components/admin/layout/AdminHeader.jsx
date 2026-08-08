'use client';

export default function AdminHeader({ user, onMenuToggle }) {
  const initials = user?.firstName?.[0] ?? 'A';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-6">
      {/* Left — hamburger (mobile only) */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Right — user info + logout */}
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-700 sm:block">
          {user?.firstName} {user?.lastName}
        </span>

        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-medium">
          {initials}
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
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