import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { pingServer } from '../../services/api'

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    pingServer()
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-surface-container-lowest">
      {/* TopAppBar */}
      <header
        className={`flex justify-between items-center h-header-height px-container-margin w-full sticky top-0 z-50 transition-all ${scrolled ? 'shadow-sm bg-surface-container-lowest/95 backdrop-blur-md' : 'bg-surface-container-lowest border-b border-outline-variant'
          }`}
      >
        <div className="flex items-center gap-8">
          <span className="font-display text-display font-bold text-primary">Chaos Planner</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={() => navigate('/login')} variant="ghost">Log In</Button>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
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

        {/* CTA Section */}
        <section className="py-24 px-container-margin bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-outline-variant) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-display text-5xl font-extrabold mb-8">Ready to Restore Order?</h2>
            <p className="font-body-lg text-body-lg mb-10 opacity-90">Join the organizations already running their logistics on Chaos Planner.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => navigate('/signup')} className="px-10 py-4 hover:brightness-110">
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
