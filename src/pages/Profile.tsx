import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import CurrencySelector from '../components/CurrencySelector'
import ChangePasswordForm from '../components/ChangePasswordForm'

function Profile() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const settingsRef = useRef<HTMLDivElement | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [currency, setCurrency] = useState('MAD')
  const [dailyLimit, setDailyLimit] = useState('300')
  const [autoLogout, setAutoLogout] = useState('15')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setDisplayName(data.display_name ?? '')
      setCurrency(data.currency)
      setDailyLimit(data.daily_limit.toString())
      setAutoLogout(data.auto_logout ?? '15')

      setLoading(false)
    }

    fetchProfile()
  }, [user])

  /* Scroll to settings if hash exists */

  useEffect(() => {
    if (location.hash === '#settings') {
      setTimeout(() => {
        settingsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }, [location])

  async function handleSaveSettings() {
    setError('')
    setSuccess('')

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        currency,
        daily_limit: parseFloat(dailyLimit),
        auto_logout: autoLogout,
      })
      .eq('id', user!.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSuccess('Settings saved successfully')
    refreshProfile()
    setSaving(false)
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    )

    if (!confirmed) return

    const { error } = await supabase.auth.admin.deleteUser(user!.id)

    if (error) {
      setError('Could not delete account')
      return
    }

    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="min-h-screen" />

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="w-full max-w-3xl mx-auto lg:max-w-6xl space-y-6">

        {/* PROFILE SECTION */}

        <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl p-6 space-y-6">

          <h2 className="text-xl font-semibold text-[#E8CD9B]">
            Profile
          </h2>

          {/* Account Info */}

          <div className="bg-[#252525] border border-[#2e2e2e] rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white">{user?.email}</p>

            <p className="text-sm text-gray-400 mt-3">
              Member since
            </p>
            <p className="text-white font-['Platypi'] font-light">
              {new Date(user?.created_at ?? '').toLocaleDateString()}
            </p>
          </div>

          {/* Display Name */}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Display Name
            </label>

            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8CD9B]"
            />
          </div>

          <ChangePasswordForm />

        </div>

        {/* SETTINGS SECTION */}

        <div
          ref={settingsRef}
          className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-[#E8CD9B]">
            Settings
          </h2>

          <CurrencySelector
            currency={currency}
            onCurrencyChange={setCurrency}
          />

          {/* Daily Limit */}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Daily Spending Limit
            </label>

            <input
              type="number"
              value={dailyLimit}
              onChange={(e) =>
                setDailyLimit(e.target.value)
              }
              className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8CD9B] font-['Platypi'] font-light"
            />
          </div>

          {/* Auto logout */}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Auto logout timer
            </label>

            <select
              value={autoLogout}
              onChange={(e) =>
                setAutoLogout(e.target.value)
              }
              className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white"
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="never">Never</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-[#c4956a] hover:opacity-90 transition-opacity text-[#1a1108] font-semibold px-5 py-2 rounded-lg"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          {success && (
            <p className="text-green-400 text-sm">
              {success}
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

        </div>

        {/* DANGER ZONE */}

        <div className="bg-[#1e1e1e] border border-red-500/30 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-red-400">
            Danger Zone
          </h2>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg"
          >
            Delete Account
          </button>

        </div>

      </div>
    </div>
  )
}

export default Profile