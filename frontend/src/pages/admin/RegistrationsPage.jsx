import React, { useState, useEffect } from 'react'
import { adminRegService, adminEventService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const STATUS_COLORS = { 
  APPROVED: 'bg-green-100 text-green-800', 
  PENDING: 'bg-[#fff4ce] text-[#8f6300]', 
  REJECTED: 'bg-error-container text-on-error-container', 
  CANCELLED: 'bg-surface-container-high text-secondary', 
  WAITLISTED: 'bg-blue-100 text-blue-800' 
}



export default function RegistrationsPage() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [regs, setRegs] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    adminEventService.list().then(res => {
      if (res.data.content?.length) setEvents(res.data.content.map(e => ({ id: e.id, title: e.title })))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedEvent) return
    setLoading(true)
    adminRegService.getByEvent(selectedEvent).then(res => {
      setRegs(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [selectedEvent])

  const filtered = regs.filter(r => {
    const name = r.user?.fullName?.toLowerCase() || ''
    const email = r.user?.email?.toLowerCase() || ''
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    const matchStatus = !statusFilter || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleApprove = async (id) => {
    try { await adminRegService.approve(id); setRegs(r => r.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x)) } catch { alert('Failed') }
  }
  const handleReject = async (id) => {
    try { await adminRegService.reject(id); setRegs(r => r.map(x => x.id === id ? { ...x, status: 'REJECTED' } : x)) } catch { alert('Failed') }
  }
  const handleCancel = async (id) => {
    try { await adminRegService.cancel(id); setRegs(r => r.map(x => x.id === id ? { ...x, status: 'CANCELLED' } : x)) } catch { alert('Failed') }
  }

  const pending = filtered.filter(r => r.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Registrations</h1>
        <p className="font-body-md text-secondary mt-1">Manage attendee registrations and approvals</p>
      </div>

      {pending > 0 && (
        <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
          <span className="material-symbols-outlined text-[#8f6300] mt-0.5">hourglass_empty</span>
          <div>
            <div className="font-headline-sm font-bold">{pending} registrations awaiting approval</div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface-container-low p-4 rounded-lg border border-outline-variant">
        <div className="relative w-full sm:max-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            placeholder="Search attendees..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <select 
          className="w-full sm:max-w-[200px] px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          value={selectedEvent} 
          onChange={e => setSelectedEvent(e.target.value)}
        >
          <option value="">Select Event</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select 
          className="w-full sm:max-w-[150px] px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span className="text-body-sm text-secondary ml-auto">{filtered.length} registrations</span>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Attendee</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Email</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Status</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Registered</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary"><span className="material-symbols-outlined animate-spin text-[32px]">sync</span></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[48px] text-outline opacity-50 mb-4">how_to_reg</span>
                      <h3 className="font-headline-sm font-bold text-on-surface mb-1">No registrations found</h3>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4 font-headline-sm text-on-surface">{r.user?.fullName}</td>
                  <td className="px-6 py-4 font-body-sm text-secondary">{r.user?.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-800'}`}>
                      {r.status === 'APPROVED' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                      {r.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-secondary">{r.registeredAt?.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === 'PENDING' && (
                        <>
                          <button className="px-3 py-1.5 text-label-md font-bold text-white bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center gap-1" onClick={() => handleApprove(r.id)}>
                            <span className="material-symbols-outlined text-[16px]">check</span> Approve
                          </button>
                          <button className="px-3 py-1.5 text-label-md font-bold text-white bg-error hover:bg-red-700 rounded transition-colors flex items-center gap-1" onClick={() => handleReject(r.id)}>
                            <span className="material-symbols-outlined text-[16px]">close</span> Reject
                          </button>
                        </>
                      )}
                      {(r.status === 'APPROVED' || r.status === 'PENDING') && (
                        <button className="px-3 py-1.5 text-label-md font-bold text-secondary hover:bg-surface-container-high rounded transition-colors" onClick={() => handleCancel(r.id)}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
