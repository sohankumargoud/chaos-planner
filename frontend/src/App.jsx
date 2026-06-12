import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'

// Public pages
import LandingPage from './pages/public/LandingPage'
import AdminLogin from './pages/public/AdminLogin'
import AdminSignup from './pages/public/AdminSignup'
import UserLogin from './pages/public/UserLogin'
import Signup from './pages/public/Signup'
import OtpVerification from './pages/public/OtpVerification'
import ForgotPassword from './pages/public/ForgotPassword'

// Admin pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProfileSettings from './pages/admin/AdminProfileSettings'
import EventsManagement from './pages/admin/EventsManagement'
import EventDetail from './pages/admin/EventDetail'
import RegistrationsPage from './pages/admin/RegistrationsPage'
import ShiftsBoard from './pages/admin/ShiftsBoard'
import RoomsConflicts from './pages/admin/RoomsConflicts'
import QRCheckIn from './pages/admin/QRCheckIn'
import AnnouncementsPage from './pages/admin/AnnouncementsPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'

// User pages
import UserLayout from './layouts/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import UserProfileSettings from './pages/user/UserProfileSettings'
import EventListing from './pages/user/EventListing'
import EventDetailUser from './pages/user/EventDetailUser'
import MyRegistrations from './pages/user/MyRegistrations'
import MyShifts from './pages/user/MyShifts'
import MyQRPass from './pages/user/MyQRPass'
import NotificationsPage from './pages/user/NotificationsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin - protected ADMIN role */}
          <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/profile" element={<AdminProfileSettings />} />
              <Route path="/admin/events" element={<EventsManagement />} />
              <Route path="/admin/events/:id" element={<EventDetail />} />
              <Route path="/admin/registrations" element={<RegistrationsPage />} />
              <Route path="/admin/shifts" element={<ShiftsBoard />} />
              <Route path="/admin/rooms" element={<RoomsConflicts />} />
              <Route path="/admin/checkin" element={<QRCheckIn />} />
              <Route path="/admin/announcements" element={<AnnouncementsPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          {/* User - protected USER role */}
          <Route element={<ProtectedRoute requiredRole="ROLE_USER" />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<UserProfileSettings />} />
              <Route path="/events" element={<EventListing />} />
              <Route path="/events/:id" element={<EventDetailUser />} />
              <Route path="/my-registrations" element={<MyRegistrations />} />
              <Route path="/my-shifts" element={<MyShifts />} />
              <Route path="/my-qr" element={<MyQRPass />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
