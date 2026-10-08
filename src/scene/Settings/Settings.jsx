import { useCallback, useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import './Settings.css'
import { updateUserPassword, upload_profile_picture, update_username } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'

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

function Settings({ isOpen, onClose, username, onUsernameChange, initialImageUrl, onProfileUpdate }) {
  const { user, updateUser } = useAuth()
  const [view, setView] = useState('menu')
  const [draftUsername, setDraftUsername] = useState(username)
  const [alert, setAlert] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Track image load failures
  const [imgError, setImgError] = useState(false)

  // States for deferred upload & instant preview
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const initialPasswordState = { currentPassword: '', newPassword: '', confirmPassword: '' }
  const [passwordForm, setPasswordForm] = useState(initialPasswordState)

  // Calculate saved image URL from server/context
  const rawImageUrl = initialImageUrl || user?.img_url || user?.img_file || user?.image_file
  const savedProfileImageUrl = rawImageUrl
    ? rawImageUrl.startsWith('http')
      ? rawImageUrl
      : `http://localhost:8000${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`
    : null

  // Priority: Preview URL (unsaved selection) > Saved DB Image URL
  const profileImageUrl = previewUrl || savedProfileImageUrl

  const resetFormState = useCallback(() => {
    setPasswordForm(initialPasswordState)
    setSelectedFile(null)
    setImgError(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [previewUrl])

  // Sync draft state and reset image state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftUsername(username)
      setImgError(false)
    }
  }, [isOpen, username])

  const closeSettings = useCallback(() => {
    resetFormState()
    setView('menu')
    onClose()
  }, [onClose, resetFormState])

  const closeAlert = (_event, reason) => {
    if (reason !== 'clickaway') setAlert(null)
  }

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeSettings()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, closeSettings])

  // Select file & generate temporary browser preview
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImgError(false)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // Submit picture and username together on Confirm
  const confirmProfile = async (event) => {
    event.preventDefault()
    const nextUsername = draftUsername.trim()
    if (!nextUsername) return

    setUploading(true)
    try {
      let updatedUserData = {}

      // Step A: Upload picture if user selected a new file
      if (selectedFile) {
        const uploadedUser = await upload_profile_picture(selectedFile)
        if (uploadedUser) {
          updatedUserData = { ...uploadedUser }
        }
      }

      // Step B: Send API request to change username if modified
      if (nextUsername !== username) {
        const usernameResponse = await update_username(nextUsername)
        if (usernameResponse) {
          updatedUserData = { ...updatedUserData, ...usernameResponse }
        }
      }

      // Step C: Update local parent state & AuthContext
      onUsernameChange(nextUsername)
      setDraftUsername(nextUsername)
      updatedUserData.username = nextUsername
      updatedUserData.name = nextUsername
      updateUser(updatedUserData)

      // Step D: Trigger parent component refresh callback directly
      if (typeof onProfileUpdate === 'function') {
        onProfileUpdate(updatedUserData)
      }

      // Step E: Clean up temporary file preview state
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }

      setAlert({ severity: 'success', message: 'Profile updated successfully.' })
    } catch (err) {
      console.error('Failed to update profile:', err?.response?.data || err)
      const detail = err?.response?.data?.detail
      const errorMessage = typeof detail === 'string' ? detail : 'Failed to update profile.'
      setAlert({ severity: 'error', message: errorMessage })
    } finally {
      setUploading(false)
    }
  }

  const handlePasswordInput = (field) => (event) => {
    setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const confirmPasswordChange = async (event) => {
    event.preventDefault()
    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (newPassword !== confirmPassword) {
      setAlert({ severity: 'error', message: 'New passwords do not match.' })
      return
    }

    if (newPassword.length < 8) {
      setAlert({ severity: 'error', message: 'Password must be at least 8 characters long.' })
      return
    }

    try {
      await updateUserPassword({ currentPassword, newPassword })
      resetFormState()
      setAlert({ severity: 'success', message: 'Password updated successfully.' })
      closeSettings()
    } catch (err) {
      console.error('Change Password Error:', err.response?.data)
      const detail = err?.response?.data?.detail
      const errorMessage = typeof detail === 'string' ? detail : 'Failed to update password.'
      setAlert({ severity: 'error', message: errorMessage })
    }
  }

  return (
    <>
      {isOpen && (
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
                <button type="button" onClick={() => { setDraftUsername(username); setView('profile') }}>
                  <AccountCircleOutlinedIcon /><span>Edit Profile</span>
                </button>
                <button type="button" onClick={() => setView('password')}>
                  <LockOutlinedIcon /><span>Change Password</span>
                </button>
              </div>
            </section>
          )}

          {view === 'profile' && (
            <section
              className="settings-dialog edit-profile-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="settings-subpage-heading">
                <button className="settings-close edit-profile-back" type="button" aria-label="Back to settings" onClick={() => setView('menu')}>
                  <ArrowBackRoundedIcon />
                </button>
                <h2 className="settings-subpage-title" id="edit-profile-title">Edit Profile</h2>
                <button className="settings-close edit-profile-close" type="button" aria-label="Close edit profile" onClick={closeSettings}>
                  <CloseRoundedIcon />
                </button>
              </div>

              <form className="edit-profile-form" onSubmit={confirmProfile}>
                <div className="edit-profile-avatar-wrap">
                  <span className="edit-profile-avatar" aria-hidden="true">
                    {profileImageUrl && !imgError ? (
                      <img
                        src={profileImageUrl}
                        alt={username || 'Profile'}
                        onError={() => setImgError(true)}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      username ? username.charAt(0).toUpperCase() : 'K'
                    )}
                  </span>
                  <label className={`avatar-upload ${uploading ? 'uploading' : ''}`} aria-label="Change profile picture">
                    <PhotoCameraOutlinedIcon />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      disabled={uploading}
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="profile-detail-row">
                  <strong>Email</strong>
                  <span>{user?.email || '2023-miit-cse-022@miit.edu.mm'}</span>
                </div>
                <label className="profile-detail-row username-field" htmlFor="profile-username">
                  <strong>Username</strong>
                  <input
                    id="profile-username"
                    value={draftUsername}
                    onChange={(event) => setDraftUsername(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </label>
                <button className="confirm-profile-button" type="submit" disabled={uploading}>
                  {uploading ? 'Saving...' : 'Confirm'}
                </button>
              </form>
            </section>
          )}

          {view === 'password' && (
            <section
              className="settings-dialog change-password-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-password-title"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="settings-subpage-heading">
                <button className="settings-close edit-profile-back" type="button" aria-label="Back to settings" onClick={() => setView('menu')}>
                  <ArrowBackRoundedIcon />
                </button>
                <h2 className="settings-subpage-title" id="change-password-title">Change Password</h2>
                <button className="settings-close edit-profile-close" type="button" aria-label="Close change password" onClick={closeSettings}>
                  <CloseRoundedIcon />
                </button>
              </div>
              <form className="change-password-form" onSubmit={confirmPasswordChange}>
                <SettingsPasswordField
                  id="current-password"
                  label="Current Password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInput('currentPassword')}
                />
                <SettingsPasswordField
                  id="new-password"
                  label="New Password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInput('newPassword')}
                />
                <SettingsPasswordField
                  id="confirm-password"
                  label="Confirm Password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInput('confirmPassword')}
                />
                <button className="save-password-button" type="submit">Save Password</button>
              </form>
            </section>
          )}
        </div>
      )}

      <Snackbar
        key={alert?.message}
        open={Boolean(alert)}
        autoHideDuration={4000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert?.severity ?? 'success'} variant="filled" onClose={closeAlert} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Settings