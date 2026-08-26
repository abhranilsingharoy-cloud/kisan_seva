/**
 * @file apps/web/src/lib/ai.ts
 * @description Shared AI provider abstraction for all KisanSeva API routes.
 *
 * This module centralises the multi-provider AI cascade so that individual
 * API routes stay lean and focused on their own domain logic. Every AI call
 * in KisanSeva should go through one of the two exported helpers:
 *
 *  - `callTextAI`  — for text-only prompts (chat, disease lookup)
 *  - `callVisionAI` — for image + text prompts (diagnose, soil OCR)
 *
 * Cascade order for text:  Groq → Gemini
 * Cascade order for vision: Gemini → Nvidia NIM
 *
 * @module ai
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The result returned by any AI provider helper. */
export interface AIResult {
  /** Raw text content returned by the model. */
  text: string;
  /** Human-readable identifier of the provider that succeeded, e.g. "Gemini/gemini-3.6-flash". */
  provider: string;
}

/** Options shared by both text and vision AI calls. */
interface AICallOptions {
  /** Sampling temperature (0 = deterministic, 1 = creative). Defaults to 0.2. */
  temperature?: number;
  /** Maximum number of output tokens. Defaults to 4096. */
  maxOutputTokens?: number;
  /** AbortSignal timeout in milliseconds. Defaults to 10000. */
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Strips markdown code-fence wrappers that some models wrap JSON responses in.
 * Also extracts the first JSON object if surrounded by prose.
 *
 * @param raw - Raw string from the model.
 * @returns The cleaned string, ready for JSON.parse().
 */
export function cleanJsonResponse(raw: string): string {
  let cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) cleaned = match[0];
  return cleaned;
}

// ---------------------------------------------------------------------------
// Text AI Cascade
// ---------------------------------------------------------------------------

/**
 * Calls the text AI cascade: Groq models → Gemini models.
 * Returns the first successful response. Throws if all providers fail.
 *
 * @param prompt - The full user + system prompt to send.
 * @param options - Optional temperature, token limit, and timeout overrides.
 * @returns A promise resolving to `AIResult` with text and provider name.
 *
 * @example
 * const { text, provider } = await callTextAI("What is early blight?");
 */
export async function callTextAI(
  prompt: string,
  options: AICallOptions = {}
): Promise<AIResult> {
  const { temperature = 0.2, maxOutputTokens = 4096, timeoutMs = 10000 } = options;

  const GROQ_KEY = process.env.GROQ_API_KEY || '';
  const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

  // --- Provider 1: Groq ---
  const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'groq/compound-mini'];
  if (GROQ_KEY) {
    for (const model of groqModels) {
      try {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature,
            max_tokens: maxOutputTokens,
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (resp.ok) {
          const data = await resp.json();
          const text: string = data?.choices?.[0]?.message?.content || '';
          if (text) return { text, provider: `Groq/${model}` };
        }
      } catch { /* try next provider */ }
    }
  }

  // --- Provider 2: Gemini ---
  const geminiModels = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  if (GEMINI_KEY) {
    for (const model of geminiModels) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature, maxOutputTokens },
            }),
            signal: AbortSignal.timeout(timeoutMs),
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) return { text, provider: `Gemini/${model}` };
        }
      } catch { /* try next provider */ }
    }
  }

  throw new Error('All text AI providers failed. Please check API keys in Vercel.');
}

// ---------------------------------------------------------------------------
// Vision AI Cascade
// ---------------------------------------------------------------------------

/** Base64-encoded image payload for vision calls. */
export interface VisionImage {
  /** Raw base64 data (no data-URL prefix). */
  base64: string;
  /** MIME type, e.g. "image/jpeg". */
  mimeType: string;
}

/**
 * Calls the vision AI cascade: Gemini (multi-model) → Nvidia NIM.
 * Returns the first successful response. Throws if all providers fail.
 *
 * @param prompt - Text prompt / system instruction to send alongside the image.
 * @param image  - The image to analyse, as a `VisionImage` object.
 * @param options - Optional temperature, token limit, and timeout overrides.
 * @returns A promise resolving to `AIResult` with text and provider name.
 *
 * @example
 * const img: VisionImage = { base64: b64str, mimeType: "image/jpeg" };
 * const { text, provider } = await callVisionAI(myPrompt, img);
 */
export async function callVisionAI(
  prompt: string,
  image: VisionImage,
  options: AICallOptions = {}
): Promise<AIResult> {
  const { temperature = 0.1, maxOutputTokens = 4096, timeoutMs = 15000 } = options;

  const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
  const NVIDIA_KEY = process.env.NVIDIA_NIM_KEY || '';

  // --- Provider 1: Gemini Vision (multi-model cascade) ---
  const geminiModels = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  if (GEMINI_KEY && GEMINI_KEY.length > 20) {
    for (const model of geminiModels) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: image.mimeType, data: image.base64 } },
                ],
              }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature,
                maxOutputTokens,
              },
            }),
            signal: AbortSignal.timeout(timeoutMs),
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (text) return { text, provider: `Gemini/${model}` };
        }
      } catch { /* try next provider */ }
    }
  }

  // --- Provider 2: Nvidia NIM (text+image via OpenAI-compatible API) ---
  if (NVIDIA_KEY && !NVIDIA_KEY.startsWith('AQ.')) {
    try {
      const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${NVIDIA_KEY}` },
        body: JSON.stringify({
          model: 'meta/llama-3.2-90b-vision-instruct',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.base64}` } },
            ],
          }],
          temperature,
          max_tokens: maxOutputTokens,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (resp.ok) {
        const data = await resp.json();
        const text: string = data?.choices?.[0]?.message?.content || '';
        if (text) return { text, provider: 'Nvidia/llama-3.2-90b-vision' };
      }
    } catch { /* fall through to error */ }
  }

  throw new Error('All vision AI providers failed. Please check API keys in Vercel.');
}
