import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000'
const GROQ_API_KEY   = process.env.GROQ_API_KEY || ''
const GROQ_MODEL     = 'llama3-70b-8192'

/** Zod schema for validating incoming chat request bodies */
const ChatRequestSchema = z.object({
  query: z.string().min(1, 'query is required').max(2000, 'query too long'),
  language: z.string().default('en'),
  user_id: z.string().optional(),
  plot_id: z.string().optional(),
  context: z.any().default({}),
})
