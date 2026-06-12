import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminEventService, adminRegService, adminShiftService } from '../../services/services'



export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState({})
  const [regs, setRegs] = useState([])
  const [shifts, setShifts] = useState([])
  const [activeTab, setActiveTab] = useState('registrations')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      adminEventService.get(id),
      adminRegService.getByEvent(id),
      adminShiftService.getByEvent(id),
    ]).then(([eRes, rRes, sRes]) => {
      if (eRes.status === 'fulfilled') setEvent(eRes.value.data)
      if (rRes.status === 'fulfilled') setRegs(rRes.value.data)
      if (sRes.status === 'fulfilled') setShifts(sRes.value.data)
    }).finally(() => setLoading(false))
  }, [id])

  const handleApprove = async (regId) => {
    try { await adminRegService.approve(regId); setRegs(r => r.map(x => x.id === regId ? { ...x, status: 'APPROVED' } : x)) } catch { alert('Failed') }
  }
  const handleReject = async (regId) => {
    try { await adminRegService.reject(regId); setRegs(r => r.map(x => x.id === regId ? { ...x, status: 'REJECTED' } : x)) } catch { alert('Failed') }
  }

  const STATUS_COLORS = { APPROVED: 'badge-approved', PENDING: 'badge-pending', REJECTED: 'badge-rejected', CANCELLED: 'badge-cancelled', WAITLISTED: 'badge-waitlisted' }

  if (loading || !event.id) {
    return (
      <div className="page-content py-12 flex justify-center text-secondary">
        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/events" className="text-sm text-muted">← Back to Events</Link>
      </div>
      <div className="page-header">
        <div>
          <h1>{event.title}</h1>
          <p>{event.eventDate} · {event.venueName} · {event.roomName}</p>
        </div>
        <span className={`badge badge-${event.status?.toLowerCase()}`}>
          <span className="badge-dot" />
          {event.status}
        </span>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card info"><div className="label">Registrations</div><div className="value">{event.registrationCount}</div><div className="sub">of {event.capacity}</div></div>
        <div className="stat-card success"><div className="label">Checked In</div><div className="value">{event.checkedInCount}</div></div>
        <div className="stat-card warning"><div className="label">Waitlisted</div><div className="value">{event.waitlistCount}</div></div>
        <div className="stat-card"><div className="label">Volunteer Shifts</div><div className="value">{shifts.length}</div></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
        {['registrations', 'shifts', 'details'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            style={{ textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'registrations' && (
        <div className="card">
          <div className="card-header"><h2>Registrations</h2></div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
              <tbody>
                {regs.map(r => (
                  <tr key={r.id}>
                    <td className="td-primary">{r.user?.fullName}</td>
                    <td><span className="text-sm text-muted">{r.user?.email}</span></td>
                    <td><span className={`badge ${STATUS_COLORS[r.status] || 'badge-draft'}`}><span className="badge-dot" />{r.status}</span></td>
                    <td><span className="text-sm text-muted">{r.registeredAt?.slice(0, 10)}</span></td>
                    <td>
                      <div className="td-actions">
                        {r.status === 'PENDING' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(r.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(r.id)}>Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="card">
          <div className="card-header"><h2>Volunteer Shifts</h2></div>
          {shifts.length === 0 ? (
            <div className="empty-state"><div className="icon">🧑‍🤝‍🧑</div><p>No shifts created yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Role</th><th>Time</th><th>Slots</th><th>Fill Rate</th></tr></thead>
                <tbody>
                  {shifts.map(s => (
                    <tr key={s.id}>
                      <td className="td-primary">{s.roleName}</td>
                      <td className="text-sm">{s.startTime?.slice(11, 16)} – {s.endTime?.slice(11, 16)}</td>
                      <td>{s.slotsFilled} / {s.slotsTotal}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${(s.slotsFilled / s.slotsTotal) * 100}%`, height: '100%', background: s.slotsFilled < s.slotsTotal ? 'var(--yellow-500)' : 'var(--green-500)', borderRadius: 3 }} />
                          </div>
                          {s.slotsFilled < s.slotsTotal && <span className="badge badge-paused badge-sm">Understaffed</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'details' && (
        <div className="card card-body">
          <div className="form-group"><div className="form-label">Description</div><p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{event.description}</p></div>
          <div className="divider" />
          <div className="grid-2">
            <div><div className="form-label">Category</div><p>{event.category}</p></div>
            <div><div className="form-label">Approval Required</div><p>{event.approvalRequired ? 'Yes' : 'No'}</p></div>
            <div><div className="form-label">Start Time</div><p>{event.startTime}</p></div>
            <div><div className="form-label">End Time</div><p>{event.endTime}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
