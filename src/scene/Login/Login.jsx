import { useState } from 'react'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import mentoraLogo from '../../assets/mentora-logo.png'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="app-shell">
      <section className="login-section" aria-labelledby="login-title">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1 id="login-title">Welcome Back</h1>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <EmailOutlinedIcon aria-hidden="true" />
              <input id="email" name="email" type="email" placeholder="Email" autoComplete="email" required />
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

          <button className="login-button" type="submit">Log in</button>

          <p className="signup-copy">
            Don’t have an account?
            <a className="text-link" href="#sign-up">Sign Up</a>
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
