import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useInactivityLogout } from '../hooks/useInactivityLogout'

function AppLayout() {
  useInactivityLogout()

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default AppLayout