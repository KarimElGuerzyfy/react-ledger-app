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
      setError('Please fill in all fields.')
      return
    }
 
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
 
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.')
      return
    }
 
    setLoading(true)
 
    const { error } = await supabase.auth.updateUser({ password: newPassword })
 
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
 
    setSuccess('Password updated successfully.')
    setNewPassword('')
    setConfirmNewPassword('')
    setLoading(false)
  }
 
  const inputClasses = 'w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#E8CD9B] transition-colors duration-200'
 
  return (
    <div className="space-y-4 pt-2 border-t border-[#2e2e2e]">
      <p className="text-sm font-medium text-gray-400 pt-2">Change Password</p>
 
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-xs text-green-400">{success}</p>
      )}
 
      <div className="space-y-1">
        <label htmlFor="newPassword" className="text-xs text-gray-500">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            if (error) setError('')
          }}
          className={inputClasses}
        />
      </div>
 
      <div className="space-y-1">
        <label htmlFor="confirmNewPassword" className="text-xs text-gray-500">
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          placeholder="Repeat new password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value)
            if (error) setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
          className={inputClasses}
        />
      </div>
 
      <button
        type="button"
        onClick={handleChangePassword}
        disabled={loading}
        className="bg-[#c4956a] hover:opacity-90 active:opacity-75 transition-opacity text-[#1a1108] text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  )
}
 
export default ChangePasswordForm