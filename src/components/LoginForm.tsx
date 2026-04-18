import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
 
// Converts raw Supabase error messages into user-friendly ones
function humanizeError(message: string): string {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Please confirm your email address before logging in.'
  }
  if (message.toLowerCase().includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return message
}
 
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
 
  const navigate = useNavigate()
 
  async function handleLogin() {
    setError('')
 
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
 
    setLoading(true)
 
    const { error } = await supabase.auth.signInWithPassword({ email, password })
 
    if (error) {
      setError(humanizeError(error.message))
      setLoading(false)
      return
    }
 
    navigate('/dashboard')
  }
 
  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-stone-900 mb-1">Welcome back</h2>
      <p className="text-sm text-stone-500 mb-8">Sign in to your account</p>
 
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
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-3 text-sm border-0 rounded-xl bg-[#EEF1F8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
 
      <div className="mb-8">
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-3 text-sm border-0 rounded-xl bg-[#EEF1F8] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
 
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 bg-[#FBE6C9] text-stone-900 text-sm font-bold rounded-xl hover:bg-[#e6d2b6] transition-colors disabled:opacity-50 mb-4 cursor-pointer"
      >
        {loading ? 'Signing in...' : 'Log in'}
      </button>
 
      <p className="text-sm text-stone-500 text-center mb-8">
        Don't have an account?{' '}
        <Link to="/register" className="text-stone-900 font-semibold hover:underline">Register</Link>
      </p>
 
      {/* Tutorial video */}
      <div className="w-full bg-stone-900 rounded-xl aspect-video flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
        </div>
      </div>
      <p className="text-xs text-stone-400 text-center mt-2">Tutorial video — how to use Ledger</p>
    </div>
  )
}
 
export default LoginForm