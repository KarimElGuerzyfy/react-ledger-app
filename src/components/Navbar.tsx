import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <span>Ledger</span>
      <div>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </nav>
  )
}

export default Navbar