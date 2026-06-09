import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('cp_token')
    const savedUser = localStorage.getItem('cp_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    setToken(authResponse.token)
    setUser({
      id: authResponse.userId,
      email: authResponse.email,
      fullName: authResponse.fullName,
      roles: authResponse.roles,
    })
    localStorage.setItem('cp_token', authResponse.token)
    localStorage.setItem('cp_user', JSON.stringify({
      id: authResponse.userId,
      email: authResponse.email,
      fullName: authResponse.fullName,
      roles: authResponse.roles,
    }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_user')
  }

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN')
  const isUser = () => user?.roles?.includes('ROLE_USER')
  const hasRole = (role) => user?.roles?.includes(role)

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
