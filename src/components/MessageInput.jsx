import { useState } from 'react';
import PropTypes from 'prop-types';

function MessageInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Mesajınızı yazın
      </label>
      <input
        id="chat-input"
        name="message"
        type="text"
        autoComplete="off"
        placeholder="Mesajınızı yazın ve Enter'a basın"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Gönder
      </button>
    </form>
  );
}

MessageInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

MessageInput.defaultProps = {
  disabled: false,
};

export default MessageInput;
