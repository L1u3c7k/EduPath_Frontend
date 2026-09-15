import { useCallback, useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import './Settings.css'

function SettingsPasswordField({ id, label, autoComplete, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="password-change-field" htmlFor={id}>
      <span>{label}</span>
      <span className="password-change-input">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder="Password"
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required
        />
        <button
          type="button"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </button>
      </span>
    </label>
  )
}

function Settings({ isOpen, onClose, username, onUsernameChange }) {
  const [view, setView] = useState('menu')
  const [draftUsername, setDraftUsername] = useState(username)

  const closeSettings = useCallback(() => {
    setView('menu')
    resetFormState()
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

  const confirmProfile = (event) => {
    event.preventDefault()
    const nextUsername = draftUsername.trim()
    if (!nextUsername) return
    onUsernameChange(nextUsername)
    setDraftUsername(nextUsername)
    setView('menu')
  }

  if (!isOpen) return null

  return (
    <div className="settings-overlay" onPointerDown={closeSettings}>
      {view === 'menu' && (
        <section
          className="settings-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="settings-heading-row">
            <h2 id="settings-title">Settings</h2>
            <button className="settings-close" type="button" aria-label="Close settings" onClick={closeSettings}>
              <CloseRoundedIcon />
            </button>
          </div>
          <div className="settings-actions">
            <button type="button" onClick={() => { setDraftUsername(username); setView('profile') }}><AccountCircleOutlinedIcon /><span>Edit Profile</span></button>
            <button type="button" onClick={() => setView('password')}><LockOutlinedIcon /><span>Change Password</span></button>
          </div>
        </section>
      )}

      {view === 'profile' && (
        <section className="settings-dialog edit-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onPointerDown={(event) => event.stopPropagation()}>
          <div className="settings-subpage-heading">
            <button className="settings-close edit-profile-back" type="button" aria-label="Back to settings" onClick={() => setView('menu')}><ArrowBackRoundedIcon /></button>
            <h2 className="settings-subpage-title" id="edit-profile-title">Edit Profile</h2>
            <button className="settings-close edit-profile-close" type="button" aria-label="Close edit profile" onClick={closeSettings}><CloseRoundedIcon /></button>
          </div>
          <div className="edit-profile-avatar-wrap">
            <span className="edit-profile-avatar" aria-hidden="true">
              {username ? username.charAt(0).toUpperCase() : 'K'}
            </span>
            <label className="avatar-upload" aria-label="Change profile picture">
              <PhotoCameraOutlinedIcon />
              <input type="file" accept="image/*" />
            </label>
          </div>
          <div className="profile-detail-row">
            <strong>Email</strong>
            <span>2023-miit-cse-022@miit.edu.mm</span>
          </div>
          <form className="edit-profile-form" onSubmit={confirmProfile}>
            <div className="profile-detail-row"><strong>Email</strong><span>2023-miit-cse-022@miit.edu.mm</span></div>
            <label className="profile-detail-row username-field" htmlFor="profile-username">
              <strong>Username</strong>
              <input id="profile-username" value={draftUsername} onChange={(event) => setDraftUsername(event.target.value)} autoComplete="username" required />
            </label>
            <button className="confirm-profile-button" type="submit">Confirm</button>
          </form>
        </section>
      )}

      {view === 'password' && (
        <section className="settings-dialog change-password-dialog" role="dialog" aria-modal="true" aria-labelledby="change-password-title" onPointerDown={(event) => event.stopPropagation()}>
          <div className="settings-subpage-heading">
            <button className="settings-close edit-profile-back" type="button" aria-label="Back to settings" onClick={() => setView('menu')}><ArrowBackRoundedIcon /></button>
            <h2 className="settings-subpage-title" id="change-password-title">Change Password</h2>
            <button className="settings-close edit-profile-close" type="button" aria-label="Close change password" onClick={closeSettings}><CloseRoundedIcon /></button>
          </div>
          <form className="change-password-form" onSubmit={(event) => event.preventDefault()}>
            <SettingsPasswordField id="current-password" label="Current Password" autoComplete="current-password" />
            <SettingsPasswordField id="new-password" label="New Password" autoComplete="new-password" />
            <SettingsPasswordField id="confirm-password" label="Confirm Password" autoComplete="new-password" />
            <button className="save-password-button" type="submit">Save Password</button>
          </form>
        </section>
      )}
    </div>
  )
}

export default Settings