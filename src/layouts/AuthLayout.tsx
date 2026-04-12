import { Outlet } from 'react-router-dom'
import bg from '../assets/bg.jpg'

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left side — illustration (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FBE6C9] flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-bold text-stone-900 mb-2 tracking-wide">LEDGER</h1>
        <p className="text-stone-600 mb-8">Track your spending, day by day.</p>
        <img src={bg} alt="Ledger illustration" className="w-full max-w-xl object-contain" />
      </div>

      {/* Mobile + Tablet top — illustration */}
      <div className="lg:hidden w-full bg-[#FBE6C9] flex flex-col items-center pt-10 pb-6 px-6">
        <h1 className="text-3xl font-bold text-stone-900 mb-1 tracking-wide">LEDGER</h1>
        <p className="text-sm text-stone-600 mb-6">Track your spending, day by day.</p>
        <img src={bg} alt="Ledger illustration" className="w-full max-w-sm object-contain" />
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white
                      rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0
                      px-6 py-10 md:px-12">
        <Outlet />
      </div>

    </div>
  )
}

export default AuthLayout