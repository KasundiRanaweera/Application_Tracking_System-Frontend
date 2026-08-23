import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const getInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, loading: false }
  }

  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!storedToken || !storedUser) {
    return { user: null, token: null, loading: false }
  }

  try {
    return {
      user: JSON.parse(storedUser),
      token: storedToken,
      loading: false,
    }
  } catch {
    return { user: null, token: null, loading: false }
  }
}

export function AuthProvider({ children }) {
  const initialAuthState = getInitialAuthState()
  const [user, setUser] = useState(initialAuthState.user)
  const [token, setToken] = useState(initialAuthState.token)
  const [loading, setLoading] = useState(initialAuthState.loading)

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    setLoading(false)
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setLoading(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isRecruiter = () => user?.role === 'RECRUITER'
  const isCandidate = () => user?.role === 'USER'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isRecruiter,
      isCandidate,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — use this everywhere instead of useContext(AuthContext)
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
