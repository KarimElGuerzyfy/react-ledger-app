function ChangePasswordForm() {
  return (
    <div>
      <h3>Change Password</h3>
      <div>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          placeholder="Current password"
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          placeholder="New password"
        />
      </div>
      <div>
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          id="confirmNewPassword"
          type="password"
          placeholder="Repeat new password"
        />
      </div>
      <button type="button">Update Password</button>
    </div>
  )
}

export default ChangePasswordForm