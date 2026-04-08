import { Link } from 'react-router-dom'

function LoginForm() {
  return (
    <div>
      <h2>Welcome back</h2>
      <p>Sign in to your account</p>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
        />
      </div>

      <button type="submit">Sign in</button>

      <p>
        Don't have an account?{' '}
        <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default LoginForm