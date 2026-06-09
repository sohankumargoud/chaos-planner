import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/services'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/layout/Card'

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(59)
  
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email || ''
  const otpType = location.state?.otpType || 'SIGNUP'

  useEffect(() => {
    if (!email) {
      navigate('/login')
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Move to next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.verifyOtp({ email, otpCode: code, otpType })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { state: { message: 'Verification successful. You can now log in.' } })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    try {
      await authService.resendOtp(email, otpType)
      setCountdown(59)
      setError('')
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.')
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <header className="flex justify-between items-center h-header-height px-container-margin w-full bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="font-display text-headline-lg font-black text-primary">Chaos Planner</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-gutter">
        <Card className="max-w-[440px] w-full p-8 shadow-sm">
          {/* Icon & Branding */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-fixed text-primary rounded-full mb-6">
              <span className="material-symbols-outlined text-[32px]">shield_person</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg mb-2 text-on-surface">Security Verification</h1>
            <p className="font-body-md text-secondary">
              We sent a 6-digit code to <span className="text-on-surface font-semibold">{email || 'your email'}</span>
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleVerify}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`w-12 h-14 text-center text-headline-md font-bold border ${error ? 'border-error text-error' : 'border-outline-variant'} bg-surface-container-low rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={success || loading}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded border border-error/20">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="font-label-md">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Button type="submit" className="w-full h-12 shadow-sm" loading={loading} disabled={success}>
                Verify & Continue
              </Button>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  className={`text-primary font-label-md hover:underline decoration-2 underline-offset-4 ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleResend}
                  disabled={countdown > 0}
                >
                  Resend code
                </button>
                <p className="font-label-sm text-secondary">
                  {countdown > 0 ? `Wait 0:${countdown < 10 ? '0' : ''}${countdown} to resend` : 'You can resend now'}
                </p>
              </div>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant">
            <p className="font-label-sm text-secondary text-center uppercase tracking-widest">Command Center Security</p>
          </div>
        </Card>
      </main>

      {success && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300">
          <div className="bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="font-body-md">Verification successful. Redirecting...</span>
          </div>
        </div>
      )}
    </div>
  )
}
