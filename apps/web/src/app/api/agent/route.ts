import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, language } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json({ result: { text: "API Key not configured on the server." } }, { status: 500 });
    }

    const languageMap: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu'
    };
    
    const targetLang = languageMap[language] || 'English';

    const systemPrompt = `You are KisanSeva AI, an expert agricultural advisor for farmers in India.
Answer the following query concisely, practically, and empathetically.
Format your response in plain text with short paragraphs. 
CRITICAL: You MUST answer in ${targetLang}.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: query }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", response.status, errText);
      throw new Error("Failed to fetch from Gemini");
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am currently unable to process this request. Please try again later.";

    return NextResponse.json({
      result: { text: reply.trim() }
    });

  } catch (error) {
    console.error("Agent API Route Error:", error);
    return NextResponse.json({ result: { text: "Sorry, I am facing some technical difficulties right now. Please check my connection." } }, { status: 500 });
  }
}
