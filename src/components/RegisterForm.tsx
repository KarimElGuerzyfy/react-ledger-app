import { Link } from 'react-router-dom'

function RegisterForm() {
  return (
    <div>
      <h2>Create an account</h2>
      <p>Start tracking your spending today</p>

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
          placeholder="Create a password"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
        />
      </div>

      <button type="submit">Create account</button>

      <p>
        Already have an account?{' '}
        <Link to="/">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterForm