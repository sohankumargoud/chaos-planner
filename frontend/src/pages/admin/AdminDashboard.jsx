import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { analyticsService, adminAnnouncementService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const DEMO_METRICS = {
  totalEvents: 4,
  publishedEvents: 3,
  draftEvents: 1,
  totalRegistrations: 8,
  pendingApprovals: 2,
  waitlisted: 0,
  unresolvedConflicts: 1,
  urgentAnnouncements: 1,
  totalVolunteerSlots: 20,
  filledVolunteerSlots: 12,
  understaffedShifts: 3,
  volunteerFillRate: 60,
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(DEMO_METRICS)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      analyticsService.getDashboard(),
      adminAnnouncementService.list(),
    ]).then(([mRes, aRes]) => {
      if (mRes.status === 'fulfilled') setMetrics(mRes.value.data)
      if (aRes.status === 'fulfilled') setAnnouncements(aRes.value.data.content?.slice(0, 5) || [])
    }).finally(() => setLoading(false))
  }, [])

  const fillPct = metrics.totalVolunteerSlots > 0
    ? Math.round(metrics.volunteerFillRate)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Operations Dashboard</h1>
          <p className="font-body-md text-secondary mt-1">Real-time event-day control center</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="border border-outline-variant" onClick={() => navigate('/admin/events')}>
            All Events
          </Button>
          <Button onClick={() => navigate('/admin/events')}>
            <span className="material-symbols-outlined mr-1 text-[18px]">add</span> New Event
          </Button>
        </div>
      </div>

      {/* Critical alerts */}
      <div className="space-y-3">
        {metrics.unresolvedConflicts > 0 && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg flex gap-4 items-start border border-error/20">
            <span className="material-symbols-outlined text-error mt-0.5">meeting_room</span>
            <div>
              <div className="font-headline-sm font-bold">{metrics.unresolvedConflicts} Room Conflict{metrics.unresolvedConflicts > 1 ? 's' : ''} Detected</div>
              <div className="font-body-sm mt-1">One or more room bookings overlap. <Link to="/admin/rooms" className="font-bold underline hover:text-error transition-colors">Resolve now →</Link></div>
            </div>
          </div>
        )}
        {metrics.pendingApprovals > 0 && (
          <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
            <span className="material-symbols-outlined text-[#8f6300] mt-0.5">how_to_reg</span>
            <div>
              <div className="font-headline-sm font-bold">{metrics.pendingApprovals} Registration{metrics.pendingApprovals > 1 ? 's' : ''} Awaiting Approval</div>
              <div className="font-body-sm mt-1"><Link to="/admin/registrations" className="font-bold underline hover:text-[#8f6300] transition-colors">Review registrations →</Link></div>
            </div>
          </div>
        )}
        {metrics.understaffedShifts > 0 && (
          <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
            <span className="material-symbols-outlined text-[#8f6300] mt-0.5">group_off</span>
            <div>
              <div className="font-headline-sm font-bold">{metrics.understaffedShifts} Understaffed Volunteer Shift{metrics.understaffedShifts > 1 ? 's' : ''}</div>
              <div className="font-body-sm mt-1"><Link to="/admin/shifts" className="font-bold underline hover:text-[#8f6300] transition-colors">Manage shifts →</Link></div>
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className={`p-5 flex flex-col ${metrics.pendingApprovals > 0 ? 'border-[#ffe082] bg-[#fffcf0]' : ''}`}>
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Pending Approvals</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.pendingApprovals}</div>
          <div className="font-body-sm text-secondary mt-1">Registration requests</div>
        </Card>
        
        <Card className="p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">event</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Published Events</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.publishedEvents}</div>
          <div className="font-body-sm text-secondary mt-1">{metrics.draftEvents} draft</div>
        </Card>

        <Card className="p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Total Registrations</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.totalRegistrations}</div>
          <div className="font-body-sm text-secondary mt-1">{metrics.waitlisted} waitlisted</div>
        </Card>

        <Card className={`p-5 flex flex-col ${fillPct < 60 ? 'border-[#ffe082] bg-[#fffcf0]' : 'border-green-200 bg-green-50'}`}>
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Volunteer Fill Rate</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{fillPct}%</div>
          <div className="font-body-sm text-secondary mt-1">{metrics.filledVolunteerSlots}/{metrics.totalVolunteerSlots} slots filled</div>
        </Card>

        <Card className={`p-5 flex flex-col ${metrics.unresolvedConflicts > 0 ? 'border-error/30 bg-error-container/30' : ''}`}>
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">domain_disabled</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Room Conflicts</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.unresolvedConflicts}</div>
          <div className="font-body-sm text-secondary mt-1">Unresolved</div>
        </Card>

        <Card className={`p-5 flex flex-col ${metrics.urgentAnnouncements > 0 ? 'border-error/30 bg-error-container/30' : ''}`}>
          <div className="flex items-center gap-3 mb-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">campaign</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Urgent Alerts</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.urgentAnnouncements}</div>
          <div className="font-body-sm text-secondary mt-1">Active right now</div>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-headline-sm font-bold text-on-surface">Quick Actions</h2>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              { icon: 'qr_code_scanner', label: 'Open QR Check-In Scanner', path: '/admin/checkin', bg: 'bg-primary text-white hover:brightness-110' },
              { icon: 'how_to_reg', label: `Review ${metrics.pendingApprovals} Pending Approvals`, path: '/admin/registrations', bg: 'bg-surface-container hover:bg-surface-container-high' },
              { icon: 'campaign', label: 'Send Urgent Announcement', path: '/admin/announcements', bg: 'bg-error text-white hover:brightness-110' },
              { icon: 'meeting_room', label: 'View Room Conflicts', path: '/admin/rooms', bg: 'bg-surface-container hover:bg-surface-container-high' },
              { icon: 'monitoring', label: 'Open Analytics', path: '/admin/analytics', bg: 'bg-surface-container hover:bg-surface-container-high' },
            ].map((a, i) => (
              <Link 
                key={i} 
                to={a.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline-sm transition-colors ${a.bg}`}
              >
                <span className="material-symbols-outlined text-[20px]">{a.icon}</span> 
                {a.label}
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent announcements */}
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h2 className="font-headline-sm font-bold text-on-surface">Recent Announcements</h2>
            <Link to="/admin/announcements" className="text-primary font-label-md hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-outline-variant">
            {announcements.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[48px] opacity-20 mb-3">campaign</span>
                <p className="font-body-md">No announcements yet</p>
              </div>
            ) : announcements.map(a => (
              <div key={a.id} className="p-4 flex gap-4 items-start hover:bg-surface-container-lowest transition-colors">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                  a.priority === 'URGENT' ? 'bg-error text-white' : 
                  a.priority === 'HIGH' ? 'bg-[#fff4ce] text-[#8f6300]' : 
                  'bg-surface-container-high text-secondary'
                }`}>
                  {a.priority}
                </span>
                <div>
                  <div className="font-headline-sm text-on-surface mb-1">{a.title}</div>
                  <div className="font-body-sm text-secondary">
                    {a.event ? `📅 ${a.event.title}` : '🌐 Global'} · {a.targetAudience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
