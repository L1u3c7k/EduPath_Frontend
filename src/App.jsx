import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './scene/Login/Login'
import SignUp from './scene/SignUp/SignUp'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/EduPath">
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
