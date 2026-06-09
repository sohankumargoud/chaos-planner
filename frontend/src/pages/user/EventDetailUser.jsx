import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { userEventService, userRegService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const DEMO = { id: 'e001', title: 'TechFest 2026 — Annual Technology Summit', category: 'Technology', eventDate: '2026-07-15', startTime: '09:00', endTime: '18:00', venueName: 'Main Campus Hall', roomName: 'Auditorium A', capacity: 400, registrationCount: 2, status: 'PUBLISHED', description: 'The biggest annual tech summit for students. Features keynotes, workshops, hackathon, and networking sessions. Open to all students and recent graduates.', approvalRequired: false }

const CATEGORY_COLORS = { 
  Technology: 'from-blue-500 to-blue-700', 
  Workshop: 'from-purple-500 to-purple-700', 
  Cultural: 'from-orange-400 to-orange-600', 
  Orientation: 'from-green-500 to-green-700' 
}

export default function EventDetailUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(DEMO)
  const [loading, setLoading] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')
  const [regStatus, setRegStatus] = useState(null)

  useEffect(() => {
    userEventService.get(id).then(res => setEvent(res.data)).catch(() => {})
  }, [id])

  const available = event.capacity - (event.registrationCount || 0)
  const isFull = available <= 0

  const handleRegister = async () => {
    setRegistering(true)
    setError('')
    try {
      const res = await userRegService.register(id)
      setRegistered(true)
      setRegStatus(res.data.status)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low mb-2 h-9 px-3" onClick={() => navigate('/events')}>
        <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span> Back
      </Button>

      {/* Hero */}
      <div className={`p-10 rounded-[20px] text-white bg-gradient-to-br ${CATEGORY_COLORS[event.category] || 'from-blue-600 to-indigo-700'} shadow-lg relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-90 mb-3">{event.category}</div>
          <h1 className="font-display text-[32px] md:text-[40px] leading-tight font-black mb-6 drop-shadow-sm">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-3 font-body-sm font-medium opacity-90">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">calendar_today</span> {event.eventDate}</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> {event.startTime} &ndash; {event.endTime}</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">location_on</span> {event.venueName}{event.roomName ? ` \u00B7 ${event.roomName}` : ''}</span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full"><span className="material-symbols-outlined text-[18px]">group</span> {event.registrationCount || 0} / {event.capacity} registered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Details */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">About this event</h2>
            </div>
            <div className="p-6">
              <p className="font-body-md text-secondary leading-relaxed mb-8">{event.description}</p>
              
              <div className="border-t border-outline-variant pt-8">
                <h3 className="font-label-md text-outline uppercase tracking-widest font-bold mb-4">Event Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Date</div>
                    <p className="font-body-md text-on-surface font-medium">{event.eventDate}</p>
                  </div>
                  <div>
                    <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Time</div>
                    <p className="font-body-md text-on-surface font-medium">{event.startTime} &ndash; {event.endTime}</p>
                  </div>
                  <div>
                    <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Venue</div>
                    <p className="font-body-md text-on-surface font-medium">{event.venueName}</p>
                  </div>
                  <div>
                    <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Category</div>
                    <p className="font-body-md text-on-surface font-medium">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Registration panel */}
        <div className="lg:col-span-1">
          <Card className="p-0 overflow-hidden sticky top-[90px]">
            <div className="px-6 py-5 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">Registration</h2>
            </div>
            <div className="p-6">
              {/* Capacity bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md font-bold text-on-surface">Spots remaining</span>
                  <span className="font-label-md text-secondary">{available} of {event.capacity}</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isFull ? 'bg-error' : 'bg-primary'}`} 
                    style={{ width: `${Math.min((event.registrationCount || 0) / event.capacity * 100, 100)}%` }} 
                  />
                </div>
              </div>

              {event.approvalRequired && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start border border-blue-200 mb-6">
                  <span className="material-symbols-outlined mt-0.5 text-blue-600">info</span>
                  <span className="font-body-sm">This event requires admin approval after registration.</span>
                </div>
              )}

              {error && (
                <div className="bg-error-container text-on-error-container p-4 rounded-lg flex gap-3 items-start border border-error/20 mb-6">
                  <span className="material-symbols-outlined mt-0.5 text-error">warning</span>
                  <span className="font-body-sm">{error}</span>
                </div>
              )}

              {registered ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-lg flex gap-3 items-start border border-green-200">
                  <span className="material-symbols-outlined mt-0.5 text-green-600">check_circle</span>
                  <div>
                    <div className="font-headline-sm font-bold mb-1">
                      {regStatus === 'WAITLISTED' ? 'Added to waitlist!' : regStatus === 'PENDING' ? 'Registration submitted!' : 'Registered successfully!'}
                    </div>
                    <div className="font-body-sm text-green-700">
                      {regStatus === 'WAITLISTED' ? "You're on the waitlist and will be notified if a spot opens." : regStatus === 'PENDING' ? 'Your registration is pending admin approval.' : 'Check your My QR Pass for your entry pass.'}
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  className={`w-full justify-center h-12 text-label-lg ${isFull ? 'bg-surface-container-high text-on-surface border border-outline' : ''}`}
                  onClick={handleRegister}
                  disabled={registering || event.status !== 'PUBLISHED'}
                  loading={registering}
                >
                  {registering ? 'Registering...' : isFull ? '+ Join Waitlist' : '🎫 Register Now'}
                </Button>
              )}

              {event.status !== 'PUBLISHED' && (
                <p className="font-body-sm text-secondary text-center mt-4">Registration is currently closed.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
