import { useCallback, useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
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
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetFormState = () => {
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setError('')
    setStatusMessage('')
  }

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

  const handlePasswordChange = (field) => (event) => {
    setPasswords((prev) => ({ ...prev, [field]: event.target.value }))
    if (error) setError('')
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatusMessage('')

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    if (passwords.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      // Connect to your API endpoint here (e.g., await updatePasswordApi(passwords))
      setStatusMessage('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err?.message || 'Failed to update password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            <button type="button" onClick={() => setView('profile')}>
              <AccountCircleOutlinedIcon />
              <span>Edit Profile</span>
            </button>
            <button type="button" onClick={() => setView('password')}>
              <LockOutlinedIcon />
              <span>Change Password</span>
            </button>
          </div>
        </section>
      )}

      {view === 'profile' && (
        <section
          className="settings-dialog edit-profile-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="settings-heading-row">
            
            <h2>Edit Profile</h2>
            <button className="settings-close" type="button" aria-label="Close settings" onClick={closeSettings}>
              <CloseRoundedIcon />
            </button>
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
          <label className="username-field">
            <span>Username</span>
            <input value={username} onChange={(event) => onUsernameChange(event.target.value)} />
          </label>
        </section>
      )}

      {view === 'password' && (
        <section
          className="settings-dialog change-password-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Change password"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="settings-heading-row">
            
            <h2>Change Password</h2>
            <button className="settings-close" type="button" aria-label="Close settings" onClick={closeSettings}>
              <CloseRoundedIcon />
            </button>
          </div>
          <form className="change-password-form" onSubmit={handlePasswordSubmit}>
            <SettingsPasswordField
              id="current-password"
              label="Current Password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
            />
            <SettingsPasswordField
              id="new-password"
              label="New Password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={handlePasswordChange('newPassword')}
            />
            <SettingsPasswordField
              id="confirm-password"
              label="Confirm Password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
            />

            {error && <p className="settings-error">{error}</p>}
            {statusMessage && <p className="settings-success">{statusMessage}</p>}

            <button className="submit-password-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save Password'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default Settings