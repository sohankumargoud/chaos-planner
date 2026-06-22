import { useState, useEffect } from 'react'
import { adminClubService } from '../../services/services'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/layout/Card'

export default function ClubsManagement() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: ''
  })

  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      const response = await adminClubService.list()
      setClubs(response.data)
    } catch (err) {
      setError('Failed to load clubs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await adminClubService.create(formData)
      setIsModalOpen(false)
      setFormData({ name: '', description: '', logoUrl: '' })
      fetchClubs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create club')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Clubs</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your organizations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Club
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <Card className="text-center py-12">
          <span className="material-symbols-outlined text-gray-400 mb-4 text-[48px]">domain</span>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Clubs Yet</h3>
          <p className="text-gray-500 mb-4">Create your first club to start organizing events under it.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create Club</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => (
            <Card key={club.id} className="flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">domain</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{club.name}</h3>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                  {club.description || 'No description provided.'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
          <Card className="w-full max-w-[500px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h3 className="font-headline-sm font-bold text-on-surface">Create New Club</h3>
              <button type="button" className="text-secondary hover:text-on-surface transition-colors rounded-full p-1 hover:bg-surface-container-low" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-surface-container-lowest">
              <Input
                label="Club Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chess Club"
              />
              <div className="space-y-1.5">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block">Description</label>
                <textarea
                  className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-y"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this club about?"
                />
              </div>
              <Input
                label="Logo URL (Optional)"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
              />
              <div className="flex justify-end gap-3 pt-4 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="border border-outline-variant bg-white text-gray-700">
                  Cancel
                </Button>
                <Button type="submit">
                  Create Club
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
