import React, { useState, useEffect } from 'react'
import { adminUserService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../auth/AuthContext'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user: currentUser } = useAuth()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setLoading(true)
    adminUserService.list()
      .then(res => {
        setUsers(res.data.content || [])
      })
      .catch(err => {
        setError('Failed to load users.')
      })
      .finally(() => setLoading(false))
  }

  const handleRoleChange = (userId, newRole) => {
    adminUserService.updateRole(userId, newRole)
      .then(() => {
        // Optimistically update
        setUsers(users.map(u => {
          if (u.id === userId) {
            return { ...u, roles: [newRole, 'ROLE_USER'] } // naive update
          }
          return u
        }))
        loadUsers() // Refresh to get exact roles
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Failed to update role')
      })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Users & Roles</h1>
        <p className="font-body-md text-secondary mt-1">Manage club members and assign Sub-Admin permissions.</p>
      </div>

      {error && <div className="text-error bg-error-container p-3 rounded-lg">{error}</div>}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-label-md uppercase tracking-widest border-b border-outline-variant">
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Current Role</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan="4" className="p-8 text-center text-secondary">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-secondary">No users found.</td></tr>
              ) : users.map(u => {
                const isAdmin = u.roles.includes('ROLE_ADMIN')
                const isSubAdmin = u.roles.includes('ROLE_SUB_ADMIN')
                const isMe = u.email === currentUser?.email
                
                let badgeClass = 'bg-surface-container-high text-secondary'
                let displayRole = 'User'
                if (isAdmin) {
                  badgeClass = 'bg-primary text-white'
                  displayRole = 'Super Admin'
                } else if (isSubAdmin) {
                  badgeClass = 'bg-primary-container text-on-primary-container'
                  displayRole = 'Sub-Admin'
                }

                return (
                  <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4">
                      <div className="font-headline-sm text-on-surface font-bold">{u.fullName}</div>
                      <div className="text-[11px] text-secondary mt-0.5">{u.id}</div>
                    </td>
                    <td className="p-4 text-body-sm">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-secondary">{u.phone}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${badgeClass}`}>
                        {displayRole}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isAdmin ? (
                         <span className="text-xs text-outline italic">Cannot modify Super Admin</span>
                      ) : isSubAdmin ? (
                         <Button variant="ghost" className="text-error border border-error/30 hover:bg-error-container/30" onClick={() => handleRoleChange(u.id, 'ROLE_USER')}>
                           Revoke Sub-Admin
                         </Button>
                      ) : (
                         <Button onClick={() => handleRoleChange(u.id, 'ROLE_SUB_ADMIN')} className="bg-primary text-white hover:brightness-110">
                           Promote to Sub-Admin
                         </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
