import Link from 'next/link'
import { ArrowRight, Leaf, CloudSun, TrendingUp, Phone, Shield, Zap, Users, ChevronRight, Star, MapPin, Bell, MessageSquare } from 'lucide-react'

const STATS = [
  { value: '10M+', label: 'Farmers Reached' },
  { value: '94%', label: 'Diagnosis Accuracy' },
  { value: '2.3s', label: 'Avg. Response Time' },
  { value: '18+', label: 'Languages Supported' },
]

const FEATURES = [
  {
    icon: Leaf,
    title: 'Instant Crop Disease Detection',
    desc: 'Photograph any diseased leaf and get a diagnosis within 5 seconds — powered by computer vision trained on 50,000+ field samples.',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
    cta: 'Try Diagnosis',
    href: '/diagnose',
  },
  {
    icon: CloudSun,
    title: 'Smart Irrigation & Fertilizer Schedule',
    desc: 'Hyperlocal weather + soil-health data combined to give you the exact irrigation amount and fertilizer dose for your specific plot — today.',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
    cta: 'View Schedule',
    href: '/schedule',
  },
  {
    icon: TrendingUp,
    title: 'Live Mandi Price Comparisons',
    desc: 'Compare real-time prices across 10,000+ mandis before you decide when and where to sell. Never lose to a middleman again.',
    color: 'var(--color-honey-amber)',
    bg: 'rgba(240,200,145,0.2)',
    cta: 'Check Prices',
    href: '/market',
  },
  {
    icon: Phone,
    title: 'Works on Any Phone — Even Feature Phones',
    desc: 'No smartphone? Call our toll-free number or receive a personalised SMS advisory in your language. Full access, zero data cost.',
    color: 'var(--color-deep-olive)',
    bg: 'var(--color-bone)',
    cta: 'Learn More',
    href: '/ivr',
  },
]

const CROPS = [
  { name: 'Wheat', hi: 'गेहूँ', emoji: '🌾' },
  { name: 'Rice', hi: 'चावल', emoji: '🌾' },
  { name: 'Tomato', hi: 'टमाटर', emoji: '🍅' },
  { name: 'Cotton', hi: 'कपास', emoji: '🌱' },
  { name: 'Maize', hi: 'मक्का', emoji: '🌽' },
  { name: 'Potato', hi: 'आलू', emoji: '🥔' },
  { name: 'Onion', hi: 'प्याज', emoji: '🧅' },
  { name: 'Soybean', hi: 'सोयाबीन', emoji: '🫘' },
]

const TESTIMONIALS = [
  {
    name: 'Ramesh Patel',
    location: 'Vidisha, Madhya Pradesh',
    crop: 'Soybean farmer',
    quote: 'Pehle mujhe pata nahi tha ki meri fasal mein kya bimari hai. Ab ek photo se turant jawab milta hai aur sahi ilaj bhi.',
    rating: 5,
  },
  {
    name: 'Lakshmi Devi',
    location: 'Nalgonda, Telangana',
    crop: 'Cotton & Chilli',
    quote: 'Mandi price compare karne se mujhe ₹800 per quintal zyada mila. Pehle siyal mujhe sahi rate nahi batate the.',
    rating: 5,
  },
  {
    name: 'Sukhwinder Singh',
    location: 'Ludhiana, Punjab',
    crop: 'Wheat farmer',
    quote: 'Irrigation schedule bahut helpful hai. Pani ki bachat hui aur fasal bhi zyada ayi. Bina smartphone ke bhi SMS se kaam chalta hai.',
    rating: 5,
  },
]

