import { Link } from 'react-router-dom'

function RegisterForm() {
  return (
    <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Create an account</h2>
      <p className="text-sm text-stone-500 mb-6">Start tracking your spending today</p>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <button className="w-full py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors">
        Create account
      </button>

      <p className="text-sm text-stone-500 text-center mt-4">
        Already have an account?{' '}
        <Link to="/" className="text-stone-900 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterForm