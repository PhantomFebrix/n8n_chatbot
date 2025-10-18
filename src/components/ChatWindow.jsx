import { useEffect, useMemo, useRef } from 'react';
import useChat from '../hooks/useChat.js';
import ChatBubble from './ChatBubble.jsx';
import MessageInput from './MessageInput.jsx';

function ChatWindow() {
  const { messages, isLoading, error, sendMessage, retry } = useChat();
  const listRef = useRef(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    const scrollToBottom = () => {
      if (typeof node.scrollTo === 'function') {
        try {
          node.scrollTo({
            top: node.scrollHeight,
            behavior: 'smooth',
          });
          return;
        } catch (err) {
          // fall back to direct assignment below
        }
      }

      node.scrollTop = node.scrollHeight;
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(scrollToBottom);
    } else {
      scrollToBottom();
    }
  }, [messages, isLoading, error]);

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
