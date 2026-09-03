import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, signupApi, refreshAccessTokenApi, logoutApi } from '../api/authApi'
import { configureAuthHandlers } from '../api/api'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const tokenRef = useRef(null)
  const navigate = useNavigate()

  const applyToken = useCallback((nextToken, nextUser) => {
  
    tokenRef.current = nextToken
    setToken(nextToken)
    if (nextUser !== undefined) {
      setUser(nextUser)
    }
  }, [])

  useEffect(() => {
    let isMounted = true;

    configureAuthHandlers({
      getToken: () => tokenRef.current,
      setToken: (nextToken) => {
        if (!isMounted) return;
        tokenRef.current = nextToken
        setToken(nextToken)
      },
      onUnauthorized: () => {
        if (!isMounted) return;
        tokenRef.current = null
        setToken(null)
        setUser(null)
        navigate('/login', { replace: true })
      },
    })

    const restoreSession = async () => {
      try {
        const accessToken = await refreshAccessTokenApi()
        // Only update state if the component is still mounted
        if (isMounted) {
          applyToken(accessToken)
        }
      } catch {
        if (isMounted) {
          applyToken(null, null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false; // Cleanup flag when component unmounts
    }
  }, [applyToken, navigate])

  const login = async (credentials) => {
    const data = await loginApi(credentials)
    applyToken(data.access_token, data.user || null)
    return data
  }

  const signup = async (userData) => {
    const data = await signupApi(userData)

    if (data?.access_token) {
      applyToken(data.access_token, data.user || null)
      return data
    }

    return login({
      email: userData.email,
      password: userData.password,
    })
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      applyToken(null, null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
