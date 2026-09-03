import { useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

function PasswordField({ id, label, autoComplete }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <LockOutlinedIcon aria-hidden="true" />
        <input id={id} name={id} type={isVisible ? 'text' : 'password'} placeholder="Password" autoComplete={autoComplete} required />
        <button
          className="visibility-button"
          type="button"
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setIsVisible((visible) => !visible)}
        >
          {isVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
        </button>
      </div>
    </div>
  )
}

export default PasswordField
