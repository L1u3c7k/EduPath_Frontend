import { useCallback, useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import './Settings.css'

function SettingsPasswordField({ id, label, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="password-change-field" htmlFor={id}>
      <span>{label}</span>
      <span className="password-change-input">
        <input id={id} type={visible ? 'text' : 'password'} placeholder="Password" autoComplete={autoComplete} />
        <button type="button" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} onClick={() => setVisible((current) => !current)}>
          {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </button>
      </span>
    </label>
  )
}

function Settings({ isOpen, onClose, username, onUsernameChange }) {
  const [view, setView] = useState('menu')

  const closeSettings = useCallback(() => {
    setView('menu')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeSettings()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, closeSettings])

  if (!isOpen) return null

  return (
    <div className="settings-overlay" onPointerDown={closeSettings}>
      {view === 'menu' && (
        <section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" onPointerDown={(event) => event.stopPropagation()}>
          <div className="settings-heading-row">
            <h2 id="settings-title">Settings</h2>
            <button className="settings-close" type="button" aria-label="Close settings" onClick={closeSettings}><CloseRoundedIcon /></button>
          </div>
          <div className="settings-actions">
            <button type="button" onClick={() => setView('profile')}><AccountCircleOutlinedIcon /><span>Edit Profile</span></button>
            <button type="button" onClick={() => setView('password')}><LockOutlinedIcon /><span>Change Password</span></button>
          </div>
        </section>
      )}

      {view === 'profile' && (
        <section className="settings-dialog edit-profile-dialog" role="dialog" aria-modal="true" aria-label="Edit profile" onPointerDown={(event) => event.stopPropagation()}>
          <button className="settings-close edit-profile-close" type="button" aria-label="Close edit profile" onClick={closeSettings}><CloseRoundedIcon /></button>
          <div className="edit-profile-avatar-wrap">
            <span className="edit-profile-avatar" aria-hidden="true">K</span>
            <label className="avatar-upload" aria-label="Change profile picture"><PhotoCameraOutlinedIcon /><input type="file" accept="image/*" /></label>
          </div>
          <div className="profile-detail-row"><strong>Email</strong><span>2023-miit-cse-022@miit.edu.mm</span></div>
          <label className="username-field"><span>Username</span><input value={username} onChange={(event) => onUsernameChange(event.target.value)} /></label>
        </section>
      )}

      {view === 'password' && (
        <section className="settings-dialog change-password-dialog" role="dialog" aria-modal="true" aria-label="Change password" onPointerDown={(event) => event.stopPropagation()}>
          <button className="settings-close edit-profile-close" type="button" aria-label="Close change password" onClick={closeSettings}><CloseRoundedIcon /></button>
          <form className="change-password-form" onSubmit={(event) => event.preventDefault()}>
            <SettingsPasswordField id="current-password" label="Current Password" autoComplete="current-password" />
            <SettingsPasswordField id="new-password" label="New Password" autoComplete="new-password" />
            <SettingsPasswordField id="confirm-password" label="Confirm Password" autoComplete="new-password" />
          </form>
        </section>
      )}
    </div>
  )
}

export default Settings
