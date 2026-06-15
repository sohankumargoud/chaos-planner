import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ requiredRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  const localUser = localStorage.getItem('cp_user')
  const activeUser = user || (localUser ? JSON.parse(localUser) : null)

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!activeUser) {
    const loginPath = requiredRole === 'ROLE_ADMIN' ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  const hasAccess = () => {
    if (requiredRole === 'ROLE_ADMIN') {
      return activeUser.roles?.includes('ROLE_ADMIN') || activeUser.roles?.includes('ROLE_SUB_ADMIN');
    }
    return activeUser.roles?.includes(requiredRole);
  }

  if (!hasAccess()) {
    if (requiredRole === 'ROLE_USER' && (activeUser.roles?.includes('ROLE_ADMIN') || activeUser.roles?.includes('ROLE_SUB_ADMIN'))) {
      return <Navigate to="/admin/dashboard" replace />
    } else if (requiredRole === 'ROLE_ADMIN' && activeUser.roles?.includes('ROLE_USER')) {
      return <Navigate to="/dashboard" replace />
    } else {
      localStorage.removeItem('cp_token')
      localStorage.removeItem('cp_user')
      return <Navigate to={requiredRole === 'ROLE_ADMIN' ? '/admin/login' : '/login'} replace />
    }
  }

  return <Outlet />
}
