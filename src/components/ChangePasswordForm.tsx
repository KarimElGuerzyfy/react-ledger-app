import { useState } from 'react'
import { supabase } from '../lib/supabase'

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword() {
    setError('')
    setSuccess('')

    if (!newPassword || !confirmNewPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Password updated successfully')
    setNewPassword('')
    setConfirmNewPassword('')
    setLoading(false)
  }

  return (
    <div>
      <h3>Change Password</h3>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <div>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          id="confirmNewPassword"
          type="password"
          placeholder="Repeat new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>

      <button type="button" onClick={handleChangePassword} disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  )
}

export default ChangePasswordForm