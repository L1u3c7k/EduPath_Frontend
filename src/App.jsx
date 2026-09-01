import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Login from './scene/Login/Login'
import SignUp from './scene/SignUp/SignUp'
import Dashboard from './scene/Dashboard/Dashboard'
import './App.css'

const authPages = {
  login: Login,
  signup: SignUp,
}

function AuthPage() {
  const { mode } = useParams()
  const Page = authPages[mode]

  return Page ? <Page /> : <Navigate to="/auth/login" replace />
}

function App() {
  return (
    <BrowserRouter basename="/EduPath">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Keep the original URLs working. */}
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
