import React, { useState, useEffect } from 'react'
import { userShiftService } from '../../services/services'
import { Card } from '../../components/layout/Card'

const DEMO = [
  { id: 'v001', shift: { roleName: 'Check-In Desk', event: { title: 'TechFest 2026' }, startTime: '2026-07-15T08:00:00', endTime: '2026-07-15T11:00:00' }, status: 'CONFIRMED' },
  { id: 'v006', shift: { roleName: 'Stage Management', event: { title: 'Culture Fest' }, startTime: '2026-07-25T15:00:00', endTime: '2026-07-25T21:30:00' }, status: 'ASSIGNED' },
]

const STATUS_COLORS = { 
  ASSIGNED: 'bg-[#fff4ce] text-[#8f6300]', 
  CONFIRMED: 'bg-green-100 text-green-800', 
  DECLINED: 'bg-error-container text-on-error-container', 
  COMPLETED: 'bg-surface-container-high text-secondary' 
}

export default function MyShifts() {
  const [assignments, setAssignments] = useState(DEMO)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userShiftService.myShifts().then(res => { if (res.data?.length) setAssignments(res.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">My Volunteer Shifts</h1>
        <p className="font-body-md text-secondary mt-1">Your assigned and open volunteer shifts</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-secondary">
          <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container text-secondary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">groups</span>
          </div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">No shifts assigned yet</h3>
          <p className="font-body-sm text-secondary">Browse open shifts on the events page to volunteer</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map(a => (
            <Card key={a.id} className="p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="font-headline-sm font-bold text-on-surface mb-2">{a.shift?.roleName}</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 font-body-sm text-secondary">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">event</span> {a.shift?.event?.title}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> {a.shift?.startTime?.slice(0, 16).replace('T', ' ')} &ndash; {a.shift?.endTime?.slice(11, 16)}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit shrink-0 ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-800'}`}>
                  {a.status === 'CONFIRMED' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                  {a.status === 'ASSIGNED' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                  {a.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
