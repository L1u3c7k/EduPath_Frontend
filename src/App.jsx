import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./scene/Dashboard/Dashboard";
import Login from "./scene/Login/Login";
import SignUp from "./scene/SignUp/SignUp";

import "./App.css";

// 🔒 Blocks unauthenticated users from protected pages
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

// 🔓 Blocks authenticated users from visiting /login or /signup
const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (isAuthenticated) {
    // FIX 1: Point to /app (matching your Route path)
    const from = location.state?.from?.pathname || "/app";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter basename="/EduPath">
      <AuthProvider>
        <Routes>
          {/* Default entry point redirect */}
          <Route path="/" element={<Navigate to="/app" replace />} />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/app" element={<Dashboard />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;