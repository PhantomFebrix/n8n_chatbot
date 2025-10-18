import PropTypes from 'prop-types';
import MarkdownMessage from './MarkdownMessage.jsx';

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'bot'}`}>
      <span className="chat-author" aria-hidden>
        {isUser ? '👤' : '🤖'}
      </span>
      <MarkdownMessage className="chat-content" content={message.content} />
      {message.timestamp ? (
        <time dateTime={message.timestamp.toISOString()} className="chat-timestamp">
          {message.timestamp.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      ) : null}
    </div>
  );
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
  }).isRequired,
};

export default ChatBubble;
