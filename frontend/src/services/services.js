import api from './api'

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  signupAdmin: (data) => api.post('/auth/admin/signup', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resendOtp: (email, otpType) => api.post(`/auth/resend-otp?email=${email}&otpType=${otpType}`),
  loginUser: (data) => api.post('/auth/user/login', data),
  loginAdmin: (data) => api.post('/auth/admin/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

export const adminEventService = {
  list: (page = 0, size = 20) => api.get(`/admin/events?page=${page}&size=${size}`),
  get: (id) => api.get(`/admin/events/${id}`),
  create: (data) => api.post('/admin/events', data),
  update: (id, data) => api.put(`/admin/events/${id}`, data),
  updateStatus: (id, status) => api.patch(`/admin/events/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/admin/events/${id}`),
}

export const adminRegService = {
  getByEvent: (eventId) => api.get(`/admin/registrations/event/${eventId}`),
  approve: (id) => api.patch(`/admin/registrations/${id}/approve`),
  reject: (id) => api.patch(`/admin/registrations/${id}/reject`),
  cancel: (id) => api.patch(`/admin/registrations/${id}/cancel`),
}

export const adminShiftService = {
  getByEvent: (eventId) => api.get(`/admin/shifts/event/${eventId}`),
  create: (eventId, data) => api.post(`/admin/shifts/event/${eventId}`, data),
  assign: (shiftId, userId) => api.post(`/admin/shifts/${shiftId}/assign/${userId}`),
  getAssignments: (shiftId) => api.get(`/admin/shifts/${shiftId}/assignments`),
}

export const adminCheckInService = {
  scan: (qrToken) => api.post(`/admin/checkins/scan?qrToken=${encodeURIComponent(qrToken)}`),
  getStatus: (qrToken) => api.get(`/admin/checkins/status?qrToken=${encodeURIComponent(qrToken)}`),
  getQrImageUrl: (qrToken) => `/api/admin/checkins/qr-image?qrToken=${encodeURIComponent(qrToken)}`,
}

export const adminAnnouncementService = {
  list: (page = 0) => api.get(`/admin/announcements?page=${page}&size=20`),
  create: (data, eventId) => api.post(`/admin/announcements${eventId ? `?eventId=${eventId}` : ''}`, data),
}

export const analyticsService = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
}

export const adminUserService = {
  list: (page = 0, size = 20) => api.get(`/admin/users?page=${page}&size=${size}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
}

export const userEventService = {
  list: (page = 0, size = 12) => api.get(`/user/events?page=${page}&size=${size}`),
  get: (id) => api.get(`/user/events/${id}`),
}

export const userRegService = {
  register: (eventId) => api.post(`/user/events/${eventId}/register`),
  myRegistrations: () => api.get('/user/registrations'),
  cancel: (id) => api.patch(`/user/registrations/${id}/cancel`),
}

export const userShiftService = {
  myShifts: () => api.get('/user/my-shifts'),
  claim: (shiftId) => api.post(`/user/shifts/${shiftId}/claim`),
}

export const userNotifService = {
  list: (page = 0) => api.get(`/user/my-notifications?page=${page}&size=20`),
  unreadCount: () => api.get('/user/my-notifications/unread-count'),
  markRead: (id) => api.patch(`/user/my-notifications/${id}/read`),
}

export const userQrService = {
  getQrImageUrl: (registrationId) => `/api/user/my-qr/${registrationId}`,
}

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/profile', data),
}
