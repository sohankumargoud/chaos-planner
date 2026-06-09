import React, { useState, useEffect } from 'react'
import { analyticsService } from '../../services/services'
import { Card } from '../../components/layout/Card'

const DEMO = {
  totalEvents: 4, publishedEvents: 3, draftEvents: 1, cancelledEvents: 0,
  totalRegistrations: 8, pendingApprovals: 2, waitlisted: 0,
  unresolvedConflicts: 1, urgentAnnouncements: 1,
  totalVolunteerSlots: 20, filledVolunteerSlots: 12, understaffedShifts: 3,
  volunteerFillRate: 60,
}

function Gauge({ value, max = 100, color = '#2563eb', label }) {
  const pct = Math.min(Math.round(value), 100)
  return (
    <div className="flex flex-col items-center">
      <svg width={120} height={70} viewBox="0 0 120 70">
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#e5e7eb" strokeWidth={10} strokeLinecap="round" />
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${pct * 1.57} 157`} />
      </svg>
      <div className="font-display text-headline-lg font-black text-on-surface -mt-4">{pct}%</div>
      <div className="font-body-sm text-secondary mt-1">{label}</div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(DEMO)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    analyticsService.getDashboard().then(res => setMetrics(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const fillRate = metrics.totalVolunteerSlots > 0 ? Math.round(metrics.filledVolunteerSlots / metrics.totalVolunteerSlots * 100) : 0

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Analytics</h1>
        <p className="font-body-md text-secondary mt-1">Event performance and operations metrics</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2 text-blue-800">
            <span className="material-symbols-outlined text-[20px]">event</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Total Events</span>
          </div>
          <div className="font-display text-display font-black text-blue-900">{metrics.totalEvents}</div>
          <div className="font-body-sm text-blue-700 mt-1">{metrics.publishedEvents} published</div>
        </Card>
        
        <Card className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-secondary">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Registrations</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.totalRegistrations}</div>
          <div className="font-body-sm text-secondary mt-1">{metrics.pendingApprovals} pending</div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${metrics.unresolvedConflicts > 0 ? 'bg-error-container/30 border-error/30' : 'bg-green-50 border-green-200'}`}>
          <div className={`flex items-center gap-2 mb-2 ${metrics.unresolvedConflicts > 0 ? 'text-error' : 'text-green-800'}`}>
            <span className="material-symbols-outlined text-[20px]">{metrics.unresolvedConflicts > 0 ? 'domain_disabled' : 'domain_verification'}</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Room Conflicts</span>
          </div>
          <div className={`font-display text-display font-black ${metrics.unresolvedConflicts > 0 ? 'text-error' : 'text-green-900'}`}>{metrics.unresolvedConflicts}</div>
          <div className={`font-body-sm mt-1 ${metrics.unresolvedConflicts > 0 ? 'text-error' : 'text-green-700'}`}>{metrics.unresolvedConflicts > 0 ? 'Unresolved' : 'Clear'}</div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${metrics.understaffedShifts > 0 ? 'bg-[#fff4ce] border-[#ffe082]' : 'bg-green-50 border-green-200'}`}>
          <div className={`flex items-center gap-2 mb-2 ${metrics.understaffedShifts > 0 ? 'text-[#8f6300]' : 'text-green-800'}`}>
            <span className="material-symbols-outlined text-[20px]">{metrics.understaffedShifts > 0 ? 'group_off' : 'groups'}</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Understaffed Shifts</span>
          </div>
          <div className={`font-display text-display font-black ${metrics.understaffedShifts > 0 ? 'text-[#8f6300]' : 'text-green-900'}`}>{metrics.understaffedShifts}</div>
          <div className={`font-body-sm mt-1 ${metrics.understaffedShifts > 0 ? 'text-[#8f6300]' : 'text-green-700'}`}>{metrics.understaffedShifts > 0 ? 'Need volunteers' : 'Fully staffed'}</div>
        </Card>
        
        <Card className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-secondary">
            <span className="material-symbols-outlined text-[20px]">person_check</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Volunteer Slots</span>
          </div>
          <div className="font-display text-display font-black text-on-surface">{metrics.filledVolunteerSlots}<span className="text-secondary text-headline-sm font-bold">/{metrics.totalVolunteerSlots}</span></div>
          <div className="font-body-sm text-secondary mt-1">Filled vs total</div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${metrics.urgentAnnouncements > 0 ? 'bg-error-container/30 border-error/30' : ''}`}>
          <div className={`flex items-center gap-2 mb-2 ${metrics.urgentAnnouncements > 0 ? 'text-error' : 'text-secondary'}`}>
            <span className="material-symbols-outlined text-[20px]">campaign</span>
            <span className="font-label-sm uppercase tracking-widest font-bold">Urgent Alerts</span>
          </div>
          <div className={`font-display text-display font-black ${metrics.urgentAnnouncements > 0 ? 'text-error' : 'text-on-surface'}`}>{metrics.urgentAnnouncements}</div>
          <div className={`font-body-sm mt-1 ${metrics.urgentAnnouncements > 0 ? 'text-error' : 'text-secondary'}`}>{metrics.urgentAnnouncements > 0 ? 'Active right now' : 'None active'}</div>
        </Card>
      </div>

      {/* Gauges */}
      <Card className="p-0 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
          <h2 className="font-headline-sm font-bold text-on-surface">Key Performance Rates</h2>
        </div>
        <div className="p-8 flex justify-around flex-wrap gap-8">
          <Gauge value={fillRate} color="#2563eb" label="Volunteer Fill Rate" />
          <Gauge value={metrics.publishedEvents / Math.max(metrics.totalEvents, 1) * 100} color="#16a34a" label="Event Publish Rate" />
          <Gauge value={metrics.pendingApprovals > 0 ? 30 : 100} color="#ca8a04" label="Approval Throughput" />
          <Gauge value={metrics.unresolvedConflicts > 0 ? 20 : 100} color="#dc2626" label="Room Readiness" />
        </div>
      </Card>

      {/* Ops summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-headline-sm font-bold text-on-surface">Event Status Breakdown</h2>
          </div>
          <div className="p-6">
            {[
              { label: 'Published', value: metrics.publishedEvents, color: 'bg-green-500' },
              { label: 'Draft', value: metrics.draftEvents, color: 'bg-gray-400' },
              { label: 'Cancelled', value: metrics.cancelledEvents, color: 'bg-red-500' },
            ].map(b => (
              <div key={b.label} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md font-bold text-on-surface">{b.label}</span>
                  <span className="font-label-md text-secondary">{b.value}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.value / Math.max(metrics.totalEvents, 1) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h2 className="font-headline-sm font-bold text-on-surface">Volunteer Staffing</h2>
          </div>
          <div className="p-6">
            {[
              { label: 'Filled Slots', value: metrics.filledVolunteerSlots, total: metrics.totalVolunteerSlots, color: 'bg-green-500' },
              { label: 'Open Slots', value: metrics.totalVolunteerSlots - metrics.filledVolunteerSlots, total: metrics.totalVolunteerSlots, color: 'bg-red-400' },
              { label: 'Understaffed Shifts', value: metrics.understaffedShifts, total: metrics.totalVolunteerSlots, color: 'bg-yellow-500' },
            ].map(b => (
              <div key={b.label} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md font-bold text-on-surface">{b.label}</span>
                  <span className="font-label-md text-secondary">{b.value}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${Math.min(b.value / Math.max(b.total, 1) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
