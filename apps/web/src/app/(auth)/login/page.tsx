'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, Phone, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'

type Method = 'phone' | 'email'
type Step = 'credentials' | 'otp'

export default function LoginPage() {
  const [method, setMethod] = useState<Method>('phone')
  const [step, setStep] = useState<Step>('credentials')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (method === 'phone' && step === 'credentials') {
      setLoading(true)
      setTimeout(() => { setLoading(false); setStep('otp') }, 1500)
    } else {
      setLoading(true)
      setTimeout(() => { setLoading(false); window.location.href = '/dashboard' }, 1500)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      next?.focus()
    }
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
            {step === 'otp' ? 'Secure Login' : 'Welcome back'}
          </div>
          <h1 className="font-display font-semibold" style={{ fontSize: '32px', color: '#ffffff', letterSpacing: '-0.03em' }}>
            {step === 'otp' ? 'Verify your identity' : 'Sign in to your account'}
          </h1>
          {step === 'otp' && <p className="mt-2 text-sm text-gray-300">Enter the code sent to +91 {phone}</p>}
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
          {step === 'credentials' ? (
            <>
              {/* Method Toggle */}
              <div className="flex mb-8 rounded-xl overflow-hidden p-1" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {(['phone', 'email'] as Method[]).map((m) => (
                  <button
                    key={m}
                    className="flex-1 py-2.5 font-semibold capitalize transition-all rounded-lg"
                    style={{
                      fontSize: '0.9rem',
                      background: method === m ? '#10b981' : 'transparent',
                      color: method === m ? '#ffffff' : '#9ca3af',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: method === m ? '0 4px 6px -1px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                    onClick={() => setMethod(m)}
                    id={`btn-method-${m}`}
                  >
                    {m === 'phone' ? '📱 Mobile' : '✉️ Email'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {method === 'phone' ? (
                  <div>
                    <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-300">Mobile Number</label>
                    <div className="flex rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center px-4 font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        🇮🇳 +91
                      </div>
                      <input
                        id="phone-input"
                        type="tel"
                        className="w-full px-4 py-3 bg-transparent text-white font-medium focus:outline-none"
                        style={{ fontSize: '1.05rem', background: 'rgba(0,0,0,0.2)' }}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="email-input" className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
                      <input 
                        id="email-input" 
                        type="email" 
                        className="w-full px-4 py-3 rounded-xl text-white font-medium focus:outline-none" 
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.05rem' }}
                        placeholder="you@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="password-input" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                      <div className="relative">
                        <input
                          id="password-input"
                          type={showPass ? 'text' : 'password'}
                          className="w-full px-4 py-3 rounded-xl text-white font-medium focus:outline-none"
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.05rem', paddingRight: '44px' }}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                      <div className="flex justify-end mt-2">
                        <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 500 }}>
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 transition-all hover:opacity-90 active:scale-95 shadow-lg" 
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontSize: '1.05rem', cursor: 'pointer' }}
                  disabled={loading} 
                  id="btn-login-submit"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : method === 'phone' ? <><Phone size={18} /> Send Secure OTP</> : <>Sign In <ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-center text-sm font-medium text-gray-300 mb-6">Enter 6-Digit OTP</label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 rounded-xl text-center text-xl font-bold text-white focus:outline-none transition-all focus:scale-110"
                      style={{ background: 'rgba(0,0,0,0.3)', border: digit ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)', boxShadow: digit ? '0 0 10px rgba(16,185,129,0.3)' : 'none' }}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg disabled:opacity-50 disabled:scale-100" 
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', fontSize: '1.05rem', cursor: 'pointer' }}
                disabled={loading || otp.join('').length < 6} 
                id="btn-verify-otp"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Verify & Continue'}
              </button>
              <button 
                type="button" 
                className="w-full py-2 text-gray-400 hover:text-white transition-colors font-medium text-sm" 
                onClick={() => setStep('credentials')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Use a different number
              </button>
            </form>
          )}

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

