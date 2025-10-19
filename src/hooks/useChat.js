import { useCallback, useMemo, useState } from 'react';
import { sendPrompt } from '../services/chatService.js';

const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function createMessage(role, content) {
    return {
        id: `${role}-${createId()}`,
        role,
        content,
        timestamp: new Date(),
    };
}

// ↓↓↓ sessionId parametresini ekledik
function useChat(sessionId) {
    const [messages, setMessages] = useState([
        createMessage(
            'assistant',
            'Merhaba! Ben Poc Pulse Proje Asistanıyım. Sorularınızı buraya yazabilirsiniz.',
        ),
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastPayload, setLastPayload] = useState(null);

    const executePrompt = useCallback(async (payload) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await sendPrompt(payload);
            const replyText = response.reply ?? response.message ?? 'Yanıt alınamadı.';
            const assistantMessage = createMessage('assistant', replyText);
            setMessages((prev) => [...prev, assistantMessage]);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(
        async (content) => {
            const userMessage = createMessage('user', content);
            const nextHistory = messages
                .concat(userMessage)
                .map(({ role, content: c }) => ({ role, content: c }));

            // ← sessionId artık payload’ta
            const payload = { sessionId, message: content, history: nextHistory };

            setMessages((prev) => [...prev, userMessage]);
            setLastPayload(payload);

            try {
                await executePrompt(payload);
            } catch (err) {
                console.error(err);
            }
        },
        [executePrompt, messages, sessionId], // ← dependency'e sessionId eklendi
    );

    const retry = useCallback(async () => {
        if (!lastPayload) return;
        try {
            await executePrompt(lastPayload);
        } catch (err) {
            console.error(err);
        }
    }, [executePrompt, lastPayload]);

    return useMemo(
        () => ({ messages, isLoading, error, sendMessage, retry }),
        [error, isLoading, messages, retry, sendMessage],
    );
}

export default useChat;
