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
    setSaving(true)
 
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        currency,
        daily_limit: parseFloat(dailyLimit) || null,
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

    // 1. Call the Edge Function to delete the account and data
    const { error } = await supabase.functions.invoke('delete-account', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (error) throw error

    // 2. Attempt to sign out locally
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
 
            <p className="text-sm text-gray-400 mt-3">Member since</p>
            <p className="text-white font-['Platypi'] font-light">
              {new Date(user?.created_at ?? '').toLocaleDateString()}
            </p>
          </div>
 
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Display Name</label>
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
            <label className="text-sm text-gray-400">Daily Spending Limit</label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#E8CD9B] font-['Platypi'] font-light"
            />
          </div>
 
          {/* Auto logout */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Auto logout timer</label>
            <select
              value={autoLogout}
              onChange={(e) => setAutoLogout(e.target.value)}
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
 
          {success && <p className="text-green-400 text-sm">{success}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
 
        </div>
 
        {/* DANGER ZONE */}
        <div className="bg-[#1e1e1e] border border-red-500/30 rounded-xl p-6 space-y-4">
 
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
 
          <p className="text-sm text-gray-400">
            This action is permanent and cannot be undone. All your expenses,
            history, and settings will be deleted immediately.
          </p>
 
          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Type{' '}
              <span className="text-red-400 font-mono">DELETE</span>
              {' '}to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => {
                setDeleteConfirm(e.target.value)
                setDeleteError('')
              }}
              placeholder="DELETE"
              className="w-full bg-[#1a1010] border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder:text-red-500/20 focus:outline-none focus:border-red-500/60"
            />
          </div>
 
          {deleteError && (
            <p className="text-red-400 text-sm">{deleteError}</p>
          )}
 
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirm !== 'DELETE'}
            className="w-full py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: deleteConfirm === 'DELETE' ? '#3d1a1a' : '#1a1010',
              color: deleteConfirm === 'DELETE' ? '#f87171' : '#3d1a1a',
              border: '1px solid rgba(239,68,68,0.3)',
              cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
            }}
          >
            {deleting ? 'Deleting...' : 'Delete my account'}
          </button>
 
        </div>
 
      </div>
    </div>
  )
}
 
export default Profile