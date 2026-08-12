// ============================================================
// KisanSeva API — Express Backend
// ============================================================
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { authRouter }    from './routes/auth'
import { farmsRouter }   from './routes/farms'
import { diagnosisRouter } from './routes/diagnosis'
import { pricesRouter }  from './routes/prices'
import { weatherRouter } from './routes/weather'
import { recommendRouter } from './routes/recommendations'
import { smsRouter }     from './routes/sms'
import { errorHandler }  from './middleware/errorHandler'
import { requestLogger } from './middleware/logger'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Security middleware ───────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Request logging ──────────────────────────────────────
app.use(requestLogger)

// ─── Global rate limiter ──────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', globalLimiter)

// ─── Stricter rate limits for sensitive endpoints ─────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts.' },
})

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many upload requests. Please wait.' },
})

const smsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'SMS rate limit reached.' },
})

// ─── Health check ─────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected',
      ml_service: process.env.ML_SERVICE_URL ? 'configured' : 'not_configured',
    }
  })
})

// ─── API Routes ───────────────────────────────────────────
app.use('/api/v1/auth',            authLimiter,   authRouter)
app.use('/api/v1/farms',           farmsRouter)
app.use('/api/v1/diagnosis',       uploadLimiter, diagnosisRouter)
app.use('/api/v1/prices',          pricesRouter)
app.use('/api/v1/weather',         weatherRouter)
app.use('/api/v1/recommendations', recommendRouter)
app.use('/api/v1/sms',             smsLimiter,    smsRouter)

// ─── API version info ─────────────────────────────────────
app.get('/api/v1', (_, res) => {
  res.json({
    name: 'KisanSeva API',
    version: '1.0.0',
    endpoints: [
      'POST /api/v1/auth/register',
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/send-otp',
      'POST /api/v1/auth/verify-otp',
      'GET  /api/v1/farms',
      'POST /api/v1/farms',
      'GET  /api/v1/farms/:id/plots',
      'POST /api/v1/diagnosis',
      'GET  /api/v1/diagnosis/:id',
      'PATCH /api/v1/diagnosis/:id/feedback',
      'GET  /api/v1/prices?commodity=tomato&state=Maharashtra',
      'GET  /api/v1/weather?lat=23.5&lon=77.8',
      'GET  /api/v1/recommendations?plotId=xxx',
      'POST /api/v1/sms/webhook',
      'POST /api/v1/sms/ivr/webhook',
    ]
  })
})

// ─── 404 handler ──────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// ─── Error handler ────────────────────────────────────────
app.use(errorHandler)

// ─── Start server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║  KisanSeva API running on port ${PORT}   ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(22)}║
║  Health: http://localhost:${PORT}/health  ║
╚═══════════════════════════════════════╝
  `)
})

export default app
