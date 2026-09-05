import { NextRequest, NextResponse } from 'next/server';
import { callTextAI } from '@/lib/ai';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  } catch (err) {
    console.error('[Telegram] Failed to send message:', err);
  }
}

export async function POST(req: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('[Telegram] TELEGRAM_BOT_TOKEN is not set');
    return NextResponse.json({ error: 'Token missing' }, { status: 500 });
  }

  try {
    const body = await req.json();
    
    // Check if it's a standard text message
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;
      const firstName = body.message.from?.first_name || 'Farmer';

      // Quick response for /start command
      if (text === '/start') {
        await sendMessage(chatId, `Namaste ${firstName}! 🌾 I am KisanSaathi, your AI agricultural advisor.\n\nYou can ask me about:\n- Crop diseases\n- Fertilizers\n- Live Mandi prices\n- Government schemes\n\nSend me a message in English, Hindi, or Bengali!`);
        return NextResponse.json({ success: true });
      }

      // Build AI prompt
      const prompt = `You are KisanSeva Saathi, an expert agricultural advisor for farmers in India.
The farmer is talking to you on Telegram. Keep your answer under 1000 characters and format nicely with Markdown.
If they speak in Hindi, reply in Hindi. If Bengali, reply in Bengali. Otherwise English.
Farmer says: "${text}"`;

      // Send typing action to Telegram
      await fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
      }).catch(() => {});

      // Call AI
      const aiResponse = await callTextAI(prompt, { temperature: 0.3 });
      
      let replyText = aiResponse.text || "Sorry, I am currently facing network issues. Please try again later.";
      
      await sendMessage(chatId, replyText);
    }

    // Always return 200 OK to Telegram so it doesn't retry
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Telegram] Webhook error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is active' });
}
