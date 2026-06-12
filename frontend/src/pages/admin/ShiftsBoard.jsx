import React, { useState, useEffect } from 'react'
import { adminShiftService, adminEventService, adminRegService } from '../../services/services'
import { Card } from '../../components/layout/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export default function ShiftsBoard() {
  const [shifts, setShifts] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // Form States
  const [addFormData, setAddFormData] = useState({ eventId: '', roleName: '', startTime: '', endTime: '', slotsTotal: '' })
  const [assignFormData, setAssignFormData] = useState({ shiftId: null, shiftRoleName: '', userId: '' })
  const [eventRegistrations, setEventRegistrations] = useState([]) // For the assign modal dropdown

  const fetchData = async () => {
    setLoading(true)
    try {
      const evRes = await adminEventService.list()
      const allEvents = evRes.data.content || []
      setEvents(allEvents)
      
      // Fetch shifts for all events concurrently
      const shiftsPromises = allEvents.map(ev => adminShiftService.getByEvent(ev.id).catch(() => ({ data: [] })))
      const shiftsResults = await Promise.all(shiftsPromises)
      
      const allShifts = shiftsResults.map(res => res.data).flat()
      setShifts(allShifts)
    } catch (err) {
      console.error('Failed to fetch shifts data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      await adminShiftService.create(addFormData.eventId, {
        roleName: addFormData.roleName,
        startTime: addFormData.startTime + ':00', // Backend expects seconds
        endTime: addFormData.endTime + ':00',
        slotsTotal: parseInt(addFormData.slotsTotal, 10),
        slotsFilled: 0
      })
      setShowAddModal(false)
      setAddFormData({ eventId: '', roleName: '', startTime: '', endTime: '', slotsTotal: '' })
      fetchData() // Refresh board
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create shift')
    } finally {
      setModalLoading(false)
    }
  }

  const openAssignModal = async (shift) => {
    setAssignFormData({ shiftId: shift.id, shiftRoleName: shift.roleName, userId: '' })
    setShowAssignModal(true)
    setEventRegistrations([]) 
    try {
      const res = await adminRegService.getByEvent(shift.event.id)
      setEventRegistrations(res.data)
    } catch (err) {
      console.error('Failed to fetch registrations for assignment', err)
    }
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!assignFormData.userId) return
    setModalLoading(true)
    try {
      await adminShiftService.assign(assignFormData.shiftId, assignFormData.userId)
      setShowAssignModal(false)
      fetchData() // Refresh board
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign volunteer')
    } finally {
      setModalLoading(false)
    }
  }

  // Derived state
  const grouped = shifts.reduce((acc, s) => {
    const evTitle = s.event?.title || 'Unknown Event'
    if (!acc[evTitle]) acc[evTitle] = []
    acc[evTitle].push(s)
    return acc
  }, {})

  const totalSlots = shifts.reduce((s, sh) => s + sh.slotsTotal, 0)
  const filledSlots = shifts.reduce((s, sh) => s + sh.slotsFilled, 0)
  const understaffed = shifts.filter(s => s.slotsFilled < s.slotsTotal)

  if (loading && shifts.length === 0) {
    return <div className="p-8 text-center text-secondary">Loading Shifts Board...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Volunteer Shifts Board</h1>
          <p className="font-body-md text-secondary mt-1">Manage shift assignments and staffing levels</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <span className="material-symbols-outlined mr-1 text-[18px]">add</span> Add Shift
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Total Shifts</div>
          <div className="font-display text-display font-black text-on-surface">{shifts.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col bg-green-50 border-green-200">
          <div className="font-label-sm uppercase tracking-widest font-bold text-green-800 mb-1">Slots Filled</div>
          <div className="flex items-end gap-2">
            <div className="font-display text-display font-black text-green-700">{filledSlots}</div>
            <div className="font-body-sm text-green-800 mb-1.5">of {totalSlots}</div>
          </div>
        </Card>
        
        <Card className={`p-5 flex flex-col ${understaffed.length > 0 ? 'bg-[#fff4ce] border-[#ffe082]' : 'bg-surface-container-lowest'}`}>
          <div className={`font-label-sm uppercase tracking-widest font-bold mb-1 ${understaffed.length > 0 ? 'text-[#8f6300]' : 'text-secondary'}`}>Understaffed</div>
          <div className={`font-display text-display font-black ${understaffed.length > 0 ? 'text-[#8f6300]' : 'text-on-surface'}`}>{understaffed.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col bg-surface-container-lowest">
          <div className="font-label-sm uppercase tracking-widest font-bold text-secondary mb-1">Fill Rate</div>
          <div className="font-display text-display font-black text-on-surface">{totalSlots > 0 ? Math.round(filledSlots / totalSlots * 100) : 0}%</div>
        </Card>
      </div>

      {understaffed.length > 0 && (
        <div className="bg-[#fff4ce] text-[#5c4000] p-4 rounded-lg flex gap-4 items-start border border-[#ffe082]">
          <span className="material-symbols-outlined text-[#8f6300] mt-0.5">warning</span>
          <div>
            <div className="font-headline-sm font-bold">{understaffed.length} shift{understaffed.length > 1 ? 's' : ''} need volunteers</div>
            <div className="font-body-sm mt-1">{understaffed.map(s => s.roleName).join(', ')}</div>
          </div>
        </div>
      )}

      {/* Grouped by event */}
      {shifts.length === 0 ? (
        <Card className="p-12 text-center text-secondary border-dashed">
          <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">event_busy</span>
          <h3 className="font-headline-sm font-bold text-on-surface">No Shifts Created</h3>
          <p className="font-body-sm mt-1">Click "Add Shift" to start organizing your event staff.</p>
        </Card>
      ) : (
        Object.entries(grouped).map(([eventTitle, eventShifts]) => (
          <Card key={eventTitle} className="p-0 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">event</span> {eventTitle}
              </h2>
              <span className="font-body-sm text-secondary">{eventShifts.length} shifts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Role</th>
                    <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Time Window</th>
                    <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Slots</th>
                    <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold">Status</th>
                    <th className="px-6 py-3 font-label-md text-outline uppercase tracking-widest font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {eventShifts.map(s => {
                    const pct = Math.round(s.slotsFilled / s.slotsTotal * 100)
                    const isUnder = s.slotsFilled < s.slotsTotal
                    return (
                      <tr key={s.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 font-headline-sm text-on-surface">{s.roleName}</td>
                        <td className="px-6 py-4 font-body-sm text-on-surface">
                          {new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} &ndash; {new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 font-body-sm font-bold">{s.slotsFilled} <span className="text-secondary font-normal">/ {s.slotsTotal}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${pct}%` }} 
                              />
                            </div>
                            {isUnder ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-800">Understaffed</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800">Full</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            className="px-3 py-1.5 border border-outline-variant text-sm h-auto disabled:opacity-50" 
                            onClick={() => openAssignModal(s)}
                            disabled={!isUnder}
                          >
                            <span className="material-symbols-outlined text-[16px] mr-1">person_add</span> Assign
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}

      {/* --- ADD SHIFT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md font-bold">Create New Shift</h2>
              <button onClick={() => setShowAddModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface uppercase tracking-wider block mb-1">Target Event</label>
                <select 
                  className="w-full py-2.5 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                  value={addFormData.eventId}
                  onChange={e => setAddFormData({...addFormData, eventId: e.target.value})}
                  required
                >
                  <option value="" disabled>Select an Event</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>

              <Input 
                label="Role Name" 
                placeholder="e.g., Check-In Desk" 
                value={addFormData.roleName}
                onChange={e => setAddFormData({...addFormData, roleName: e.target.value})}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-on-surface uppercase tracking-wider block mb-1">Start Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full py-2.5 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md"
                    value={addFormData.startTime}
                    onChange={e => setAddFormData({...addFormData, startTime: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="font-label-md text-on-surface uppercase tracking-wider block mb-1">End Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full py-2.5 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md"
                    value={addFormData.endTime}
                    onChange={e => setAddFormData({...addFormData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Input 
                label="Total Slots Needed" 
                type="number"
                min="1"
                placeholder="e.g., 4" 
                value={addFormData.slotsTotal}
                onChange={e => setAddFormData({...addFormData, slotsTotal: e.target.value})}
                required
              />

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" className="flex-1 border border-outline-variant" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" loading={modalLoading}>Create Shift</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- ASSIGN VOLUNTEER MODAL --- */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-xl animate-fade-in p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md font-bold">Assign to {assignFormData.shiftRoleName}</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface uppercase tracking-wider block mb-1">Select Registered Volunteer</label>
                {eventRegistrations.length === 0 ? (
                  <p className="text-sm text-error bg-error-container p-3 rounded border border-error/20">No users have registered for this event yet.</p>
                ) : (
                  <select 
                    className="w-full py-2.5 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary"
                    value={assignFormData.userId}
                    onChange={e => setAssignFormData({...assignFormData, userId: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select a User</option>
                    {eventRegistrations.map(reg => (
                      <option key={reg.id} value={reg.user.id}>{reg.user.fullName} ({reg.user.email})</option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-secondary mt-2 flex items-start gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Only users who have registered for this event appear here.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" className="flex-1 border border-outline-variant" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" loading={modalLoading} disabled={eventRegistrations.length === 0 || !assignFormData.userId}>Confirm Assignment</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
