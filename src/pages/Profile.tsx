import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import CurrencySelector from '../components/CurrencySelector'
import ChangePasswordForm from '../components/ChangePasswordForm'

function Profile() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [currency, setCurrency] = useState('MAD')
  const [dailyLimit, setDailyLimit] = useState('300')
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
        console.error('Error fetching profile:', error)
        return
      }

      setCurrency(data.currency)
      setDailyLimit(data.daily_limit.toString())
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  async function handleSaveSettings() {
    setError('')
    setSuccess('')

    if (!dailyLimit || parseFloat(dailyLimit) <= 0) {
      setError('Please enter a valid daily limit')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        currency,
        daily_limit: parseFloat(dailyLimit),
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
    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.')
    if (!confirmed) return

    const { error } = await supabase.auth.admin.deleteUser(user!.id)

    if (error) {
      setError('Could not delete account. Please contact support.')
      return
    }

    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className="min-h-screen bg-stone-50" />

  return (
    <div>
      <h2>Profile</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <CurrencySelector currency={currency} onCurrencyChange={setCurrency} />

      <div>
        <label htmlFor="dailyLimit">Daily Spending Limit</label>
        <input
          id="dailyLimit"
          type="number"
          min="0"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
        />
        <button onClick={handleSaveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <ChangePasswordForm />

      <button onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  )
}

export default Profile