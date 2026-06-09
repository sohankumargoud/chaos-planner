import React, { useState, useRef } from 'react'
import { adminCheckInService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

export default function QRCheckIn() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([
    { qrToken: 'QR-ALICE-TECHFEST-2026-001', attendee: 'Alice Johnson', event: 'TechFest 2026', status: 'checked-in', time: '09:14 AM' },
  ])
  const inputRef = useRef()

  const handleScan = async (token) => {
    const t = token || input.trim()
    if (!t) return
    setLoading(true)
    setResult(null)
    try {
      const res = await adminCheckInService.scan(t)
      const data = res.data
      const entry = {
        qrToken: t,
        attendee: data.registration?.user?.fullName || 'Attendee',
        event: data.registration?.event?.title || 'Event',
        status: 'checked-in',
        time: new Date().toLocaleTimeString(),
      }
      setResult({ type: 'success', ...entry })
      setHistory(h => [entry, ...h.slice(0, 19)])
    } catch (err) {
      const code = err.response?.data?.code
      const msg = err.response?.data?.message || 'Check-in failed'
      if (code === 'ALREADY_CHECKED_IN') {
        setResult({ type: 'duplicate', message: 'This attendee has already checked in!' })
      } else {
        setResult({ type: 'error', message: msg })
      }
    } finally {
      setLoading(false)
      setInput('')
      inputRef.current?.focus()
    }
  }

  const demoScan = (token) => {
    setInput(token)
    handleScan(token)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">QR Check-In Scanner</h1>
        <p className="font-body-md text-secondary mt-1">Scan attendee QR codes to mark attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Scanner */}
        <div className="space-y-4">
          <Card className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px]">qr_code_scanner</span>
              </div>
            </div>
            <h2 className="font-headline-md font-bold text-on-surface mb-2">Manual QR Entry</h2>
            <p className="font-body-sm text-secondary mb-6 max-w-sm mx-auto">
              Type or paste a QR token below, or connect a barcode scanner and scan directly.
            </p>
            <div className="flex gap-2 max-w-[360px] mx-auto">
              <input
                ref={inputRef}
                className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono-sm"
                placeholder="QR-TOKEN-HERE..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                autoFocus
              />
              <Button onClick={() => handleScan()} disabled={loading} className="shrink-0">
                {loading ? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : 'Scan'}
              </Button>
            </div>
          </Card>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg flex items-start gap-4 border ${
              result.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
              result.type === 'duplicate' ? 'bg-[#fff4ce] text-[#8f6300] border-[#ffe082]' : 
              'bg-error-container text-on-error-container border-error/20'
            }`}>
              <span className="material-symbols-outlined mt-0.5">
                {result.type === 'success' ? 'check_circle' : result.type === 'duplicate' ? 'warning' : 'error'}
              </span>
              <div>
                {result.type === 'success' ? (
                  <>
                    <div className="font-headline-sm font-bold mb-1">Checked In Successfully!</div>
                    <div className="font-body-sm">{result.attendee} · {result.event}</div>
                  </>
                ) : (
                  <>
                    <div className="font-headline-sm font-bold mb-1">{result.type === 'duplicate' ? 'Already Checked In' : 'Check-In Failed'}</div>
                    <div className="font-body-sm">{result.message}</div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Demo tokens */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">Demo QR Tokens</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {['QR-BOB-TECHFEST-2026-002', 'QR-DAVID-WORKSHOP-2026-001'].map(t => (
                <div key={t} className="px-6 py-3 flex justify-between items-center hover:bg-surface-container-lowest transition-colors">
                  <span className="font-mono-sm text-xs text-secondary">{t}</span>
                  <Button variant="ghost" className="px-3 py-1 border border-outline-variant h-8 text-xs" onClick={() => demoScan(t)}>Scan</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Check-in log */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h2 className="font-headline-sm font-bold text-on-surface">Check-In Log</h2>
            <span className="font-body-sm text-secondary">{history.length} scans</span>
          </div>
          {history.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-secondary">
              <span className="material-symbols-outlined text-[48px] opacity-20 mb-3">receipt_long</span>
              <p className="font-body-md">No check-ins yet</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {history.map((h, i) => (
                <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-surface-container-lowest transition-colors">
                  <div>
                    <div className="font-headline-sm text-on-surface mb-1">{h.attendee}</div>
                    <div className="font-body-sm text-secondary">{h.event}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800 flex items-center gap-1.5 w-fit ml-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Checked In
                    </span>
                    <div className="font-label-md text-secondary mt-2">{h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
