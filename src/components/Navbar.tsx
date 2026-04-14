import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { Bell, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const avatarUrl = user?.user_metadata?.avatar_url ?? null
  const initials = (user?.email ?? 'U')[0].toUpperCase()

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Kufam:wght@700&display=swap"
        rel="stylesheet"
      />

      <nav className="w-full px-4 py-4 md:px-8 lg:px-10 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto lg:max-w-6xl">

          {/* Logo → links to dashboard */}
          <Link
            to="/dashboard"
            className="text-2xl tracking-[0.15em] select-none font-bold text-[#E8CD9B]"
            style={{ fontFamily: "'Kufam', sans-serif" }}
          >
            LEDGER
          </Link>

          {/* Outer glossy pill */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-xl border border-white/10 bg-white/20 backdrop-blur-lg">

            <NavLink
              to="/dashboard"
              className="text-sm transition-colors duration-150"
              style={({ isActive }) => ({
                color: isActive ? '#E8CD9B' : '#ffffff',
                fontWeight: isActive ? 600 : 300,
              })}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/history"
              className="text-sm transition-colors duration-150"
              style={({ isActive }) => ({
                color: isActive ? '#E8CD9B' : '#ffffff',
                fontWeight: isActive ? 600 : 300,
              })}
            >
              History
            </NavLink>

            {/* Inner dark pill — bell + chevron menu */}
            <div className="relative flex items-center gap-3 px-2 py-2 rounded-full bg-[#021426]">
              <Bell size={16} className="text-white" />
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white hover:opacity-80 transition-opacity"
              >
                <ChevronDown size={14} className="text-[#021426]" />
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div className="absolute right-0 top-12 w-40 rounded-xl border border-[#2e2e2e] bg-[#1e1e1e] overflow-hidden z-50">
                  <Link
                    to="/profile#settings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Avatar → links to profile */}
            <Link to="/profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20 hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-[#c4956a] text-[#1a1108] hover:opacity-80 transition-opacity">
                  {initials}
                </div>
              )}
            </Link>

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar