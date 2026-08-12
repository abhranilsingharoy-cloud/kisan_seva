'use client'
import Link from 'next/link'

// Copied exactly from JanSuvidha Header.tsx — adapted for KisanSeva
export default function Navbar() {
  return (
    <header className="fixed w-full top-0 z-50 pt-4 pb-2 px-4 sm:px-6 lg:px-8 bg-transparent pointer-events-none">
      <div className="w-full max-w-screen-2xl mx-auto bg-white backdrop-blur-md rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] h-[72px] flex items-center justify-between px-6 lg:px-8 border border-white/40 hover:border-white/80 pointer-events-auto transition-all duration-300">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 outline-none select-none">
          <span className="text-2xl font-extrabold text-[#65a30d] tracking-tighter leading-none">
            KisanSeva
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/diagnose" className="hover:text-slate-900 transition-colors">Crops</Link>
          <Link href="/market" className="hover:text-slate-900 transition-colors">Markets</Link>
          <Link href="/schedule" className="hover:text-slate-900 transition-colors">Weather</Link>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-slate-700 hover:text-slate-900 font-medium text-[15px] px-6 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#0f172a] hover:bg-black text-white font-medium text-[15px] px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            Get Started
          </Link>
        </div>

      </div>
    </header>
  )
}
