import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './AuthContextDef'
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  setAccessToken,
  clearAccessToken,
} from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // null = unknown (loading), false = not logged in, object = logged in
  const [authStatus, setAuthStatus] = useState('loading')

  // On app mount: try to restore session via refresh token cookie
  // If the cookie exists and is valid, /auth/me will succeed after
  // the axios interceptor auto-refreshes
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getMe()
        setUser(response.data)
        setAuthStatus('authenticated')
      } catch {
        // No valid session — user needs to log in
        clearAccessToken()
        setUser(null)
        setAuthStatus('unauthenticated')
      }
    }

    restoreSession()
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await apiLogin(credentials)
    const { access_token, user: userData } = response.data

    setAccessToken(access_token)

    // Store username for display — this is not sensitive
    localStorage.setItem('username', userData.username)

    setUser(userData)
    setAuthStatus('authenticated')

    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // Even if server call fails, clear local state
    }

    clearAccessToken()
    localStorage.removeItem('username')
    setUser(null)
    setAuthStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ user, authStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}