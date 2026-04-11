import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-stone-50 border-b border-stone-200 px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-2xl font-semibold text-stone-900">Ledger</span>
        <div className="flex gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`
            }
          >
            Profile
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar