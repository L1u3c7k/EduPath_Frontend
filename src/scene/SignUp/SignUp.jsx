import { useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Link, useNavigate } from 'react-router-dom'
import mentoraLogo from '../../assets/mentora-logo.png'

function PasswordField({ id, label, autoComplete }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <LockOutlinedIcon aria-hidden="true" />
        <input
          id={id}
          name={id}
          type={isVisible ? 'text' : 'password'}
          placeholder="Password"
          autoComplete={autoComplete}
          required
        />
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

function SignUp() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main className="app-shell signup-page">
      <section className="login-section" aria-labelledby="signup-title">
        <form className="login-card signup-card" onSubmit={handleSubmit}>
          <h1 id="signup-title">Create Account</h1>

          <div className="field-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <PersonOutlinedIcon aria-hidden="true" />
              <input id="username" name="username" type="text" placeholder="Username" autoComplete="username" required />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <EmailOutlinedIcon aria-hidden="true" />
              <input id="email" name="email" type="email" placeholder="Email" autoComplete="email" required />
            </div>
          </div>

          <PasswordField id="password" label="Password" autoComplete="new-password" />
          <PasswordField id="confirm-password" label="Confirm Password" autoComplete="new-password" />

          <button className="login-button" type="submit">Sign Up</button>

          <p className="signup-copy">
            Already have an account?
            <Link className="text-link" to="/auth/login">Sign in</Link>
          </p>
        </form>
      </section>

      <aside className="brand-section" aria-label="About Mentora">
        <div className="brand-mark">
          <img src={mentoraLogo} alt="Mentora" />
        </div>

        <div className="brand-copy">
          <h2>Welcome to Mentora.<br />Turn Knowledge Into Understanding.</h2>
          <p>Ask questions, get meaningful explanations, and challenge yourself with AI-generated quizzes based on what you learn.</p>
        </div>
      </aside>
    </main>
  )
}

export default SignUp
