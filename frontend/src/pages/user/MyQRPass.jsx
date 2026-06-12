import React, { useState, useEffect } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { userRegService } from '../../services/services'
import { QRCodeSVG } from 'qrcode.react'
import { Card } from '../../components/layout/Card'

import api from '../../services/api'

export default function MyQRPass() {
  const { user } = useAuth()
  const [regs, setRegs] = useState([])
  const [selected, setSelected] = useState(null)
  const [qrImgUrl, setQrImgUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userRegService.myRegistrations()
      .then(res => {
        const approved = (res.data || []).filter(r => r.status === 'APPROVED')
        if (approved.length) { setRegs(approved); setSelected(approved[0]) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const approvedRegs = regs.filter(r => r.status === 'APPROVED')
  const activeReg = selected || approvedRegs[0]

  useEffect(() => {
    if (activeReg?.id) {
      api.get(`/user/my-qr/${activeReg.id}`, { responseType: 'blob' })
        .then(res => {
          const url = URL.createObjectURL(res.data)
          setQrImgUrl(url)
        })
        .catch(err => console.error('Failed to load QR image', err))
    }
  }, [activeReg?.id])

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-secondary">
        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">My QR Pass</h1>
        <p className="font-body-md text-secondary mt-1">Show this at the event check-in desk</p>
      </div>

      {approvedRegs.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container text-secondary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
          </div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">No QR passes available</h3>
          <p className="font-body-sm text-secondary">Your QR pass will appear here once your registration is approved.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 max-w-[480px] mx-auto w-full">
          {/* Event selector */}
          {approvedRegs.length > 1 && (
            <div className="w-full">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block mb-1.5">Select Event</label>
              <select 
                className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                value={activeReg?.id}
                onChange={e => setSelected(approvedRegs.find(r => r.id === e.target.value))}
              >
                {approvedRegs.map(r => (
                  <option key={r.id} value={r.id}>{r.event?.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* QR Pass Card */}
          <Card className="w-full p-0 overflow-hidden text-center shadow-md">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1.5">Entry Pass</div>
              <div className="font-display text-[22px] leading-tight font-black mb-1 drop-shadow-sm">{activeReg?.event?.title}</div>
              <div className="font-body-sm opacity-90 flex items-center justify-center gap-3">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {activeReg?.event?.eventDate}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {activeReg?.event?.venueName}</span>
              </div>
            </div>

            <div className="p-8 pb-4">
              <div className="mb-6">
                <div className="font-headline-sm font-bold text-on-surface">{user?.fullName || 'Attendee'}</div>
                <div className="font-body-sm text-secondary">{user?.email || 'email@example.com'}</div>
              </div>

              {/* QR Code */}
              <div className="inline-block p-4 bg-white rounded-xl border border-outline-variant shadow-sm mb-5">
                {qrImgUrl ? (
                  <img src={qrImgUrl} alt="Entry QR Pass" className="w-[200px] h-[200px] object-contain" />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 text-green-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Approved
                </span>
              </div>

              <div className="text-[10px] text-outline font-mono-sm break-all mt-4 px-4">
                {activeReg?.id}
              </div>
            </div>
          </Card>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start border border-blue-200 w-full">
            <span className="material-symbols-outlined mt-0.5 text-blue-600">info</span>
            <div>
              <div className="font-headline-sm font-bold mb-1">How to use your pass</div>
              <div className="font-body-sm text-blue-700">Show this QR code to the check-in volunteer at the event entrance. Each pass can only be scanned once.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
