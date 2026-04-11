import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-stone-900 mb-1">Ledger</h1>
        <p className="text-sm text-stone-500">Track your spending, day by day.</p>
      </div>
      <Outlet />
    </div>
  )
}

export default AuthLayout