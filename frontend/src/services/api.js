import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://chaos-planner-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — force logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthEndpoint = err.config?.url?.includes('/auth/')
    
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('cp_token')
      localStorage.removeItem('cp_user')
      
      const isUrlAdmin = window.location.pathname.startsWith('/admin')
      window.location.href = isUrlAdmin ? '/admin/login' : '/login'
    }
    return Promise.reject(err)
  }
)

export default api
