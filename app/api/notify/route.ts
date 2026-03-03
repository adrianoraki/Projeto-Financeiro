
import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.TELEGRAM_CHAT_ID || '';

const bot = new TelegramBot(token);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await bot.sendMessage(chatId, message);

    return NextResponse.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
