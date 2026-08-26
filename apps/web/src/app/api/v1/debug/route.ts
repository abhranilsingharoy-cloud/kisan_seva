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

  // Test Groq
  if (GROQ_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: "hi" }], max_tokens: 5 }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await r.json();
      results.groq_test = r.ok ? "OK" : `FAIL: ${JSON.stringify(data?.error)}`;
    } catch (e: any) { results.groq_test = `EXCEPTION: ${e.message}`; }
  }

  // Test Gemini
  if (GEMINI_KEY) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await r.json();
      results.gemini_test = r.ok ? "OK" : `FAIL: ${JSON.stringify(data?.error)}`;
    } catch (e: any) { results.gemini_test = `EXCEPTION: ${e.message}`; }
  }

  return NextResponse.json(results);
}
