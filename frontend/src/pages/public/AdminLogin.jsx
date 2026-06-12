import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/services'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [user, navigate])

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
    <div className="min-h-screen flex bg-surface-container-lowest">
      
      {/* Left Panel: Branding & Context (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-on-primary-fixed p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm mb-6 border border-white/10 shadow-sm">
            <span className="material-symbols-outlined text-white text-[24px]">admin_panel_settings</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold mb-4 text-white">Chaos Planner</h1>
          <p className="font-body-lg text-white/90 max-w-md leading-relaxed">
            The operations-first command center. Manage shifts, resolve room conflicts, and orchestrate events with precision.
          </p>
        </div>

        <div className="relative z-10">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse shadow-[0_0_8px_#4ade80]"></div>
              <span className="font-label-sm uppercase tracking-widest text-white font-bold">System Status: Online</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                 <span className="text-white/80">Core Services</span>
                 <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-xs">Operational</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-white/80">Room Guard Engine</span>
                 <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-xs">Active</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative bg-surface-container-lowest">
        <main className="w-full max-w-[440px]">
          {/* Mobile Only Header */}
          <div className="lg:hidden mb-10 flex flex-col items-center text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
               <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
             </div>
             <h1 className="font-display text-3xl font-extrabold text-primary">Chaos Planner</h1>
          </div>

          <div className="mb-10">
            <h2 className="font-headline-lg text-4xl font-bold text-on-surface mb-2">Admin Portal</h2>
            <p className="font-body-md text-secondary">Sign in with your operational credentials.</p>
          </div>

          {location.state?.message && !error && (
            <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg mb-6 font-body-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] mt-0.5">check_circle</span>
              <p>{location.state.message}</p>
            </div>
          )}

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 font-body-sm flex items-start gap-3 border border-error/20">
               <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
               <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <Input 
              label="Email Address"
              icon="mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chaosplanner.com"
              required
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">
                  Password
                </label>
                <button type="button" className="font-label-sm text-label-sm text-primary hover:underline transition-all font-semibold">
                  Forgot password?
                </button>
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

            <div className="pt-2">
              <Button type="submit" className="w-full h-12" loading={loading}>
                Access Command Center
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Button>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-outline-variant">
            <div className="flex items-center gap-2 text-secondary">
               <span className="material-symbols-outlined text-[16px]">gpp_good</span>
               <p className="font-label-sm uppercase tracking-widest font-bold">
                 Internal Utility
               </p>
            </div>
            <p className="font-body-sm text-secondary mt-2">
              For authorized personnel only. Access is logged and monitored.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
