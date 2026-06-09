import React, { useState, useEffect } from 'react'
import { adminShiftService, adminEventService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const DEMO_SHIFTS = [
  { id: 's001', roleName: 'Check-In Desk', event: { title: 'TechFest 2026' }, startTime: '2026-07-15T08:00:00', endTime: '2026-07-15T11:00:00', slotsTotal: 4, slotsFilled: 2 },
  { id: 's002', roleName: 'Logistics', event: { title: 'TechFest 2026' }, startTime: '2026-07-15T07:00:00', endTime: '2026-07-15T19:00:00', slotsTotal: 6, slotsFilled: 1 },
  { id: 's003', roleName: 'Media & Photography', event: { title: 'TechFest 2026' }, startTime: '2026-07-15T09:00:00', endTime: '2026-07-15T18:00:00', slotsTotal: 2, slotsFilled: 2 },
  { id: 's004', roleName: 'Help Desk', event: { title: 'TechFest 2026' }, startTime: '2026-07-15T09:00:00', endTime: '2026-07-15T18:00:00', slotsTotal: 3, slotsFilled: 0 },
  { id: 's005', roleName: 'Stage Management', event: { title: 'Culture Fest' }, startTime: '2026-07-25T15:00:00', endTime: '2026-07-25T21:30:00', slotsTotal: 3, slotsFilled: 1 },
  { id: 's006', roleName: 'Room Monitor', event: { title: 'Culture Fest' }, startTime: '2026-07-25T17:00:00', endTime: '2026-07-25T21:00:00', slotsTotal: 4, slotsFilled: 0 },
]

export default function ShiftsBoard() {
  const [shifts, setShifts] = useState(DEMO_SHIFTS)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminEventService.list().then(res => {
      if (res.data.content?.length) setEvents(res.data.content)
    }).catch(() => {})
  }, [])

  const grouped = shifts.reduce((acc, s) => {
    const evTitle = s.event?.title || 'Unknown Event'
    if (!acc[evTitle]) acc[evTitle] = []
    acc[evTitle].push(s)
    return acc
  }, {})

  const totalSlots = shifts.reduce((s, sh) => s + sh.slotsTotal, 0)
  const filledSlots = shifts.reduce((s, sh) => s + sh.slotsFilled, 0)
  const understaffed = shifts.filter(s => s.slotsFilled < s.slotsTotal)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Volunteer Shifts Board</h1>
          <p className="font-body-md text-secondary mt-1">Manage shift assignments and staffing levels</p>
        </div>
        <Button onClick={() => alert('Select an event first to create a shift')}>
          <span className="material-symbols-outlined mr-1 text-[18px]">add</span> Add Shift
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Total Shifts</div>
          <div className="font-display text-display font-black text-on-surface">{shifts.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col bg-green-50 border-green-200">
          <div className="font-label-sm uppercase tracking-widest font-bold text-green-800 mb-1">Slots Filled</div>
          <div className="flex items-end gap-2">
            <div className="font-display text-display font-black text-green-700">{filledSlots}</div>
            <div className="font-body-sm text-green-800 mb-1.5">of {totalSlots}</div>
          </div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${understaffed.length > 0 ? 'bg-[#fff4ce] border-[#ffe082]' : 'bg-surface-container-lowest'}`}>
          <div className={`font-label-sm uppercase tracking-widest font-bold mb-1 ${understaffed.length > 0 ? 'text-[#8f6300]' : 'text-secondary'}`}>Understaffed</div>
          <div className={`font-display text-display font-black ${understaffed.length > 0 ? 'text-[#8f6300]' : 'text-on-surface'}`}>{understaffed.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Fill Rate</div>
          <div className="font-display text-display font-black text-on-surface">{totalSlots > 0 ? Math.round(filledSlots / totalSlots * 100) : 0}%</div>
        </Card>
      </div>

      {understaffed.length > 0 && (
        <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
          <span className="material-symbols-outlined text-[#8f6300] mt-0.5">warning</span>
          <div>
            <div className="font-headline-sm font-bold">{understaffed.length} shift{understaffed.length > 1 ? 's' : ''} need volunteers</div>
            <div className="font-body-sm mt-1">{understaffed.map(s => s.roleName).join(', ')}</div>
          </div>
        </div>
      )}

      {/* Grouped by event */}
      {Object.entries(grouped).map(([eventTitle, eventShifts]) => (
        <Card key={eventTitle} className="p-0 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">event</span> {eventTitle}
            </h2>
            <span className="font-body-sm text-secondary">{eventShifts.length} shifts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Role</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Time Window</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Slots</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Status</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {eventShifts.map(s => {
                  const pct = Math.round(s.slotsFilled / s.slotsTotal * 100)
                  const isUnder = s.slotsFilled < s.slotsTotal
                  return (
                    <tr key={s.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4 font-headline-sm text-on-surface">{s.roleName}</td>
                      <td className="px-6 py-4 font-body-sm text-on-surface">{s.startTime?.slice(11, 16)} &ndash; {s.endTime?.slice(11, 16)}</td>
                      <td className="px-6 py-4 font-body-sm font-bold">{s.slotsFilled} <span className="text-secondary font-normal">/ {s.slotsTotal}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                          {isUnder ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-800">Understaffed</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800">Full</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" className="px-3 py-1.5 border border-outline-variant text-sm h-auto" onClick={() => alert('Assign volunteer to ' + s.roleName)}>
                          <span className="material-symbols-outlined text-[16px] mr-1">person_add</span> Assign
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
