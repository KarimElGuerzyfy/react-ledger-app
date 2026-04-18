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
 
  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-green-400">{success}</p>}
 
      <div className="grid grid-cols-2 gap-3">
        <input
          id="newPassword"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            if (error) setError('')
          }}
          className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#E8CD9B] transition-colors duration-200"
        />
        <input
          id="confirmNewPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value)
            if (error) setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
          className="w-full bg-[#252525] border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#E8CD9B] transition-colors duration-200"
        />
      </div>
 
      <button
        type="button"
        onClick={handleChangePassword}
        disabled={loading}
        className="w-full py-2 rounded-lg text-md font-semibold bg-[#c4956a] hover:opacity-90 active:opacity-75 transition-opacity text-[#1a1108] disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  )
}
 
export default ChangePasswordForm