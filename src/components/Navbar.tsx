import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()

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

      <nav className="w-full px-8 py-4  border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between w-full lg:max-w-6xl mx-auto">

          {/* Logo */}
          <span
            className="text-2xl tracking-[0.15em] select-none font-bold text-[#E8CD9B]"
            style={{ fontFamily: "'Kufam', sans-serif" }}
          >
            LEDGER
          </span>

          {/* Right side */}
          <div className="flex items-center gap-5">

            <NavLink
              to="/dashboard"
              className="text-sm transition-colors duration-150"
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : '#888888',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/history"
              className="text-sm transition-colors duration-150"
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : '#888888',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              History
            </NavLink>

            {/* Bell + chevron pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#2a2a2a]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5A4.5 4.5 0 0 0 3.5 6v2.5L2 10h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z"
                  stroke="#aaaaaa"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M6.5 10.5a1.5 1.5 0 0 0 3 0" stroke="#aaaaaa" strokeWidth="1.2" />
              </svg>

              <button
                onClick={handleLogout}
                className="flex items-center hover:opacity-70 transition-opacity"
                title="Sign out"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5l4 4 4-4"
                    stroke="#aaaaaa"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-[#2e2e2e]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-[#c4956a] text-[#1a1108] border-2 border-[#2e2e2e]">
                {initials}
              </div>
            )}

          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar