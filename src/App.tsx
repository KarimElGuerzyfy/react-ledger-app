import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App