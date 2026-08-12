'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: 'var(--color-parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: 'var(--color-honey-amber)' }}>
              <Leaf size={20} color="var(--color-ink)" />
            </div>
            <span className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
              KisanSeva
            </span>
          </Link>
          <div className="eyebrow eyebrow-sage mb-2">
            {step === 'otp' ? 'Verify OTP' : 'Welcome back'}
          </div>
          <h1 className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            {step === 'otp' ? `Enter the code sent to +91 ${phone}` : 'Sign in to your account'}
          </h1>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {step === 'credentials' ? (
            <>
              {/* Method Toggle */}
              <div className="flex mb-6 rounded-sm overflow-hidden" style={{ border: '1px solid var(--color-bone)' }}>
                {(['phone', 'email'] as Method[]).map((m) => (
                  <button
                    key={m}
                    className="flex-1 py-2 font-medium capitalize transition-all"
                    style={{
                      fontSize: 'var(--text-body)',
                      background: method === m ? 'var(--color-ink)' : 'transparent',
                      color: method === m ? 'var(--color-parchment)' : 'var(--color-saddle)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setMethod(m)}
                    id={`btn-method-${m}`}
                  >
                    {m === 'phone' ? '📱 Phone' : '✉️ Email'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {method === 'phone' ? (
                  <div>
                    <label htmlFor="phone-input" className="input-label">Mobile Number</label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-sm" style={{ background: 'var(--color-bone)', borderColor: 'var(--color-loam)', fontSize: 'var(--text-body)', color: 'var(--color-ink)' }}>
                        🇮🇳 +91
                      </div>
                      <input
                        id="phone-input"
                        type="tel"
                        className="input"
                        style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', borderLeft: 'none' }}
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
                      <label htmlFor="email-input" className="input-label">Email Address</label>
                      <input id="email-input" type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor="password-input" className="input-label">Password</label>
                      <div className="relative">
                        <input
                          id="password-input"
                          type={showPass ? 'text' : 'password'}
                          className="input"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ paddingRight: '44px' }}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={showPass ? 'Hide password' : 'Show password'}
                          style={{ color: 'var(--color-bark)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="flex justify-end mt-1">
                        <Link href="/forgot-password" style={{ fontSize: 'var(--text-eyebrow)', color: 'var(--color-honey-amber)' }}>
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary w-full" disabled={loading} id="btn-login-submit">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : method === 'phone' ? <><Phone size={16} /> Send OTP →</> : <>Sign In <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="input-label block mb-3">6-Digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="input text-center font-medium"
                      style={{ width: '48px', padding: '10px 4px', fontSize: '20px', textAlign: 'center' }}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading || otp.join('').length < 6} id="btn-verify-otp">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify & Continue →'}
              </button>
              <button type="button" className="btn btn-ghost w-full" onClick={() => setStep('credentials')}>
                ← Change Number
              </button>
            </form>
          )}

          <div className="mt-6 text-center" style={{ borderTop: '1px solid var(--color-bone)', paddingTop: '20px' }}>
            <p style={{ color: 'var(--color-saddle)', fontSize: 'var(--text-body)' }}>
              New to KisanSeva?{' '}
              <Link href="/register" style={{ color: 'var(--color-honey-amber)', fontWeight: 500 }}>
                Create free account →
              </Link>
            </p>
          </div>
        </div>

        {/* Language bar */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {['हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা'].map((lang) => (
            <button key={lang} style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
