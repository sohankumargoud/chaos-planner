import React, { useState } from 'react'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const DEMO_CONFLICTS = [
  {
    id: 1,
    room: { name: 'Seminar Room B1', venue: { name: 'Main Campus Hall' } },
    eventA: { title: 'TechFest 2026', status: 'PUBLISHED' },
    eventB: { title: 'Club Orientation Day', status: 'DRAFT' },
    conflictDate: '2026-07-15',
    startTime: '09:00',
    endTime: '14:00',
    resolved: false,
    detectedAt: '2026-06-04T10:30:00',
  }
]

const DEMO_ROOMS = [
  { id: 1, name: 'Auditorium A', venueName: 'Main Campus Hall', capacity: 500, floor: 'Ground' },
  { id: 2, name: 'Seminar Room B1', venueName: 'Main Campus Hall', capacity: 80, floor: '1st' },
  { id: 3, name: 'Seminar Room B2', venueName: 'Main Campus Hall', capacity: 80, floor: '1st' },
  { id: 4, name: 'Innovation Lab', venueName: 'Innovation Hub', capacity: 120, floor: 'Ground' },
  { id: 5, name: 'Conference Room 1', venueName: 'Innovation Hub', capacity: 40, floor: '2nd' },
  { id: 6, name: 'Main Hall', venueName: 'Student Union Building', capacity: 300, floor: 'Ground' },
]

export default function RoomsConflicts() {
  const [conflicts, setConflicts] = useState(DEMO_CONFLICTS)
  const [activeTab, setActiveTab] = useState('conflicts')

  const unresolvedCount = conflicts.filter(c => !c.resolved).length

  const handleResolve = (id) => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c))
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Rooms & Conflicts</h1>
        <p className="font-body-md text-secondary mt-1">Venue management and room conflict detection</p>
      </div>

      {unresolvedCount > 0 && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg flex gap-4 items-start border border-error/20">
          <span className="material-symbols-outlined text-error mt-0.5">domain_disabled</span>
          <div>
            <div className="font-headline-sm font-bold">{unresolvedCount} Unresolved Room Conflict{unresolvedCount > 1 ? 's' : ''}</div>
            <div className="font-body-sm mt-1">Overlapping bookings detected. Review and resolve below.</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-outline-variant mb-6 pb-2">
        <button 
          className={`px-4 py-2 font-headline-sm rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'conflicts' ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-container-low'}`} 
          onClick={() => setActiveTab('conflicts')}
        >
          Conflicts 
          {unresolvedCount > 0 && (
            <span className="bg-error text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ml-1">
              {unresolvedCount}
            </span>
          )}
        </button>
        <button 
          className={`px-4 py-2 font-headline-sm rounded-lg transition-colors ${activeTab === 'rooms' ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-container-low'}`} 
          onClick={() => setActiveTab('rooms')}
        >
          All Rooms
        </button>
      </div>

      {activeTab === 'conflicts' && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-headline-sm font-bold text-on-surface">Room Conflicts</h2>
            <span className="font-body-sm text-secondary">Auto-detected overlapping bookings</span>
          </div>
          {conflicts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>
              <h3 className="font-headline-sm font-bold text-on-surface mb-1">No conflicts detected</h3>
              <p className="font-body-sm text-secondary">All room bookings are clear</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {conflicts.map(c => (
                <div key={c.id} className={`p-6 transition-colors ${c.resolved ? 'bg-surface-container-lowest opacity-60' : 'bg-surface-container-lowest'}`}>
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${c.resolved ? 'bg-green-100 text-green-800' : 'bg-error text-white'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.resolved ? 'bg-green-500' : 'bg-white'}`}></span>
                          {c.resolved ? 'Resolved' : 'Conflict'}
                        </span>
                        <span className="font-body-sm text-secondary">Detected {c.detectedAt?.slice(0, 10)}</span>
                      </div>
                      
                      <div className="font-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">meeting_room</span> 
                        {c.room?.name} <span className="text-secondary font-normal">— {c.room?.venue?.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                        <div className="p-4 bg-primary-fixed/20 rounded-lg border border-primary-fixed">
                          <div className="font-label-sm text-primary uppercase tracking-widest font-bold mb-1">Event A</div>
                          <div className="font-headline-sm font-bold text-on-surface mb-2">{c.eventA?.title}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                            c.eventA?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-secondary'
                          }`}>
                            {c.eventA?.status}
                          </span>
                        </div>
                        <div className="p-4 bg-error-container/30 rounded-lg border border-error-container">
                          <div className="font-label-sm text-error uppercase tracking-widest font-bold mb-1">Event B</div>
                          <div className="font-headline-sm font-bold text-on-surface mb-2">{c.eventB?.title}</div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                            c.eventB?.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-secondary'
                          }`}>
                            {c.eventB?.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 font-body-sm text-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">schedule</span> 
                        Overlap: {c.conflictDate} &middot; {c.startTime} &ndash; {c.endTime}
                      </div>
                    </div>
                    {!c.resolved && (
                      <Button onClick={() => handleResolve(c.id)} className="bg-green-600 hover:bg-green-700 text-white shrink-0">
                        <span className="material-symbols-outlined mr-1 text-[18px]">check</span> Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'rooms' && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-headline-sm font-bold text-on-surface">All Rooms</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Room</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Venue</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Capacity</th>
                  <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Floor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {DEMO_ROOMS.map(r => (
                  <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 font-headline-sm text-on-surface">{r.name}</td>
                    <td className="px-6 py-4 font-body-sm text-secondary">{r.venueName}</td>
                    <td className="px-6 py-4 font-body-sm text-on-surface">{r.capacity}</td>
                    <td className="px-6 py-4 font-body-sm text-secondary">{r.floor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
