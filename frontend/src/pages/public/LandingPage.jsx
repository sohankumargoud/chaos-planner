import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-surface-container-lowest">
      {/* TopAppBar */}
      <header
        className={`flex justify-between items-center h-header-height px-container-margin w-full sticky top-0 z-50 transition-all ${scrolled ? 'shadow-sm bg-white/95 backdrop-blur-md' : 'bg-surface-container-lowest border-b border-outline-variant'
          }`}
      >
        <div className="flex items-center gap-8">
          <span className="font-display text-display font-bold text-primary">Chaos Planner</span>
          <nav className="hidden md:flex gap-6">
            <a className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary" href="#">Home</a>
            <a className="font-headline-sm text-headline-sm text-secondary hover:bg-surface-container-low transition-colors px-2 py-1" href="#">Features</a>
            <a className="font-headline-sm text-headline-sm text-secondary hover:bg-surface-container-low transition-colors px-2 py-1" href="#">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-secondary p-2 hover:bg-surface-container-low transition-colors rounded-full">
            notifications
          </button>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            CP
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 px-container-margin text-center" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)', backgroundSize: '40px 40px' }}>
          <div className="max-w-4xl mx-auto">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4 block">Operations-First Management</span>
            <h1 className="font-display text-6xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">
              Manage the Chaos, <br /> <span className="text-primary">Not Just the Guestlist.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto mb-10">
              The operations-first event management platform for college clubs and community organizers. Stop fighting spreadsheets and start executing perfectly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate('/signup')} className="px-8 py-3">
                Get Started Free
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Entry Cards (Single User Entry) */}
        <section className="px-container-margin py-16">
          <div className="max-w-2xl mx-auto">
            {/* User Card */}
            <div
              onClick={() => navigate('/login')}
              className="group relative bg-white border border-outline-variant p-8 hover:border-primary transition-colors cursor-pointer overflow-hidden rounded-xl"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 rounded-lg">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg mb-2">User Portal</h3>
                <p className="font-body-md text-body-md text-secondary mb-6">Central hub for attendees and volunteers. Access QR passes, shift schedules, and event announcements.</p>
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  JOIN AS ATTENDEE <span className="material-symbols-outlined text-sm">north_east</span>
                </span>
              </div>
              <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-[12rem]">qr_code_scanner</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-container-low py-24 px-container-margin">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-headline-lg text-4xl mb-4">Operational Excellence</h2>
              <p className="text-secondary font-body-md max-w-xl mx-auto">Engineered for high-stakes environments where clarity is the primary utility.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white border border-outline-variant p-8 flex flex-col justify-between rounded-xl">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <h4 className="font-headline-sm text-headline-sm">Real-time Staffing</h4>
                  </div>
                  <p className="font-body-md text-body-md text-secondary mb-8 max-w-md">Dynamically assign volunteers to shifts as needs change. Monitor check-ins and capacity in real-time with automated conflict alerts.</p>
                </div>
                <div className="bg-surface-container p-4 rounded border border-outline-variant font-mono-sm text-xs">
                  <div className="flex justify-between border-b border-outline-variant pb-2 mb-2">
                    <span>SHIFT_ID: 2940</span>
                    <span className="text-primary font-bold">LIVE_STATUS: 12/15 STAFFED</span>
                  </div>
                  <div className="space-y-1 opacity-60">
                    <p>&gt; Deploying surplus to Entrance B...</p>
                    <p>&gt; Volunteer #402 checked in at 18:04</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-outline-variant p-8 flex flex-col items-center text-center rounded-xl">
                <div className="w-full h-48 bg-surface-container flex items-center justify-center mb-6 relative group rounded-lg overflow-hidden">
                  <span className="material-symbols-outlined text-6xl text-primary opacity-20">qr_code_2</span>
                  <div className="absolute inset-0 border-2 border-primary border-dashed opacity-40 group-hover:scale-95 transition-transform"></div>
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-2">Frictionless QR Entry</h4>
                <p className="font-body-sm text-body-sm text-secondary">Sub-second validation with offline support for basements and high-density arenas.</p>
              </div>

              <div className="bg-white border border-outline-variant p-8 rounded-xl">
                <span className="material-symbols-outlined text-error mb-4">meeting_room</span>
                <h4 className="font-headline-sm text-headline-sm mb-2">Conflict Resolution</h4>
                <p className="font-body-md text-body-md text-secondary mb-6">Our proprietary "Room Guard" algorithm prevents double-booking across campus facilities instantly.</p>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-error w-3/4"></div>
                  </div>
                  <div className="flex justify-between font-label-sm text-[10px] uppercase text-error">
                    <span>Room 402 Conflict</span>
                    <span>High Priority</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white border border-outline-variant p-8 grid md:grid-cols-2 gap-8 items-center rounded-xl">
                <div>
                  <h4 className="font-headline-sm text-headline-sm mb-2">Predictive Analytics</h4>
                  <p className="font-body-md text-body-md text-secondary">Understand attendee flow and peak load times before they become bottlenecks. Data-driven decision making for the next event.</p>
                </div>
                <div className="h-32 flex items-end gap-1 px-4">
                  <div className="w-full bg-primary-container h-1/2 rounded-t-sm"></div>
                  <div className="w-full bg-primary-container h-3/4 rounded-t-sm"></div>
                  <div className="w-full bg-primary h-full rounded-t-sm"></div>
                  <div className="w-full bg-primary-container h-2/3 rounded-t-sm"></div>
                  <div className="w-full bg-primary-container h-1/2 rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-container-margin bg-on-surface text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display text-5xl font-extrabold mb-8">Ready to Restore Order?</h2>
            <p className="font-body-lg text-body-lg mb-10 text-surface-container-highest">Join the organizations already running their logistics on Chaos Planner.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate('/signup')} className="px-10 py-4 text-on-primary-fixed hover:brightness-110">
                Create Account
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant py-16 px-container-margin">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div>
            <span className="font-display text-headline-lg font-black text-on-surface block mb-4">Chaos Planner</span>
            <p className="font-body-sm text-body-sm text-secondary max-w-xs">A professional-grade operational toolkit designed for the next generation of community leaders and logistics experts.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-label-md text-label-md font-bold mb-4 uppercase">Platform</h5>
              <ul className="space-y-2 font-body-sm text-body-sm text-secondary">
                <li><a className="hover:text-primary transition-colors" href="#">Admin Dashboard</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">User Portal</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md text-label-md font-bold mb-4 uppercase">Resources</h5>
              <ul className="space-y-2 font-body-sm text-body-sm text-secondary">
                <li><a className="hover:text-primary transition-colors" href="#">Operational Guides</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-md text-label-md font-bold mb-4 uppercase">Legal</h5>
              <ul className="space-y-2 font-body-sm text-body-sm text-secondary">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-outline-variant flex justify-between items-center font-label-sm text-label-sm text-secondary">
          <p>© 2026 Chaos Planner. Built for operators.</p>
          <button onClick={() => navigate('/admin/login')} className="hover:text-primary transition-colors opacity-50 hover:opacity-100">
            Staff Access
          </button>
        </div>
      </footer>
    </div>
  )
}
