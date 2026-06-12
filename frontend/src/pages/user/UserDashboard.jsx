import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { userRegService, userNotifService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'



const STATUS_COLORS = { 
  APPROVED: 'bg-green-100 text-green-800', 
  PENDING: 'bg-[#fff4ce] text-[#8f6300]', 
  CANCELLED: 'bg-surface-container-high text-secondary', 
  WAITLISTED: 'bg-blue-100 text-blue-800' 
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [regs, setRegs] = useState([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    Promise.allSettled([
      userRegService.myRegistrations(),
      userNotifService.unreadCount(),
    ]).then(([rRes, nRes]) => {
      if (rRes.status === 'fulfilled') setRegs(rRes.value.data)
      if (nRes.status === 'fulfilled') setUnread(nRes.value.data.count)
    })
  }, [])

  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Good day, {firstName} 👋</h1>
          <p className="font-body-md text-secondary mt-1">Here's your event overview</p>
        </div>
        <Link to="/events" className="px-4 py-2 font-headline-sm rounded-lg bg-primary text-white hover:brightness-110 transition-colors flex items-center gap-2 shadow-sm">
          Browse Events <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">My Registrations</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{regs.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Volunteer Shifts</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">1</div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${unread > 0 ? 'bg-[#fffcf0] border-[#ffe082]' : 'bg-surface-container-lowest'}`}>
          <div className={`flex items-center gap-3 mb-3 ${unread > 0 ? 'text-[#8f6300]' : 'text-secondary'}`}>
            <span className="material-symbols-outlined text-[20px]">{unread > 0 ? 'notifications_active' : 'notifications'}</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Unread Notifications</span>
          </div>
          <div className={`font-display text-display font-black ${unread > 0 ? 'text-[#8f6300]' : 'text-on-surface'}`}>{unread}</div>
        </Card>
      </div>

      {unread > 0 && (
        <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
          <span className="material-symbols-outlined text-[#8f6300] mt-0.5">notifications_active</span>
          <div>
            <div className="font-headline-sm font-bold">{unread} unread notification{unread > 1 ? 's' : ''}</div>
            <div className="font-body-sm mt-1">
              <Link to="/notifications" className="font-bold underline hover:text-[#8f6300] transition-colors">View all →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Registrations */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h2 className="font-headline-sm font-bold text-on-surface">My Registrations</h2>
          <Link to="/my-registrations" className="text-primary font-label-md hover:underline">View All</Link>
        </div>
        
        {regs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center text-secondary">
            <span className="material-symbols-outlined text-[48px] opacity-20 mb-3">confirmation_number</span>
            <h3 className="font-headline-sm font-bold text-on-surface mb-1">No registrations yet</h3>
            <p className="font-body-md mb-4">Browse upcoming events and register</p>
            <Link to="/events" className="px-4 py-2 font-headline-sm rounded-lg bg-primary text-white hover:brightness-110 transition-colors shadow-sm">Browse Events</Link>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {regs.slice(0, 3).map(r => (
              <div key={r.id} className="p-6 hover:bg-surface-container-lowest transition-colors">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div>
                    <div className="font-headline-sm font-bold text-on-surface mb-1">{r.event?.title}</div>
                    <div className="font-body-sm text-secondary flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {r.event?.eventDate}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {r.event?.venueName}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-800'}`}>
                      {r.status === 'APPROVED' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                      {r.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                      {r.status}
                    </span>
                    {r.status === 'APPROVED' && (
                      <Link to="/my-qr" className="px-3 py-1.5 text-label-md font-bold border border-outline-variant rounded hover:bg-surface-container transition-colors flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">qr_code_2</span> QR Pass
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
