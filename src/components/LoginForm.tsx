import { Link } from 'react-router-dom'

function LoginForm() {
  return (
    <div className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-8">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Welcome back</h2>
      <p className="text-sm text-stone-500 mb-6">Sign in to your account</p>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
        />
      </div>

      <button className="w-full py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors">
        Sign in
      </button>

      <p className="text-sm text-stone-500 text-center mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-stone-900 font-medium hover:underline">Register</Link>
      </p>
    </div>
  )
}

export default LoginForm