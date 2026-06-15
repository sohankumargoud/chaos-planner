import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/services'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/layout/Card'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authService.forgotPassword({ email })
      setSuccess(true)
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.')
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
              <span className="material-symbols-outlined text-[32px]">lock_reset</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Reset Password</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Enter your email address to receive a 6-digit recovery code.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 font-body-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-6 text-center font-body-md">
              Recovery code sent! Redirecting...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleRequestReset}>
              <Input 
                label="Email Address"
                icon="mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@university.edu"
                required
              />

              <div className="pt-2 space-y-3">
                <Button type="submit" className="w-full" loading={loading}>
                  Send Recovery Code
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate(-1)}>
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