const TRUST_SIGNALS = [
  { icon: Shield, label: 'Free for farmers' },
  { icon: Zap, label: 'Under 5 sec diagnosis' },
  { icon: Users, label: 'No middlemen' },
  { icon: Star, label: '4.8★ rated app' },
]

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KisanSeva',
    url: 'https://kisanseva.app',
    description: 'Smart crop advisory platform for smallholder farmers — AI disease detection, irrigation scheduling, live mandi prices.',
    areaServed: 'IN',
    serviceType: 'Agricultural Advisory',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Top Nav ─────────────────────── */}
      <nav className="top-nav" role="navigation" aria-label="Main navigation">
        <div className="page-container w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="KisanSeva home">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--color-honey-amber)' }}>
              <Leaf size={16} color="var(--color-ink)" strokeWidth={2} />
            </div>
            <span className="font-display font-medium text-xl" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              KisanSeva
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              ['Features', '#features'],
              ['Crop Guide', '/crop-guide'],
              ['Mandi Prices', '/market'],
              ['About', '/about'],
            ].map(([label, href]) => (
              <Link key={label} href={href}
                className="text-sm font-medium transition-colors hover:text-amber-600"
                style={{ color: 'var(--color-saddle)', fontSize: 'var(--text-body)' }}>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      <main id="main" role="main">
        {/* ── HERO ────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: 'var(--color-parchment)', paddingTop: '80px', paddingBottom: '100px' }}>
          {/* Subtle background texture */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(240,200,145,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(122,151,121,0.08) 0%, transparent 50%)'
          }} />

          <div className="page-container relative">
            <div className="text-center max-w-4xl mx-auto">
              {/* Eyebrow */}
              <div className="eyebrow eyebrow-sage mb-4">
                Track 03 / AgriTech · IEMH4-AG-01
              </div>

              {/* Headline */}
              <h1 className="font-display font-medium mb-6" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 6vw, 68px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)'
              }}>
                Your crops deserve a<br />
                <span style={{ color: 'var(--color-honey-amber)' }}>smart advisor</span> — not guesswork.
              </h1>

              {/* Subtext */}
              <p className="mx-auto mb-8 text-body-lg" style={{
                maxWidth: '580px',
                color: 'var(--color-saddle)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 1.6
              }}>
                Detect crop diseases instantly, get personalised irrigation & fertilizer schedules,
                and compare live mandi prices — all in your language, on any phone.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-register">
                  Start for Free →
                </Link>
                <Link href="/demo" className="btn btn-ghost btn-lg" id="hero-cta-demo">
                  Watch Demo
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2" style={{ color: 'var(--color-saddle)', fontSize: 'var(--text-eyebrow)' }}>
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="mt-16 mx-auto max-w-5xl">
              <div className="panel-dark relative overflow-hidden" style={{ padding: '0', borderRadius: 'var(--radius-md)' }}>
                {/* Simulated dashboard UI */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span style={{ color: 'rgba(252,250,241,0.5)', fontSize: '12px', marginLeft: '8px' }}>
                    kisanseva.app/dashboard
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ divideColor: 'rgba(255,255,255,0.08)' }}>
                  {/* Disease Alert */}
                  <div className="p-6">
                    <div className="eyebrow mb-3" style={{ color: 'var(--color-bark)', fontSize: '11px' }}>DISEASE ALERT</div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-danger-bg)' }}>
                        <Leaf size={20} color="var(--color-danger)" />
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--color-parchment)' }}>Leaf Blight Detected</div>
                        <div style={{ color: 'var(--color-bark)', fontSize: '12px' }}>Tomato · Plot 2A · 87% confidence</div>
                        <div className="mt-2">
                          <span className="badge badge-danger" style={{ fontSize: '10px' }}>High Risk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather */}
                  <div className="p-6">
                    <div className="eyebrow mb-3" style={{ color: 'var(--color-bark)', fontSize: '11px' }}>TODAY'S ADVISORY</div>
                    <div className="flex items-center gap-3">
                      <CloudSun size={36} color="var(--color-honey-amber)" />
                      <div>
                        <div className="font-medium" style={{ color: 'var(--color-parchment)', fontSize: '15px' }}>Irrigate 28mm Today</div>
                        <div style={{ color: 'var(--color-bark)', fontSize: '12px' }}>32°C · Partly Cloudy · No rain expected</div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.06)', fontSize: '12px', color: 'var(--color-bark)' }}>
                      Apply DAP 25 kg/acre — Stage: Flowering
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-6">
                    <div className="eyebrow mb-3" style={{ color: 'var(--color-bark)', fontSize: '11px' }}>BEST PRICE TODAY</div>
                    <div>
                      <div className="font-display font-medium" style={{ fontSize: '28px', color: 'var(--color-honey-amber)', fontFamily: 'var(--font-display)' }}>
                        ₹2,340<span style={{ fontSize: '14px', color: 'var(--color-bark)' }}>/qtl</span>
                      </div>
                      <div style={{ color: 'var(--color-bark)', fontSize: '12px' }}>Azadpur Mandi, Delhi</div>
                      <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--color-success)', fontSize: '12px' }}>
                        <TrendingUp size={12} />
                        <span>₹180 higher than your local mandi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────── */}
        <section style={{ background: 'var(--color-bone)', borderTop: '1px solid var(--color-loam)', borderBottom: '1px solid var(--color-loam)' }}>
          <div className="page-container py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display font-medium" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(28px, 3vw, 42px)',
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                  }}>
                    {value}
                  </div>
                  <div className="eyebrow mt-1" style={{ color: 'var(--color-bark)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────── */}
        <section id="features" style={{ background: 'var(--color-parchment)', padding: '80px 0' }}>
          <div className="page-container">
            <div className="text-center mb-16">
              <span className="eyebrow eyebrow-sage mb-4 block">What We Do</span>
              <h2 className="font-display font-medium" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(30px, 4vw, 53px)',
                color: 'var(--color-ink)',
                letterSpacing: '-0.011em',
                lineHeight: 1.1,
              }}>
                Everything a farmer needs,<br />
                in one place.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc, color, bg, cta, href }) => (
                <div key={title} className="card group" style={{ padding: '32px' }}>
                  <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: bg }}>
                    <Icon size={22} color={color} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-medium mb-3" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-subheading)',
                    color: 'var(--color-ink)',
                    lineHeight: 1.3
                  }}>
                    {title}
                  </h3>
                  <p className="mb-5" style={{ color: 'var(--color-saddle)', lineHeight: 1.6, fontSize: 'var(--text-body)' }}>
                    {desc}
                  </p>
                  <Link href={href} className="inline-flex items-center gap-2 font-medium transition-colors" style={{ color, fontSize: 'var(--text-body)' }}>
                    {cta} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CROPS GRID ──────────────────── */}
        <section style={{ background: 'var(--color-bone)', borderTop: '1px solid var(--color-loam)', padding: '80px 0' }}>
          <div className="page-container">
            <div className="text-center mb-12">
              <span className="eyebrow eyebrow-sage mb-3 block">Supported Crops</span>
              <h2 className="font-display font-medium" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.5vw, 42px)',
                color: 'var(--color-ink)',
                letterSpacing: '-0.011em'
              }}>
                From wheat to tomato — we speak your crop.
              </h2>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-0 border border-bone rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-loam)' }}>
              {CROPS.map(({ name, hi, emoji }) => (
                <Link key={name} href={`/crop-guide/${name.toLowerCase()}`}
                  className="group flex flex-col items-center justify-center py-8 px-4 border-b border-r transition-all hover:bg-white"
                  style={{ borderColor: 'var(--color-loam)', textDecoration: 'none' }}>
                  <span style={{ fontSize: '32px', marginBottom: '8px' }}>{emoji}</span>
                  <span className="font-medium text-center" style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink)' }}>{name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-bark)' }}>{hi}</span>
                  <ChevronRight size={12} className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity" color="var(--color-honey-amber)" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────── */}
        <section style={{ background: 'var(--color-parchment)', padding: '80px 0' }}>
          <div className="page-container">
            <div className="text-center mb-16">
              <span className="eyebrow eyebrow-sage mb-4 block">How It Works</span>
              <h2 className="font-display font-medium" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.5vw, 42px)',
                color: 'var(--color-ink)',
                letterSpacing: '-0.011em'
              }}>
                Three steps to smarter farming.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line desktop */}
              <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px" style={{ background: 'var(--color-loam)' }} />
              {[
                { num: '01', title: 'Register Your Farm', desc: 'Add your plots, select crops, enter soil card data or let us auto-fetch it.', icon: MapPin },
                { num: '02', title: 'Get Smart Advisories', desc: 'Photograph a leaf, check today\'s schedule, or call our toll-free number.', icon: Bell },
                { num: '03', title: 'Sell at the Right Price', desc: 'Compare mandis in real time and get a price alert when your target is hit.', icon: TrendingUp },
              ].map(({ num, title, desc, icon: Icon }) => (
                <div key={num} className="text-center relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10" style={{ background: 'var(--color-honey-amber)', border: '4px solid var(--color-parchment)' }}>
                    <Icon size={28} color="var(--color-ink)" />
                  </div>
                  <div className="eyebrow mb-2" style={{ color: 'var(--color-bark)' }}>Step {num}</div>
                  <h3 className="font-display font-medium mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-subheading)', color: 'var(--color-ink)' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--color-saddle)', fontSize: 'var(--text-body)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SMS/IVR HIGHLIGHT ──────────── */}
        <section>
          <div className="page-container py-12">
            <div className="panel-dark flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,182,114,0.2)', border: '1px solid rgba(232,182,114,0.3)' }}>
                <Phone size={28} color="var(--color-honey-amber)" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="eyebrow mb-2" style={{ color: 'var(--color-bark)' }}>No Smartphone? No Problem.</div>
                <h3 className="font-display font-medium mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 30px)', color: 'var(--color-parchment)' }}>
                  Call 1800-XXX-XXXX (Toll-Free)
                </h3>
                <p style={{ color: 'var(--color-bark)', fontSize: 'var(--text-body)' }}>
                  Get weather, mandi prices, and pest advisories in Hindi, Tamil, Telugu, Kannada, Bengali, and Marathi — no smartphone or internet required.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-center">
                  <div style={{ fontSize: '11px', color: 'var(--color-bark)', marginBottom: '4px' }}>OR SMS</div>
                  <div className="btn btn-primary btn-sm">
                    <MessageSquare size={14} />
                    SMS "HELP" to 56161
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────── */}
        <section style={{ background: 'var(--color-bone)', borderTop: '1px solid var(--color-loam)', padding: '80px 0' }}>
          <div className="page-container">
            <div className="text-center mb-12">
              <span className="eyebrow eyebrow-sage mb-3 block">Farmer Stories</span>
              <h2 className="font-display font-medium" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.5vw, 42px)',
                color: 'var(--color-ink)',
                letterSpacing: '-0.011em'
              }}>
                Real words from real farmers.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ name, location, crop, quote, rating }) => (
                <div key={name} className="card" style={{ padding: '28px' }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={14} fill="var(--color-honey-amber)" color="var(--color-honey-amber)" />
                    ))}
                  </div>
                  <p className="mb-5" style={{ color: 'var(--color-ink)', lineHeight: 1.7, fontSize: 'var(--text-body)', fontStyle: 'italic' }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--color-bone)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium" style={{ background: 'var(--color-honey-amber)', color: 'var(--color-ink)', fontSize: 'var(--text-eyebrow)' }}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="font-medium" style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink)' }}>{name}</div>
                      <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)' }}>{location} · {crop}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ───────────────────── */}
        <section style={{ background: 'var(--color-parchment)', padding: '80px 0' }}>
          <div className="page-container text-center">
            <span className="eyebrow eyebrow-amber mb-4 block">Start Today</span>
            <h2 className="font-display font-medium mb-5" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 53px)',
              color: 'var(--color-ink)',
              letterSpacing: '-0.011em'
            }}>
              Better yields start with<br />better decisions.
            </h2>
            <p className="mb-8 mx-auto" style={{ maxWidth: '480px', color: 'var(--color-saddle)', fontSize: 'var(--text-body-lg)' }}>
              Join over 10 million farmers already using KisanSeva to grow more and earn more.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="btn btn-primary btn-lg" id="footer-cta-register">
                Create Free Account →
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">
                Talk to an Agronomist
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────── */}
      <footer role="contentinfo" style={{ background: 'var(--color-charcoal-olive)', color: 'var(--color-parchment)', padding: '60px 0 40px' }}>
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: 'var(--color-honey-amber)' }}>
                  <Leaf size={13} color="var(--color-ink)" />
                </div>
                <span className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-parchment)' }}>
                  KisanSeva
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-bark)', lineHeight: 1.7, maxWidth: '220px' }}>
                Smart crop advisory for India&apos;s smallholder farmers. Free forever for individual farmers.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Crop Guide', 'Mandi Prices', 'IVR / SMS'] },
              { title: 'Farmers', links: ['Register', 'Login', 'Download App', 'Toll-Free: 1800-XXX-XXXX'] },
              { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms of Use'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="eyebrow mb-4" style={{ color: 'var(--color-bark)' }}>{title}</div>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-saddle)', cursor: 'pointer' }} className="hover:text-parchment transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)' }}>
              © 2026 KisanSeva. All rights reserved. IEMH4-AG-01 Track 03 / AgriTech
            </p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)' }}>
              Built for India&apos;s 140M smallholder farmers.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
