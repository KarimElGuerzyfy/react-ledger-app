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
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [autoLogout, setAutoLogout] = useState('15')
 
  const [loading, setLoading] = useState(!!user)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
 
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
 
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
      setCurrency(data.currency ?? 'MAD')
      setDailyLimit(data.daily_limit?.toString() ?? '300')
      setMonthlyLimit(data.monthly_limit?.toString() ?? '')
      setAutoLogout(data.auto_logout ?? '15')
      setLoading(false)
    }
 
    fetchProfile()
  }, [user])
 
  useEffect(() => {
    if (location.hash === '#settings') {
      const scrollToSettings = () => {
        if (settingsRef.current) {
          settingsRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        } else {
          requestAnimationFrame(scrollToSettings)
        }
      }
      requestAnimationFrame(scrollToSettings)
    }
  }, [location])
 
  async function handleSaveSettings() {
    setError('')
    setSuccess('')
 
    if (!dailyLimit || parseFloat(dailyLimit) <= 0) {
      setError('Daily limit must be a positive number.')
      return
    }
 
    if (monthlyLimit && parseFloat(monthlyLimit) <= 0) {
      setError('Monthly limit must be a positive number.')
      return
    }
 
    if (monthlyLimit && parseFloat(monthlyLimit) < parseFloat(dailyLimit)) {
      setError('Monthly limit should be greater than your daily limit.')
      return
    }
 
    setSaving(true)
 
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        currency,
        daily_limit: parseFloat(dailyLimit),
        monthly_limit: monthlyLimit ? parseFloat(monthlyLimit) : null,
        auto_logout: autoLogout,
      })
      .eq('id', user!.id)
 
    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }
 
    setSuccess('Settings saved successfully.')
    refreshProfile()
    setSaving(false)
  }
 
  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Type DELETE (all caps) to confirm.')
      return
    }
 
    setDeleting(true)
    setDeleteError('')
 
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
 
      if (!currentUser) {
        setDeleteError('Not authenticated. Please log in again.')
        setDeleting(false)
        return
      }
 
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
 
      if (!token) {
        setDeleteError('Session expired. Please log in again.')
        setDeleting(false)
        return
      }
 
      const { error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
 
      if (error) throw error
 
      await supabase.auth.signOut()
 
    } catch {
      console.log('Cleanup: Session already invalidated by account deletion.')
    } finally {
      navigate('/', { replace: true })
    }
  }
 
  if (loading) return <div className="min-h-screen" />
 
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="w-full max-w-3xl mx-auto lg:max-w-6xl space-y-4">
 
        {/* PROFILE SECTION */}
        <div className="bg-white border border-[#2e2e2e] rounded-2xl p-4">
 
          <h2 className="text-xl font-semibold text-black mb-1">PROFILE</h2>
 
          <div className="h-px bg-black mb-3" />
 
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 
            {/* Avatar + name + email */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg, #c4956a 0%, #E59898 100%)', color: '#161616' }}
              >
                {(displayName || user?.email || 'U')
                  .split(' ')
                  .map((w: string) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-base font-semibold text-black">
                  {displayName || 'No display name'}
                </p>
                <p className="text-sm text-black">{user?.email}</p>
              </div>
            </div>
 
            {/* Member since */}
            <p className="text-sm font-semibold text-black sm:shrink-0">
              Member since :{'  '}
              <span className="font-['Platypi'] font-light">
                {new Date(user?.created_at ?? '').toLocaleDateString('en-GB').replace(/\//g, '.')}
              </span>
            </p>
 
          </div>
 
        </div>
 
        {/* SETTINGS SECTION */}
        <div
          ref={settingsRef}
          className="bg-white border border-[#2e2e2e] rounded-2xl p-4 space-y-4"
        >
          <h2 className="text-xl font-semibold text-black mb-1">Settings</h2>
          <div className="h-px bg-black mb-2" />
 
          {/* Display Name — full width */}
          <div className="space-y-2">
            <label className="text-sm text-black font-semibold">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-[#F4F4F4] border border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg px-4 py-2 text-gray-600 placeholder:text-[#444] focus:outline-none focus:border-[#E59898] transition-colors duration-200"
            />
          </div>
 
          {/* 2-column grid:
              Left:  Currency → Auto Logout
              Right: Daily Limit → Monthly Limit */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
 
            {/* Left col — Currency */}
            <CurrencySelector
              currency={currency}
              onCurrencyChange={setCurrency}
            />
 
            {/* Right col — Daily Limit */}
            <div className="space-y-2">
              <label className="text-sm text-black font-semibold">Daily Limit</label>
              <input
                type="number"
                value={dailyLimit}
                min="0"
                onChange={(e) => {
                  setDailyLimit(e.target.value)
                  if (error) setError('')
                }}
                className="w-full bg-[#F4F4F4] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-transparent rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:border-[#E59898] font-['Platypi'] font-light transition-colors duration-200"
              />
            </div>
 
            {/* Left col — Auto Logout */}
            <div className="space-y-2">
              <label className="text-sm text-black font-semibold">Auto Logout</label>
              <select
                value={autoLogout}
                onChange={(e) => setAutoLogout(e.target.value)}
                className="w-full bg-[#F4F4F4] border border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:border-[#E59898] transition-colors duration-200"
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="never">Never</option>
              </select>
            </div>
 
            {/* Right col — Monthly Limit */}
            <div className="space-y-2">
              <label className="text-sm text-black font-semibold">Monthly Limit</label>
              <input
                type="number"
                value={monthlyLimit}
                min="0"
                placeholder="No limit"
                onChange={(e) => {
                  setMonthlyLimit(e.target.value)
                  if (error) setError('')
                }}
                className="w-full bg-[#F4F4F4] border border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] rounded-lg px-4 py-2 text-gray-600 placeholder:text-[#444] focus:outline-none focus:border-[#E59898] font-['Platypi'] font-light transition-colors duration-200"
              />
            </div>
 
          </div>
 
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-green-400 text-xs">{success}</p>}
 
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full py-2 rounded-lg text-md font-semibold bg-[#E59898] hover:opacity-90 active:opacity-75 transition-opacity text-[#1a1108] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
 
        </div>
 
        {/* CHANGE PASSWORD */}
        <div className="bg-white border border-[#2e2e2e] rounded-2xl p-4 space-y-4">
          <h2 className="text-lg font-semibold text-black mb-1">Change Password</h2>
          <ChangePasswordForm />
        </div>
 
        {/* DANGER ZONE */}
        <div className="bg-[#797373] border border-red-500/10 rounded-2xl p-4 space-y-3">
 
          <h2 className="text-lg font-semibold text-[#6B0919] mb-1">Danger Zone</h2>
 
          <p className="text-sm text-white">
            This action is permanent and cannot be undone. All your expenses,
            history, and settings will be deleted immediately.
          </p>
 
          {deleteError && (
            <p className="text-red-400 text-xs">{deleteError}</p>
          )}
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => {
                setDeleteConfirm(e.target.value)
                setDeleteError('')
              }}
              placeholder="Type DELETE to confirm"
              className="w-full bg-[#363433] font-semibold border text-center border-red-500/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#E59898] focus:outline-none focus:border-red-500/60"
            />
 
            <button
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== 'DELETE'}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: deleteConfirm === 'DELETE' ? '#3d1a1a' : '#363433',
                color: deleteConfirm === 'DELETE' ? '#f87171' : '#E59898',
                border: '1px solid rgba(239,68,68,0.3)',
                cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
              }}
            >
              {deleting ? 'Deleting...' : 'Delete my account'}
            </button>
          </div>
 
        </div>
 
      </div>
    </div>
  )
}
 
export default Profile