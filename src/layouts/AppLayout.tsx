import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useInactivityLogout } from '../hooks/useInactivityLogout'

function AppLayout() {
  useInactivityLogout()

  return (
    <div>
      <Navbar />
      <div className="pb-15 md:pb-0">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout