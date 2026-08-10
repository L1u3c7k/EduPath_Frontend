import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './scene/Login/Login'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/EduPath">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
