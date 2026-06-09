import React, { useState, useEffect } from 'react'
import { adminAnnouncementService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const DEMO_ANNOUNCEMENTS = [
  { id: 'an1', title: '🚨 URGENT: Gate B is now closed — use Gate A only', body: 'Due to maintenance, Gate B is temporarily closed.', priority: 'URGENT', targetAudience: 'ALL', event: { title: 'TechFest 2026' }, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'an2', title: 'Keynote Speaker Confirmed: Dr. Sarah Chen', body: 'Dr. Sarah Chen, CTO of Nexus Labs, will be our keynote speaker.', priority: 'HIGH', targetAudience: 'ATTENDEES', event: { title: 'TechFest 2026' }, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'an3', title: 'Platform Update: New QR Pass Feature Available', body: 'All registered attendees can now access their digital QR pass.', priority: 'NORMAL', targetAudience: 'ALL', event: null, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
]

const PRIORITY_COLORS = { 
  URGENT: 'bg-error text-white', 
  HIGH: 'bg-[#fff4ce] text-[#8f6300]', 
  NORMAL: 'bg-surface-container-high text-secondary' 
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(DEMO_ANNOUNCEMENTS)
  const [showComposer, setShowComposer] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', priority: 'NORMAL', targetAudience: 'ALL' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminAnnouncementService.list().then(res => {
      if (res.data.content?.length) setAnnouncements(res.data.content)
    }).catch(() => {})
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await adminAnnouncementService.create(form)
      setAnnouncements(prev => [res.data, ...prev])
      setForm({ title: '', body: '', priority: 'NORMAL', targetAudience: 'ALL' })
      setShowComposer(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const urgentCount = announcements.filter(a => a.priority === 'URGENT').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Announcements</h1>
          <p className="font-body-md text-secondary mt-1">Send alerts and announcements to attendees and volunteers</p>
        </div>
        <Button onClick={() => setShowComposer(true)} className="bg-error hover:bg-red-700 text-white border-transparent">
          <span className="material-symbols-outlined mr-1 text-[18px]">campaign</span> Send Announcement
        </Button>
      </div>

      {urgentCount > 0 && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg flex gap-4 items-start border border-error/20">
          <span className="material-symbols-outlined text-error mt-0.5">campaign</span>
          <div>
            <div className="font-headline-sm font-bold">{urgentCount} Urgent Alert{urgentCount > 1 ? 's' : ''} Active</div>
          </div>
        </div>
      )}

      {/* List */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
          <h2 className="font-headline-sm font-bold text-on-surface">All Announcements</h2>
        </div>
        <div className="divide-y divide-outline-variant">
          {announcements.map(a => (
            <div key={a.id} className="p-6 hover:bg-surface-container-lowest transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${PRIORITY_COLORS[a.priority]}`}>
                      {a.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-surface-container-high text-secondary">
                      {a.targetAudience}
                    </span>
                    {a.event && <span className="font-body-sm text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {a.event.title}</span>}
                  </div>
                  <div className="font-headline-sm font-bold text-on-surface mb-2">{a.title}</div>
                  <div className="font-body-sm text-secondary">{a.body}</div>
                </div>
                <div className="font-label-md text-secondary shrink-0">
                  {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={e => e.target === e.currentTarget && setShowComposer(false)}>
          <Card className="w-full max-w-[580px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h3 className="font-headline-sm font-bold text-on-surface">Compose Announcement</h3>
              <button className="text-secondary hover:text-on-surface transition-colors rounded-full p-1 hover:bg-surface-container-low" onClick={() => setShowComposer(false)}>
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSend}>
              <div className="p-6 space-y-4 bg-surface-container-lowest">
                {error && <div className="bg-error-container text-on-error-container p-3 rounded font-body-sm">{error}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Priority</label>
                    <select 
                      className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      value={form.priority} 
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">🚨 Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Target Audience</label>
                    <select 
                      className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                      value={form.targetAudience} 
                      onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                    >
                      <option value="ALL">All Participants</option>
                      <option value="ATTENDEES">Attendees Only</option>
                      <option value="VOLUNTEERS">Volunteers Only</option>
                    </select>
                  </div>
                </div>
                
                <Input 
                  label="Title *"
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  required 
                  placeholder="Announcement title..." 
                />
                
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Message *</label>
                  <textarea 
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] resize-y" 
                    value={form.body} 
                    onChange={e => setForm(f => ({ ...f, body: e.target.value }))} 
                    required 
                    placeholder="Full announcement text..." 
                  />
                </div>
                
                {form.priority === 'URGENT' && (
                  <div className="bg-error-container/30 text-error p-3 rounded-lg border border-error-container flex items-start gap-3 mt-2">
                    <span className="material-symbols-outlined mt-0.5 text-[20px]">warning</span>
                    <span className="font-body-sm">Urgent alerts will be highlighted immediately in all user notification centers.</span>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowComposer(false)} className="border border-outline-variant bg-white">Cancel</Button>
                <Button type="submit" disabled={sending} className={form.priority === 'URGENT' ? 'bg-error hover:bg-red-700 text-white border-transparent' : ''}>
                  {sending ? 'Sending...' : '📣 Send Now'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
