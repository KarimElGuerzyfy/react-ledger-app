import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useInactivityLogout } from '../hooks/useInactivityLogout'
import { useAuth } from '../hooks/useAuth'
 
function AppLayout() {
  const { profile } = useAuth()
  useInactivityLogout(profile?.auto_logout ?? '15')
 
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