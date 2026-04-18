import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
 
// Converts raw Supabase error messages into user-friendly ones
function humanizeError(message: string): string {
  if (message.toLowerCase().includes('user already registered')) {
    return 'An account with this email already exists. Try logging in instead.'
  }
  if (message.toLowerCase().includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (message.toLowerCase().includes('password should be at least')) {
    return 'Password must be at least 8 characters.'
  }
  return message
}
 
function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
 
  const navigate = useNavigate()
 
  async function handleRegister() {
    setError('')
 
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
 
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
 
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
 
    setLoading(true)
 
    const { error } = await supabase.auth.signUp({ email, password })
 
    if (error) {
      setError(humanizeError(error.message))
      setLoading(false)
      return
    }
 
    navigate('/dashboard')
  }
 
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-stone-900 mb-1">Create your Free Account</h2>
      <p className="text-sm text-stone-500 mb-8">Start tracking your spending today</p>
 
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}
 
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          className="w-full px-4 py-3 text-sm border-0 rounded-xl bg-[#EEF1F8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
 
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">Password</label>
        <input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          className="w-full px-4 py-3 text-sm border-0 rounded-xl bg-[#EEF1F8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
 
      <div className="mb-8">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          className="w-full px-4 py-3 text-sm border-0 rounded-xl bg-[#EEF1F8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
 
      <button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-3 bg-[#FBE6C9] text-stone-900 text-sm font-bold rounded-xl hover:bg-[#e6d2b6] transition-colors disabled:opacity-50 mb-4 cursor-pointer"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
 
      <p className="text-sm text-stone-500 text-center">
        Already have an account?{' '}
        <Link to="/" className="text-stone-900 font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  )
}
 
export default RegisterForm