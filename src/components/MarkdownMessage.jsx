import PropTypes from 'prop-types';
import { Fragment } from 'react';

function renderInline(text, keyPrefix) {
  const nodes = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      nodes.push(
        <Fragment key={`${keyPrefix}-text-${index}`}>{plain}</Fragment>,
      );
      index += 1;
    }

    if (match[2]) {
      nodes.push(
        <strong key={`${keyPrefix}-bold-${index}`}>{match[2]}</strong>,
      );
    } else if (match[3]) {
      nodes.push(
        <em key={`${keyPrefix}-italic-${index}`}>{match[3]}</em>,
      );
    } else if (match[4]) {
      nodes.push(
        <code key={`${keyPrefix}-code-${index}`}>{match[4]}</code>,
      );
    } else if (match[5] && match[6]) {
      nodes.push(
        <a
          key={`${keyPrefix}-link-${index}`}
          href={match[6]}
          target="_blank"
          rel="noreferrer noopener"
        >
          {match[5]}
        </a>,
      );
    }

    index += 1;
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Fragment key={`${keyPrefix}-text-${index}`}>{text.slice(lastIndex)}</Fragment>,
    );
  }

  return nodes;
}

function parseMarkdown(content) {
  const blocks = [];
  const lines = content.split(/\r?\n/);

  let paragraphLines = [];
  let listBuffer = null;
  let blockquoteLines = [];
  let codeBlock = null;

  const flushParagraph = () => {
    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listBuffer) {
      blocks.push({ type: listBuffer.type, items: listBuffer.items });
      listBuffer = null;
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length) {
      blocks.push({ type: 'blockquote', text: blockquoteLines.join(' ') });
      blockquoteLines = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlock) {
      blocks.push({ type: 'code', text: codeBlock.lines.join('\n') });
      codeBlock = null;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (codeBlock) {
      if (trimmed.startsWith('```')) {
        flushCodeBlock();
        return;
      }

      codeBlock.lines.push(line);
      return;
    }

    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      codeBlock = { lines: [] };
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushBlockquote();
      return;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      flushList();
      blockquoteLines.push(trimmed.replace(/^>\s?/, ''));
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushBlockquote();
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(trimmed.replace(/^\d+\.\s+/, ''));
      return;
    }

    flushList();
    flushBlockquote();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushList();
  flushBlockquote();
  flushCodeBlock();

  return blocks;
}

function MarkdownMessage({ content, className }) {
  const blocks = parseMarkdown(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === 'paragraph') {
          return <p key={key}>{renderInline(block.text, `${key}-inline`)}</p>;
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote key={key}>
              {renderInline(block.text, `${key}-inline`)}
            </blockquote>
          );
        }

        if (block.type === 'code') {
          return (
            <pre key={key}>
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === 'ul' || block.type === 'ol') {
          const ListTag = block.type === 'ul' ? 'ul' : 'ol';
          return (
            <ListTag key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-item-${itemIndex}`}>
                  {renderInline(item, `${key}-item-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}

MarkdownMessage.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
};

MarkdownMessage.defaultProps = {
  className: undefined,
};

export default MarkdownMessage;
