// src/api/setup-webhook.ts
import 'dotenv/config';
import axios from 'axios';

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const VERCEL_URL = process.env.VERCEL_URL; // Используем переменную Vercel

const MAX_API_URL = `https://botapi.max.ru/bot${BOT_TOKEN}/setWebhook`;

async function setupWebhook() {
  if (!BOT_TOKEN || !VERCEL_URL) {
    console.error(
      'Error: MAX_BOT_TOKEN and VERCEL_URL must be set.',
    );
    // В CI/CD среде лучше не падать, а просто логировать
    if (process.env.CI) { 
        console.log('CI environment detected, skipping webhook setup.');
        return;
    }
    process.exit(1);
  }

  // VERCEL_URL не включает https://, добавляем его
  const webhookUrl = `https://${VERCEL_URL}/api/webhook`;

  try {
    console.log(`Setting webhook to: ${webhookUrl}`);
    const response = await axios.post(MAX_API_URL, { url: webhookUrl });

    if (response.data.success) {
      console.log('Webhook set successfully!');
    } else {
      console.error('Failed to set webhook:', response.data);
    }
  } catch (error: any) {
    console.error(
      'Error setting webhook:',
      error.response?.data || error.message,
    );
  }
}

setupWebhook();