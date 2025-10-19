const WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;

async function sendPrompt(payload) {
    if (!WEBHOOK_URL) {
        throw new Error('VITE_N8N_CHAT_WEBHOOK_URL tanımlı değil. Lütfen .env dosyasını kontrol edin.');
    }

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'n8n servisinden geçersiz yanıt alındı.');
    }

    return response.json();
}

export { sendPrompt };
