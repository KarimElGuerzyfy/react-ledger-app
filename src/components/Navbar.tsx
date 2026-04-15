import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { Bell, ChevronDown, LayoutDashboard, History as HistoryIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const desktopMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(target)) {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
          setMenuOpen(false)
        }
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const avatarUrl = user?.user_metadata?.avatar_url ?? null
  const initials = (user?.email ?? 'U')[0].toUpperCase()

  return (
    <>
      {/* --- MOBILE LOGO BAR (TOP SCROLLABLE) --- */}
      <div className="md:hidden px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-center">
        <Link
          to="/dashboard"
          className="text-2xl tracking-[0.15em] select-none font-bold text-[#E8CD9B]"
          style={{ fontFamily: "'Kufam', sans-serif" }}
        >
          LEDGER
        </Link>
      </div>

      {/* --- DESKTOP NAVBAR (UNTOUCHED STYLES) --- */}
      <nav className="hidden md:block w-full px-4 py-4 md:px-8 lg:px-10 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto lg:max-w-6xl">
          <Link
            to="/dashboard"
            className="text-2xl tracking-[0.15em] select-none font-bold text-[#E8CD9B]"
            style={{ fontFamily: "'Kufam', sans-serif" }}
          >
            LEDGER
          </Link>

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

            <div ref={desktopMenuRef} className="relative flex items-center gap-3 px-2 py-2 rounded-full bg-[#021426]">
              <Bell size={16} className="text-white" />
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-6 h-6 rounded-full bg-white hover:opacity-80 transition-opacity"
              >
                <ChevronDown size={14} className="text-[#021426]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-40 rounded-xl border border-[#2e2e2e] bg-[#1e1e1e] overflow-hidden z-50">
                  <Link to="/profile#settings" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a]">
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link to="/profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20 hover:opacity-80 transition-opacity" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-[#c4956a] text-[#1a1108] hover:opacity-80 transition-opacity">
                  {initials}
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- MOBILE NAVBAR (BOTTOM FIXED) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 px-6 py-2 border-t border-white/10 bg-white/20 backdrop-blur-lg rounded-t-xl">
        <div className="flex items-center justify-between max-w-md mx-auto">
          
          {/* Dashboard Icon */}
          <NavLink to="/dashboard">
            {({ isActive }) => (
              <div className={`p-3 rounded-full transition-colors ${isActive ? 'bg-[#021426] text-[#E8CD9B]' : 'text-white'}`}>
                <LayoutDashboard size={24} />
              </div>
            )}
          </NavLink>

          {/* History Icon */}
          <NavLink to="/history">
            {({ isActive }) => (
              <div className={`p-3 rounded-full transition-colors ${isActive ? 'bg-[#021426] text-[#E8CD9B]' : 'text-white'}`}>
                <HistoryIcon size={24} />
              </div>
            )}
          </NavLink>

          {/* Chevron (Menu Toggle) */}
          <div ref={mobileMenuRef} className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white transition-opacity"
            >
              <ChevronDown size={20} className="text-[#021426]" />
            </button>

            {menuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-16 w-40 rounded-xl border border-[#2e2e2e] bg-[#1e1e1e] overflow-hidden z-50">
                <Link to="/profile#settings" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                  Settings
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2a]">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Bell Icon */}
          <div className="p-3 text-white">
            <Bell size={24} />
          </div>

          {/* Profile (Far Right) */}
          <Link to="/profile">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-[#c4956a] text-[#1a1108]">
                {initials}
              </div>
            )}
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar