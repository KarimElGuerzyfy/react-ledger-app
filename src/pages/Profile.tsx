import ChangePasswordForm from '../components/ChangePasswordForm'
import CurrencySelector from '../components/CurrencySelector'

function Profile() {
  return (
    <div>
      <h2>Profile</h2>
      <CurrencySelector />
      <ChangePasswordForm />
      <button>Delete Account</button>
    </div>
  )
}

export default Profile