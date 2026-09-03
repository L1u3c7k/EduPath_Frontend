import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useAuth } from '../../context/AuthContext'
import mentoraLogo from '../../assets/mentora-logo.png'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => { 
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="login-section" aria-labelledby="login-title">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1 id="login-title">Welcome Back</h1>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockOutlinedIcon aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="visibility-button"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-label">
              <input type="checkbox" name="remember" />
              <span>Remember username</span>
            </label>
            <a className="text-link" href="#forgot-password">Forgot password?</a>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className="signup-copy">
            Don’t have an account?{' '}
            <Link className="text-link" to="/signup">Sign Up</Link>
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

export default Login