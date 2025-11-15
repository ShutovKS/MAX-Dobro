import 'dotenv/config';
import axios from 'axios';

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL;

const MAX_API_URL = `https://botapi.max.ru/bot${BOT_TOKEN}/setWebhook`;

async function setupWebhook() {
  if (!BOT_TOKEN || !MINI_APP_URL) {
    console.error('Error: MAX_BOT_TOKEN and VERCEL_URL must be set in your .env file.');
    process.exit(1);
  }

  const webhookUrl = `${MINI_APP_URL}/api/webhook`;

  try {
    console.log(`Setting webhook to: ${webhookUrl}`);
    const response = await axios.post(MAX_API_URL, { url: webhookUrl });

    if (response.data.success) {
      console.log('Webhook set successfully!');
    } else {
      console.error('Failed to set webhook:', response.data);
    }
  } catch (error: any) {
    console.error('Error setting webhook:', error.response?.data || error.message);
  }
}

setupWebhook();