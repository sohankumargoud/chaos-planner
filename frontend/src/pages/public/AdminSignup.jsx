import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/services'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/layout/Card'

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.signupAdmin({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        secretCode: formData.secretCode
      })
      // Send OTP is triggered by backend, navigate to verify OTP
      navigate('/verify-otp', { state: { email: formData.email, otpType: 'SIGNUP', isAdmin: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center p-gutter">
      <main className="w-full max-w-[480px] flex flex-col items-center mt-12 mb-12">
        {/* Brand Identity / Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
          </div>
          <h1 className="font-display text-display text-primary mb-2">Chaos Planner</h1>
          <p className="font-body-md text-body-md text-secondary">Organizer & Admin Portal</p>
        </div>

        <Card className="w-full shadow-sm">
          <div className="mb-8 text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Register as Admin</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Enter your organization's secret code to join.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            <Input
              label="Full Name"
              icon="person"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              required
            />

            <Input
              label="Email Address"
              icon="mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@chaosplanner.com"
              required
            />

            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full pl-10 pr-12 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg input-focus-ring transition-all placeholder:text-outline/50"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <Input
              label="Confirm Password"
              icon="lock"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="border-t border-outline-variant pt-5 mt-5">
              <Input
                label="Secret Registration Code"
                icon="key"
                type="text"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                placeholder="Enter club registration code"
                required
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" loading={loading}>
                Create Admin Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center font-body-sm text-secondary">
            Already an admin? <button onClick={() => navigate('/admin/login')} className="text-primary hover:underline font-semibold">Sign in here</button>
          </div>
        </Card>
      </main>
    </div>
  )
}
