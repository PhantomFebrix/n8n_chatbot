import { useEffect, useMemo, useRef } from 'react';
import useChat from '../hooks/useChat.js';
import ChatBubble from './ChatBubble.jsx';
import MessageInput from './MessageInput.jsx';

function ChatWindow() {
  const { messages, isLoading, error, sendMessage, retry } = useChat();
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const statusMessage = useMemo(() => {
    if (error) {
      return (
        <div className="chat-status error">
          <p>Sohbet servisine ulaşılamadı.</p>
          <button type="button" onClick={retry}>
            Tekrar dene
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="chat-status loading">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <span>n8n yanıtlıyor…</span>
        </div>
      );
    }

    return null;
  }, [error, isLoading, retry]);

  return (
    <section className="chat-window" aria-live="polite">
      <div className="chat-messages" ref={listRef}>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {statusMessage}
      </div>
      <MessageInput onSubmit={sendMessage} disabled={isLoading} />
    </section>
  );
}

export default ChatWindow;
