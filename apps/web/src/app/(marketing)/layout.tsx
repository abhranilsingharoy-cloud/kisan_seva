import React from 'react'
import Link from 'next/link'
import './marketing.css'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] w-full pointer-events-none">
        <div className="max-w-[1376px] mx-auto px-8 pt-6 pointer-events-auto">
          <nav className="navbar">
            <div className="logo">AgriSmart</div>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/diagnose">Crops</Link></li>
              <li><Link href="/market">Markets</Link></li>
              <li><Link href="/schedule">Weather</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
            </ul>
            <div className="auth-buttons">
              <Link href="/login" className="btn btn-outline nav-cta">Login</Link>
              <Link href="/register" className="btn btn-solid nav-cta">Register</Link>
            </div>
          </nav>
        </div>
      </header>
      {children}
    </>
  )
}
