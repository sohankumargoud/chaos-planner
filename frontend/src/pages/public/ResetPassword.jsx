import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/services'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/layout/Card'

export default function ResetPassword() {
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate('/login')
    }
  }, [email, navigate])

  const handleReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.resetPassword({ email, otpCode, newPassword })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. You can now log in.' } })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center p-gutter">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="font-display text-display text-primary mb-2">Chaos Planner</h1>
        </div>

        <Card className="w-full shadow-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-fixed text-primary rounded-full mb-6">
              <span className="material-symbols-outlined text-[32px]">password</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Create New Password</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Enter the 6-digit code sent to {email}</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 font-body-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-6 text-center font-body-md">
              Password successfully reset! Redirecting to login...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleReset}>
              <Input 
                label="6-Digit OTP Code"
                icon="pin"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
              />
              <Input 
                label="New Password"
                icon="lock"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
              <Input 
                label="Confirm Password"
                icon="lock"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />

              <div className="pt-2">
                <Button type="submit" className="w-full" loading={loading}>
                  Reset Password
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
