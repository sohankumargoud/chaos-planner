import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ requiredRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    const loginPath = requiredRole === 'ROLE_ADMIN' ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (!user.roles?.includes(requiredRole)) {
    // Wrong role — redirect to their dashboard
    const redirectTo = user.roles?.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
