import { useEffect, useRef } from 'react'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import AssistantChat from './AssistantChat'
import InitialChat from './InitialChat'
import UserChat from './UserChat'

function ConversationChat({
  messages = [], // ✅ Fixed default assignment syntax
  prompt = '',
  onPromptChange,
  onSubmit,
  isSending = false,
  isLoading = false,
  error = '',
}) {
  const listRef = useRef(null)

  // Safe helper to check message count
  const messageList = Array.isArray(messages) ? messages : []
  const hasMessages = messageList.length > 0

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages, isLoading])

  if (!hasMessages && !isLoading) {
    return (
      <InitialChat
        prompt={prompt}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        isSending={isSending}
        error={error}
      />
    )
  }

  return (
    <div className="conversation">
      <div className="message-list" aria-live="polite" ref={listRef}>
        {isLoading && !hasMessages ? (
          <article className="message message-assistant is-pending">Loading conversation…</article>
        ) : (
          messageList.map((message, index) => {
            const ChatMessage = message.role === 'assistant' ? AssistantChat : UserChat
            return (
              <ChatMessage
                key={message.id ?? `${message.role}-${index}`}
                /* ✅ Gracefully accepts 'text', 'message', or 'content' */
                text={message.text || message.message || message.content || ''}
                pending={message.pending}
              />
            )
          })
        )}
      </div>
      {error ? <p className="chat-status-error">{error}</p> : null}
      <form className="prompt-form" onSubmit={onSubmit}>
        <input
          value={prompt}
          onChange={onPromptChange}
          placeholder="Ask anything..."
          aria-label="Ask Mentora anything"
          disabled={isSending}
        />
        <button type="submit" aria-label="Send message" disabled={isSending || !prompt.trim()}>
          <ArrowUpwardRoundedIcon />
        </button>
      </form>
    </div>
  )
}

export default ConversationChat