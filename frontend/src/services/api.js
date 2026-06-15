import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://chaos-planner-backend.onrender.com/api').replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 seconds timeout to prevent infinite hanging
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
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
      const targetUrl = isUrlAdmin ? '/admin/login' : '/login'
      if (window.location.pathname !== targetUrl) {
        window.location.href = targetUrl
      }
    }
    return Promise.reject(err)
  }
)

export const pingServer = () => {
  api.get('/health').catch(() => {}) // Fire and forget
}

export default api
