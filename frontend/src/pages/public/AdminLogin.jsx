import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/services'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/layout/Card'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authService.loginAdmin({ email, password })
      login(res.data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or missing privileges')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center p-gutter">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Identity / Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-display text-primary mb-2">Chaos Planner</h1>
          <p className="font-body-md text-body-md text-secondary">Command Center Authentication</p>
        </div>

        {/* Professional Centered Auth Card */}
        <Card className="w-full shadow-sm">
          <div className="mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Sign In</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Enter your operational credentials to continue.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 font-body-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <Input 
              label="Email Address"
              icon="mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@chaosplanner.com"
              required
            />

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="font-label-sm text-label-sm text-primary hover:underline transition-all">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg input-focus-ring transition-all placeholder:text-outline/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* CTA Button */}
            <div className="pt-2">
              <Button type="submit" className="w-full" loading={loading}>
                Sign in to Command Center
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Internal utility for system administrators. <a href="#" className="text-primary font-semibold hover:underline">Access Policy</a>
            </p>
          </div>
        </Card>

        {/* Footer Decoration / Visual Balance */}
        <footer className="mt-12 w-full flex items-center gap-6 opacity-40">
          <div className="h-[1px] flex-1 bg-outline-variant"></div>
          <div className="font-mono-sm text-mono-sm text-outline uppercase tracking-widest">v2.4.0 OPERATIONAL</div>
          <div className="h-[1px] flex-1 bg-outline-variant"></div>
        </footer>
      </main>
    </div>
  )
}
