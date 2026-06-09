import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userEventService } from '../../services/services'
import { Card } from '../../components/layout/Card'

const DEMO_EVENTS = [
  { id: 'e0000000-0000-0000-0000-000000000001', title: 'TechFest 2026 — Annual Technology Summit', category: 'Technology', eventDate: '2026-07-15', startTime: '09:00', endTime: '18:00', venueName: 'Main Campus Hall', capacity: 400, registrationCount: 2, status: 'PUBLISHED', description: 'The biggest annual tech summit for students.', icon: '💻' },
  { id: 'e0000000-0000-0000-0000-000000000002', title: 'Leadership & Governance Workshop', category: 'Workshop', eventDate: '2026-07-20', startTime: '10:00', endTime: '17:00', venueName: 'Innovation Hub', capacity: 100, registrationCount: 2, status: 'PUBLISHED', description: 'A full-day workshop on student governance.', icon: '🎓' },
  { id: 'e0000000-0000-0000-0000-000000000003', title: 'Culture Fest — Diversity & Inclusion Night', category: 'Cultural', eventDate: '2026-07-25', startTime: '17:00', endTime: '21:00', venueName: 'Student Union Building', capacity: 250, registrationCount: 0, status: 'PUBLISHED', description: 'A cultural evening celebrating diversity.', icon: '🎭' },
]

const CATEGORY_COLORS = { 
  Technology: 'from-blue-500 to-blue-700', 
  Workshop: 'from-purple-500 to-purple-700', 
  Cultural: 'from-orange-400 to-orange-600', 
  Orientation: 'from-green-500 to-green-700' 
}

const CATEGORY_TEXT_COLORS = {
  Technology: 'text-blue-600',
  Workshop: 'text-purple-600',
  Cultural: 'text-orange-600',
  Orientation: 'text-green-600'
}

export default function EventListing() {
  const [events, setEvents] = useState(DEMO_EVENTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userEventService.list().then(res => {
      if (res.data.content?.length) setEvents(res.data.content)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || e.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg font-bold text-on-surface">Upcoming Events</h1>
        <p className="font-body-md text-secondary mt-1">Browse and register for events</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface-container-low p-4 rounded-lg border border-outline-variant">
        <div className="relative w-full sm:max-w-[300px]">
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
          className="w-full sm:max-w-[160px] px-3 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
          value={category} 
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Workshop">Workshop</option>
          <option value="Cultural">Cultural</option>
          <option value="Orientation">Orientation</option>
        </select>
        <span className="font-body-sm text-secondary ml-auto">{filtered.length} events</span>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-secondary">
          <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container text-secondary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">No events found</h3>
          <p className="font-body-sm text-secondary">Try a different search or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} className="block group">
              <Card className="p-0 overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow hover:border-outline">
                <div className={`h-32 bg-gradient-to-br ${CATEGORY_COLORS[event.category] || 'from-blue-500 to-indigo-600'} relative flex items-center justify-center`}>
                  <span className="text-[48px] filter drop-shadow-md">{event.icon || '📅'}</span>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-white/90 text-gray-900 shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{event.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${CATEGORY_TEXT_COLORS[event.category] || 'text-blue-600'}`}>
                    {event.category}
                  </span>
                  <h3 className="font-headline-sm font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mt-auto mb-4">
                    <div className="flex items-center gap-2 font-body-sm text-secondary">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span> {event.eventDate}
                    </div>
                    <div className="flex items-center gap-2 font-body-sm text-secondary">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> {event.startTime} &ndash; {event.endTime}
                    </div>
                    <div className="flex items-center gap-2 font-body-sm text-secondary">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> <span className="truncate">{event.venueName}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center mt-auto">
                  <span className="font-body-sm text-secondary font-medium">
                    <span className="text-on-surface font-bold">{event.registrationCount || 0}</span> / {event.capacity} registered
                  </span>
                  <span className="text-primary font-label-md hover:underline flex items-center">
                    View <span className="material-symbols-outlined text-[16px] ml-0.5">arrow_forward</span>
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
