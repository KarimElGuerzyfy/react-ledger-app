import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Create an account</h2>
      <p className="text-sm text-stone-500 mb-6">Start tracking your spending today</p>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        className="w-full py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-sm text-stone-500 text-center mt-4">
        Already have an account?{' '}
        <Link to="/" className="text-stone-900 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterForm