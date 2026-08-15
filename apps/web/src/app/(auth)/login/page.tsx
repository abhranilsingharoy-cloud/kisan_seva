'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Leaf, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await login(formData)
      if (res?.error) {
        setErrorMsg(res.error)
      }
    })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #111827 0%, #064e3b 100%)', 
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px' 
    }}>
      {/* Abstract Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(52, 211, 153, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }} />

      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium z-20">
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 transition-transform hover:scale-105">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' }}>
              <Leaf size={24} color="#ffffff" />
            </div>
            <span className="font-display font-bold" style={{ fontSize: '28px', color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              KisanSeva
            </span>
          </Link>
          <div className="mb-2 uppercase tracking-widest text-xs font-bold" style={{ color: '#6ee7b7' }}>
            Welcome back
          </div>
          <h1 className="font-display font-semibold" style={{ fontSize: '32px', color: '#ffffff', letterSpacing: '-0.03em' }}>
            Sign in to your account
          </h1>
        </div>

        {/* Card */}
        <div style={{ 
          background: 'rgba(17, 24, 39, 0.7)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
              <input 
                id="email" 
                name="email"
                type="email" 
                className="w-full px-4 py-3 rounded-xl text-white font-medium focus:outline-none" 
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.05rem' }}
                placeholder="you@example.com" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl text-white font-medium focus:outline-none"
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.05rem', paddingRight: '44px' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all hover:opacity-90 active:scale-95 shadow-lg" 
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontSize: '1.05rem', cursor: 'pointer' }}
              disabled={isPending} 
            >
              {isPending ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-gray-400 text-sm">
              New to KisanSeva?{' '}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Create free account →
              </Link>
            </p>
          </div>
        </div>

        {/* Language bar */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা'].map((lang, i) => (
            <button 
              key={lang} 
              className={`text-sm font-medium transition-colors hover:text-white ${i === 0 ? 'text-emerald-400' : 'text-gray-500'}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
