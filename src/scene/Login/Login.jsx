import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel'
import PasswordField from '../../components/auth/PasswordField'

function Login() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
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

          <PasswordField id="password" label="Password" autoComplete="current-password" />

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
            <Link className="text-link" to="/auth/signup">Sign Up</Link>
          </p>
        </form>
      </section>

      <AuthBrandPanel />
    </main>
  )
}

export default Login
