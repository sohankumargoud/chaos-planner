import React, { useState, useEffect } from 'react'
import { userNotifService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'

const PRIORITY_STYLES = {
  URGENT: { bg: 'bg-error-container/30', border: 'border-error/20', dot: 'bg-error', label: 'bg-error text-white' },
  HIGH:   { bg: 'bg-[#fffcf0]', border: 'border-[#ffe082]', dot: 'bg-[#8f6300]', label: 'bg-[#fff4ce] text-[#8f6300]' },
  NORMAL: { bg: 'bg-surface-container-lowest', border: 'border-outline-variant', dot: 'bg-primary', label: 'bg-surface-container-high text-secondary' },
}



function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userNotifService.list()
      .then(res => { if (res.data.content?.length) setNotifs(res.data.content) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await userNotifService.markRead(id)
      setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x))
    } catch {
      setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x))
    }
  }

  const handleMarkAllRead = () => {
    notifs.filter(n => !n.isRead).forEach(n => handleMarkRead(n.id))
  }

  const unreadCount = notifs.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Notifications</h1>
          <p className="font-body-md text-secondary mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" className="border border-outline-variant bg-surface-container-lowest" onClick={handleMarkAllRead}>
            <span className="material-symbols-outlined text-[18px] mr-1">done_all</span> Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-secondary">
          <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
        </div>
      ) : notifs.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container text-secondary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">notifications_off</span>
          </div>
          <h3 className="font-headline-sm font-bold text-on-surface mb-1">All caught up!</h3>
          <p className="font-body-sm text-secondary">No notifications yet. We'll notify you of event updates and announcements.</p>
        </div>
      ) : (
        <Card className="p-0 overflow-hidden divide-y divide-outline-variant">
          {notifs.map((n) => {
            const priority = n.announcement?.priority || 'NORMAL'
            const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.NORMAL
            return (
              <div
                key={n.id}
                className={`p-5 transition-colors cursor-pointer ${!n.isRead ? style.bg : 'bg-surface-container-lowest hover:bg-surface-container-low'}`}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.isRead ? style.dot : 'bg-transparent'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${style.label}`}>
                        {priority}
                      </span>
                      <span className="font-label-sm text-secondary">{timeAgo(n.createdAt)}</span>
                    </div>
                    <div className={`font-headline-sm mb-1 ${!n.isRead ? 'font-bold text-on-surface' : 'font-medium text-secondary'}`}>
                      {n.title}
                    </div>
                    <div className={`font-body-sm leading-relaxed ${!n.isRead ? 'text-secondary' : 'text-outline'}`}>
                      {n.body}
                    </div>
                  </div>
                  {!n.isRead && (
                    <button
                      className="text-secondary hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container-high shrink-0"
                      onClick={e => { e.stopPropagation(); handleMarkRead(n.id) }}
                      title="Mark as read"
                    >
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </Card>
      )}
    </div>
  )
}
