import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const GROQ_KEY = process.env.GROQ_API_KEY || "";
  const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
  
  const results: any = {
    groq_key_present: !!GROQ_KEY,
    gemini_key_present: !!GEMINI_KEY,
    groq_key_prefix: GROQ_KEY ? GROQ_KEY.substring(0, 8) + "..." : "MISSING",
    gemini_key_prefix: GEMINI_KEY ? GEMINI_KEY.substring(0, 8) + "..." : "MISSING",
    groq_test: null,
    gemini_test: null,
  };

  // Test Groq - try models available on this plan
  if (GROQ_KEY) {
    const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "groq/compound-mini"];
    for (const model of groqModels) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
          body: JSON.stringify({ model, messages: [{ role: "user", content: "hi" }], max_tokens: 10 }),
          signal: AbortSignal.timeout(5000),
        });
        const data = await r.json();
        if (r.ok) { results.groq_test = `OK (${model})`; break; }
        else { results.groq_test = `FAIL (${model}): ${JSON.stringify(data?.error?.message)}`; }
      } catch (e: any) { results.groq_test = `EXCEPTION: ${e.message}`; }
    }
  }

  // Test Gemini - use gemini-3.6-flash (the correct model for this key)
  if (GEMINI_KEY) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Reply with just the word: WORKING" }] }], generationConfig: { maxOutputTokens: 200 } }),
        signal: AbortSignal.timeout(10000),
      });
      const data = await r.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      results.gemini_test = r.ok ? `OK: "${text}"` : `FAIL: ${JSON.stringify(data?.error?.message)}`;
    } catch (e: any) { results.gemini_test = `EXCEPTION: ${e.message}`; }
  }

  return NextResponse.json(results);
}

