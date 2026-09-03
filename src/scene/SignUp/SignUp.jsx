import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { Link, useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../../components/auth/AuthBrandPanel'
import PasswordField from '../../components/auth/PasswordField'

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
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
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
                required
              />
            </div>
          </div>

          <PasswordField id="password" label="Password" autoComplete="new-password" />
          <PasswordField id="confirm-password" label="Confirm Password" autoComplete="new-password" />

          <button className="login-button" type="submit">
            Sign Up
          </button>

          <p className="signup-copy">
            Already have an account?
            <Link className="text-link" to="/auth/login">Sign in</Link>
          </p>
        </form>
      </section>

      <AuthBrandPanel />
    </main>
  )
}

export default SignUp
