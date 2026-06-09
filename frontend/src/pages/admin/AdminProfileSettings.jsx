import React, { useState, useEffect } from 'react'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { userService } from '../../services/services' // Assuming this will be updated to handle profile
import { useAuth } from '../../auth/AuthContext'

export default function AdminProfileSettings() {
  const { user, login } = useAuth() // Reusing login to update context
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // In a real scenario, fetch full profile from /api/user/profile
    if (user) {
      setForm(prev => ({ ...prev, fullName: user.fullName || '', email: user.email || '' }))
    }
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // API call to PATCH /api/user/profile
      const res = await userService.updateProfile({
        fullName: form.fullName,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      
      // Update local context
      login({ ...user, fullName: res.data.fullName })
      setSuccess('Profile updated successfully!')
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Profile & Settings</h1>
        <p className="font-body-md text-secondary mt-1">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Card className="flex flex-col items-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-primary text-white font-bold text-3xl flex items-center justify-center mb-4 shadow-sm">
              {initials}
            </div>
            <h3 className="font-headline-sm font-bold text-on-surface">{user?.fullName}</h3>
            <p className="font-body-sm text-secondary">{user?.email}</p>
            <div className="mt-4 px-3 py-1 bg-surface-container-high text-secondary text-[11px] font-bold uppercase tracking-widest rounded">
              Administrator
            </div>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">Account Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-surface-container-lowest">
              {error && <div className="bg-error-container text-on-error-container p-3 rounded font-body-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-700 p-3 border border-green-200 rounded font-body-sm">{success}</div>}

              <div className="space-y-4">
                <h3 className="font-label-md text-outline uppercase tracking-widest font-bold">Personal Details</h3>
                <Input 
                  label="Full Name" 
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="Email Address" 
                  name="email"
                  value={form.email}
                  disabled
                  // Email usually cannot be changed easily without re-verification, so we disable it
                />
              </div>

              <div className="border-t border-outline-variant pt-6 space-y-4">
                <h3 className="font-label-md text-outline uppercase tracking-widest font-bold">Security</h3>
                <p className="font-body-sm text-secondary mb-2">Leave blank if you don't want to change your password.</p>
                <Input 
                  label="Current Password" 
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="New Password" 
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Confirm New Password" 
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
