import { Outlet, NavLink } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-svh flex flex-col">
      {/* Glass header */}
      <header
        style={{
          background: 'rgba(23, 0, 34, 0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
        className="sticky top-0 z-30"
      >
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <span
              className="font-display font-black tracking-tight text-white"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}
            >
              Tasks &amp; Alerts
            </span>
            <span
              className="ml-2 text-xs font-bold tracking-widest uppercase"
              style={{ color: 'rgba(227,204,255,0.55)' }}
            >
              local-first
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/entries"
              className={({ isActive }) =>
                isActive
                  ? 'btn-primary !text-xs !min-h-[34px] !px-4'
                  : 'btn-ghost !text-xs !min-h-[34px] !px-4 !text-[rgba(227,204,255,0.7)] !bg-[rgba(255,255,255,0.06)] !border-[rgba(255,255,255,0.12)]'
              }
            >
              My Entries
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer
        className="text-center py-5"
        style={{
          fontSize: '0.74rem',
          letterSpacing: '0.1em',
          color: 'rgba(227,204,255,0.35)',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Tasks &amp; Alerts &middot; offline-first &middot; v0.1
      </footer>
    </div>
  );
}
