import { useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import mentoraLogo from '../../assets/mentora-logo.png'

function PasswordField({ id, label, autoComplete, value, onChange }) {
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
          placeholder={label}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
  event.preventDefault()
  setError('')

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  setLoading(true)

  const payload = {
    name: formData.name.trim(),
    username: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
  }

  try {
    // 1. Call signup from context
    await signup(payload)
    
    // 2. Use replace: true so the route swap is clean without triggering extra listeners
    navigate('/dashboard', { replace: true })
  } catch (err) {
    const backendDetail = err.response?.data?.detail

    if (Array.isArray(backendDetail) && backendDetail.length > 0) {
      const cleanMessage = backendDetail[0].msg.replace(/^Value error,\s*/, '')
      setError(cleanMessage)
    } else if (typeof backendDetail === 'string') {
      setError(backendDetail)
    } else {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="app-shell signup-page">
      <section className="login-section" aria-labelledby="signup-title">
        <form className="login-card signup-card" onSubmit={handleSubmit}>
          <h1 id="signup-title">Create Account</h1>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          <div className="field-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <PersonOutlinedIcon aria-hidden="true" />
              <input
                id="username"
                name="name"
                type="text"
                placeholder="Username"
                autoComplete="username"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <EmailOutlinedIcon aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="signup-copy">
            Already have an account?{' '}
            <Link className="text-link" to="/login">Sign in</Link>
          </p>
        </form>
      </section>

      <aside className="brand-section" aria-label="About Mentora">
        <div className="brand-mark">
          <img src={mentoraLogo} alt="Mentora" />
        </div>

        <div className="brand-copy">
          <h2>
            Welcome to Mentora.
            <br />
            Turn Knowledge Into Understanding.
          </h2>
          <p>Ask questions, get meaningful explanations, and challenge yourself with AI-generated quizzes based on what you learn.</p>
        </div>
      </aside>
    </main>
  )
}

export default SignUp