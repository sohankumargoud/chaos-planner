import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminEventService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const STATUS_COLORS = {
  PUBLISHED: 'bg-green-100 text-green-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const DEMO_EVENTS = [
  { id: 'e001', title: 'TechFest 2026', category: 'Technology', status: 'PUBLISHED', eventDate: '2026-07-15', capacity: 400, registrationCount: 2, venueName: 'Main Campus Hall' },
  { id: 'e002', title: 'Leadership Workshop', category: 'Workshop', status: 'PUBLISHED', eventDate: '2026-07-20', capacity: 100, registrationCount: 2, venueName: 'Innovation Hub' },
  { id: 'e003', title: 'Culture Fest', category: 'Cultural', status: 'PUBLISHED', eventDate: '2026-07-25', capacity: 250, registrationCount: 0, venueName: 'Student Union Building' },
  { id: 'e004', title: 'Club Orientation Day', category: 'Orientation', status: 'DRAFT', eventDate: '2026-08-05', capacity: 80, registrationCount: 0, venueName: 'Main Campus Hall' },
]

export default function EventsManagement() {
  const [events, setEvents] = useState(DEMO_EVENTS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    adminEventService.list().then(res => {
      if (res.data.content?.length) setEvents(res.data.content)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || e.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (id, status) => {
    try {
      await adminEventService.updateStatus(id, status)
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    } catch {
      alert('Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Events Management</h1>
          <p className="font-body-md text-secondary mt-1">Create, edit, and manage all events</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <span className="material-symbols-outlined mr-1 text-[18px]">add</span> New Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface-container-low p-4 rounded-lg border border-outline-variant">
        <div className="relative w-full sm:w-[300px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            placeholder="Search events..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <select 
          className="w-full sm:w-[150px] px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="PAUSED">Paused</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span className="text-body-sm text-secondary ml-auto">{filtered.length} events</span>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Event</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Category</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Date</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Venue</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Registrations</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Status</th>
                <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-secondary"><span className="material-symbols-outlined animate-spin text-[32px]">sync</span></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-[48px] text-outline opacity-50 mb-4">event_note</span>
                      <h3 className="font-headline-sm font-bold text-on-surface mb-1">No events found</h3>
                      <p className="font-body-sm text-secondary mb-4">Try adjusting filters or create a new event</p>
                      <Button onClick={() => setShowCreateModal(true)}>Create Event</Button>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(event => (
                <tr key={event.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-headline-sm text-on-surface">{event.title}</div>
                  </td>
                  <td className="px-6 py-4"><span className="font-body-sm text-secondary">{event.category}</span></td>
                  <td className="px-6 py-4"><span className="font-body-sm text-on-surface">{event.eventDate}</span></td>
                  <td className="px-6 py-4"><span className="font-body-sm text-secondary">{event.venueName || '—'}</span></td>
                  <td className="px-6 py-4">
                    <span className="font-body-sm text-on-surface">{event.registrationCount ?? 0} <span className="text-secondary">/ {event.capacity}</span></span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/events/${event.id}`} className="px-3 py-1.5 text-label-md font-bold text-primary hover:bg-primary/10 rounded transition-colors">View</Link>
                      {event.status === 'DRAFT' && (
                        <button className="px-3 py-1.5 text-label-md font-bold text-green-600 hover:bg-green-50 rounded transition-colors" onClick={() => handleStatusChange(event.id, 'PUBLISHED')}>Publish</button>
                      )}
                      {event.status === 'PUBLISHED' && (
                        <button className="px-3 py-1.5 text-label-md font-bold text-yellow-600 hover:bg-yellow-50 rounded transition-colors" onClick={() => handleStatusChange(event.id, 'PAUSED')}>Pause</button>
                      )}
                      {event.status !== 'CANCELLED' && (
                        <button className="px-3 py-1.5 text-label-md font-bold text-error hover:bg-error/10 rounded transition-colors" onClick={() => { if (window.confirm('Cancel this event?')) handleStatusChange(event.id, 'CANCELLED') }}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateModal && <CreateEventModal onClose={() => setShowCreateModal(false)} onCreated={e => { setEvents(prev => [e, ...prev]); setShowCreateModal(false) }} />}
    </div>
  )
}

function CreateEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', eventDate: '', startTime: '09:00', endTime: '17:00', capacity: 100, approvalRequired: false, status: 'DRAFT' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminEventService.create(form)
      onCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={e => e.target === e.currentTarget && onClose()}>
      <Card className="w-full max-w-[600px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
          <h3 className="font-headline-sm font-bold text-on-surface">Create New Event</h3>
          <button className="text-secondary hover:text-on-surface transition-colors rounded-full p-1 hover:bg-surface-container-low" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 bg-surface-container-lowest max-h-[70vh] overflow-y-auto">
            {error && <div className="bg-error-container text-on-error-container p-3 rounded font-body-sm">{error}</div>}
            
            <Input 
              label="Event Title *"
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
              required 
              placeholder="e.g. TechFest 2026" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Category"
                value={form.category} 
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
                placeholder="Technology, Cultural, etc." 
              />
              <Input 
                label="Capacity *"
                type="number" 
                value={form.capacity} 
                onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} 
                min={1} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Event Date *"
                type="date" 
                value={form.eventDate} 
                onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} 
                required 
              />
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Start / End Time</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    value={form.startTime} 
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} 
                  />
                  <input 
                    type="time" 
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    value={form.endTime} 
                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Description</label>
              <textarea 
                className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-y" 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Event description..." 
              />
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="approvalReq" 
                className="w-4 h-4 text-primary bg-surface-container-lowest border-outline-variant rounded focus:ring-primary"
                checked={form.approvalRequired} 
                onChange={e => setForm(f => ({ ...f, approvalRequired: e.target.checked }))} 
              />
              <label htmlFor="approvalReq" className="font-body-md text-on-surface cursor-pointer select-none">Require approval for registrations</label>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="border border-outline-variant bg-white">Cancel</Button>
            <Button type="submit" loading={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
