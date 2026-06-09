import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userRegService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const DEMO = [
  { id: 'r001', event: { title: 'TechFest 2026', eventDate: '2026-07-15', venueName: 'Main Campus Hall' }, status: 'APPROVED', registeredAt: '2026-06-01T00:00:00' },
  { id: 'r004', event: { title: 'Leadership Workshop', eventDate: '2026-07-20', venueName: 'Innovation Hub' }, status: 'PENDING', registeredAt: '2026-06-03T00:00:00' },
]

const STATUS_COLORS = { 
  APPROVED: 'bg-green-100 text-green-800', 
  PENDING: 'bg-[#fff4ce] text-[#8f6300]', 
  CANCELLED: 'bg-surface-container-high text-secondary', 
  WAITLISTED: 'bg-blue-100 text-blue-800', 
  REJECTED: 'bg-error-container text-on-error-container' 
}

export default function MyRegistrations() {
  const [regs, setRegs] = useState(DEMO)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userRegService.myRegistrations().then(res => { if (res.data?.length) setRegs(res.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return
    try {
      await userRegService.cancel(id)
      setRegs(r => r.map(x => x.id === id ? { ...x, status: 'CANCELLED' } : x))
    } catch { alert('Failed to cancel') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">My Registrations</h1>
          <p className="font-body-md text-secondary mt-1">All your event registrations</p>
        </div>
        <Link to="/events" className="px-4 py-2 font-headline-sm rounded-lg bg-primary text-white hover:brightness-110 transition-colors flex items-center gap-2 shadow-sm">
          Browse Events <span className="material-symbols-outlined text-[18px]">search</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-secondary">
          <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
        </div>
      ) : regs.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container text-secondary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
          </div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">No registrations yet</h3>
          <p className="font-body-sm text-secondary mb-6">Browse upcoming events and register</p>
          <Link to="/events" className="px-4 py-2 font-headline-sm rounded-lg bg-primary text-white hover:brightness-110 transition-colors shadow-sm">Browse Events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {regs.map(r => (
            <Card key={r.id} className="p-6 hover:shadow-md transition-shadow hover:border-outline">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="font-headline-sm font-bold text-on-surface mb-3">{r.event?.title}</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 font-body-sm text-secondary">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span> {r.event?.eventDate}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span> {r.event?.venueName}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">history</span> Registered: {r.registeredAt?.slice(0, 10)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end shrink-0 w-full md:w-auto">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-800'}`}>
                    {r.status === 'APPROVED' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                    {r.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                    {r.status}
                  </span>
                  {r.status === 'APPROVED' && (
                    <Link to="/my-qr" className="px-3 py-1.5 text-label-md font-bold border border-outline-variant rounded hover:bg-surface-container transition-colors flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span> QR Pass
                    </Link>
                  )}
                  {(r.status === 'APPROVED' || r.status === 'PENDING') && (
                    <Button variant="ghost" className="px-3 py-1.5 text-error hover:bg-error/10 border border-error/20" onClick={() => handleCancel(r.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
